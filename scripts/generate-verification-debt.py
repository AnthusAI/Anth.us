#!/usr/bin/env python3
"""Generate src/blog/images/verification-debt.png for cybernetic-development.mdx.

The one place in that article where a chart beats a diagram: the argument is
explicitly about two rates diverging. Generation capacity climbs exponentially
(cheap tokens); manual verification -- one human reading -- climbs almost not
at all. The gap between them is not a constant, it compounds. Automated
verification (BDD/TDD plus runtime feedback) is the resolution: it tracks
generation closely instead of falling behind.

Illustrative rates and shapes, not measured project data -- same convention as
generate-break-even-crossing.py.
"""

import numpy as np

FIG_W_IN = 1200 / 150
FIG_H_IN = 630 / 150
DPI = 150
OUT = "src/blog/images/verification-debt.png"

N_MONTHS = 24
GEN_START = 8.0
GEN_DOUBLING_MONTHS = 4.0
MANUAL_START = 18.0
MANUAL_SLOPE = 0.6
AUTO_RATIO = 0.8  # automated verification tracks generation at a fixed ratio

GEN_COLOR = "#9B1B30"
MANUAL_COLOR = "#555555"
AUTO_COLOR = "#1f77b4"
DEBT_FILL = "#9B1B30"
TEXT_MUTED = "#6B6B6B"

t = np.linspace(0, N_MONTHS, 400)
gen = GEN_START * 2 ** (t / GEN_DOUBLING_MONTHS)
manual = MANUAL_START + MANUAL_SLOPE * t
auto = AUTO_RATIO * gen

# Find the crossing (gen overtakes manual) by locating the sign change --
# no closed form once the parameters above are tuned by eye, so solve
# numerically rather than hardcode a month that will drift out of sync
# if GEN_START / GEN_DOUBLING_MONTHS / MANUAL_* ever change.
diff = gen - manual
cross_idx = np.argmax(diff > 0)
cross_t = t[cross_idx]
cross_y = manual[cross_idx]

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

fig, ax = plt.subplots(figsize=(FIG_W_IN, FIG_H_IN), dpi=DPI)
fig.patch.set_facecolor("white")
ax.set_facecolor("white")

ax.set_yscale("log")
ax.set_xlim(0, N_MONTHS)
ax.set_ylim(5, 700)

ax.fill_between(
    t[cross_idx:], manual[cross_idx:], gen[cross_idx:],
    color=DEBT_FILL, alpha=0.12, zorder=1,
)

ax.plot(t, gen, color=GEN_COLOR, linewidth=2.4, label="Generation capacity", zorder=3)
ax.plot(t, manual, color=MANUAL_COLOR, linewidth=2.0, linestyle="--",
        label="Manual verification", zorder=3)
ax.plot(t, auto, color=AUTO_COLOR, linewidth=2.4,
        label="Automated verification (BDD/TDD + runtime feedback)", zorder=3)

ax.axvline(cross_t, color=GEN_COLOR, linestyle=":", linewidth=1.2, zorder=2)
ax.plot(cross_t, cross_y, "o", color=GEN_COLOR, markersize=6, zorder=4)
ax.annotate(
    "you are now shipping\ncode nobody has read",
    xy=(cross_t, cross_y),
    xytext=(16, -30),
    textcoords="offset points",
    fontsize=8.5,
    color=GEN_COLOR,
    fontweight="bold",
    ha="left",
)

# Label the shaded gap partway through its own span, not at the crossing point
# (crowded) and not at the far right edge (clipped by the legend/plot edge).
# auto sits at a fixed 0.8x of gen, so the auto-to-gen gap is a CONSTANT width
# in log-space regardless of t -- there is no t that gives it more room. The
# manual-to-auto gap, by contrast, widens with t, so place the label there
# instead (still inside the shaded manual-to-gen band) rather than squeezed
# between auto and gen.
label_t = cross_t + (N_MONTHS - cross_t) * 0.55
label_gen = GEN_START * 2 ** (label_t / GEN_DOUBLING_MONTHS)
label_auto = AUTO_RATIO * label_gen
label_manual = MANUAL_START + MANUAL_SLOPE * label_t
label_y = 10 ** (0.5 * np.log10(label_manual) + 0.5 * np.log10(label_auto))
ax.text(label_t, label_y, "verification\ndebt", fontsize=9, fontweight="bold",
        color=GEN_COLOR, ha="center", va="center", zorder=4,
        bbox=dict(boxstyle="round,pad=0.25", facecolor="white",
                   edgecolor="none", alpha=0.75))

ax.set_xlabel("Project lifetime (months)", fontsize=9.5)
ax.set_ylabel("Code under active generation\n(log scale, illustrative units)", fontsize=9)

for side in ("top", "right"):
    ax.spines[side].set_visible(False)
ax.grid(axis="y", linestyle=":", alpha=0.3, which="both")
ax.tick_params(labelsize=9)

ax.legend(loc="upper left", fontsize=8.5, frameon=False)

ax.set_title(
    "Generation got cheap. Verification didn't—unless you automate it too.",
    fontsize=12.5, fontweight="bold", pad=12,
)

ax.text(0.995, 0.03, "Illustrative rates and shapes, not measured project data.",
        transform=ax.transAxes, fontsize=7.5, color="#A0A0A0",
        ha="right", va="bottom", zorder=5)

fig.text(0.5, -0.02,
          "You cannot run a 100× generator with a 1× verifier.",
          ha="center", fontsize=9.5, style="italic", color=TEXT_MUTED)

fig.savefig(OUT, facecolor="white", bbox_inches="tight", pad_inches=0.16)
print(f"Wrote {OUT}")
