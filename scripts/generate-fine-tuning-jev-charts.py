#!/usr/bin/env python3
"""Generate the charts for fine-tuning-jev.mdx.

Every number is read from the Jev-Flywheel repo's studies/ records by absolute
path. Nothing here is typed in by hand except labels.

    python3 scripts/generate-fine-tuning-jev-charts.py            # everything
    python3 scripts/generate-fine-tuning-jev-charts.py --only refit-vs-steer --layout portrait

Charts (one message each, stated in the title):
  cover            1200x630   the headline contrast
  refit-vs-steer   accuracy and calibration error by scorecard version v1..v4
  reliability      the 12-run study: what each run gained, and whether it named the axis
  finetune         the layer against actually fine-tuning an open engine, same 140 labels

Layouts: landscape 1600x900 (site body), portrait 1080x1350 and square 1080x1080
(social, with an anth.us/blog/<slug> footer).

Series encoding (shared by the three Jev articles): colour is the ENGINE
(Jev blue, Laya magenta, DistilBERT/baselines gray); fill is the METHOD
(engine alone = light tint, with the flywheel layer = solid, fine-tuned = hatched).
"""

import argparse
import ast
import json
import statistics as st
import textwrap
from collections import defaultdict
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Patch

SLUG = "fine-tuning-jev"
SITE = Path(__file__).resolve().parents[1]
IMAGES = SITE / "src/site-content/images"
SOCIAL = SITE / "social" / SLUG
STUDIES = Path("/Users/home/Projects/Jev-Flywheel/studies")

DPI = 100
LAYOUTS = {
    "landscape": (16, 9),
    "portrait": (10.8, 13.5),
    "square": (10.8, 10.8),
    "cover": (12, 6.3),
}

BACKGROUND = "#f1f9fe"
PANEL = "#ffffff"
INK = "#333333"
MUTED = "#5f6a72"
GRID = "#c8d8e3"
BLUE = "#0389d7"
MAGENTA = "#d03382"
GRAY = "#8a949c"
BLUE_TINT = "#b9def5"
MAGENTA_TINT = "#f2c4db"
GRAY_TINT = "#d5dade"


# ---------------------------------------------------------------- data

def jsonl(name):
    path = STUDIES / name
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]


def paired(engine, sample="paper-600"):
    """Scorecard versions of one engine's lineage, from the paired replay."""
    rows = [r for r in jsonl("laya_paired.jsonl")
            if r.get("engine") == engine and r.get("sample") == sample]
    return sorted(rows, key=lambda r: r["version"])


def d0_runs():
    """The plain loop's 12 runs: gain over the best plain refit, and the hand judgement."""
    judged = json.loads((STUDIES / "arms_judged.json").read_text())["named_the_axis"]
    named = {(j["arm"], j["model"], int(j["seed"])) for j in judged}
    out = []
    for r in jsonl("arms.jsonl"):
        if r.get("arm") != "d0":
            continue
        gain = None
        if r["decision"] == "promoted":
            v = r["versions"]
            v = ast.literal_eval(v) if isinstance(v, str) else v
            order = sorted(v, key=lambda k: int(k[1:]))
            fits = [v[k]["accuracy"] for k in order if v[k]["kind"] == "fit"]
            gain = (v[order[-1]]["accuracy"] - max(fits)) * 100
        out.append({"model": short_model(r["model"]), "seed": int(r["seed"]), "gain": gain,
                    "named": ("d0", r["model"], int(r["seed"])) in named})
    return out


def short_model(name):
    for key, label in (("kimi-k3", "Kimi K3"), ("kimi-k2.5", "Kimi K2.5"),
                       ("deepseek", "DeepSeek V3.2"), ("qwen", "Qwen3-Coder")):
        if key in name:
            return label
    return name


