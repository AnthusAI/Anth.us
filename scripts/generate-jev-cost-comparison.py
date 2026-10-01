#!/usr/bin/env python3
"""Generate the linear Jev versus GPT-5.4 mini cost-comparison chart.

The chart uses the deliberately simple scorecard assumptions stated in
jev-useful-decisions.mdx: one grouped 10,000-token Jev request, versus ten
separate GPT-5.4 mini calls that each repeat 10,000 tokens and return a short
10-token label. It visualizes model-token charges only.
"""

from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter


FIGURE_SIZE = (16, 9)
DPI = 100
OUTPUT = Path("src/site-content/images/jev-cost-comparison.png")

JEV_COST_PER_MILLION = 420
GPT_COST_PER_MILLION = 75_450

BACKGROUND = "#f1f9fe"
PANEL = "#ffffff"
INK = "#333333"
MUTED = "#5f6a72"
GRID = "#c8d8e3"
MAGENTA = "#d03382"
BLUE = "#0389d7"


def dollars(value, _position):
    return f"${value / 1_000:.0f}k" if value else "$0"


def main():
    fig, ax = plt.subplots(figsize=FIGURE_SIZE, dpi=DPI)
    fig.patch.set_facecolor(BACKGROUND)
    ax.set_facecolor(PANEL)

    names = ["GPT-5.4 mini", "Jev"]
    values = [GPT_COST_PER_MILLION, JEV_COST_PER_MILLION]
    bars = ax.bar(names, values, color=[MAGENTA, BLUE], width=0.52, zorder=3)

    ax.set_yscale("linear")
    ax.set_ylim(0, 84_000)
    ax.set_yticks([0, 20_000, 40_000, 60_000, 80_000])
    ax.yaxis.set_major_formatter(FuncFormatter(dollars))
    ax.grid(axis="y", color=GRID, linewidth=1, alpha=0.8, zorder=0)
    ax.set_axisbelow(True)

    ax.set_title(
        "Model-token cost for 1 million 10-question scorecards",
        fontsize=26,
        fontweight="bold",
        color=INK,
        loc="left",
        pad=26,
    )
    ax.text(
        0,
        1.025,
        "Linear scale  •  Same 10,000-token context per question  •  API charges only",
        transform=ax.transAxes,
        fontsize=13,
        color=MUTED,
        va="bottom",
    )
    ax.set_ylabel("USD per million scorecards", fontsize=15, color=INK, labelpad=18)
    ax.tick_params(axis="x", labelsize=17, length=0, pad=16, colors=INK)
    ax.tick_params(axis="y", labelsize=13, colors=INK)

    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    ax.spines["left"].set_color(GRID)
    ax.spines["bottom"].set_color(GRID)

    gpt_bar, jev_bar = bars
    ax.text(
        gpt_bar.get_x() + gpt_bar.get_width() / 2,
        GPT_COST_PER_MILLION + 2_800,
        "$75,450",
        ha="center",
        va="bottom",
        fontsize=22,
        fontweight="bold",
        color=MAGENTA,
    )
    ax.text(
        gpt_bar.get_x() + gpt_bar.get_width() / 2,
        -10_000,
        "10 separate calls",
        ha="center",
        va="top",
        fontsize=12,
        color=MUTED,
        clip_on=False,
    )

    ax.annotate(
        "$420",
        xy=(jev_bar.get_x() + jev_bar.get_width() / 2, JEV_COST_PER_MILLION),
        xytext=(jev_bar.get_x() + jev_bar.get_width() / 2, 11_000),
        ha="center",
        va="bottom",
        fontsize=22,
        fontweight="bold",
        color=BLUE,
        arrowprops={"arrowstyle": "-", "color": BLUE, "lw": 2.2},
    )
    ax.text(
        jev_bar.get_x() + jev_bar.get_width() / 2,
        -10_000,
        "1 grouped request",
        ha="center",
        va="top",
        fontsize=12,
        color=MUTED,
        clip_on=False,
    )

    ax.text(
        0.5,
        0.53,
        "≈180× lower\nmodel charge",
        transform=ax.transAxes,
        ha="center",
        va="center",
        fontsize=19,
        fontweight="bold",
        color=INK,
        bbox={
            "boxstyle": "round,pad=0.55",
            "facecolor": "#ffffff",
            "edgecolor": "#ff87c3",
            "linewidth": 2,
        },
        zorder=5,
    )

    fig.text(
        0.125,
        0.035,
        "Assumptions: GPT-5.4 mini uses 10 × (10,000 input + 10 output) tokens; "
        "Jev uses 1 × 10,000 input tokens. Excludes transcription, storage, engineering, and review.",
        ha="left",
        fontsize=11.5,
        color=MUTED,
    )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    fig.subplots_adjust(left=0.12, right=0.96, top=0.82, bottom=0.22)
    fig.savefig(OUTPUT, facecolor=BACKGROUND, dpi=DPI)
    print(f"Wrote {OUTPUT} at {FIGURE_SIZE[0] * DPI}x{FIGURE_SIZE[1] * DPI}")


if __name__ == "__main__":
    main()
