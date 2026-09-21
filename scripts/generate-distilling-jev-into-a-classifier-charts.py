#!/usr/bin/env python3
"""Charts for "Distilling an Aligned Jev System into a Classifier You Own".

Every number is read from the Jev-Flywheel study records by absolute path:

    studies/distill.jsonl         one row per (student, seed): accuracy against the human label,
                                  agreement with the teacher, ECE, every (tier, topic) slice,
                                  every cascade threshold
    studies/finetune_laya.jsonl   arm D: the same DistilBERT fine-tuned directly on the 140
                                  recorded human labels (rows marked exploratory are skipped)

Series encoding: colour is the ENGINE (Jev blue, Laya magenta, DistilBERT gray). The teacher here
is a hybrid (Jev's answers plus a topic answer from Laya), so it gets neutral dark ink and no
engine colour. Fine-tuned models are hatched.

    python3 scripts/generate-distilling-jev-into-a-classifier-charts.py

writes the cover and the 1600x900 body charts into src/site-content/images/ and the 1080x1350
and 1080x1080 social variants into social/distilling-jev-into-a-classifier/.
"""

import json
import statistics
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
matplotlib.rcParams["hatch.linewidth"] = 0.6
import matplotlib.pyplot as plt  # noqa: E402

SLUG = "distilling-jev-into-a-classifier"
SITE = Path(__file__).resolve().parents[1]
IMAGES = SITE / "src" / "site-content" / "images"
SOCIAL = SITE / "social" / SLUG
STUDIES = Path("/Users/home/Projects/Jev-Flywheel/studies")

BACKGROUND = "#f1f9fe"
PANEL = "#ffffff"
INK = "#333333"
MUTED = "#5f6a72"
GRID = "#c8d8e3"
GRAY = "#8a949c"
GRAY_LIGHT = "#d5dade"

DPI = 100
# layout -> (figure size in inches, type scale, footer?)
LAYOUTS = {
    "wide": ((16, 9), 1.0, False),
    "cover": ((12, 6.3), 0.82, False),
    "portrait": ((10.8, 13.5), 1.15, True),
    "square": ((10.8, 10.8), 1.0, True),
}

STUDENT_NAMES = {
    "soft-teacher": "Student, teacher's probabilities (soft)",
    "hard-teacher": "Student, teacher's hard labels",
    "reference-ceiling": "Ceiling: a reference label on every pool item",
}


# ---------------------------------------------------------------- data

def load():
    distill = [json.loads(line) for line in (STUDIES / "distill.jsonl").open()]
    finetune = [json.loads(line) for line in (STUDIES / "finetune_laya.jsonl").open()]
    arm_d = [r for r in finetune if r["arm"] == "D" and not r.get("exploratory")]
    return distill, arm_d


def by_kind(distill, kind):
    return sorted((r for r in distill if r["student"] == kind), key=lambda r: r["seed"])


def mean(values):
    return statistics.mean(values)


# ---------------------------------------------------------------- furniture

def new_figure(layout, title, subtitle, nrows=1, ncols=1, panel_titles=False, **grid):
    """A figure with a left-aligned title block; the axes start below it however many lines it has."""
    subtitle = ""   # one line to land on social; captions carry the rest
    size, scale, footer = LAYOUTS[layout]
    fig, axes = plt.subplots(nrows, ncols, figsize=size, dpi=DPI, squeeze=False, **grid)
    fig.patch.set_facecolor(BACKGROUND)
    points = size[1] * 72
    title_size, sub_size = 26 * scale, 14.5 * scale
    y = 0.955
    fig.text(0.04, y, title, fontsize=title_size, fontweight="bold", color=INK, va="top",
             ha="left", linespacing=1.15)
    y -= (title.count("\n") + 1) * title_size * 1.22 / points + 0.012
    fig.text(0.04, y, subtitle, fontsize=sub_size, color=MUTED, va="top", ha="left",
             linespacing=1.3)
    y -= (0.075 if panel_titles else 0.035)
    fig.subplots_adjust(left=0.08, right=0.96, top=y, bottom=0.12 if not footer else 0.10)
    for ax in axes.flat:
        ax.set_facecolor(PANEL)
        for side in ("top", "right"):
            ax.spines[side].set_visible(False)
        ax.spines["left"].set_color(GRID)
        ax.spines["bottom"].set_color(GRID)
        ax.tick_params(colors=INK, labelsize=13 * scale)
        ax.set_axisbelow(True)
    return fig, axes, scale


