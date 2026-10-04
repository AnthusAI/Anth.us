#!/usr/bin/env python3
"""Charts for "It's Not a System 1 Model If It Takes Ten Seconds" (GLiDE on Hard-Decisions).

Every number is read from the Hard-Decisions records by absolute path:

  answers/<engine>/<task>.jsonl.gz   scored benchmark answers (Jev, GLiDE), with each request's latency
  timing/jev/<task>.jsonl.gz         Jev's one-request-at-a-time timing rerun
  tasks/<task>/items.jsonl           gold answers and proof depth

Both ProofWriter tasks are pooled (3,600 problems) unless a panel names its task. GLiDE's latency comes
from its scored run (8 requests in flight); Jev's from its rerun (one at a time). Series encoding: Jev
blue circles, GLiDE purple downward triangles, each also labelled in text. Run from the Anth.us repo root:

  python3 scripts/generate-glide-charts.py
"""

import gzip
import json
import math
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from chart_fonts import headline_font, use_brand_fonts  # noqa: E402

use_brand_fonts()

SLUG = "glide-decision-model-ten-seconds"
HD = Path("/Users/home/Projects/Hard-Decisions")
SITE = Path(__file__).resolve().parents[1]
IMAGES = SITE / "src/site-content/images"
TASKS = ("proofwriter-owa", "proofwriter-cwa")
TASK_NAME = {"proofwriter-owa": "Open world: true, false or unknown", "proofwriter-cwa": "Closed world: true or false"}
DPI = 100

BACKGROUND = "#f1f9fe"
PANEL = "#ffffff"
INK = "#333333"
MUTED = "#5f6a72"
GRID = "#c8d8e3"
JEV = "#0389d7"
GLIDE = "#6d28d9"
BANDS = [(0.5, 0.7), (0.7, 0.8), (0.8, 0.9), (0.9, 0.95), (0.95, 0.99), (0.99, 1.0000001)]
SERIES = (("jev", JEV, "o", "Jev"), ("glide", GLIDE, "v", "GLiDE"))


def read_gz(path):
    with gzip.open(path, "rt", encoding="utf-8") as handle:
        return [json.loads(line) for line in handle if line.strip()]


def load():
    """Item-level rows per engine: task, depth, stated probability of the answer, correct, latency."""
    rows = {"jev": [], "glide": [], "jev_timing": []}
    for slug in TASKS:
        items = {}
        for line in (HD / "tasks" / slug / "items.jsonl").read_text().splitlines():
            if line.strip():
                i = json.loads(line)
                items[i["id"]] = i["metadata"]
        for key, path in (("jev", HD / "answers" / "jev"), ("glide", HD / "answers" / "glide"), ("jev_timing", HD / "timing" / "jev")):
            for r in read_gz(path / f"{slug}.jsonl.gz"):
                a = r["answers"]["Decision"]
                m = items[r["id"]]
                rows[key].append({"task": slug, "depth": m["depth"], "p": a["probabilities"][a["choice"]],
                                  "correct": a["choice"] == m["reference_label"], "ms": r["latency_ms"],
                                  "tokens": (r.get("usage") or {}).get("input_tokens"), "id": r["id"]})
    return rows


def frame(fig, ax, title, subtitle, scale):
    fig.patch.set_facecolor(BACKGROUND)
    for a in (ax if isinstance(ax, (list, tuple)) else [ax]):
        a.set_facecolor(PANEL)
        for side in ("top", "right"):
            a.spines[side].set_visible(False)
        for side in ("left", "bottom"):
            a.spines[side].set_color(GRID)
        a.grid(axis="y", color=GRID, linewidth=0.8)
        a.set_axisbelow(True)
        a.tick_params(colors=MUTED, labelsize=15 * scale)
    fig.text(0.06, 0.93, title, color=INK, **headline_font(30 * scale), va="top")
    fig.text(0.06, 0.835, subtitle, color=MUTED, fontsize=16 * scale, va="top")


def bands(rows):
    out = []
    for lo, hi in BANDS:
        g = [r for r in rows if lo <= r["p"] < hi]
        if g:
            out.append((sum(r["p"] for r in g) / len(g), sum(r["correct"] for r in g) / len(g), len(g)))
    return out


