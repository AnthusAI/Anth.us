#!/usr/bin/env python3
"""Generate src/blog/images/break-even-crossing.png.

One simple idea: the set of jobs worth handing to an agent keeps growing, and
the jobs joining it keep getting more sophisticated. Time runs left to right,
sophistication bottom to top, one dot per job. Read a vertical slice and the
dots to its left are what was practical at that moment; the set is small and
mechanical in 2023 and large and autonomous by 2026.

Deliberately no arrows or dependency edges between jobs. An earlier version drew
those and the interrelationships buried the trend, which is the actual claim.

Timing is illustrative -- these are ordering, not measured adoption dates.
"""

from datetime import datetime

import matplotlib.dates as mdates
import matplotlib.pyplot as plt

FIG_W_IN = 1200 / 150
FIG_H_IN = 830 / 150
DPI = 150
OUT = "src/blog/images/break-even-crossing.png"

START = datetime(2023, 1, 1)
END = datetime(2026, 11, 1)

BANDS = [
    ("Mechanical\nwork", "#F5E7ED", "#9B1B30"),
    ("Judgment\ncalls", "#EEDAE6", "#C2255C"),
    ("Acting on\nits own", "#E4CCDF", "#7A1F6B"),
    ("Deciding what\nto build", "#D5BAD3", "#3D1550"),
]

# (label, date it became practical, band index)
# Plain language on purpose. Trade names for what the job actually is: nobody
# outside the discipline parses "L0 ITSM", "test backfill" or "zero-day triage",
# and the band already supplies the qualifier the jargon was carrying.
JOBS = [
    ("Keeping docs current", datetime(2023, 9, 1), 0),
    ("Dependency upgrades", datetime(2023, 12, 1), 0),
    ("Writing missing tests", datetime(2024, 2, 1), 0),
    ("Code review", datetime(2024, 7, 1), 1),
    ("Sorting security alerts", datetime(2024, 10, 1), 1),
    ("Answering support tickets", datetime(2024, 12, 1), 1),
    ("Mapping where data flows", datetime(2025, 2, 1), 1),
    ("Resolving IT requests", datetime(2025, 4, 1), 2),
    ("Penetration testing", datetime(2025, 7, 1), 2),
    ("Watching for new threats", datetime(2025, 9, 1), 2),
    ("Emergency security patching", datetime(2025, 12, 1), 2),
    ("Proposing what to build", datetime(2026, 2, 1), 3),
    ("Running experiments", datetime(2026, 4, 1), 3),
    ("Building features before you ask", datetime(2026, 7, 1), 3),
]

TEXT_MUTED = "#6B6B6B"

start_num = mdates.date2num(START)
end_num = mdates.date2num(END)

fig, ax = plt.subplots(figsize=(FIG_W_IN, FIG_H_IN), dpi=DPI)
fig.patch.set_facecolor("white")
ax.set_facecolor("white")

ax.set_xlim(start_num, end_num)
ax.set_ylim(-0.9, len(JOBS) - 0.1)

# Shade each sophistication band across the rows that belong to it.
for band_index, (name, fill, _) in enumerate(BANDS):
    rows = [i for i, job in enumerate(JOBS) if job[2] == band_index]
    lo, hi = min(rows) - 0.5, max(rows) + 0.5
    ax.axhspan(lo, hi, color=fill, alpha=0.55, zorder=0)
    ax.text(start_num + 12, (lo + hi) / 2, name, fontsize=9, fontweight="bold",
            color=TEXT_MUTED, va="center", ha="left", linespacing=1.3, zorder=2)

fig.canvas.draw()
renderer = fig.canvas.get_renderer()
inv = ax.transData.inverted()


def width_in_days(value):
    probe = ax.text(start_num, 0, value, fontsize=9)
    extent = probe.get_window_extent(renderer=renderer)
    probe.remove()
    return inv.transform((extent.width, 0))[0] - inv.transform((0, 0))[0]


# Labels sit to the right of their dot, flipping left when one would run past
# the plot edge. Decide per band rather than per row: mixing sides inside a band
# reads as a mistake, while a whole band flipping reads as deliberate.
flip_band = {}
for label, when, band_index in JOBS:
    overflows = mdates.date2num(when) + 14 + width_in_days(label) > end_num
    flip_band[band_index] = flip_band.get(band_index, False) or overflows

for row, (label, when, band_index) in enumerate(JOBS):
    x = mdates.date2num(when)
    color = BANDS[band_index][2]
    ax.plot(x, row, "o", color=color, markersize=9,
            markeredgecolor="white", markeredgewidth=1.5, zorder=4)
    if flip_band[band_index]:
        ax.text(x - 14, row, label, fontsize=9, color="#333333",
                va="center", ha="right", zorder=4)
    else:
        ax.text(x + 14, row, label, fontsize=9, color="#333333",
                va="center", ha="left", zorder=4)

ax.set_yticks([])
ax.xaxis.set_major_locator(mdates.YearLocator())
ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))
ax.tick_params(labelsize=10)
for side in ("top", "right", "left"):
    ax.spines[side].set_visible(False)
ax.grid(axis="x", linestyle=":", alpha=0.3)

ax.set_title("The set of jobs worth automating keeps growing — and it has\n"
             "started reaching work nobody would have called automatable",
             fontsize=13.5, fontweight="bold", pad=14)

ax.text(0.995, 0.02, "Illustrative ordering, not measured adoption dates.",
        transform=ax.transAxes, fontsize=7.5, color="#A0A0A0",
        ha="right", va="bottom", zorder=5)

fig.text(0.5, 0.015,
         "Nobody announces the crossing. You just notice the backlog stopped growing.",
         ha="center", fontsize=9.5, style="italic", color=TEXT_MUTED)

fig.savefig(OUT, facecolor="white", bbox_inches="tight", pad_inches=0.16)
print(f"Wrote {OUT}")