def wrap_title(text, layout):
    """Break a title for the narrow layouts at the marked point."""
    narrow = layout in ("portrait", "square")
    return text.replace(" || ", "\n" if narrow else " ").replace(" | ", "\n")


def reclaim_bottom(fig, floor=0.11):
    """Subtitles and footers are gone (the article captions carry detail), so stretch the panels
    into that space: up to just under the title block, down to just above the bottom edge.
    A figure-level legend keeps its place and moves the limit."""
    axes = [a for a in fig.axes if a.get_visible()]
    if not axes:
        return
    fig.canvas.draw()
    inv = fig.transFigure.inverted()
    ceiling = 1.0
    for item in list(fig.texts) + list(fig.legends):
        if hasattr(item, "get_text") and not item.get_text().strip():
            continue
        box = item.get_window_extent().transformed(inv)
        if box.y0 > 0.5:
            ceiling = min(ceiling, box.y0)
        elif box.y1 < 0.3 and item in fig.legends:
            floor = max(floor, box.y1 + 0.115)   # room for ticks and the axis label above it
    titled = any(a.get_title(loc=loc) for a in axes for loc in ("left", "center", "right"))
    ceiling -= 0.075 if titled else 0.04
    top = max(a.get_position().y1 for a in axes)
    low = min(a.get_position().y0 for a in axes)
    if ceiling <= low + 0.2:
        return
    k = (ceiling - floor) / (top - low)
    for a in axes:
        p = a.get_position()
        a.set_position([p.x0, ceiling - (top - p.y0) * k, p.width, p.height * k])


def save(fig, name, layout):
    if layout != "cover":
        reclaim_bottom(fig)
    if layout in ("wide", "cover"):
        out = IMAGES / f"{SLUG}-{name}.png"
    else:
        out = SOCIAL / f"{SLUG}-{name}-{'4x5' if layout == 'portrait' else '1x1'}.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out, dpi=DPI, facecolor=fig.get_facecolor())
    plt.close(fig)
    print(out.relative_to(SITE))


# ---------------------------------------------------------------- 1. teacher vs students

