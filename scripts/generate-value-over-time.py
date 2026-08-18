#!/usr/bin/env python3
"""Generate src/blog/images/value-over-time.png for maximize-value-not-intelligence.mdx."""

from datetime import datetime

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import numpy as np

# 1200x630 at DPI 150. The title is wrapped rather than set as one long line:
# with bbox_inches="tight", a single-line title wider than the axes drags the
# saved canvas out with it (that is how this chart previously ended up 2916px
# wide, a 4.3:1 letterbox that rendered as a sliver in the article column).
FIG_W_IN = 1200 / 150
FIG_H_IN = 630 / 150
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

# Labels sit horizontally in stacked rows in the open wedge under the band.
# Rotated labels were unreadable here: nine releases land inside six months and
# two of them (Kimi K2.5 / GPT-5.3 Codex) are four days apart, which is only a
# few pixels -- no vertical stagger separates marks that close, so they have to
# be packed into rows by their real rendered width.
LABEL_FONTSIZE = 7.5
# Rows are generated on demand rather than fixed: nine labels inside six months
# can need more rows than any hand-written list provides, and a fixed list forces
# the overflow to share one row (which is exactly how GPT-5.6 family and Luna
# price cut ended up printed on top of each other).
LABEL_ROW_BASE = 1.11
LABEL_ROW_RATIO = 1.30
LABEL_PAD_DAYS = 8
RIGHT_GUTTER_DAYS = 26

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

ax.set_yscale("log")
ax.set_ylim(1, 40)
ax.set_xlim(start_num, end_num + RIGHT_GUTTER_DAYS)

# Axis limits must be final before measuring: text extents are converted through
# transData, so any later limit change would invalidate every measured width.
fig.canvas.draw()
renderer = fig.canvas.get_renderer()
inv = ax.transData.inverted()


def label_width_in_days(text_value, weight):
    probe = ax.text(start_num, 2, text_value, fontsize=LABEL_FONTSIZE, fontweight=weight)
    extent = probe.get_window_extent(renderer=renderer)
    probe.remove()
    left = inv.transform((0, 0))[0]
    right = inv.transform((extent.width, 0))[0]
    return right - left


def row_y(row_index):
    return LABEL_ROW_BASE * (LABEL_ROW_RATIO**row_index)


def place_labels(events):
    """Assign each label a row and an anchor side so no two labels overlap."""
    occupied = []
    placements = []
    for when, text_value in events:
        x = mdates.date2num(when)
        weight = "bold" if text_value == "Luna price cut" else "normal"
        width = label_width_in_days(text_value, weight) + LABEL_PAD_DAYS
        # Flip to a left-extending label when a right-extending one would spill
        # past the plot edge, which is what clipped the July releases before.
        align_right = x + width > end_num + RIGHT_GUTTER_DAYS
        low, high = (x - width, x) if align_right else (x, x + width)
        for row_index, spans in enumerate(occupied):
            if all(high <= lo or low >= hi for lo, hi in spans):
                spans.append((low, high))
                placements.append((row_index, align_right))
                break
        else:
            occupied.append([(low, high)])
            placements.append((len(occupied) - 1, align_right))
    return placements


for (when, text_value), (row_index, align_right) in zip(
    RELEASE_EVENTS, place_labels(RELEASE_EVENTS)
):
    x = mdates.date2num(when)
    highlight = text_value == "Luna price cut"
    ax.axvline(
        x,
        color=HIGHLIGHT_COLOR if highlight else MARKER_COLOR,
        linestyle="--",
        linewidth=1.2 if highlight else 0.9,
        alpha=1.0 if highlight else 0.55,
        zorder=0,
    )
    ax.text(
        x,
        row_y(row_index),
        f"{text_value} " if align_right else f" {text_value}",
        va="center",
        ha="right" if align_right else "left",
        fontsize=LABEL_FONTSIZE,
        color=HIGHLIGHT_COLOR if highlight else "#666666",
        fontweight="bold" if highlight else "normal",
        zorder=4,
    )

end_years = (end_num - start_num) / 365.25
end_conservative = CONSERVATIVE_RATE**end_years
end_band_high = BAND_HIGH_RATE**end_years

# Sits below its line, in white space -- offset upward it landed inside the band.
ax.annotate(
    f"~{end_conservative:.1f}× conservative",
    xy=(end_num, end_conservative),
    xytext=(-6, -30),
    textcoords="offset points",
    fontsize=10,
    color=LINE_COLOR,
    fontweight="bold",
    ha="right",
    va="top",
)
# Computed, not hard-coded: this previously read "up to ~32x" while the title
# claimed 35x, because the annotation string was left stale when the window moved.
ax.annotate(
    f"up to ~{end_band_high:.0f}×",
    xy=(end_num, end_band_high),
    xytext=(-6, 7),
    textcoords="offset points",
    fontsize=9,
    color=LINE_COLOR,
    ha="right",
)

ax.set_title(
    "Fixed coding benchmark capability per dollar has climbed\n"
    'roughly 10×—and possibly 35×—since "vibe coding" was coined',
    fontsize=13,
    fontweight="bold",
    pad=12,
)
ax.set_ylabel(
    "Price-performance index\n(fixed benchmark score per dollar, Feb 2025 = 1×)",
    fontsize=9,
    linespacing=1.35,
)
ax.set_yticks([1, 2, 5, 10, 20, 35])
ax.set_yticklabels(["1×", "2×", "5×", "10×", "20×", "35×"])
ax.tick_params(labelsize=9)
ax.xaxis.set_major_locator(mdates.MonthLocator(interval=3))
ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="y", linestyle=":", alpha=0.35, which="both")
ax.legend(loc="upper left", frameon=False, fontsize=8.5)

fig.savefig(OUT, facecolor="white", bbox_inches="tight", pad_inches=0.12)
print(f"Wrote {OUT}")
