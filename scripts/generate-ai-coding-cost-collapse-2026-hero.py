#!/usr/bin/env python3
"""Generate src/blog/images/ai-coding-cost-collapse-2026.png -- the HERO
treatment of generate-price-of-fixed-capability.py's data, for the social
card. Same source data, not re-derived, but simplified for thumbnail scale:
no legend, no vibe-coding marker, one annotated headline number, a much
larger baked-in title. The full annotated version stays in the article body.
"""

from datetime import datetime

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import numpy as np

FIG_W_IN = 1200 / 150
FIG_H_IN = 630 / 150
DPI = 150
OUT = "src/blog/images/ai-coding-cost-collapse-2026.png"

START = datetime(2023, 1, 1)
END = datetime(2026, 8, 17)

# Same illustrative series as the in-article chart.
SERIES = [
    ("GPQA-Diamond", 180.0, 8.0, "#1f77b4"),
    ("AIME", 220.0, 7.0, "#2ca02c"),
    ("SWE-bench Verified", 260.0, 4.7, "#9B1B30"),
]


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
    ax.plot(dates, costs, color=color, linewidth=(2.8 if label == "SWE-bench Verified" else 2.0),
            zorder=3, alpha=(1.0 if label == "SWE-bench Verified" else 0.55))

swe_start = series_at(START, SERIES[2][1], SERIES[2][2])
swe_end = series_at(END, SERIES[2][1], SERIES[2][2])

ax.annotate(
    "5×-10× cheaper\nper year",
    xy=(end_num, swe_end),
    xytext=(-100, 30),
    textcoords="offset points",
    fontsize=15,
    color=SERIES[2][3],
    fontweight="bold",
    arrowprops=dict(arrowstyle="-", color="#9B1B30", lw=1.2),
    zorder=5,
)

ax.set_yscale("log")
ax.set_ylim(0.8, 600)
ax.set_yticks([1, 10, 100])
ax.set_yticklabels(["$1", "$10", "$100"])
ax.tick_params(labelsize=11)
ax.xaxis.set_major_locator(mdates.YearLocator())
ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))
ax.tick_params(axis="x", labelsize=11)
ax.set_xlim(start_num, end_num)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="y", linestyle=":", alpha=0.3, which="major", zorder=0)

ax.set_title(
    "Same coding capability. Falling price.",
    fontsize=23,
    fontweight="bold",
    pad=14,
)

fig.text(
    0.5,
    0.015,
    "Cost to reach a fixed benchmark score, 2023-2026. Log scale.",
    ha="center",
    fontsize=10.5,
    color="#555555",
    style="italic",
)

plt.subplots_adjust(bottom=0.14, top=0.86, left=0.09, right=0.97)
fig.savefig(OUT, facecolor="white", bbox_inches="tight", pad_inches=0.14)
print(f"Wrote {OUT}")