def chart_students(distill, layout):
    stacked = layout in ("portrait", "square")
    title = wrap_title("The small student beat || its hosted teacher.", layout)
    fig, axes, s = new_figure(
        layout, title,
        "3,521 held-out items, three seeds each (dot = mean, bar = min to max). Students are "
        "DistilBERT, 66M parameters." if not stacked else
        "3,521 held-out items, three seeds each\n(dot = mean, bar = min to max). DistilBERT, 66M.",
        nrows=2 if stacked else 1, ncols=1 if stacked else 2,
        panel_titles=True,
        gridspec_kw={"hspace": 0.55} if stacked else {"wspace": 0.10, "width_ratios": [1, 1]})
    if stacked:
        fig.subplots_adjust(left=0.40, bottom=0.11)
    else:
        fig.subplots_adjust(left=0.25)
    acc_ax, ece_ax = axes.flat

    kinds = ["reference-ceiling", "soft-teacher", "hard-teacher"]
    teacher = by_kind(distill, "soft-teacher")[0]["teacher_acc_vs_human"]
    labels = [STUDENT_NAMES[k] for k in kinds] + ["Teacher: the flywheel's fitted head\n(140 human labels)"]
    labels = [l.replace(": a reference", ":\na reference").replace(", teacher's", ",\nteacher's")
              for l in labels]
    ys = list(range(len(labels)))[::-1]

    # accuracy panel (dots on a cut axis: the differences are two points wide)
    for y, kind in zip(ys, kinds):
        accs = [r["acc_vs_human"] for r in by_kind(distill, kind)]
        acc_ax.plot([min(accs), max(accs)], [y, y], color=GRAY, linewidth=7 * s, alpha=0.45,
                    solid_capstyle="round", zorder=2)
        acc_ax.scatter([mean(accs)], [y], s=330 * s, facecolor=GRAY_LIGHT if kind == "reference-ceiling" else GRAY,
                       edgecolor=INK, linewidth=1.4, hatch="////", zorder=3)
        acc_ax.text(mean(accs) + 0.004, y, f"{mean(accs):.3f}", va="center", fontsize=17 * s,
                    fontweight="bold", color=INK)
    acc_ax.scatter([teacher], [ys[-1]], s=330 * s, color=INK, zorder=3)
    acc_ax.text(teacher + 0.004, ys[-1], f"{teacher:.3f}", va="center", fontsize=17 * s,
                fontweight="bold", color=INK)
    acc_ax.axvline(teacher, color=INK, linestyle=":", linewidth=1.6, zorder=1)
    acc_ax.set_yticks(ys)
    acc_ax.set_yticklabels(labels, fontsize=13.5 * s)
    acc_ax.set_ylim(-0.6, len(labels) - 0.4)
    acc_ax.set_xlim(0.86, 0.96)
    acc_ax.set_xticks([0.86, 0.88, 0.90, 0.92, 0.94, 0.96])
    acc_ax.grid(axis="x", color=GRID, linewidth=1)
    acc_ax.tick_params(axis="y", length=0)
    acc_ax.set_title("Accuracy against the human label (axis starts at 0.86)" if not stacked else
                     "Accuracy (axis starts at 0.86)", fontsize=15 * s,
                     color=INK, loc="left", pad=12)

    # calibration panel: raw -> one temperature
    for y, kind in zip(ys, kinds):
        rows = by_kind(distill, kind)
        raw, cal = mean([r["ece_raw"] for r in rows]), mean([r["ece_calibrated"] for r in rows])
        temp = mean([r["temperature"] for r in rows])
        ece_ax.annotate("", xy=(cal, y), xytext=(raw, y),
                        arrowprops={"arrowstyle": "-|>", "color": GRAY, "linewidth": 2.2 * s})
        ece_ax.scatter([raw], [y], s=210 * s, facecolor=PANEL, edgecolor=GRAY, linewidth=2.4, zorder=3)
        ece_ax.scatter([cal], [y], s=210 * s, color=GRAY, edgecolor=INK, linewidth=1.2, zorder=4)
        ece_ax.text(max(raw, cal) + 0.004, y, f"{raw:.3f} to {cal:.3f}   (T = {temp:.2f})",
                    va="center", fontsize=14 * s, color=INK)
    ece_ax.text(0.002, ys[-1], "not recorded on this set", va="center", fontsize=13 * s,
                color=MUTED, style="italic")
    ece_ax.set_yticks(ys)
    ece_ax.set_yticklabels(labels if stacked else [""] * len(labels), fontsize=13.5 * s)
    ece_ax.set_ylim(-0.6, len(labels) - 0.4)
    ece_ax.set_xlim(0, 0.13)
    ece_ax.grid(axis="x", color=GRID, linewidth=1)
    ece_ax.tick_params(axis="y", length=0)
    ece_ax.set_title("Calibration error (ECE): hollow raw, filled calibrated",
                     fontsize=15 * s, color=INK, loc="left", pad=12)
    save(fig, "students", layout)


# ---------------------------------------------------------------- 2. per-slice gate