def finetune_arms():
    """Pre-registered rows only, grouped by (arm, n_labels)."""
    groups = defaultdict(list)
    for r in jsonl("finetune_laya.jsonl"):
        if r.get("exploratory"):
            continue
        groups[(r["arm"], r["n_labels"])].append(r)
    return groups


def arm_summary(rows):
    acc = [r["paper600_accuracy"] for r in rows]
    return {"acc": st.mean(acc), "lo": min(acc), "hi": max(acc), "n": len(rows),
            "ece": st.mean(r["paper600_ece_calibrated"] for r in rows),
            "ece_raw": st.mean(r["paper600_ece_raw"] for r in rows)}


# ---------------------------------------------------------------- shared drawing

def new_figure(layout, rows=1, cols=1, **kw):
    fig, axes = plt.subplots(rows, cols, figsize=LAYOUTS[layout], dpi=DPI, **kw)
    fig.patch.set_facecolor(BACKGROUND)
    for ax in (axes.flat if hasattr(axes, "flat") else [axes]):
        ax.set_facecolor(PANEL)
        for side in ("top", "right"):
            ax.spines[side].set_visible(False)
        ax.spines["left"].set_color(GRID)
        ax.spines["bottom"].set_color(GRID)
        ax.tick_params(colors=INK)
        ax.set_axisbelow(True)
    return fig, axes


def scale(layout):
    return {"landscape": 1.0, "portrait": 1.12, "square": 1.0, "cover": 0.8}[layout]


def headline(fig, layout, title, subtitle):
    k = scale(layout)
    top = {"landscape": 0.945, "portrait": 0.962, "square": 0.955, "cover": 0.93}[layout]
    gap = {"landscape": 0.058, "portrait": 0.058, "square": 0.068, "cover": 0.08}[layout]
    fig.text(0.05, top, title, fontsize=25 * k, fontweight="bold", color=INK, va="top",
             linespacing=1.15)
    lines = title.count("\n") + 1
    fig.text(0.05, top - gap * lines, subtitle, fontsize=13.5 * k, color=MUTED, va="top",
             linespacing=1.35)


def footer(fig, layout, note):
    return  # no footers: the article captions carry sources and caveats

    k = scale(layout)
    if layout in ("portrait", "square"):
        # Social: re-wrap the note for the narrow canvas and give the URL its own line.
        note = "\n".join(textwrap.wrap(note.replace("\n", " "), 92))
        fig.text(0.05, 0.05, note, fontsize=10.5 * k, color=MUTED, va="bottom",
                 linespacing=1.35)
        fig.text(0.05, 0.02, f"anth.us/blog/{SLUG}", fontsize=13 * k, color=BLUE,
                 fontweight="bold", va="bottom")
        return
    fig.text(0.05, 0.028, note, fontsize=11 * k, color=MUTED, va="bottom", linespacing=1.35)


def reclaim_bottom(fig, floor=0.11):
    """Footers are gone (captions carry sources), so stretch the panels down into that space.
    A figure-level legend under the panels keeps its place and raises the floor."""
    axes = [a for a in fig.axes if a.get_visible()]
    if not axes:
        return
    def anchor_y(legend):
        box = legend.get_bbox_to_anchor().transformed(fig.transFigure.inverted())
        return box.y0
    if any(anchor_y(l) < 0.3 for l in fig.legends):
        floor = max(floor, 0.2)   # a legend under the panels keeps its place
    top = max(a.get_position().y1 for a in axes)
    low = min(a.get_position().y0 for a in axes)
    if low <= floor + 0.01:
        return
    k = (top - floor) / (top - low)
    for a in axes:
        p = a.get_position()
        a.set_position([p.x0, top - (top - p.y0) * k, p.width, p.height * k])


def save(fig, name, layout):
    if layout != "cover":
        reclaim_bottom(fig)
    if layout in ("landscape", "cover"):
        out = IMAGES / f"{SLUG}-{name}.png"
    else:
        size = "1080x1350" if layout == "portrait" else "1080x1080"
        out = SOCIAL / f"{SLUG}-{name}-{size}.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out, facecolor=BACKGROUND, dpi=DPI)
    plt.close(fig)
    w, h = LAYOUTS[layout]
    print(f"wrote {out} ({int(w * DPI)}x{int(h * DPI)})")


