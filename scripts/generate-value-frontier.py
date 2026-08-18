#!/usr/bin/env python3
"""Generate src/blog/images/value-frontier.png.

This is the reviewed-and-approved version of this chart. A later pass
replaced both value charts with regenerated variants; this script is the
restored original so re-running it reproduces the approved art.
"""
import matplotlib.pyplot as plt

# Ordered ascending, left to right -- same convention as value-over-time.png,
# where the reader's eye reads left-to-right as "worse to better." A
# descending bar chart (best on the left) reads as decline regardless of
# the caption; ending on Luna's tall bar on the right makes it the payoff
# instead of the start.
models = [
    {"name": "GPT-5.6 Sol",           "price": 30.00, "score": 78.7, "value": 2.62,  "color": "#adb5bd"},
    {"name": "GPT-5.6 Terra",         "price": 12.00, "score": 65.4, "value": 5.45,  "color": "#adb5bd"},
    {"name": "Gemini 3.1 Flash-Lite", "price": 1.50,  "score": 41.9, "value": 27.96, "color": "#adb5bd"},
    {"name": "GPT-5.6 Luna",          "price": 1.20,  "score": 73.0, "value": 60.85, "color": "#d6336c"},
]

names = [m["name"] for m in models]
values = [m["value"] for m in models]
colors = [m["color"] for m in models]

fig, ax = plt.subplots(figsize=(12, 6.3), dpi=100)
fig.patch.set_facecolor("white")
ax.set_facecolor("white")

bars = ax.bar(names, values, color=colors, width=0.55, zorder=3)

# Both lines of each annotation sit ABOVE the bar top, stacked upward, so
# short bars (Sol, Terra) never collide with their own label the way a
# below-the-number offset would.
for m, bar in zip(models, bars):
    height = bar.get_height()
    ax.annotate(f'{m["value"]:.1f}',
                (bar.get_x() + bar.get_width() / 2, height),
                textcoords="offset points", xytext=(0, 26),
                ha="center", fontsize=15, fontweight="bold", color="#222222")
    ax.annotate(f'score {m["score"]:.1f} · ${m["price"]:.2f}/1M',
                (bar.get_x() + bar.get_width() / 2, height),
                textcoords="offset points", xytext=(0, 8),
                ha="center", fontsize=10, color="#555555")

# Draw the arrow and place the text as two separate elements, so the
# arrow's start isn't wherever the text happens to sit. Sol's bar (2.6) is
# so short that anchoring the arrow tail right at its top forced the whole
# arc down low enough to cut through Terra and Flash-Lite's bars. Instead
# the arrow starts well above Sol -- elevated, but still directly over its
# bar, so the horizontal position still reads as "this is about Sol" --
# and stays above the tallest interior bar (Flash-Lite, 28.0) the whole way.
sol_index = 0
luna_index = 3
sol_value = values[sol_index]
luna_value = values[luna_index]
# Left end sits just above Sol/Terra's bars -- low enough to visibly start
# near Sol rather than floating up by the Flash-Lite label. The near-flat
# rad still clears Flash-Lite's bar (28.0) on the way to Luna, since the
# line is already rising well past it by that x position.
start_y = max(values) * 0.30
end_y = luna_value + max(values) * 0.03

ax.annotate("", xy=(luna_index - 0.3, end_y),
            xytext=(sol_index + 0.15, start_y),
            arrowprops=dict(arrowstyle="->", color="#b02a2a", lw=1.3,
                             connectionstyle="arc3,rad=0.04"))

ax.text(1.4, start_y + (end_y - start_y) * 0.5 + max(values) * 0.09,
        "Luna: 23× Sol's coding value",
        fontsize=12, color="#b02a2a", ha="center", fontweight="bold")

ax.set_ylabel("Coding value score (weighted score ÷ output $/1M)", fontsize=11)
ax.set_ylim(0, max(values) * 1.35)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.spines["left"].set_visible(False)
ax.tick_params(left=False, labelsize=12)
ax.set_yticks([])
ax.grid(False)

ax.set_title("Coding Value Today: Score per Dollar\n"
             "GPT-5.6 family + Gemini Flash-Lite · August 2026",
             fontsize=15, pad=16)

plt.tight_layout()
plt.savefig("src/blog/images/value-frontier.png",
            dpi=100, facecolor="white")
print("Wrote src/blog/images/value-frontier.png")
