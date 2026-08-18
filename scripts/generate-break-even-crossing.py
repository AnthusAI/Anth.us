#!/usr/bin/env python3
"""Generate src/blog/images/break-even-crossing.png for maximize-value-not-intelligence.mdx.

Conceptual chart: falling all-in cost-per-task curve crossing a value band,
with chores annotated at their individual break-even points.
"""

from datetime import datetime, timedelta

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Patch

FIG_W_IN = 1200 / 150
FIG_H_IN = 630 / 150
DPI = 150
OUT = "src/blog/images/break-even-crossing.png"

START = datetime(2023, 1, 1)
END = datetime(2026, 8, 17)

# Exponential decay: ~$400/task in early 2023 → ~$12/task by Aug 2026 (~4.5×/yr).
COST_START = 400.0
COST_END = 12.0
ANNUAL_DECAY = (COST_START / COST_END) ** (1.0 / ((END - START).days / 365.25))

# Chores ordered earliest → latest crossing (lowest threshold first).
# Thresholds are illustrative "worth having done" dollars per completed chore.
CHORES = [
    ("Changelog generation", 95.0),
    ("Docs drift", 72.0),
    ("Dependency upgrades", 55.0),
    ("Test backfill", 40.0),
    ("First-pass code review", 28.0),
]

BAND_LOW = 22.0
BAND_HIGH = 110.0

CURVE_COLOR = "#9B1B30"
BAND_COLOR = "#D03382"
ZONE_LEFT = "#E8E8E8"
ZONE_RIGHT = "#F8E8F0"
MARKER_COLOR = "#9B1B30"
ECHO_COLOR = "#AAAAAA"


def years_since_start(when):
    return (when - START).total_seconds() / (365.25 * 24 * 3600)


def cost_at(when):
    return COST_START / (ANNUAL_DECAY ** years_since_start(when))


def crossing_date(threshold):
    """Solve COST_START / ANNUAL_DECAY^t = threshold for calendar date."""
    if threshold <= 0 or threshold >= COST_START:
        return START
    t_years = np.log(COST_START / threshold) / np.log(ANNUAL_DECAY)
    return START + timedelta(days=float(t_years * 365.25))


start_num = mdates.date2num(START)
end_num = mdates.date2num(END)

crossings = [(label, threshold, crossing_date(threshold)) for label, threshold in CHORES]
first_cross = crossings[0][2]
last_cross = crossings[-1][2]

dates = np.linspace(start_num, end_num, 300)
costs = np.array([cost_at(mdates.num2date(d).replace(tzinfo=None)) for d in dates])

fig, ax = plt.subplots(figsize=(FIG_W_IN, FIG_H_IN), dpi=DPI)
fig.patch.set_facecolor("white")
ax.set_facecolor("white")

# Zone shading: left of first crossing / right of last crossing
ax.axvspan(
    start_num,
    mdates.date2num(first_cross),
    facecolor=ZONE_LEFT,
    alpha=0.55,
    zorder=0,
    label="Not worth automating",
)
ax.axvspan(
    mdates.date2num(last_cross),
    end_num,
    facecolor=ZONE_RIGHT,
    alpha=0.55,
    zorder=0,
    label="Obviously worth automating",
)

# Value band (not a single line — value differs per chore)
ax.fill_between(
    dates,
    BAND_LOW,
    BAND_HIGH,
    color=BAND_COLOR,
    alpha=0.18,
    zorder=1,
    label="Worth having done at all (varies by chore)",
)
ax.axhline(BAND_LOW, color=BAND_COLOR, linestyle=":", linewidth=0.8, alpha=0.45, zorder=1)
ax.axhline(BAND_HIGH, color=BAND_COLOR, linestyle=":", linewidth=0.8, alpha=0.45, zorder=1)

# Falling all-in cost curve
ax.plot(
    dates,
    costs,
    color=CURVE_COLOR,
    linewidth=2.6,
    zorder=3,
    label="All-in cost per completed chore",
)

