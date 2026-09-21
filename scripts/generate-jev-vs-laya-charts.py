#!/usr/bin/env python3
"""Charts for "Jev vs Laya: Same Labels, Same Questions, One Variable".

Every number is read from the Jev-Flywheel study records by absolute path:

  studies/laya_paired.jsonl    the paired replay (one row per engine, sample, version)
  studies/finetune_laya.jsonl  the fine-tune-Laya study (one row per arm, seed, n_labels);
                               rows with "exploratory": true are skipped

Series encoding, shared by the three articles: colour is the ENGINE (Jev blue, Laya magenta,
DistilBERT gray); fill is the METHOD (engine alone = light tint, with the flywheel layer =
solid, fine-tuned = hatched). Blue and magenta are close in luminance, so every bar is also
labelled with its engine in text, and the three fills differ in lightness and texture.

Run from the Anth.us repo root:

  python3 scripts/generate-jev-vs-laya-charts.py            # everything
  python3 scripts/generate-jev-vs-laya-charts.py --only curve --layouts wide

The learning curve draws whatever arm C sizes are on disk and names the ones still to come;
re-run it when the arm finishes.
"""

import argparse
import json
import statistics
from collections import defaultdict
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Patch  # noqa: E402

SLUG = "jev-vs-laya"
STUDIES = Path("/Users/home/Projects/Jev-Flywheel/studies")
SITE = Path(__file__).resolve().parents[1]
IMAGES = SITE / "src/site-content/images"
SOCIAL = SITE / "social" / SLUG
DPI = 100

BACKGROUND = "#f1f9fe"
PANEL = "#ffffff"
INK = "#333333"
MUTED = "#5f6a72"
GRID = "#c8d8e3"
BLUE = "#0389d7"
MAGENTA = "#d03382"
GRAY = "#8a949c"
TINT = {BLUE: "#b9def5", MAGENTA: "#f3c3dc", GRAY: "#d9dde0", INK: "#d5d5d5"}

# name -> (figsize in inches, type scale, orientation of bars, footer?)
LAYOUTS = {
    "wide": ((16, 9), 1.0, "v", False),
    "portrait": ((10.8, 13.5), 1.12, "h", True),
    "square": ((10.8, 10.8), 1.0, "h", True),
    "cover": ((12, 6.3), 0.8, "v", False),
}
PLANNED_C_SIZES = [140, 300, 500, 800, 2000, 5140]  # PREREGISTERED.md, arm C
FLYWHEEL_LAYA = None  # filled from laya_paired.jsonl in load()
FLYWHEEL_JEV = None


# ---------------------------------------------------------------- data

def read_jsonl(path):
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]


def load():
    paired = {}
    for row in read_jsonl(STUDIES / "laya_paired.jsonl"):
        if row.get("sample") != "paper-600":
            continue
        key = "alone" if row["kind"] == "seed" else ("layer" if row["kind"] == "steer" else None)
        if key:
            paired[(row["engine"], key)] = row
    arms = defaultdict(list)
    for row in read_jsonl(STUDIES / "finetune_laya.jsonl"):
        if row.get("exploratory"):
            continue
        arms[(row["arm"], row["n_labels"])].append(row)
    return paired, arms


def stat(rows, field):
    xs = [r[field] for r in rows]
    return statistics.mean(xs), min(xs), max(xs)


def tier_mean(rows, tier):
    return statistics.mean(r["paper600_by_tier"][tier] for r in rows)


# ---------------------------------------------------------------- drawing helpers

def style(engine_colour, method):
    if method == "alone":
        return dict(facecolor=TINT[engine_colour], edgecolor=engine_colour, linewidth=1.6)
    if method == "layer":
        return dict(facecolor=engine_colour, edgecolor=engine_colour, linewidth=1.6)
    return dict(facecolor=PANEL, edgecolor=engine_colour, linewidth=1.6, hatch="///")


