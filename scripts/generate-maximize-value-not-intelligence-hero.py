#!/usr/bin/env python3
"""Generate src/blog/images/maximize-value-not-intelligence.png -- the HERO
treatment of generate-value-frontier.py's data, for the social card. Same
fourteen models and the same Sol->Luna annotation, not re-derived, but
thinned for thumbnail scale: only three of fourteen bars keep a text label
(Sol, one recognizable midpoint, Luna), a much larger baked-in title, and
the per-bar value numbers dropped since they will not survive thumbnailing.
The full annotated version stays in the article body.
"""

import matplotlib.pyplot as plt
import numpy as np

FIG_W_IN = 1200 / 150
FIG_H_IN = 630 / 150
DPI = 150
OUT = "src/blog/images/maximize-value-not-intelligence.png"

# Same source data and order as generate-value-frontier.py.
MODELS = [
    ("Claude Fable 5", 1.6),
    ("GPT-5.6 Sol", 2.6),
    ("Claude Opus 5", 3.1),
    ("GPT-5.3 Codex", 4.5),
    ("Kimi K3", 5.2),
    ("GPT-5.6 Terra", 5.5),
    ("Claude Sonnet 5", 6.9),
    ("Claude Haiku 4.5", 9.3),
    ("Kimi K2.6", 12.6),
    ("GLM 5.2", 14.5),
    ("Kimi K2.5", 18.8),
    ("Composer 2.5", 21.1),
    ("Gemini 3.1 Flash-Lite", 28.0),
    ("GPT-5.6 Luna", 60.9),
]

CURVE_COLOR = "#9B1B30"
LABELED = {"GPT-5.6 Sol", "Claude Sonnet 5", "GPT-5.6 Luna"}

names = [m[0] for m in MODELS]
values = [m[1] for m in MODELS]

fig, ax = plt.subplots(figsize=(FIG_W_IN, FIG_H_IN), dpi=DPI)
fig.patch.set_facecolor("white")
ax.set_facecolor("white")

x = np.arange(len(names))
ax.bar(x, values, color="#C8C8C8", width=0.72, edgecolor="white", linewidth=0.8, zorder=2)

tick_labels = [name if name in LABELED else "" for name in names]
ax.set_xticks(x)
ax.set_xticklabels(tick_labels, rotation=0, ha="center", fontsize=11, fontweight="bold")
ax.tick_params(axis="x", length=0)
ax.set_yticks([])
ax.set_ylim(0, max(values) * 1.2)
for side in ("top", "right", "left"):
    ax.spines[side].set_visible(False)

sol_i = names.index("GPT-5.6 Sol")
luna_i = names.index("GPT-5.6 Luna")
ax.annotate(
    "",
    xy=(x[luna_i], values[luna_i]),
    xytext=(x[sol_i], values[sol_i]),
    arrowprops=dict(arrowstyle="->", color=CURVE_COLOR, lw=2.6, shrinkA=0, shrinkB=0),
    zorder=6,
)
ax.text(
    (sol_i + luna_i) / 2.0 - 1.6,
    46,
    "Luna: 23× Sol's\ncoding value",
    fontsize=15,
    color=CURVE_COLOR,
    fontweight="bold",
    linespacing=1.3,
    zorder=6,
)

ax.set_title("Coding value today: score per dollar", fontsize=23, fontweight="bold", pad=16)

fig.text(
    0.5,
    0.02,
    "Fourteen models, ranked by coding value per dollar.",
    ha="center",
    fontsize=10.5,
    color="#555555",
    style="italic",
)

plt.subplots_adjust(bottom=0.13, top=0.86, left=0.03, right=0.98)
fig.savefig(OUT, facecolor="white", bbox_inches="tight", pad_inches=0.14)
print(f"Wrote {OUT}")