def chart_gate(distill, layout):
    rows = by_kind(distill, "soft-teacher")
    slices = list(rows[0]["slices"])
    order = {"strong": 0, "medium": 1, "weak": 2, "neutral": 3}
    slices.sort(key=lambda k: (order[k.split("/")[0]], k))
    topic = {"sports_or_recreation": "sports", "business_or_workplace": "workplace",
             "something_else": "neither"}
    title = wrap_title("Where may the student answer? || 10 of 11 slices pass.", layout)
    fig, axes, s = new_figure(
        layout, title,
        "Student accuracy minus teacher accuracy, in points, against the human label. "
        "Bar = mean of three seeds, dots = seeds." if layout == "wide" else
        "Student minus teacher accuracy, in points, against\nthe human label. "
        "Bar = mean of three seeds, dots = seeds.")
    ax = axes[0, 0]
    narrow = layout != "wide"
    fig.subplots_adjust(left=0.37 if narrow else 0.20, bottom=0.12)
    ys = list(range(len(slices)))[::-1]
    for y, key in zip(ys, slices):
        t = rows[0]["slices"][key]["teacher"]
        deltas = [100 * (r["slices"][key]["student"] - t) for r in rows]
        ax.barh(y, mean(deltas), height=0.62, color=GRAY, edgecolor=INK, linewidth=0.8,
                hatch="////", alpha=0.85, zorder=2)
        for d, r in zip(deltas, rows):
            failed = not r["slices"][key]["passes_gate"]
            ax.scatter([d], [y], s=(150 if failed else 60) * s, zorder=4,
                       facecolor=PANEL if failed else INK, edgecolor=INK, linewidth=2.2 if failed else 0)
            if failed:
                ax.annotate(f"seed {r['seed']} fails:\n{r['slices'][key]['student']:.3f} "
                            f"against {t:.3f}", xy=(d, y), xytext=(-4.05, y - 1.25),
                            fontsize=13 * s, color=INK, ha="left", va="center",
                            zorder=6,
                            bbox={"facecolor": PANEL, "edgecolor": "none", "pad": 3},
                            arrowprops={"arrowstyle": "-", "color": INK, "linewidth": 1})
    ax.axvline(0, color=INK, linewidth=1.2, zorder=1)
    ax.axvline(-2, color=INK, linewidth=2, linestyle="--", zorder=3)
    ax.text(-1.9, len(slices) + 0.05, "the gate: two points below the teacher", fontsize=13 * s,
            color=INK, ha="left", va="center", zorder=6,
            bbox={"facecolor": PANEL, "edgecolor": "none", "pad": 3})
    ax.set_yticks(ys)
    ax.set_yticklabels([f"{k.split('/')[0]} / {topic[k.split('/')[1]]}   (n = {rows[0]['slices'][k]['n']})"
                        for k in slices], fontsize=13.5 * s)
    ax.set_ylim(-0.7, len(slices) + 0.6)
    ax.set_xlim(-4.2, 6.5)
    ax.set_xlabel("student minus teacher, accuracy points", fontsize=14 * s, color=INK, labelpad=10)
    ax.grid(axis="x", color=GRID, linewidth=1)
    ax.tick_params(axis="y", length=0)
    save(fig, "slice-gate", layout)


# ---------------------------------------------------------------- 3. cascade