def new_figure(layout, title, subtitle, nrows=1, ncols=1):
    size, scale, orient, footer = LAYOUTS[layout]
    if orient == "h" and ncols > 1:
        nrows, ncols = ncols, 1
    fig, axes = plt.subplots(nrows, ncols, figsize=size, dpi=DPI, squeeze=False)
    fig.patch.set_facecolor(BACKGROUND)
    for ax in axes.flat:
        ax.set_facecolor(PANEL)
        for side in ("top", "right"):
            ax.spines[side].set_visible(False)
        ax.spines["left"].set_color(GRID)
        ax.spines["bottom"].set_color(GRID)
        ax.tick_params(colors=INK, labelsize=13 * scale, length=0)
        ax.set_axisbelow(True)
    tall = orient == "h"
    wrap_at = 38 if tall else 68
    fig.text(0.06, 0.965, wrap(title, wrap_at), fontsize=(24 if tall else 26) * scale,
             fontweight="bold", color=INK, va="top", ha="left", linespacing=1.15)
    lines = wrap(title, wrap_at).count("\n") + 1
    fig.text(0.06, 0.965 - lines * (0.036 if tall else 0.058) - 0.008, wrap(subtitle, wrap_at + 24),
             fontsize=13.5 * scale, color=MUTED, va="top", ha="left", linespacing=1.3)
    if footer:
        pass
    sub_lines = wrap(subtitle, wrap_at + 24).count("\n") + 1
    top = (0.965 - lines * (0.036 if tall else 0.058) - 0.008
           - sub_lines * (0.021 if tall else 0.03) - (0.035 if tall else 0.05))
    return fig, axes, scale, orient, top


def wrap(text, width):
    import textwrap
    return "\n".join(textwrap.wrap(text, width))


def bars(ax, orient, scale, items, lo, hi, fmt="{:.3f}", value_label="", err=True):
    """items: list of (label, value, (min, max) or None, colour, method)."""
    n = len(items)
    pos = list(range(n))
    if orient == "h":
        pos = pos[::-1]
    for p, (label, value, span, colour, method) in zip(pos, items):
        kw = style(colour, method)
        if orient == "v":
            ax.bar(p, value - lo, bottom=lo, width=0.66, zorder=3, **kw)
            if span and err:
                ax.plot([p, p], span, color=INK, linewidth=2, zorder=4)
            ax.text(p, (span[1] + (hi - lo) * 0.01 if span else value) + (hi - lo) * 0.015, fmt.format(value),
                    ha="center", va="bottom", fontsize=17 * scale, fontweight="bold", color=colour if colour != GRAY else INK)
        else:
            ax.barh(p, value - lo, left=lo, height=0.66, zorder=3, **kw)
            if span and err:
                ax.plot(span, [p, p], color=INK, linewidth=2, zorder=4)
            ax.text((span[1] + (hi - lo) * 0.01 if span else value) + (hi - lo) * 0.015, p, fmt.format(value),
                    ha="left", va="center", fontsize=17 * scale, fontweight="bold", color=colour if colour != GRAY else INK)
    labels = [i[0] for i in items]
    if orient == "v":
        ax.set_xticks(pos)
        ax.set_xticklabels(labels, fontsize=13.5 * scale, color=INK, linespacing=1.25)
        ax.set_ylim(lo, hi)
        ax.set_ylabel(value_label, fontsize=14 * scale, color=INK, labelpad=12)
        ax.grid(axis="y", color=GRID, linewidth=1, zorder=0)
    else:
        ax.set_yticks(pos)
        ax.set_yticklabels([l.replace("\n", " ") if len(l) < 24 else l for l in labels],
                           fontsize=13.5 * scale, color=INK, linespacing=1.2)
        ax.set_xlim(lo, hi)
        ax.set_xlabel(value_label, fontsize=14 * scale, color=INK, labelpad=10)
        ax.grid(axis="x", color=GRID, linewidth=1, zorder=0)