# ---------------------------------------------------------------- chart: refit vs steer

VERSION_LABELS = {1: "v1\nJev alone\n0 labels", 2: "v2\nrefit\n37 labels",
                  3: "v3\nrefit\n87 labels", 4: "v4\none new question\n140 labels"}


def version_bars(ax, versions, key, k, fmt, ylim, ylabel):
    xs = range(len(versions))
    values = [v[key] for v in versions]
    colors = [BLUE_TINT if v["kind"] == "seed" else BLUE for v in versions]
    bars = ax.bar(xs, values, color=colors, edgecolor=BLUE, linewidth=1.6, width=0.62, zorder=3)
    for bar, value in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width() / 2, value + (ylim[1] - ylim[0]) * 0.02,
                fmt.format(value), ha="center", va="bottom", fontsize=17 * k,
                fontweight="bold", color=INK)
    ax.set_xticks(list(xs))
    ax.set_xticklabels([VERSION_LABELS[v["version"]] for v in versions], fontsize=12.5 * k)
    ax.tick_params(axis="x", length=0, pad=8)
    ax.tick_params(axis="y", labelsize=12 * k)
    ax.set_ylim(*ylim)
    ax.set_ylabel(ylabel, fontsize=13.5 * k, color=INK, labelpad=10)
    ax.grid(axis="y", color=GRID, linewidth=1, zorder=0)


def chart_refit_vs_steer(layout):
    versions = paired("jev")
    k = scale(layout)
    stacked = layout != "landscape"
    fig, axes = new_figure(layout, rows=2 if stacked else 1, cols=1 if stacked else 2)
    ece_ax, acc_ax = axes   # calibration first: it starts improving with the very first refit
    version_bars(acc_ax, versions, "accuracy", k, "{:.3f}", (0.6, 0.93), "Held-out accuracy")
    version_bars(ece_ax, versions, "ece", k, "{:.3f}", (0, 0.185),
                 "Calibration error (lower is better)")
    acc_ax.set_title("Then, accuracy: only the new question moves it",
                     fontsize=15 * k, color=INK, loc="left", pad=12)
    ece_ax.set_title("First, calibration: every refit improves it", fontsize=15 * k, color=INK,
                     loc="left", pad=12)
    v1, v3, v4 = versions[0], versions[2], versions[3]
    refit = (v3["accuracy"] - v1["accuracy"]) * 100
    steer = (v4["accuracy"] - v3["accuracy"]) * 100
    title = ("87 labels of refitting fixed calibration.\nOne new question fixed accuracy."
             if stacked else
             "87 labels of refitting fixed calibration. One new question fixed accuracy.")
    headline(fig, layout, title, "")
    footer(fig, layout, "One recorded run, replayable with `make demo`. Same 600 held-out "
                        "items for every version (about ±1.4 points, 1 s.e.).\n"
                        "Source: Jev-Flywheel studies/laya_paired.jsonl")
    if layout == "landscape":
        fig.subplots_adjust(left=0.075, right=0.97, top=0.76, bottom=0.235, wspace=0.22)
    elif layout == "portrait":
        fig.subplots_adjust(left=0.13, right=0.95, top=0.775, bottom=0.19, hspace=0.50)
    else:
        fig.subplots_adjust(left=0.13, right=0.95, top=0.735, bottom=0.22, hspace=0.78)
    save(fig, "refit-vs-steer", layout)


# ---------------------------------------------------------------- chart: the journey (hero)

