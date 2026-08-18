#!/usr/bin/env python3
"""Generate src/blog/images/value-over-time.png for maximize-value-not-intelligence.mdx."""

from datetime import datetime

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import numpy as np

FIG_W_IN = 1880 / 150
FIG_H_IN = 720 / 150
DPI = 150
OUT = "src/blog/images/value-over-time.png"

START = datetime(2025, 2, 1)
END = datetime(2026, 8, 17)

CONSERVATIVE_RATE = 4.7
BAND_LOW_RATE = 5.0
BAND_HIGH_RATE = 10.0

LINE_COLOR = "#9B1B30"
BAND_COLOR = "#D03382"
MARKER_COLOR = "#888888"
HIGHLIGHT_COLOR = "#9B1B30"

# Scoreboard models in the value-frontier chart (BenchLM release dates, Aug 2026).
RELEASE_EVENTS = [
    (datetime(2026, 2, 1), "Kimi K2.5"),
    (datetime(2026, 2, 5), "GPT-5.3 Codex"),
    (datetime(2026, 3, 3), "Gemini 3.1 Flash-Lite"),
    (datetime(2026, 4, 20), "Kimi K2.6"),
    (datetime(2026, 5, 18), "Composer 2.5"),
    (datetime(2026, 6, 16), "GLM 5.2"),
    (datetime(2026, 7, 9), "GPT-5.6 family"),
    (datetime(2026, 7, 16), "Kimi K3"),
    (datetime(2026, 7, 30), "Luna price cut"),
]

CLUSTER_GAP_DAYS = 12
MIN_LABEL_Y = 1.06
BAND_CLEARANCE_DIVISORS = {
    1: (1.18,),
    2: (1.12, 1.95),
    3: (1.12, 1.48, 2.05),
}


def assign_cluster_slots(events):
    """Return (rank, cluster_size) for staggered labels below the band at each date."""
    slots = []
    index = 0
    while index < len(events):
        cluster_end = index + 1
        while cluster_end < len(events):
            gap_days = (events[cluster_end][0] - events[cluster_end - 1][0]).days
            if gap_days < CLUSTER_GAP_DAYS:
                cluster_end += 1
            else:
                break
        count = cluster_end - index
        for offset in range(count):
            slots.append((offset, count))
        index = cluster_end
    return slots


def divisors_for_cluster_size(cluster_size):
    if cluster_size in BAND_CLEARANCE_DIVISORS:
        return BAND_CLEARANCE_DIVISORS[cluster_size]
    return tuple(1.12 + index * 0.35 for index in range(cluster_size))


def label_y_below_band(x_num, cluster_rank, cluster_size, chart_start_num):
    years_at_x = (x_num - chart_start_num) / 365.25
    band_floor = BAND_LOW_RATE**years_at_x
    divisors = divisors_for_cluster_size(cluster_size)
    divisor = divisors[min(cluster_rank, len(divisors) - 1)]
    return max(MIN_LABEL_Y, band_floor / divisor)


start_num = mdates.date2num(START)
end_num = mdates.date2num(END)
dates = np.linspace(start_num, end_num, 200)
years = (dates - start_num) / 365.25

conservative = CONSERVATIVE_RATE**years
band_low = BAND_LOW_RATE**years
band_high = BAND_HIGH_RATE**years

fig, ax = plt.subplots(figsize=(FIG_W_IN, FIG_H_IN), dpi=DPI)
fig.patch.set_facecolor("white")
ax.set_facecolor("white")

ax.fill_between(
    dates,
    band_low,
    band_high,
    color=BAND_COLOR,
    alpha=0.18,
    label="MIT Price-of-Progress band (5×–10×/yr)",
    zorder=1,
)
ax.plot(
    dates,
    conservative,
    color=LINE_COLOR,
    linewidth=2.6,
    label="Conservative rate (SWE-bench price reduction, ~4.7×/yr)",
    zorder=3,
)

cluster_slots = assign_cluster_slots(RELEASE_EVENTS)
for (when, label), (cluster_rank, cluster_size) in zip(RELEASE_EVENTS, cluster_slots):
    x = mdates.date2num(when)
    label_y = label_y_below_band(x, cluster_rank, cluster_size, start_num)
    highlight = label == "Luna price cut"
    ax.axvline(
        x,
        color=HIGHLIGHT_COLOR if highlight else MARKER_COLOR,
        linestyle="--",
        linewidth=1.2 if highlight else 1,
        zorder=0,
    )
    ax.text(
        x,
        label_y,
        label,
        rotation=90,
        va="top",
        ha="right",
        fontsize=8 if len(label) > 14 else 8.5,
        color=HIGHLIGHT_COLOR if highlight else "#666666",
        fontweight="bold" if highlight else "normal",
        zorder=4,
        clip_on=True,
    )

end_years = (end_num - start_num) / 365.25
end_conservative = CONSERVATIVE_RATE**end_years
end_band_high = BAND_HIGH_RATE**end_years

ax.annotate(
    "~10× conservative",
    xy=(end_num, end_conservative),
    xytext=(-12, 8),
    textcoords="offset points",
    fontsize=11,
    color=LINE_COLOR,
    fontweight="bold",
)
ax.annotate(
    "up to ~32×",
    xy=(end_num, end_band_high),
    xytext=(-8, 6),
    textcoords="offset points",
    fontsize=10,
    color=LINE_COLOR,
)

ax.set_title(
    'Fixed coding benchmark capability per dollar has climbed roughly 10×—and possibly 35×—since "vibe coding" was coined',
    fontsize=20,
    fontweight="bold",
    pad=16,
)
ax.set_ylabel(
    "Price-performance index\n(fixed benchmark score per dollar,\nFeb 2025 = 1×)",
    fontsize=11,
    linespacing=1.35,
)
ax.set_yscale("log")
ax.set_ylim(1, 40)
ax.set_yticks([1, 2, 5, 10, 20, 35])
ax.set_yticklabels(["1×", "2×", "5×", "10×", "20×", "35×"])
ax.xaxis.set_major_locator(mdates.MonthLocator(interval=3))
ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
ax.set_xlim(start_num, end_num)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="y", linestyle=":", alpha=0.35, which="both")
ax.legend(loc="upper left", frameon=False, fontsize=10)

plt.subplots_adjust(bottom=0.14, top=0.88, left=0.08, right=0.97)
fig.savefig(OUT, facecolor="white", bbox_inches="tight", pad_inches=0.15)
print(f"Wrote {OUT}")