def reliability(rows, size, scale, name):
    fig, ax = plt.subplots(figsize=size, dpi=DPI)
    fig.subplots_adjust(left=0.1, right=0.95, top=0.74, bottom=0.14)
    frame(fig, ax, "GLiDE is most often right when it's least sure",
          "Stated probability of the returned answer vs actual accuracy, 3,600 multi-step reasoning problems", scale)
    ax.plot([0.5, 1.0], [0.5, 1.0], linestyle="--", color=MUTED, linewidth=1.6, zorder=1)
    ax.text(0.6, 0.625, "perfect calibration", rotation=37, color=MUTED, fontsize=13 * scale, ha="center")
    for key, color, marker, label in SERIES:
        b = bands([r for r in rows[key] if r["p"] >= 0.5])
        ax.plot([x for x, _, _ in b], [y for _, y, _ in b], color=color, linewidth=3, zorder=2)
        ax.scatter([x for x, _, _ in b], [y for _, y, _ in b], s=[max(60, n / 5) for _, _, n in b], marker=marker,
                   color=color, edgecolor=PANEL, linewidth=2, zorder=3, label=label)
    g = bands(rows["glide"])
    ax.annotate(f"GLiDE at 50-70%: {g[0][2]:,} answers,\n{g[0][1]:.0%} of them right",
                xy=(g[0][0], g[0][1]), xytext=(0.52, 0.80), color=INK, fontsize=14 * scale,
                arrowprops=dict(arrowstyle="-", color=MUTED, linewidth=1.2))
    ax.annotate(f"GLiDE at 80-90%: {g[2][2]:,} answers,\n{g[2][1]:.0%} right",
                xy=(g[2][0], g[2][1]), xytext=(0.80, 0.57), color=INK, fontsize=14 * scale,
                arrowprops=dict(arrowstyle="-", color=MUTED, linewidth=1.2))
    ax.set_xlim(0.5, 1.01)
    ax.set_ylim(0.45, 1.03)
    ticks = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    ax.set_xticks(ticks, [f"{t:.0%}" for t in ticks])
    ax.set_yticks(ticks, [f"{t:.0%}" for t in ticks])
    ax.set_xlabel("Stated probability (mean of each band; marker size = answers in the band)", color=MUTED, fontsize=14 * scale)
    ax.set_ylabel("Actually right", color=MUTED, fontsize=14 * scale)
    ax.legend(loc="lower right", frameon=False, fontsize=15 * scale, markerscale=0.8)
    fig.savefig(IMAGES / name, facecolor=BACKGROUND)
    plt.close(fig)


