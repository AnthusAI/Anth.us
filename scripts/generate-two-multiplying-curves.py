#!/usr/bin/env python3
"""Generate src/blog/images/two-multiplying-curves.png for ai-coding-cost-collapse-2026.mdx.

Twin-panel chart: falling price of fixed coding capability above, rising METR
task horizon below, with a small inset showing the product curve.
"""

from datetime import datetime

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import numpy as np
from mpl_toolkits.axes_grid1.inset_locator import inset_axes

FIG_W_IN = 1200 / 150
FIG_H_IN = 900 / 150
DPI = 150
OUT = "src/blog/images/two-multiplying-curves.png"

START = datetime(2023, 1, 1)
END = datetime(2026, 8, 17)
CODEX_RUN = datetime(2025, 12, 1)

PRICE_START = 200.0
PRICE_DECAY = 6.5  # mid-band ~5×–10×/yr illustrative
HORIZON_START_MIN = 18.0  # illustrative task length at 50% reliability
HORIZON_DOUBLING_MONTHS = 7.0

LINE_COLOR = "#9B1B30"
SECOND_COLOR = "#1f77b4"
MARKER_COLOR = "#9B1B30"


def years_since_start(when):
    return (when - START).total_seconds() / (365.25 * 24 * 3600)


def months_since_start(when):
    return (when - START).days / (365.25 / 12)


def price_at(when):
    return PRICE_START / (PRICE_DECAY ** years_since_start(when))


def horizon_at(when):
    return HORIZON_START_MIN * (2 ** (months_since_start(when) / HORIZON_DOUBLING_MONTHS))


start_num = mdates.date2num(START)
end_num = mdates.date2num(END)
dates = np.linspace(start_num, end_num, 300)

prices = np.array([price_at(mdates.num2date(d).replace(tzinfo=None)) for d in dates])
horizons = np.array([horizon_at(mdates.num2date(d).replace(tzinfo=None)) for d in dates])
# Normalize product to index at start for inset readability
product = (1.0 / prices) * horizons
product_index = product / product[0]

fig, (ax_top, ax_bottom) = plt.subplots(
    2,
    1,
    figsize=(FIG_W_IN, FIG_H_IN),
    dpi=DPI,
    sharex=True,
    gridspec_kw={"height_ratios": [1, 1], "hspace": 0.08},
)
fig.patch.set_facecolor("white")

for ax in (ax_top, ax_bottom):
    ax.set_facecolor("white")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.grid(axis="y", linestyle=":", alpha=0.35, which="both", zorder=0)

ax_top.plot(dates, prices, color=LINE_COLOR, linewidth=2.4, zorder=3)
ax_top.set_yscale("log")
ax_top.set_ylim(0.6, 350)
ax_top.set_yticks([1, 2, 5, 10, 20, 50, 100, 200])
ax_top.set_yticklabels(["$1", "$2", "$5", "$10", "$20", "$50", "$100", "$200"])
ax_top.set_ylabel("USD per fixed-capability task", fontsize=9)
ax_top.set_title(
    "Price of fixed coding capability (falling) vs. agent task horizon (rising)",
    fontsize=12,
    fontweight="bold",
    pad=10,
)
ax_top.annotate(
    "5×–10× cheaper per year",
    xy=(mdates.date2num(datetime(2025, 10, 1)), price_at(datetime(2025, 10, 1))),
    xytext=(12, 14),
    textcoords="offset points",
    fontsize=8,
    color=LINE_COLOR,
    fontweight="bold",
)

ax_bottom.plot(dates, horizons, color=SECOND_COLOR, linewidth=2.4, zorder=3)
ax_bottom.set_yscale("log")
ax_bottom.set_ylim(12, 2500)
ax_bottom.set_ylabel("Task length at 50% reliability (min)", fontsize=9)
ax_bottom.annotate(
    "doubling every ~7 months",
    xy=(mdates.date2num(datetime(2025, 6, 1)), horizon_at(datetime(2025, 6, 1))),
    xytext=(12, 12),
    textcoords="offset points",
    fontsize=8,
    color=SECOND_COLOR,
    fontweight="bold",
)

codex_num = mdates.date2num(CODEX_RUN)
codex_horizon = horizon_at(CODEX_RUN)
ax_bottom.axvline(codex_num, color=MARKER_COLOR, linestyle="--", linewidth=1.2, zorder=2)
ax_bottom.plot(codex_num, codex_horizon, "o", color=MARKER_COLOR, markersize=6, zorder=4)
ax_bottom.annotate(
    "Codex 25-hour run",
    xy=(codex_num, codex_horizon),
    xytext=(8, -22),
    textcoords="offset points",
    fontsize=7.5,
    color=MARKER_COLOR,
    ha="left",
)

ax_bottom.xaxis.set_major_locator(mdates.YearLocator())
ax_bottom.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))
ax_bottom.set_xlim(start_num, end_num)

# Inset: capability-hours per dollar index (product of the two curves)
inset = inset_axes(ax_top, width="38%", height="42%", loc="center left", borderpad=1.2)
inset.set_facecolor("white")
inset.plot(dates, product_index, color="#444444", linewidth=1.8)
inset.set_yscale("log")
inset.set_title("Capability × horizon per dollar", fontsize=7, pad=3)
inset.tick_params(labelsize=6)
inset.spines["top"].set_visible(False)
inset.spines["right"].set_visible(False)
inset.grid(axis="y", linestyle=":", alpha=0.35, which="both")
inset.set_xticks([])
inset.annotate(
    "product rises faster\nthan either alone",
    xy=(dates[-1], product_index[-1]),
    xytext=(-4, -18),
    textcoords="offset points",
    fontsize=6,
    color="#555555",
    ha="right",
)

fig.text(
    0.5,
    0.01,
    "Two exponentials, same product cycle. They multiply.",
    ha="center",
    fontsize=9,
    color="#555555",
    style="italic",
)

plt.subplots_adjust(bottom=0.12, top=0.92, left=0.11, right=0.97)
fig.savefig(OUT, facecolor="white", bbox_inches="tight", pad_inches=0.12)
print(f"Wrote {OUT}")