def chart_journey(layout):
    """The whole story for a reader who has never heard of ECE: confidence gets trustworthy right
    away, accuracy jumps later, when the question set changes. Same four versions as
    chart_refit_vs_steer, drawn over rounds of feedback and in plain words."""
    versions = paired("jev")
    k = scale(layout)
    stacked = layout != "landscape"
    labels = [v.get("n_labels", v.get("after_n_labels", n)) for v, n in zip(versions, (0, 37, 87, 140))]
    fig, axes = new_figure(layout, rows=2 if stacked else 1, cols=1 if stacked else 2)
    conf_ax, acc_ax = axes
    series = [
        (conf_ax, [v["ece"] * 100 for v in versions], "{:.0f} pts", (0, 19),
         "1. Its confidence got trustworthy right away",
         "gap between its stated confidence and reality (points, lower is better)", "top"),
        (acc_ax, [v["accuracy"] * 100 for v in versions], "{:.0f}%", (70, 92),
         "2. Its accuracy jumped later, with one new question",
         "how often it agreed with the reviewers", "bottom"),
    ]
    for ax, ys, fmt, ylim, title, ylabel, band_label in series:
        ax.axvspan(87, 140, color=BLUE_TINT, alpha=0.45, zorder=1)
        ax.plot(labels, ys, color=BLUE, linewidth=3.2 * k, marker="o", markersize=11 * k,
                markerfacecolor=PANEL, markeredgewidth=3 * k, zorder=4)
        for x, y in zip(labels, ys):
            ax.annotate(fmt.format(y), (x, y), textcoords="offset points", xytext=(0, 13 * k),
                        ha="center", fontsize=15 * k, fontweight="bold", color=INK, zorder=5)
        ax.set_ylim(*ylim)
        ax.set_xlim(-12, 152)
        ax.set_xticks(labels)
        ax.set_xticklabels(["start", "37", "87", "140"], fontsize=13 * k)
        ax.set_xlabel("rounds of agree-or-disagree feedback", fontsize=13.5 * k, color=INK, labelpad=8)
        ax.set_yticks([])
        ax.set_title(title, fontsize=16 * k, color=INK, loc="left", pad=12, fontweight="bold")
        span = ylim[1] - ylim[0]
        if band_label == "top":
            ax.text(113.5, ylim[1] - span * 0.05, "the system adds\none new question", ha="center",
                    va="top", fontsize=12 * k, color=BLUE, fontweight="bold", zorder=5)
            ax.text(-8, ylim[0] + span * 0.05, ylabel, ha="left", va="bottom", fontsize=11.5 * k,
                    color=MUTED, zorder=5)
        else:
            ax.text(113.5, ylim[0] + span * 0.04, "the system adds\none new question", ha="center",
                    va="bottom", fontsize=12 * k, color=BLUE, fontweight="bold", zorder=5)
            ax.text(-8, ylim[1] - span * 0.05, ylabel, ha="left", va="top", fontsize=11.5 * k,
                    color=MUTED, zorder=5)
    title = ("Jev never changed. The system around it\nlearned in two steps."
             if stacked else "Jev never changed. The system around it learned in two steps.")
    headline(fig, layout, title,
             "Small automatic re-weightings fixed its confidence within a few dozen rounds. "
             "Accuracy moved only when it worked out which question was missing."
             if not stacked else
             "Small automatic re-weightings fixed its confidence within a few\ndozen rounds. "
             "Accuracy moved only when it worked out which\nquestion was missing.")
    footer(fig, layout, "One recorded run, replayable with `make demo`. Scored on the same 600 test "
                        "items at every step (about ±1.4 points).\n"
                        "Confidence error is expected calibration error (ECE). "
                        "Source: Jev-Flywheel studies/laya_paired.jsonl")
    if layout == "landscape":
        fig.subplots_adjust(left=0.075, right=0.97, top=0.74, bottom=0.255, wspace=0.2)
    elif layout == "portrait":
        fig.subplots_adjust(left=0.13, right=0.95, top=0.745, bottom=0.2, hspace=0.62)
    else:
        fig.subplots_adjust(left=0.13, right=0.95, top=0.70, bottom=0.235, hspace=0.95)
    save(fig, "journey", layout)


