#!/usr/bin/env python3
"""Generate src/blog/images/value-frontier.png for the AI-coding economics articles.

Matches the straight Sol→Luna annotation from commit 9d67bb0, extended to
fourteen models (prior ten plus Claude Fable/Opus/Sonnet/Haiku).
"""

import matplotlib.pyplot as plt
import numpy as np

# Article content column is 940px; export at 2x for retina.
FIG_W_IN = 1880 / 150
FIG_H_IN = 780 / 150
DPI = 150
OUT = "src/blog/images/value-frontier.png"

# Sorted low → high value score. value, coding score, output $/1M.
MODELS = [
    ("Claude Fable 5", 1.6, 80.9, 50.00),
    ("GPT-5.6 Sol", 2.6, 78.7, 30.00),
    ("Claude Opus 5", 3.1, 78.1, 25.00),
    ("GPT-5.3 Codex", 4.5, 63.5, 14.00),
    ("Kimi K3", 5.2, 78.0, 15.00),
    ("GPT-5.6 Terra", 5.5, 65.4, 12.00),
    ("Claude Sonnet 5", 6.9, 68.5, 10.00),
    ("Claude Haiku 4.5", 9.3, 46.6, 5.00),
    ("Kimi K2.6", 12.6, 50.2, 4.00),
    ("GLM 5.2", 14.5, 63.8, 4.40),
    ("Kimi K2.5", 18.8, 56.5, 3.00),
    ("Composer 2.5", 21.1, 52.7, 2.50),
    ("Gemini 3.1 Flash-Lite", 28.0, 41.9, 1.50),
    ("GPT-5.6 Luna", 60.9, 73.0, 1.20),
]

CURVE_COLOR = "#9B1B30"

names = [m[0] for m in MODELS]
values = [m[1] for m in MODELS]
raw_scores = [m[2] for m in MODELS]
prices = [m[3] for m in MODELS]

tick_labels = [
    f"{name}\nscore {raw:.1f} · ${price:.2f}/1M"
    for name, raw, price in zip(names, raw_scores, prices)
]

fig, ax = plt.subplots(figsize=(FIG_W_IN, FIG_H_IN), dpi=DPI)
fig.patch.set_facecolor("white")
ax.set_facecolor("white")

x = np.arange(len(names))
bars = ax.bar(
    x,
    values,
    color="#C8C8C8",
    width=0.72,
    edgecolor="white",
    linewidth=0.8,
    zorder=2,
)

ax.set_title("Coding Value Today: Score per Dollar", fontsize=22, fontweight="bold", pad=18)
ax.set_ylabel("Coding value score\n(weighted score ÷ output $/1M)", fontsize=12)
ax.set_xticks(x)
ax.set_xticklabels(tick_labels, rotation=48, ha="right", fontsize=7.5, linespacing=1.3)
ax.set_ylim(0, max(values) * 1.22)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.grid(axis="y", linestyle=":", alpha=0.35, zorder=0)

for bar, val in zip(bars, values):
    ax.text(
        bar.get_x() + bar.get_width() / 2,
        bar.get_height() + 0.9,
        f"{val:.1f}",
        ha="center",
        va="bottom",
        fontsize=9,
        fontweight="bold",
        zorder=4,
    )

# Straight chord Sol → Luna (not first/last bar — Fable sits below Sol on value).
sol_i = names.index("GPT-5.6 Sol")
luna_i = names.index("GPT-5.6 Luna")
ax.annotate(
    "",
    xy=(x[luna_i], values[luna_i]),
    xytext=(x[sol_i], values[sol_i]),
    arrowprops=dict(arrowstyle="->", color=CURVE_COLOR, lw=2.2, shrinkA=0, shrinkB=0),
    zorder=6,
)
ax.text(
    (sol_i + luna_i) / 2.0 - 2.2,
    44,
    "Luna: 23× Sol's coding value",
    fontsize=12,
    color=CURVE_COLOR,
    fontweight="bold",
    zorder=6,
)

fig.text(
    0.5,
    0.005,
    "BenchLM coding-value index · models with usable coding scores · August 2026",
    ha="center",
    fontsize=9,
    color="#666",
)

plt.subplots_adjust(bottom=0.34, top=0.90, left=0.06, right=0.99)

fig.savefig(OUT, facecolor="white", bbox_inches="tight", pad_inches=0.15)
print(f"Wrote {OUT}")
for name, value, raw, price in MODELS:
    print(f"  {name}: {value:.1f} ({raw}/{price})")