def legend(fig, scale, y, entries=("alone", "layer", "tuned"), ncol=3, x=0.06):
    names = {"alone": "engine alone", "layer": "with the flywheel layer", "tuned": "fine-tuned on the 140 labels"}
    handles = [Patch(label=names[e], **style(INK, e)) for e in entries]
    fig.legend(handles=handles, loc="upper left", bbox_to_anchor=(x, y), ncol=ncol, frameon=False,
               fontsize=13 * scale, labelcolor=INK, handlelength=2.2, columnspacing=1.8)


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
    if layout in ("wide", "cover"):
        out = IMAGES / f"{SLUG}-{name}.png"
    else:
        out = SOCIAL / f"{SLUG}-{name}-{'1080x1350' if layout == 'portrait' else '1080x1080'}.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out, facecolor=BACKGROUND, dpi=DPI)
    plt.close(fig)
    w, h = LAYOUTS[layout][0]
    print(f"wrote {out} ({int(w * DPI)}x{int(h * DPI)})")


def note(fig, scale, text, y=0.045, footer=False):
    return  # no source notes on the images: the article captions carry them
    if footer:
        text = wrap(text, 92)
    fig.text(0.06, y + (0.012 if footer else 0), text, fontsize=11.5 * scale, color=MUTED, ha="left", va="bottom",
             linespacing=1.3)


# ---------------------------------------------------------------- charts

def paired_items(paired, field):
    return [
        ("Jev\nalone", paired[("jev", "alone")][field], None, BLUE, "alone"),
        ("Jev\nwith the layer", paired[("jev", "layer")][field], None, BLUE, "layer"),
        ("Laya\nalone", paired[("laya", "alone")][field], None, MAGENTA, "alone"),
        ("Laya\nwith the layer", paired[("laya", "layer")][field], None, MAGENTA, "layer"),
    ]


def chart_paired(paired, arms, layout):
    gap0 = (paired[("jev", "alone")]["accuracy"] - paired[("laya", "alone")]["accuracy"]) * 100
    gap1 = (paired[("jev", "layer")]["accuracy"] - paired[("laya", "layer")]["accuracy"]) * 100
    fig, axes, scale, orient, top = new_figure(
        layout,
        f"The layer lifts both engines, and the gap widens from {gap0:.1f} to {gap1:.1f} points",
        "Held-out accuracy on the same 600 items. Same 140 labels, same refit points, same analyst "
        "proposal; only the engine that answers changes. One run; 600 items is about ±1.4 points.")
    ax = axes[0][0]
    bars(ax, orient, scale, paired_items(paired, "accuracy"), 0.5, 0.95, value_label="held-out accuracy")
    legend(fig, scale, top + 0.012, entries=("alone", "layer"))
    footer = LAYOUTS[layout][3]
    note(fig, scale, "Source: Jev-Flywheel studies/laya_paired.jsonl. Axis starts at 0.5; the majority-class baseline is 0.566.",
         footer=footer)
    fig.subplots_adjust(left=0.24 if orient == "h" else 0.09, right=0.93, top=top - 0.05, bottom=0.17 if orient == "v" else 0.19)
    save(fig, "paired-accuracy", layout)


def chart_calibration(paired, arms, layout):
    fig, axes, scale, orient, top = new_figure(
        layout,
        "Both engines end well calibrated; Brier still favours Jev",
        "Lower is better in both panels. Raw, Laya's calibration error was lower than Jev's on these 600 items. "
        "Brier rewards being confident and right, and Jev is right more often.",
        ncols=2)
    flat = list(axes.flat)
    bars(flat[0], orient, scale, paired_items(paired, "ece"), 0, 0.19, value_label="calibration error (ECE)")
    bars(flat[1], orient, scale, paired_items(paired, "brier"), 0, 0.23, value_label="Brier score")
    legend(fig, scale, top + 0.012, entries=("alone", "layer"))
    footer = LAYOUTS[layout][3]
    note(fig, scale, "Source: Jev-Flywheel studies/laya_paired.jsonl, paper-600 rows, first and last version of each lineage.",
         footer=footer)
    fig.subplots_adjust(left=0.24 if orient == "h" else 0.07, right=0.94, top=top - 0.05,
                        bottom=0.17 if orient == "v" else 0.19, wspace=0.22, hspace=0.32)
    save(fig, "calibration-brier", layout)


