#!/usr/bin/env python3
"""Generate src/blog/images/value-over-time.png.

This is the reviewed-and-approved version of this chart. A later pass
replaced both value charts with regenerated variants; this script is the
restored original so re-running it reproduces the approved art.
"""
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import date
import numpy as np

# Anchor and rates are the already-published, already-cited figures from
# the companion piece (ai-coding-cost-collapse-2026.mdx): baseline Feb 2025
# ("vibe coding" coined), ~18 months to Aug 2026, conservative SWE-bench
# rate ~4.7x/year compounding to ~10x, broader MIT 5-10x/year band
# compounding to ~12x-35x over the same window. This chart just re-visualizes
# that already-fact-checked math as a rising curve instead of restating it
# as a falling-cost curve.
start = date(2025, 2, 1)
end = date(2026, 8, 17)
months = np.linspace(0, 18, 200)
dates_x = [date(2025, 2, 1) + __import__("datetime").timedelta(days=int(m * 30.44)) for m in months]

conservative = 4.7 ** (months / 12)   # SWE-bench-specific annual rate -> ~10x at 18mo
lower_band   = 5.0 ** (months / 12)   # MIT paper's low end of the 5x-10x/yr band
upper_band   = 10.0 ** (months / 12)  # MIT paper's high end

fig, ax = plt.subplots(figsize=(12, 6.3), dpi=100)
fig.patch.set_facecolor("white")
ax.set_facecolor("white")

ax.fill_between(dates_x, lower_band, upper_band, color="#d6336c", alpha=0.12,
                 label="MIT Price-of-Progress band (5×–10×/yr)", zorder=1)
ax.plot(dates_x, conservative, color="#d6336c", linewidth=2.5, zorder=3,
        label="Conservative rate (SWE-bench, ~4.7×/yr)")
ax.plot(dates_x, lower_band, color="#d6336c", linewidth=0.8, alpha=0.4, zorder=2)
ax.plot(dates_x, upper_band, color="#d6336c", linewidth=0.8, alpha=0.4, zorder=2)

ax.axhline(1.0, color="#999999", linewidth=0.8, linestyle=":", zorder=1)

# GLM 5.2 (Jun 16) and Luna's price cut (Jul 30) land only six weeks apart,
# so inline labels at the same height collide. Stagger them hard: GLM 5.2
# low (in the open space below the curve), Luna's cut high (in the open
# space above the band) -- the rightward one goes higher so the two never
# compete for the same vertical band even though their lines sit close.
glm_date = date(2026, 6, 16)
luna_date = date(2026, 7, 30)
ax.axvline(glm_date, color="#888888", linewidth=0.8, linestyle="--", alpha=0.5, zorder=1)
ax.axvline(luna_date, color="#888888", linewidth=0.8, linestyle="--", alpha=0.5, zorder=1)

# Just name + date, rotated to run alongside each dashed line. Both
# anchored at the same height -- rotated, they're narrow enough (a single
# short line each) that the six weeks of horizontal separation between the
# two dates is already enough room; no vertical stagger needed.
from datetime import timedelta
label_offset = timedelta(days=5)
label_y = 1.35

ax.text(glm_date + label_offset, label_y, "GLM 5.2 — Jun 16, 2026",
        fontsize=9, color="#666666", rotation=90, ha="left", va="bottom")

ax.text(luna_date + label_offset, label_y, "Luna price cut — Jul 30, 2026",
        fontsize=9, color="#666666", rotation=90, ha="left", va="bottom")

end_conservative = conservative[-1]
end_upper = upper_band[-1]
ax.annotate(f"~{end_conservative:.0f}×\nconservative",
            xy=(dates_x[-1], end_conservative), xytext=(10, -4),
            textcoords="offset points", fontsize=11, fontweight="bold",
            color="#b02a2a", va="center")
ax.annotate(f"up to ~{end_upper:.0f}×",
            xy=(dates_x[-1], end_upper), xytext=(10, 4),
            textcoords="offset points", fontsize=10,
            color="#b02a2a", va="center")

ax.set_yscale("log")
ax.set_ylim(0.8, 45)
ax.set_yticks([1, 2, 5, 10, 20, 35])
ax.get_yaxis().set_major_formatter(plt.FuncFormatter(lambda y, _: f'{y:g}×'))
ax.set_ylabel("Coding value index (capability per dollar, Feb 2025 = 1×)", fontsize=11)

ax.xaxis.set_major_locator(mdates.MonthLocator(interval=3))
ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
ax.set_xlim(start, date(2026, 9, 15))

ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(True, which="major", axis="y", linestyle="-", linewidth=0.5, alpha=0.25)

ax.set_title("Coding value has climbed roughly 10×—and possibly 35×—since\n"
             "“vibe coding” was coined",
             fontsize=15, pad=14)

ax.legend(loc="upper left", fontsize=9.5, frameon=True)

plt.tight_layout()
plt.savefig("src/blog/images/value-over-time.png",
            dpi=100, facecolor="white")
print("Wrote src/blog/images/value-over-time.png")
