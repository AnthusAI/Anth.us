#!/usr/bin/env python3
"""Generate src/blog/images/price-of-fixed-capability.png for ai-coding-cost-collapse-2026.mdx.

Conceptual chart: cost to reach a fixed benchmark-performance level over time,
with three MIT Price-of-Progress benchmark series on a log scale.
"""

from datetime import datetime

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import numpy as np

FIG_W_IN = 1200 / 150
FIG_H_IN = 630 / 150
DPI = 150
OUT = "src/blog/images/price-of-fixed-capability.png"

START = datetime(2023, 1, 1)
END = datetime(2026, 8, 17)
VIBE_CODING = datetime(2025, 2, 2)

# Illustrative USD per benchmark task at START, annual decay rates from MIT band.
SERIES = [
    ("GPQA-Diamond", 180.0, 8.0, "#1f77b4"),
    ("AIME", 220.0, 7.0, "#2ca02c"),
    ("SWE-bench Verified", 260.0, 4.7, "#9B1B30"),
]

MARKER_COLOR = "#9B1B30"


def years_since_start(when):
    return (when - START).total_seconds() / (365.25 * 24 * 3600)


def series_at(when, start_cost, annual_decay):
    return start_cost / (annual_decay ** years_since_start(when))


start_num = mdates.date2num(START)
end_num = mdates.date2num(END)
dates = np.linspace(start_num, end_num, 300)

fig, ax = plt.subplots(figsize=(FIG_W_IN, FIG_H_IN), dpi=DPI)
fig.patch.set_facecolor("white")
ax.set_facecolor("white")

for label, start_cost, annual_decay, color in SERIES:
    costs = np.array(
        [series_at(mdates.num2date(d).replace(tzinfo=None), start_cost, annual_decay) for d in dates]
    )
    ax.plot(dates, costs, color=color, linewidth=2.2, label=label, zorder=3)

# SWE-bench slope annotation
swe_end = series_at(END, SERIES[2][1], SERIES[2][2])
ax.annotate(
    "SWE-bench ~4.7×/yr\n(wide CI)",
    xy=(end_num, swe_end),
    xytext=(-72, 18),
    textcoords="offset points",
    fontsize=8,
    color=SERIES[2][3],
    fontweight="bold",
    arrowprops=dict(arrowstyle="-", color="#BBBBBB", lw=0.8),
    zorder=5,
)

vibe_num = mdates.date2num(VIBE_CODING)
ax.axvline(vibe_num, color=MARKER_COLOR, linestyle="--", linewidth=1.4, zorder=2)
ax.text(
    vibe_num,
    420,
    "“vibe coding” coined",
    rotation=90,
    va="bottom",
    ha="right",
    fontsize=8,
    color=MARKER_COLOR,
    fontweight="bold",
    zorder=5,
)

ax.set_title(
    "Cost to reach a fixed benchmark score is falling roughly 5×–10× per year",
    fontsize=13,
    fontweight="bold",
    pad=12,
)
ax.set_ylabel("USD per benchmark task\n(holding capability constant)", fontsize=10, linespacing=1.3)
ax.set_yscale("log")
ax.set_ylim(0.8, 600)
ax.set_yticks([1, 2, 5, 10, 20, 50, 100, 200, 400])
ax.set_yticklabels(["$1", "$2", "$5", "$10", "$20", "$50", "$100", "$200", "$400"])
ax.xaxis.set_major_locator(mdates.YearLocator())
ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))
ax.xaxis.set_minor_locator(mdates.MonthLocator((1, 7)))
ax.set_xlim(start_num, end_num)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="y", linestyle=":", alpha=0.35, which="both", zorder=0)
ax.legend(loc="upper right", frameon=False, fontsize=8)

fig.text(
    0.5,
    0.01,
    "Same capability, falling price. The y-axis is logarithmic.",
    ha="center",
    fontsize=9,
    color="#555555",
    style="italic",
)

plt.subplots_adjust(bottom=0.16, top=0.88, left=0.12, right=0.97)
fig.savefig(OUT, facecolor="white", bbox_inches="tight", pad_inches=0.12)
print(f"Wrote {OUT}")