def chart_finetune(paired, arms, layout):
    a, b, d = arms[("A", 140)], arms[("B", 140)], arms[("D", 140)]
    sa, sb, sd = stat(a, "paper600_accuracy"), stat(b, "paper600_accuracy"), stat(d, "paper600_accuracy")
    items = [
        ("Laya\nalone", paired[("laya", "alone")]["accuracy"], None, MAGENTA, "alone"),
        ("Laya\nhead-only\nfine-tune", sb[0], sb[1:], MAGENTA, "tuned"),
        ("Laya\nwith the layer", paired[("laya", "layer")]["accuracy"], None, MAGENTA, "layer"),
        ("DistilBERT\nfine-tune", sd[0], sd[1:], GRAY, "tuned"),
        ("Jev\nwith the layer", paired[("jev", "layer")]["accuracy"], None, BLUE, "layer"),
        ("Laya\nfull\nfine-tune", sa[0], sa[1:], MAGENTA, "tuned"),
    ]
    fig, axes, scale, orient, top = new_figure(
        layout,
        f"On the same 140 labels, fully fine-tuning Laya ({sa[0]:.3f}) beats the layer on accuracy",
        "Held-out accuracy on the same 600 items. Fine-tuned bars are the mean of 3 seeds; the black line spans "
        "the seeds. Head-only fine-tuning landed below untuned Laya.")
    bars(axes[0][0], orient, scale, items, 0.5, 0.97, value_label="held-out accuracy")
    legend(fig, scale, top + 0.012, ncol=3 if orient == "v" else 1)
    footer = LAYOUTS[layout][3]
    note(fig, scale, "Source: Jev-Flywheel studies/finetune_laya.jsonl (arms A, B, D) and studies/laya_paired.jsonl. "
         "A templated corpus with a lexical cue flatters any text classifier.", footer=footer)
    fig.subplots_adjust(left=0.27 if orient == "h" else 0.09, right=0.93,
                        top=top - (0.05 if orient == "v" else 0.11), bottom=0.2 if orient == "v" else 0.19)
    save(fig, "finetune", layout)


def chart_tiers(paired, arms, layout):
    size, scale, orient, footer = LAYOUTS[layout]
    a, d = arms[("A", 140)], arms[("D", 140)]
    systems = [
        ("Jev alone", BLUE, "alone", lambda t: paired[("jev", "alone")]["by_tier"][t]),
        ("Jev with the layer", BLUE, "layer", lambda t: paired[("jev", "layer")]["by_tier"][t]),
        ("Laya alone", MAGENTA, "alone", lambda t: paired[("laya", "alone")]["by_tier"][t]),
        ("Laya with the layer", MAGENTA, "layer", lambda t: paired[("laya", "layer")]["by_tier"][t]),
        ("Laya, full fine-tune", MAGENTA, "tuned", lambda t: tier_mean(a, t)),
        ("DistilBERT fine-tune", GRAY, "tuned", lambda t: tier_mean(d, t)),
    ]
    tiers = ["strong", "medium", "weak", "neutral"]
    fig, axes, scale, orient, top = new_figure(
        layout,
        "Fine-tuned Laya carries the easy tiers; DistilBERT is best on the neutral tier",
        "Held-out accuracy by difficulty tier, 600 items (72 strong, 106 medium, 277 weak, 145 neutral). "
        "Fine-tuned systems are 3-seed means. Tier cells are small; read gaps of a few points as noise.")
    ax = axes[0][0]
    width = 0.84 / len(systems)
    mid = (len(systems) - 1) / 2
    for si, (name, colour, method, get) in enumerate(systems):
        for ti, tier in enumerate(tiers):
            v = get(tier)
            if orient == "v":
                x = ti + (si - mid) * width
                ax.bar(x, v - 0.4, bottom=0.4, width=width * 0.9, zorder=3, **style(colour, method))
                ax.text(x, v + 0.008, f"{v:.2f}", ha="center", va="bottom", fontsize=10 * scale, color=INK)
            else:
                y = (len(tiers) - 1 - ti) - (si - mid) * width
                ax.barh(y, v - 0.4, left=0.4, height=width * 0.9, zorder=3, **style(colour, method))
                ax.text(v + 0.006, y, f"{v:.2f}", ha="left", va="center", fontsize=12 * scale, color=INK)
    if orient == "v":
        ax.set_xticks(range(len(tiers)))
        ax.set_xticklabels(tiers, fontsize=15 * scale)
        ax.set_ylim(0.4, 1.12)
        ax.set_ylabel("held-out accuracy", fontsize=14 * scale, color=INK, labelpad=12)
        ax.grid(axis="y", color=GRID, zorder=0)
    else:
        ax.set_yticks(range(len(tiers)))
        ax.set_yticklabels(tiers[::-1], fontsize=15 * scale)
        ax.set_xlim(0.4, 1.08)
        ax.set_xlabel("held-out accuracy", fontsize=14 * scale, color=INK, labelpad=10)
        ax.grid(axis="x", color=GRID, zorder=0)
    handles = [Patch(label=n, **style(c, m)) for n, c, m, _ in systems]
    fig.legend(handles=handles, loc="upper left", bbox_to_anchor=(0.06, top + 0.012), frameon=False,
               ncol=4 if orient == "v" else 2, fontsize=13 * scale, labelcolor=INK, handlelength=2.2)
    note(fig, scale, "Source: Jev-Flywheel studies/laya_paired.jsonl and studies/finetune_laya.jsonl, paper600_by_tier.",
         footer=footer)
    fig.subplots_adjust(left=0.14 if orient == "h" else 0.08, right=0.95,
                        top=top - (0.05 if orient == "v" else 0.08), bottom=0.13 if orient == "v" else 0.19)
    save(fig, "tiers", layout)


