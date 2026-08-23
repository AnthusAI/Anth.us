#!/usr/bin/env python3
"""Generate src/blog/images/cache-economics.png for maximize-value-not-intelligence.mdx.

Two panels, and neither makes the argument alone. Left: a 50-turn agent
session's tokens are dominated by input, at the article's own 25:1 ratio --
the output sliver should be visibly tiny. Right: Luna's fresh vs. cached
input price, ~10x apart (both figures already stated and cited in the
article body: $0.20/$1.20 fresh pricing at line 130, "roughly a tenth" cache
discount at line 276). Read together: the dominant column is the one with
the discount available on it.
"""

import matplotlib.pyplot as plt

FIG_W_IN = 1200 / 150
FIG_H_IN = 500 / 150
DPI = 150
OUT = "src/blog/images/cache-economics.png"

INPUT_COLOR = "#9B1B30"
OUTPUT_COLOR = "#C8C8C8"
CACHE_COLOR = "#1f77b4"

INPUT_UNITS = 25
OUTPUT_UNITS = 1

FRESH_INPUT = 0.20
CACHED_INPUT = 0.02
OUTPUT_PRICE = 1.20

fig, (ax_left, ax_right) = plt.subplots(1, 2, figsize=(FIG_W_IN, FIG_H_IN), dpi=DPI)
fig.patch.set_facecolor("white")

# LEFT — where the tokens actually are.
ax_left.set_facecolor("white")
ax_left.bar(0, INPUT_UNITS, width=0.5, color=INPUT_COLOR, label="Input", zorder=3)
ax_left.bar(0, OUTPUT_UNITS, width=0.5, bottom=INPUT_UNITS, color=OUTPUT_COLOR, label="Output", zorder=3)
ax_left.set_xlim(-0.6, 1.1)
ax_left.set_ylim(0, INPUT_UNITS + OUTPUT_UNITS + 3)
ax_left.set_xticks([0])
ax_left.set_xticklabels(["50-turn session"], fontsize=10)
ax_left.set_yticks([])
for side in ("top", "right", "left"):
    ax_left.spines[side].set_visible(False)

ax_left.annotate(
    "input: 25 units",
    xy=(0.25, INPUT_UNITS / 2),
    xytext=(0.35, INPUT_UNITS / 2),
    fontsize=11,
    color=INPUT_COLOR,
    fontweight="bold",
    va="center",
)
ax_left.annotate(
    "output: 1 unit",
    xy=(0.25, INPUT_UNITS + OUTPUT_UNITS / 2),
    xytext=(0.35, INPUT_UNITS + OUTPUT_UNITS + 1.6),
    fontsize=10,
    color="#666666",
    fontweight="bold",
    va="center",
    arrowprops=dict(arrowstyle="-", color="#999999", lw=0.8),
)
ax_left.set_title("Cost tracks the input column", fontsize=13, fontweight="bold", pad=12)

# RIGHT — what each token costs.
ax_right.set_facecolor("white")
labels = ["Fresh input", "Cached input", "Output"]
prices = [FRESH_INPUT, CACHED_INPUT, OUTPUT_PRICE]
colors = [INPUT_COLOR, CACHE_COLOR, OUTPUT_COLOR]
bars = ax_right.bar(labels, prices, color=colors, width=0.6, zorder=3)
ax_right.set_ylabel("USD per 1M tokens (Luna)", fontsize=10)
for side in ("top", "right"):
    ax_right.spines[side].set_visible(False)
ax_right.grid(axis="y", linestyle=":", alpha=0.3, zorder=0)

for bar, price in zip(bars, prices):
    ax_right.text(
        bar.get_x() + bar.get_width() / 2, price + 0.03, f"${price:.2f}",
        ha="center", va="bottom", fontsize=10, fontweight="bold", zorder=4,
    )

ax_right.annotate(
    "", xy=(1, CACHED_INPUT + 0.06), xytext=(0, FRESH_INPUT + 0.06),
    arrowprops=dict(arrowstyle="-", color=CACHE_COLOR, lw=1.4,
                     connectionstyle="arc3,rad=-0.35"),
    zorder=5,
)
ax_right.text(0.5, 0.95, "10× discount", ha="center", fontsize=11,
              color=CACHE_COLOR, fontweight="bold")
ax_right.set_title("The discount sits on the dominant column", fontsize=13, fontweight="bold", pad=12)

fig.text(
    0.5, 0.02,
    "The big column is the discounted one. That is the whole trick.",
    ha="center", fontsize=10.5, color="#555555", style="italic",
)

plt.subplots_adjust(bottom=0.16, top=0.85, left=0.06, right=0.98, wspace=0.28)
fig.savefig(OUT, facecolor="white", bbox_inches="tight", pad_inches=0.14)
print(f"Wrote {OUT}")