# 2023 classifier break-even echo (conceptual parallel, not a second curve)
echo_y = 200.0
ax.axhline(echo_y, color=ECHO_COLOR, linestyle="--", linewidth=1.0, alpha=0.7, zorder=2)
ax.text(
    mdates.date2num(datetime(2023, 3, 1)),
    echo_y * 1.12,
    "2023 classifier break-even\n($200 / million)",
    fontsize=7.5,
    color="#777777",
    va="bottom",
    ha="left",
    linespacing=1.2,
    zorder=5,
)

# Chore crossing markers + staggered labels
label_offsets = [
    (10, 14),
    (-8, -22),
    (10, 12),
    (-10, -24),
    (8, 16),
]
for (label, threshold, when), (dx, dy) in zip(crossings, label_offsets):
    x = mdates.date2num(when)
    y = threshold
    ax.plot(x, y, "o", color=MARKER_COLOR, markersize=7, zorder=6)
    ax.annotate(
        label,
        xy=(x, y),
        xytext=(dx, dy),
        textcoords="offset points",
        fontsize=8,
        color="#444444",
        ha="left" if dx >= 0 else "right",
        va="bottom" if dy >= 0 else "top",
        arrowprops=dict(
            arrowstyle="-",
            color="#BBBBBB",
            lw=0.8,
            shrinkA=0,
            shrinkB=2,
        ),
        zorder=6,
    )

# Zone labels in open space
ax.text(
    mdates.date2num(datetime(2023, 6, 15)),
    18,
    "Not worth\nautomating",
    fontsize=9,
    color="#666666",
    ha="center",
    va="center",
    linespacing=1.25,
    zorder=5,
)
ax.text(
    mdates.date2num(datetime(2026, 4, 1)),
    18,
    "Obviously worth\nautomating",
    fontsize=9,
    color=CURVE_COLOR,
    ha="center",
    va="center",
    fontweight="bold",
    linespacing=1.25,
    zorder=5,
)

ax.set_title(
    "Chores cross the line when all-in cost falls below what they are worth",
    fontsize=13,
    fontweight="bold",
    pad=12,
)
ax.set_ylabel("All-in cost per completed chore\n(model + tools + retries)", fontsize=10, linespacing=1.3)
ax.set_yscale("log")
ax.set_ylim(8, 550)
ax.set_yticks([10, 20, 50, 100, 200, 400])
ax.set_yticklabels(["$10", "$20", "$50", "$100", "$200", "$400"])
ax.xaxis.set_major_locator(mdates.YearLocator())
ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))
ax.xaxis.set_minor_locator(mdates.MonthLocator((1, 7)))
ax.set_xlim(start_num, end_num)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="y", linestyle=":", alpha=0.35, which="both", zorder=0)

legend_handles = [
    plt.Line2D([0], [0], color=CURVE_COLOR, linewidth=2.4),
    Patch(facecolor=BAND_COLOR, alpha=0.25, edgecolor=BAND_COLOR),
    Patch(facecolor=ZONE_LEFT, alpha=0.7, edgecolor="#CCCCCC"),
    Patch(facecolor=ZONE_RIGHT, alpha=0.7, edgecolor=BAND_COLOR),
]
legend_labels = [
    "All-in cost per completed chore",
    "Worth having done (band by chore)",
    "Not worth automating",
    "Obviously worth automating",
]
ax.legend(
    legend_handles,
    legend_labels,
    loc="upper right",
    frameon=False,
    fontsize=8,
)

fig.text(
    0.5,
    0.01,
    "Nobody announces the crossing. You just notice the backlog stopped growing.",
    ha="center",
    fontsize=9,
    color="#555555",
    style="italic",
)

plt.subplots_adjust(bottom=0.16, top=0.88, left=0.12, right=0.97)
fig.savefig(OUT, facecolor="white", bbox_inches="tight", pad_inches=0.12)
print(f"Wrote {OUT}")
for label, threshold, when in crossings:
    print(f"  {label}: ${threshold:.0f} → {when.date()} (cost ${cost_at(when):.1f})")