def chart_curve(paired, arms, layout):
    size, scale, orient, footer = LAYOUTS[layout]
    # a size counts only once all three seeds are on disk; a partial size is still "running"
    sizes = sorted(n for (arm, n) in arms if arm == "C" and len(arms[(arm, n)]) >= 3)
    pending = [n for n in PLANNED_C_SIZES if n not in sizes]
    layer_laya = paired[("laya", "layer")]["accuracy"]
    layer_jev = paired[("jev", "layer")]["accuracy"]
    status = ("all six sizes" if not pending else
              "sizes on disk so far; still running: " + ", ".join(f"{n:,}" for n in pending))
    fig, axes, scale, orient, top = new_figure(
        layout,
        "At 140 random labels, fine-tuned Laya is already above both flywheel results",
        f"Arm C: full fine-tune on random pool draws, 3 seeds per size (dots), mean (line). Held-out accuracy, 600 items. "
        f"Showing {status}.")
    ax = axes[0][0]
    means = []
    for n in sizes:
        rows = arms[("C", n)]
        ax.scatter([n] * len(rows), [r["paper600_accuracy"] for r in rows], s=70 * scale, facecolor=PANEL,
                   edgecolor=MAGENTA, linewidth=1.8, zorder=4)
        means.append(statistics.mean(r["paper600_accuracy"] for r in rows))
    ax.plot(sizes, means, color=MAGENTA, linewidth=3, zorder=3)
    for n, m in zip(sizes, means):
        ax.text(n, 0.958, f"{m:.3f}", ha="center", va="center", fontsize=15 * scale, fontweight="bold", color=MAGENTA)
    ax.text(98, 0.958, "mean", ha="left", va="center", fontsize=12 * scale, color=MUTED)
    for value, colour, label in ((layer_jev, BLUE, f"Jev with the layer, 140 labels: {layer_jev:.3f}"),
                                 (layer_laya, MAGENTA, f"Laya with the layer, 140 labels: {layer_laya:.3f}")):
        ax.axhline(value, color=colour, linewidth=2, linestyle=(0, (6, 4)), zorder=2)
        ax.text(PLANNED_C_SIZES[-1] * 1.25, value + 0.004, label, ha="right", va="bottom", fontsize=13 * scale, color=colour)
    for n in pending:
        ax.axvline(n, color=GRID, linewidth=1.5, linestyle=":", zorder=1)
        ax.text(n, 0.765, "pending", rotation=90, ha="right", va="bottom", fontsize=11.5 * scale, color=MUTED)
    ax.set_xscale("log")
    ax.set_xticks(PLANNED_C_SIZES)
    ax.set_xticklabels([f"{n:,}" for n in PLANNED_C_SIZES], fontsize=13 * scale)
    ax.minorticks_off()
    ax.set_xlim(95, PLANNED_C_SIZES[-1] * 1.3)
    ax.set_ylim(0.76, 0.97)
    ax.set_xlabel("training labels (log scale)", fontsize=14 * scale, color=INK, labelpad=10)
    ax.set_ylabel("held-out accuracy", fontsize=14 * scale, color=INK, labelpad=12)
    ax.grid(axis="y", color=GRID, zorder=0)
    note(fig, scale, "Source: Jev-Flywheel studies/finetune_laya.jsonl, arm C. Learning rate chosen by 3-fold CV at the anchor sizes (140 and 800) and reused in between.",
         footer=footer)
    fig.subplots_adjust(left=0.12 if orient == "h" else 0.08, right=0.95, top=top, bottom=0.14 if orient == "v" else 0.19)
    save(fig, "learning-curve", layout)