def latency(rows, size, scale, name, title="Jev answers in a fifth of a second. GLiDE can take two minutes."):
    fig, ax = plt.subplots(figsize=size, dpi=DPI)
    fig.subplots_adjust(left=0.1, right=0.95, top=0.74, bottom=0.14)
    frame(fig, ax, title,
          "Time per decision, 3,600 problems each, log scale. Jev one request at a time; GLiDE eight at a time", scale)
    edges = [10 ** (1.5 + i * 0.1) for i in range(41)]  # 32 ms to 320 s
    centers = [math.sqrt(a * b) for a, b in zip(edges, edges[1:])]
    for key, color, label in (("jev_timing", JEV, "Jev"), ("glide", GLIDE, "GLiDE")):
        ms = [r["ms"] for r in rows[key]]
        counts = [sum(lo <= x < hi for x in ms) for lo, hi in zip(edges, edges[1:])]
        ax.bar(centers, counts, width=[b - a for a, b in zip(edges, edges[1:])], color=color, alpha=0.75,
               edgecolor=PANEL, linewidth=0.8, label=label)
    ax.set_xscale("log")
    ax.axvline(10000, linestyle="--", color=MUTED, linewidth=1.6)
    glide = sorted(r["ms"] for r in rows["glide"])
    jev = sorted(r["ms"] for r in rows["jev_timing"])
    over10 = sum(x >= 10000 for x in glide)
    top = ax.get_ylim()[1]
    ax.text(11500, top * 0.62, f"{over10} GLiDE decisions took\n10 seconds or more\n(slowest: {glide[-1] / 1000:.0f} s)",
            color=INK, fontsize=14 * scale, va="top")
    ax.text(jev[len(jev) // 2] * 1.25, top * 0.93, f"Jev median {jev[len(jev) // 2]:.0f} ms", color=JEV, fontsize=14 * scale, va="top")
    ax.text(glide[len(glide) // 2] * 1.25, top * 0.45, f"GLiDE median {glide[len(glide) // 2] / 1000:.1f} s",
            color=GLIDE, fontsize=14 * scale, va="top")
    ticks = [100, 300, 1000, 3000, 10000, 30000, 100000]
    ax.set_xticks(ticks, ["0.1 s", "0.3 s", "1 s", "3 s", "10 s", "30 s", "100 s"])
    ax.set_xlim(60, 250000)
    ax.set_xlabel("Seconds per decision", color=MUTED, fontsize=14 * scale)
    ax.set_ylabel("Decisions", color=MUTED, fontsize=14 * scale)
    ax.legend(loc="upper right", frameon=False, fontsize=15 * scale)
    fig.savefig(IMAGES / name, facecolor=BACKGROUND)
    plt.close(fig)


PRICE_PER_INPUT_TOKEN = {"jev": 0.042 / 1e6, "glide": 0.30 / 1e6}  # list prices; output tokens free on both


def time_and_cost(rows, size, scale, name):
    """Average seconds and list-price cost per decision by proof depth: time on top, cost below, one column per
    task. Jev's time is from its one-at-a-time rerun, its cost from the scored run; GLiDE's both from its run."""
    jev_ms = {(r["task"], r["id"]): r["ms"] for r in rows["jev_timing"]}
    fig, axes = plt.subplots(2, 2, figsize=size, dpi=DPI, sharex=True)
    fig.subplots_adjust(left=0.09, right=0.97, top=0.76, bottom=0.10, hspace=0.18, wspace=0.14)
    flat = [a for row in axes for a in row]
    frame(fig, flat, "Deeper problems cost GLiDE more time and money",
          "Average per decision by proof depth, same problems; cost at list price. GLiDE's time and billed tokens correlate at 0.94", scale)
    width = 0.38
    for col, slug in enumerate(TASKS):
        for k, (key, color, label) in enumerate((("jev", JEV, "Jev"), ("glide", GLIDE, "GLiDE"))):
            secs, cost = [], []
            for d in range(6):
                g = [r for r in rows[key] if r["task"] == slug and r["depth"] == d]
                ms = [jev_ms[(slug, r["id"])] if key == "jev" else r["ms"] for r in g]
                secs.append(sum(ms) / len(ms) / 1000)
                cost.append(sum(r["tokens"] for r in g) / len(g) * PRICE_PER_INPUT_TOKEN[key] * 1e6)
            xs = [d + (k - 0.5) * width for d in range(6)]
            axes[0][col].bar(xs, secs, width=width, color=color, edgecolor=PANEL, label=label)
            axes[1][col].bar(xs, cost, width=width, color=color, edgecolor=PANEL, label=label)
            for x, v in zip(xs, secs):
                axes[0][col].text(x, v, f"{v:.1f}", ha="center", va="bottom", color=INK, fontsize=11 * scale)
            for x, v in zip(xs, cost):
                axes[1][col].text(x, v, f"${v:.0f}", ha="center", va="bottom", color=INK, fontsize=11 * scale)
        axes[0][col].set_title(TASK_NAME[slug], color=INK, fontsize=16 * scale, loc="left")
        axes[1][col].set_xticks(range(6))
        axes[1][col].set_xlabel("Proof depth (inference steps needed)", color=MUTED, fontsize=14 * scale)
    top_s = max(a.get_ylim()[1] for a in axes[0]) * 1.08
    top_c = max(a.get_ylim()[1] for a in axes[1]) * 1.08
    for a in axes[0]:
        a.set_ylim(0, top_s)
    for a in axes[1]:
        a.set_ylim(0, top_c)
    axes[0][0].set_ylabel("Seconds per decision", color=MUTED, fontsize=14 * scale)
    axes[1][0].set_ylabel("$ per million decisions", color=MUTED, fontsize=14 * scale)
    axes[0][1].legend(loc="upper right", frameon=False, fontsize=15 * scale)
    fig.savefig(IMAGES / name, facecolor=BACKGROUND)
    plt.close(fig)


def accuracy(rows, size, scale, name):
    fig, axes = plt.subplots(1, 2, figsize=size, dpi=DPI, sharey=True)
    fig.subplots_adjust(left=0.08, right=0.95, top=0.70, bottom=0.14, wspace=0.12)
    frame(fig, list(axes), "Level on the open world, far behind on the closed world",
          "Accuracy by proof depth on the same problems, one request each, no examples. Dashed: chance", scale)
    for ax, slug in zip(axes, TASKS):
        chance = 1 / 3 if slug.endswith("owa") else 0.5
        ax.axhline(chance, linestyle="--", color=MUTED, linewidth=1.4)
        for key, color, marker, label in SERIES:
            ys = []
            for d in range(6):
                g = [r for r in rows[key] if r["task"] == slug and r["depth"] == d]
                ys.append(sum(r["correct"] for r in g) / len(g))
            ax.plot(range(6), ys, color=color, linewidth=3, marker=marker, markersize=12, markeredgecolor=PANEL,
                    markeredgewidth=2, label=label)
            ax.text(5.15, ys[-1], f"{ys[-1]:.0%}", color=INK, fontsize=15 * scale, va="center")
        ax.set_title(TASK_NAME[slug], color=INK, fontsize=16 * scale, loc="left")
        ax.set_xlim(-0.2, 5.7)
        ax.set_xticks(range(6))
        ax.set_xlabel("Proof depth (inference steps needed)", color=MUTED, fontsize=14 * scale)
    axes[0].set_ylim(0.3, 1.02)
    axes[0].set_yticks([0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], ["40%", "50%", "60%", "70%", "80%", "90%", "100%"])
    axes[0].set_ylabel("Accuracy", color=MUTED, fontsize=14 * scale)
    axes[1].legend(loc="lower left", frameon=False, fontsize=15 * scale)
    fig.savefig(IMAGES / name, facecolor=BACKGROUND)
    plt.close(fig)


def main():
    rows = load()
    latency(rows, (16, 9), 1.0, f"{SLUG}-latency.png")
    latency(rows, (12, 6.3), 0.8, f"{SLUG}-preview.png", title="GLiDE can take two minutes to decide")
    reliability(rows, (16, 9), 1.0, f"{SLUG}-reliability.png")
    accuracy(rows, (16, 9), 1.0, f"{SLUG}-accuracy-by-depth.png")
    time_and_cost(rows, (16, 10), 1.0, f"{SLUG}-time-and-cost-by-depth.png")
    print("wrote", ", ".join(f"{SLUG}-{n}.png" for n in ("latency", "preview", "reliability", "accuracy-by-depth", "time-and-cost-by-depth")))


if __name__ == "__main__":
    main()
