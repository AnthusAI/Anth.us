#!/usr/bin/env python3
"""Generate src/blog/images/same-curve-both-directions.png for
bugonomics-cheap-exploits-2026.mdx.

Draws the article's core claim literally: one curve, pointed at two
activities. Same axes and styling as the companion article's
price-of-fixed-capability.png so the two charts read as siblings. Both
series share the same decay rate (parallel on the log scale) -- the point is
that the gap between them is NOT widening, even as both costs collapse.

The offense series is directional, not a published benchmark series --
consistent with the article's own frontier-caveat section, and marked as
such on the figure.
"""

from datetime import datetime

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import numpy as np

FIG_W_IN = 1200 / 150
FIG_H_IN = 630 / 150
DPI = 150
OUT = "src/blog/images/same-curve-both-directions.png"

START = datetime(2023, 1, 1)
END = datetime(2026, 8, 17)

WRITE_START, WRITE_DECAY, WRITE_COLOR = 200.0, 5.0, "#1f77b4"
BREAK_START, BREAK_DECAY, BREAK_COLOR = 2000.0, 5.0, "#9B1B30"


def years_since_start(when):
    return (when - START).total_seconds() / (365.25 * 24 * 3600)


def series_at(when, start_cost, annual_decay):
    return start_cost / (annual_decay ** years_since_start(when))


start_num = mdates.date2num(START)
end_num = mdates.date2num(END)
dates = np.linspace(start_num, end_num, 300)

write_costs = np.array(
    [series_at(mdates.num2date(d).replace(tzinfo=None), WRITE_START, WRITE_DECAY) for d in dates]
)
break_costs = np.array(
    [series_at(mdates.num2date(d).replace(tzinfo=None), BREAK_START, BREAK_DECAY) for d in dates]
)

fig, ax = plt.subplots(figsize=(FIG_W_IN, FIG_H_IN), dpi=DPI)
fig.patch.set_facecolor("white")
ax.set_facecolor("white")

ax.fill_between(dates, write_costs, break_costs, color="#9B1B30", alpha=0.08, zorder=1)

ax.plot(dates, write_costs, color=WRITE_COLOR, linewidth=2.4,
        label="Cost to WRITE a unit of software", zorder=3)
ax.plot(dates, break_costs, color=BREAK_COLOR, linewidth=2.4, linestyle="--",
        label="Cost to BREAK a comparable target (illustrative)", zorder=3)

# Both lines are only one decade apart everywhere (constant log-gap, same
# decay rate), and that decade keeps shrinking in screen pixels toward the
# right -- there is no data-coordinate spot that fits a text label between
# them without touching one line or the other; tried three positions before
# concluding this is a real geometry constraint, not a placement mistake.
# Point into the gap from open space below both lines instead.
target_date = datetime(2024, 9, 1)
target_num = mdates.date2num(target_date)
target_y = (series_at(target_date, WRITE_START, WRITE_DECAY)
            * series_at(target_date, BREAK_START, BREAK_DECAY)) ** 0.5
ax.annotate(
    "the gap defenders\nused to rely on",
    xy=(target_num, target_y),
    xytext=(0.28, 0.08),
    textcoords="axes fraction",
    fontsize=10,
    color="#9B1B30",
    fontweight="bold",
    ha="center",
    va="center",
    arrowprops=dict(arrowstyle="-", color="#9B1B30", lw=1.1, alpha=0.7),
)

ax.set_title(
    "Not two trends. One curve, pointed at two activities.",
    fontsize=15,
    fontweight="bold",
    pad=12,
)
ax.set_ylabel("USD to achieve a fixed capability\n(illustrative)", fontsize=10, linespacing=1.3)
ax.set_yscale("log")
ax.set_yticks([1, 10, 100, 1000, 10000])
ax.set_yticklabels(["$1", "$10", "$100", "$1K", "$10K"])
ax.xaxis.set_major_locator(mdates.YearLocator())
ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))
ax.set_xlim(start_num, end_num)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="y", linestyle=":", alpha=0.35, which="both", zorder=0)
ax.legend(loc="upper right", frameon=False, fontsize=9)

ax.text(0.995, 0.03, "Offense series is directional, not a published benchmark.",
        transform=ax.transAxes, fontsize=7.5, color="#A0A0A0", ha="right", va="bottom")

fig.text(0.5, 0.01, "Same slope, falling together. The gap is not widening.",
          ha="center", fontsize=9.5, style="italic", color="#555555")

plt.subplots_adjust(bottom=0.16, top=0.88, left=0.1, right=0.97)
fig.savefig(OUT, facecolor="white", bbox_inches="tight", pad_inches=0.14)
print(f"Wrote {OUT}")