def chart_cascade(distill, layout):
    rows = by_kind(distill, "soft-teacher")
    thresholds = list(rows[0]["cascade"])
    alone = mean([r["acc_vs_human"] for r in rows])
    teacher = rows[0]["teacher_acc_vs_human"]
    casc = [mean([r["cascade"][t]["cascade_acc"] for r in rows]) for t in thresholds]
    cover = [mean([r["cascade"][t]["coverage"] for r in rows]) for t in thresholds]
    title = wrap_title("Handing hard items back to || the teacher didn't help.", layout)
    fig, axes, s = new_figure(
        layout, title,
        "Student answers when its calibrated confidence clears the threshold; the teacher takes "
        "the rest. Mean of three seeds." if layout == "wide" else
        "Student answers above the confidence threshold (its share of items\nis under each point); the teacher takes the rest. Mean of three seeds.")
    ax = axes[0, 0]
    fig.subplots_adjust(left=0.10 if layout == "wide" else 0.14, bottom=0.13)
    xs = list(range(len(thresholds)))
    ax.axhline(alone, color=GRAY, linewidth=2.6, linestyle="--", zorder=2)
    ax.text(xs[-1] + 0.45, alone + 0.0008, f"student alone {alone:.3f}", fontsize=14.5 * s,
            color=INK, ha="right", va="bottom")
    ax.axhline(teacher, color=INK, linewidth=2.2, linestyle=":", zorder=2)
    ax.text(xs[0] - 0.45, teacher + 0.0008, f"teacher alone {teacher:.3f}", fontsize=14.5 * s,
            color=INK, ha="left", va="bottom")
    ax.plot(xs, casc, color=INK, linewidth=3, marker="o", markersize=13 * s,
            markerfacecolor=GRAY, markeredgecolor=INK, zorder=4)
    for x, a, c in zip(xs, casc, cover):
        note = f"student answers {100 * c:.0f}%" if layout == "wide" else f"student: {100 * c:.0f}%"
        ax.text(x, a - 0.0022, f"{a:.3f}\n{note}", fontsize=13 * s,
                color=INK, ha="center", va="top", linespacing=1.35)
    ax.set_xticks(xs)
    ax.set_xticklabels(thresholds)
    ax.set_xlim(-0.5, len(xs) - 0.5)
    ax.set_ylim(0.880, 0.918)
    ax.set_xlabel("confidence threshold below which the teacher answers", fontsize=14 * s,
                  color=INK, labelpad=10)
    ax.set_ylabel("cascade accuracy against the human label", fontsize=14 * s, color=INK, labelpad=10)
    ax.grid(axis="y", color=GRID, linewidth=1)
    save(fig, "cascade", layout)


# ---------------------------------------------------------------- 4. label sources (and the cover)

def chart_label_source(distill, arm_d, layout):
    soft = [r["acc_vs_human"] for r in by_kind(distill, "soft-teacher")]
    ceiling = [r["acc_vs_human"] for r in by_kind(distill, "reference-ceiling")]
    direct = [r["full_accuracy"] for r in arm_d]
    teacher = by_kind(distill, "soft-teacher")[0]["teacher_acc_vs_human"]
    entries = [
        ("Trained directly on the\n140 human labels", direct, GRAY, "////"),
        ("Distilled: a head fitted on those 140\nthen labels 5,140 unlabeled items", soft, GRAY, "////"),
        ("If every one of the 5,140 items\nhad a human label (ceiling)", ceiling, GRAY_LIGHT, "////"),
    ]
    if layout == "cover":
        title = "Same 140 human labels, same DistilBERT:\n0.828 trained on them, 0.912 distilled"
        subtitle = "Accuracy against the human label on 3,521 held-out items, three seeds each"
    else:
        title = wrap_title("Same 140 human labels. || Distilling beats training on them.", layout)
        subtitle = ("Accuracy against the human label on the same 3,521 held-out items. Bar = mean "
                    "of three seeds, whisker = min to max." if layout == "wide" else
                    "Accuracy against the human label, 3,521 held-out items.\nBar = mean of three "
                    "seeds, whisker = min to max.")
    fig, axes, s = new_figure(layout, title, subtitle)
    ax = axes[0, 0]
    fig.subplots_adjust(left={"wide": 0.27, "cover": 0.33, "portrait": 0.40, "square": 0.40}[layout],
                        bottom=0.14 if layout != "cover" else 0.12, right=0.94)
    ys = [2, 1, 0]
    for y, (label, values, colour, hatch) in zip(ys, entries):
        m = mean(values)
        ax.barh(y, m, height=0.6, color=colour, edgecolor=INK, linewidth=1, hatch=hatch, zorder=2)
        ax.plot([min(values), max(values)], [y, y], color=INK, linewidth=2.4, zorder=3)
        ax.text(max(values) + 0.012, y, f"{m:.3f}", va="center", fontsize=20 * s,
                fontweight="bold", color=INK)
    ax.axvline(teacher, color=INK, linewidth=2.2, linestyle=":", zorder=4)
    ax.text(teacher - 0.008, 2.47, f"the teacher itself, {teacher:.3f}", fontsize=13.5 * s,
            color=INK, ha="right", va="center")
    ax.set_yticks(ys)
    ax.set_yticklabels([e[0] for e in entries], fontsize=14 * s)
    ax.set_ylim(-0.55, 2.75)
    ax.set_xlim(0, 1.0 if layout in ("wide", "cover") else 1.13)
    ax.set_xticks([0, 0.2, 0.4, 0.6, 0.8, 1.0])
    ax.grid(axis="x", color=GRID, linewidth=1)
    ax.tick_params(axis="y", length=0)
    if layout != "cover":
        ax.set_xlabel("accuracy against the human label", fontsize=14 * s, color=INK, labelpad=10)
    save(fig, "cover" if layout == "cover" else "label-source", layout)