# ---------------------------------------------------------------- chart: reliability

def chart_reliability(layout):
    runs = d0_runs()
    k = scale(layout)
    order = sorted(runs, key=lambda r: (r["gain"] is not None, r["gain"] or 0))
    fig, ax = new_figure(layout)
    for y, run in enumerate(order):
        if run["gain"] is None:
            ax.plot([0], [y], marker="x", color=GRAY, markersize=11 * k, mew=2.6, zorder=4)
            ax.text(0.45, y, "nothing promoted", va="center",
                    fontsize=12 * k, color=MUTED)
            continue
        ax.barh(y, run["gain"], color=BLUE if run["named"] else PANEL, edgecolor=BLUE,
                linewidth=1.8, height=0.64, zorder=3)
        ax.text(run["gain"] + 0.25, y, f"{run['gain']:+.1f}", va="center",
                fontsize=13.5 * k, fontweight="bold", color=INK)
    ax.set_yticks(range(len(order)))
    ax.set_yticklabels([f"{r['model']} · seed {r['seed']}" for r in order], fontsize=12.5 * k)
    ax.tick_params(axis="y", length=0, pad=8)
    ax.tick_params(axis="x", labelsize=12 * k)
    ax.set_xlim(-0.5, 17.5)
    ax.set_xlabel("Held-out accuracy gained over the run's best plain refit (points)",
                  fontsize=13.5 * k, color=INK, labelpad=10)
    ax.grid(axis="x", color=GRID, linewidth=1, zorder=0)

    promoted = [r["gain"] for r in runs if r["gain"] is not None]
    named = [r for r in runs if r["named"]]
    ax.axvline(st.mean(promoted), color=INK, linewidth=1.4, linestyle=(0, (4, 3)), zorder=2)
    ax.text(st.mean(promoted) + 0.15, -0.72, f"mean of promoted runs {st.mean(promoted):+.1f}",
            fontsize=11.5 * k, color=INK, va="center")
    ax.set_ylim(-1.15, len(order) - 0.4)
    ax.legend(handles=[
        Patch(facecolor=BLUE, edgecolor=BLUE, label="named the subject-matter axis"),
        Patch(facecolor=PANEL, edgecolor=BLUE, label="promoted other questions"),
    ], loc="center right", fontsize=12.5 * k, frameon=True, facecolor=PANEL, edgecolor=GRID)

    wrap = "\n" if layout != "landscape" else " "
    headline(fig, layout,
             f"{len(named)} of {len(runs)} runs named the planted axis.{wrap}"
             f"{len(promoted)} of {len(runs)} still gained accuracy.",
             "One steering round each at 140 labels: four analyst models by three label seeds. "
             if layout == "landscape" else
             "One steering round each at 140 labels:\nfour analyst models by three label seeds.")
    footer(fig, layout, "\"Named the axis\" is a hand judgement, published in "
                        "studies/arms_judged.json. 600 held-out items per run.\n"
                        "Source: Jev-Flywheel studies/arms.jsonl")
    if layout == "landscape":
        fig.subplots_adjust(left=0.175, right=0.96, top=0.80, bottom=0.215)
    elif layout == "portrait":
        fig.subplots_adjust(left=0.29, right=0.94, top=0.81, bottom=0.19)
    else:
        fig.subplots_adjust(left=0.29, right=0.94, top=0.77, bottom=0.235)
    save(fig, "reliability", layout)


# ---------------------------------------------------------------- chart: fine-tuning comparison