def chart_cover(paired, arms, layout="cover"):
    """A social card that reads at a glance and doubles as the hero figure on the page.

    It does not repeat the article title: every platform prints that under the image.
    """
    fig = plt.figure(figsize=LAYOUTS["cover"][0], dpi=DPI)
    fig.patch.set_facecolor(BACKGROUND)
    jev = paired[("jev", "layer")]["accuracy"]
    laya = paired[("laya", "layer")]["accuracy"]
    tuned = stat(arms[("A", 140)], "paper600_accuracy")[0]
    fig.text(0.06, 0.86, "JEV VS LAYA, ONE TEST", fontsize=17, fontweight="bold", color=MUTED, va="top")
    fig.text(0.06, 0.74, "The open model\ntrailed. Then we\nretrained it.", fontsize=40, fontweight="bold",
             color=INK, va="top", linespacing=1.12)
    fig.text(0.06, 0.27, "Same 140 labels, same questions, same test items.\nOnly Laya's weights are open, so only\nLaya can be retrained.",
             fontsize=15.5, color=MUTED, va="top", linespacing=1.4)
    ax = fig.add_axes([0.58, 0.17, 0.37, 0.70])
    ax.set_facecolor(PANEL)
    for side in ax.spines.values():
        side.set_visible(False)
    bars = [("Jev\n(hosted)", jev, BLUE, "layer"), ("Laya\n(open)", laya, MAGENTA, "layer"),
            ("Laya,\nretrained", tuned, MAGENTA, "tuned")]
    for x, (name, value, colour, method) in enumerate(bars):
        ax.bar(x, value - 0.5, bottom=0.5, width=0.64, zorder=3, **style(colour, method))
        ax.text(x, value + 0.012, f"{value:.0%}", ha="center", va="bottom", fontsize=28, fontweight="bold",
                color=colour)
    ax.set_xticks(range(len(bars)))
    ax.set_xticklabels([b[0] for b in bars], fontsize=14, color=INK, linespacing=1.2)
    ax.tick_params(axis="x", length=0, pad=10)
    ax.set_yticks([])
    ax.set_ylim(0.5, 1.02)
    ax.set_xlim(-0.6, 2.6)
    ax.text(1.0, 1.012, "accuracy on the same test items (axis starts at 50%)", fontsize=11.5, color=MUTED,
            ha="center", va="top")
    save(fig, "cover", "cover")


CHARTS = {
    "paired": chart_paired,
    "calibration": chart_calibration,
    "finetune": chart_finetune,
    "tiers": chart_tiers,
    "curve": chart_curve,
}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--only", nargs="*", choices=[*CHARTS, "cover"], help="charts to draw (default: all)")
    parser.add_argument("--layouts", nargs="*", default=["wide", "portrait", "square"],
                        choices=["wide", "portrait", "square"], help="layouts for the body charts")
    args = parser.parse_args()
    paired, arms = load()
    wanted = args.only or [*CHARTS, "cover"]
    for name in wanted:
        if name == "cover":
            chart_cover(paired, arms)
            continue
        for layout in args.layouts:
            CHARTS[name](paired, arms, layout)


if __name__ == "__main__":
    main()