def chart_cover(distill):
    """A social card that reads at a glance and doubles as the hero figure on the page."""
    import matplotlib.pyplot as plt
    soft = mean([r["acc_vs_human"] for r in by_kind(distill, "soft-teacher")])
    teacher = by_kind(distill, "soft-teacher")[0]["teacher_acc_vs_human"]
    fig = plt.figure(figsize=LAYOUTS["cover"][0], dpi=DPI)
    fig.patch.set_facecolor(BACKGROUND)
    fig.text(0.06, 0.86, "DISTILLATION", fontsize=17, fontweight="bold", color=MUTED, va="top")
    fig.text(0.06, 0.74, "Rent the big model\nto train a small\none you own.", fontsize=40, fontweight="bold",
             color=INK, va="top", linespacing=1.12)
    fig.text(0.06, 0.225, "The student never saw a human label.\n66M parameters, 5 to 15 ms an item on a laptop.",
             fontsize=15.5, color=MUTED, va="top", linespacing=1.4)
    ax = fig.add_axes([0.62, 0.17, 0.32, 0.70])
    ax.set_facecolor(PANEL)
    for side in ax.spines.values():
        side.set_visible(False)
    bars = [("The teacher\n(Jev-based, hosted)", teacher, dict(facecolor="#0389d7", edgecolor="#0389d7")),
            ("The student\n(yours, local)", soft, dict(facecolor=GRAY_LIGHT, edgecolor=GRAY, hatch="////"))]
    for x, (name, value, look) in enumerate(bars):
        ax.bar(x, value - 0.5, bottom=0.5, width=0.62, linewidth=1.8, zorder=3, **look)
        ax.text(x, value + 0.012, f"{value:.0%}", ha="center", va="bottom", fontsize=30, fontweight="bold",
                color=INK)
    ax.set_xticks(range(len(bars)))
    ax.set_xticklabels([b[0] for b in bars], fontsize=13, color=INK, linespacing=1.25)
    ax.tick_params(axis="x", length=0, pad=10)
    ax.set_yticks([])
    ax.set_ylim(0.5, 1.04)
    ax.set_xlim(-0.6, 1.6)
    ax.text(0.5, 1.03, "accuracy against human labels (axis starts at 50%)", fontsize=11, color=MUTED,
            ha="center", va="top")
    save(fig, "cover", "cover")


def main():
    distill, arm_d = load()
    assert len(distill) == 9 and len(arm_d) == 3, (len(distill), len(arm_d))
    chart_cover(distill)
    for layout in ("wide", "portrait", "square"):
        chart_students(distill, layout)
        chart_gate(distill, layout)
        chart_cascade(distill, layout)
        chart_label_source(distill, arm_d, layout)


if __name__ == "__main__":
    main()