def finetune_systems():
    groups = finetune_arms()
    jev, laya = paired("jev"), paired("laya")
    a, b, d = (arm_summary(groups[(arm, 140)]) for arm in ("A", "B", "D"))

    def single(row):
        return {"acc": row["accuracy"], "lo": None, "hi": None, "ece": row["ece"], "n": 1}

    return [
        ("Laya head-only fine-tune", b, MAGENTA_TINT, MAGENTA, "///"),
        ("Laya alone", single(laya[0]), MAGENTA_TINT, MAGENTA, None),
        ("Jev alone", single(jev[0]), BLUE_TINT, BLUE, None),
        ("Laya + flywheel layer", single(laya[-1]), MAGENTA, MAGENTA, None),
        ("DistilBERT fine-tuned", d, GRAY_TINT, GRAY, "///"),
        ("Jev + flywheel layer", single(jev[-1]), BLUE, BLUE, None),
        ("Laya fully fine-tuned", a, MAGENTA, "#7d1f4f", "///"),
    ]


def system_bars(ax, systems, key, k, xlim, xlabel, whiskers):
    for y, (name, s, face, edge, hatch) in enumerate(systems):
        ax.barh(y, s[key], color=face, edgecolor=edge, linewidth=1.8, height=0.64,
                hatch=hatch, zorder=3)
        end = s[key]
        if whiskers and s["lo"] is not None:
            ax.plot([s["lo"], s["hi"]], [y, y], color=INK, linewidth=2.2, zorder=5,
                    solid_capstyle="butt")
            for x in (s["lo"], s["hi"]):
                ax.plot([x, x], [y - 0.16, y + 0.16], color=INK, linewidth=2.2, zorder=5)
            end = s["hi"]
        ax.text(end + (xlim[1] - xlim[0]) * 0.015, y, f"{s[key]:.3f}", va="center",
                fontsize=14 * k, fontweight="bold", color=INK)
    ax.set_yticks(range(len(systems)))
    ax.set_yticklabels([s[0] for s in systems], fontsize=13 * k)
    ax.tick_params(axis="y", length=0, pad=8)
    ax.tick_params(axis="x", labelsize=12 * k)
    ax.set_xlim(*xlim)
    ax.set_xlabel(xlabel, fontsize=13.5 * k, color=INK, labelpad=10)
    ax.grid(axis="x", color=GRID, linewidth=1, zorder=0)


LEGEND_Y = {"landscape": 0.03, "portrait": 0.03, "square": 0.03}


def chart_finetune(layout):
    systems = finetune_systems()
    k = scale(layout)
    stacked = layout != "landscape"
    fig, axes = new_figure(layout, rows=2 if stacked else 1, cols=1 if stacked else 2)
    acc_ax, ece_ax = axes
    system_bars(acc_ax, systems, "acc", k, (0.5, 0.97), "Held-out accuracy (600 items)", True)
    system_bars(ece_ax, systems, "ece", k, (0, 0.175),
                "Calibration error (ECE) as served, lower is better", False)
    if not stacked:
        ece_ax.set_yticklabels([])
    acc_ax.set_title("Accuracy", fontsize=15 * k, color=INK, loc="left", pad=10)
    ece_ax.set_title("Calibration error", fontsize=15 * k, color=INK, loc="left", pad=10)
    fig.legend(handles=[
        Patch(facecolor=GRAY_TINT, edgecolor=GRAY, label="engine alone"),
        Patch(facecolor=GRAY, edgecolor=GRAY, label="with the flywheel layer"),
        Patch(facecolor=PANEL, edgecolor=GRAY, hatch="///", label="gradient fine-tuned"),
    ], loc="lower center", bbox_to_anchor=(0.5, LEGEND_Y[layout]), ncol=3, fontsize=12 * k,
        frameon=False)
    wrap = "\n" if stacked else " "
    headline(fig, layout,
             f"Fine-tuning Laya wins accuracy.{wrap}The layer keeps calibration.",
             "Light bars: the engines with no labels. Everything else got the same 140. Blue is Jev, magenta is "
             "Laya, gray is DistilBERT. Whiskers span three seeds."
             if not stacked else
             "Light bars are the engines with no labels; every other system got the\nsame 140. Blue is Jev, "
             "magenta is Laya, gray is DistilBERT. Whiskers span three seeds.")
    footer(fig, layout, "Constructed, templated corpus with a lexical planted cue, which "
                        "flatters any text classifier. Layer rows are one recorded run;\n"
                        "fine-tuned rows are after their own temperature step. "
                        "Source: Jev-Flywheel studies/finetune_laya.jsonl, studies/laya_paired.jsonl")
    if layout == "landscape":
        fig.subplots_adjust(left=0.185, right=0.965, top=0.78, bottom=0.27, wspace=0.12)
    elif layout == "portrait":
        fig.subplots_adjust(left=0.31, right=0.93, top=0.77, bottom=0.215, hspace=0.42)
    else:
        fig.subplots_adjust(left=0.31, right=0.93, top=0.735, bottom=0.26, hspace=0.66)
    save(fig, "finetune", layout)


# ---------------------------------------------------------------- cover

def chart_cover(layout="cover"):
    """A social card that reads at a glance: the hook in words, the result as two bars.

    It deliberately does not repeat the article title (the card's own title sits under the
    image on every platform), so it also works as the hero figure at the top of the page.
    """
    versions = paired("jev")
    before, after = versions[0]["accuracy"], versions[-1]["accuracy"]
    fig = plt.figure(figsize=LAYOUTS["cover"], dpi=DPI)
    fig.patch.set_facecolor(BACKGROUND)
    fig.text(0.06, 0.86, "THE MODEL NEVER CHANGED", fontsize=17, fontweight="bold", color=MUTED,
             va="top")
    fig.text(0.06, 0.74, "We asked it one\nmore question.", fontsize=44, fontweight="bold",
             color=INK, va="top", linespacing=1.12)
    fig.text(0.06, 0.34, f"Accuracy: {before:.0%} to {after:.0%}.", fontsize=30,
             color=BLUE, fontweight="bold", va="top")
    fig.text(0.06, 0.225, "140 rounds of agree-or-disagree feedback.\nNo fine-tuning. Jev's weights untouched.",
             fontsize=16.5, color=MUTED, va="top", linespacing=1.4)

    ax = fig.add_axes([0.61, 0.17, 0.33, 0.70])
    ax.set_facecolor(PANEL)
    for side in ax.spines.values():
        side.set_visible(False)
    bars = [("Jev alone", before, BLUE_TINT, INK), ("Jev + one\nnew question", after, BLUE, BLUE)]
    for x, (name, value, face, ink) in enumerate(bars):
        ax.bar(x, value, width=0.62, color=face, edgecolor=BLUE, linewidth=2, zorder=3)
        ax.text(x, value + 0.012, f"{value:.0%}", ha="center", va="bottom", fontsize=30,
                fontweight="bold", color=ink)
    ax.set_xticks(range(len(bars)))
    ax.set_xticklabels([b[0] for b in bars], fontsize=15, color=INK)
    ax.tick_params(axis="x", length=0, pad=10)
    ax.set_yticks([])
    ax.set_ylim(0.5, 1.0)
    ax.set_xlim(-0.6, 1.6)
    ax.text(0.5, 0.985, "held-out accuracy (axis starts at 50%)", fontsize=11.5, color=MUTED,
            ha="center", va="top")
    save(fig, "cover", "cover")


CHARTS = {"journey": chart_journey, "refit-vs-steer": chart_refit_vs_steer, "reliability": chart_reliability,
          "finetune": chart_finetune}


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--only", choices=["cover", *CHARTS], help="render one chart")
    parser.add_argument("--layout", choices=["landscape", "portrait", "square"],
                        help="render one layout (default: all three)")
    args = parser.parse_args()
    if args.only in (None, "cover"):
        chart_cover()
    for name, draw in CHARTS.items():
        if args.only not in (None, name):
            continue
        for layout in ([args.layout] if args.layout else ["landscape", "portrait", "square"]):
            draw(layout)


if __name__ == "__main__":
    main()
