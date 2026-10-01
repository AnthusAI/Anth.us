#!/usr/bin/env python3
"""Charts for "A Preview of the OpenAI Decisions API".

Every number is read from the Hard-Decisions records by absolute path:

  answers/<engine>/<task>.jsonl.gz          scored benchmark answers (Jev, GPT-6 Luna)
  probes/luna-logprobs/<task>.jsonl.gz      the GPT-6 Luna log-probability probe, every request and response
  tasks/<task>/items.jsonl                  gold answers and proof depth

Both ProofWriter tasks are pooled (3,600 problems). Series encoding: Jev blue circles, GPT-6 Luna green
triangles, each also labelled in text. Run from the Anth.us repo root:

  python3 scripts/generate-openai-decisions-api-preview-charts.py
"""

import gzip
import json
import math
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from chart_fonts import headline_font, use_brand_fonts  # noqa: E402

use_brand_fonts()

SLUG = "openai-decisions-api-preview"
HD = Path("/Users/home/Projects/Hard-Decisions")
sys.path.insert(0, str(HD / "tools"))
from analyze_luna_logprobs import answer_position, auroc  # noqa: E402

SITE = Path(__file__).resolve().parents[1]
IMAGES = SITE / "src/site-content/images"
TASKS = ("proofwriter-owa", "proofwriter-cwa")
DPI = 100

BACKGROUND = "#f1f9fe"
PANEL = "#ffffff"
INK = "#333333"
MUTED = "#5f6a72"
GRID = "#c8d8e3"
JEV = "#0389d7"
LUNA = "#2b8a3e"
BANDS = [(0.0, 0.5), (0.5, 0.8), (0.8, 0.9), (0.9, 0.95), (0.95, 0.99), (0.99, 1.0000001)]


def read_gz(path):
    with gzip.open(path, "rt", encoding="utf-8") as handle:
        return [json.loads(line) for line in handle if line.strip()]


def load():
    """Item-level rows per engine: stated probability of the returned answer, correct, depth."""
    rows = {"jev": [], "luna": [], "luna_bench": []}
    for slug in TASKS:
        items = {}
        for line in (HD / "tasks" / slug / "items.jsonl").read_text().splitlines():
            if line.strip():
                i = json.loads(line)
                items[i["id"]] = i["metadata"]
        for r in read_gz(HD / "answers" / "jev" / f"{slug}.jsonl.gz"):
            a = r["answers"]["Decision"]
            m = items[r["id"]]
            rows["jev"].append({"p": a["probabilities"][a["choice"]], "correct": a["choice"] == m["reference_label"],
                                "depth": m["depth"]})
        for r in read_gz(HD / "answers" / "openai-gpt-6-luna-effort-none" / f"{slug}.jsonl.gz"):
            m = items[r["id"]]
            rows["luna_bench"].append({"correct": r["answers"]["Decision"]["choice"] == m["reference_label"], "depth": m["depth"]})
        for r in read_gz(HD / "probes" / "luna-logprobs" / f"{slug}.jsonl.gz"):
            choice = r["response"]["choices"][0]
            answer = json.loads(choice["message"]["content"])["answer"]
            index, logprob = answer_position(choice["logprobs"]["content"], answer)
            m = items[r["id"]]
            rows["luna"].append({"p": math.exp(logprob), "correct": answer == m["reference_label"], "depth": m["depth"]})
    return rows


def bands(rows):
    out = []
    for lo, hi in BANDS:
        g = [r for r in rows if lo <= r["p"] < hi]
        if g:
            out.append((sum(r["p"] for r in g) / len(g), sum(r["correct"] for r in g) / len(g), len(g)))
    return out


def frame(fig, ax, title, subtitle, scale):
    fig.patch.set_facecolor(BACKGROUND)
    ax.set_facecolor(PANEL)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color(GRID)
    ax.grid(axis="y", color=GRID, linewidth=0.8)
    ax.set_axisbelow(True)
    ax.tick_params(colors=MUTED, labelsize=15 * scale)
    fig.text(0.06, 0.93, title, color=INK, **headline_font(30 * scale), va="top")
    fig.text(0.06, 0.835, subtitle, color=MUTED, fontsize=16 * scale, va="top")


def reliability(rows, size, scale, name):
    fig, ax = plt.subplots(figsize=size, dpi=DPI)
    fig.subplots_adjust(left=0.1, right=0.95, top=0.74, bottom=0.14)
    frame(fig, ax, "When GPT-6 Luna says 99%, it's right 68% of the time",
          "Stated probability of the returned answer vs actual accuracy, 3,600 multi-step reasoning problems", scale)
    ax.plot([0.25, 1.0], [0.25, 1.0], linestyle="--", color=MUTED, linewidth=1.6, zorder=1)
    ax.text(0.47, 0.50, "perfect calibration", rotation=33, color=MUTED, fontsize=13 * scale, ha="center")
    for key, color, marker, label in (("jev", JEV, "o", "Jev"), ("luna", LUNA, "^", "GPT-6 Luna")):
        b = bands(rows[key])
        ax.plot([x for x, _, _ in b], [y for _, y, _ in b], color=color, linewidth=3, zorder=2)
        ax.scatter([x for x, _, _ in b], [y for _, y, _ in b], s=[max(60, n / 6) for _, _, n in b], marker=marker,
                   color=color, edgecolor=PANEL, linewidth=2, zorder=3, label=label)
    top_l = bands(rows["luna"])[-1]
    top_j = bands(rows["jev"])[-1]
    ax.annotate(f"Luna: {top_l[2]:,} answers stated at 99% or more,\n{top_l[1]:.0%} of them right",
                xy=(top_l[0], top_l[1]), xytext=(0.66, 0.33), color=INK, fontsize=14 * scale,
                arrowprops=dict(arrowstyle="-", color=MUTED, linewidth=1.2))
    ax.annotate(f"Jev: {top_j[2]:,} answers at 99% or more,\n{top_j[1]:.1%} right",
                xy=(top_j[0], top_j[1]), xytext=(0.6, 0.93), color=INK, fontsize=14 * scale,
                arrowprops=dict(arrowstyle="-", color=MUTED, linewidth=1.2))
    ax.set_xlim(0.25, 1.01)
    ax.set_ylim(0.25, 1.03)
    ticks = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    ax.set_xticks(ticks, [f"{t:.0%}" for t in ticks])
    ax.set_yticks(ticks, [f"{t:.0%}" for t in ticks])
    ax.set_xlabel("Stated probability (mean of each band; marker size = answers in the band)", color=MUTED, fontsize=14 * scale)
    ax.set_ylabel("Actually right", color=MUTED, fontsize=14 * scale)
    ax.legend(loc="lower right", frameon=False, fontsize=15 * scale, markerscale=0.8)
    fig.savefig(IMAGES / name, facecolor=BACKGROUND)
    plt.close(fig)


def by_depth(rows, size, scale, name):
    fig, ax = plt.subplots(figsize=size, dpi=DPI)
    fig.subplots_adjust(left=0.1, right=0.95, top=0.74, bottom=0.14)
    frame(fig, ax, "Past a few inference steps, Luna's confidence tells you nothing",
          "How well the stated probability separates right answers from wrong ones (AUROC), by proof depth", scale)
    ax.axhline(0.5, linestyle="--", color=MUTED, linewidth=1.6)
    ax.text(-0.1, 0.485, "coin flip", color=MUTED, fontsize=13 * scale, va="top", ha="left")
    for key, color, marker, label in (("jev", JEV, "o", "Jev"), ("luna", LUNA, "^", "GPT-6 Luna")):
        ys = []
        for d in range(6):
            g = [r for r in rows[key] if r["depth"] == d]
            ys.append(auroc([r["p"] for r in g], [int(r["correct"]) for r in g]))
        ax.plot(range(6), ys, color=color, linewidth=3, marker=marker, markersize=12, markeredgecolor=PANEL,
                markeredgewidth=2, label=label)
        ax.text(5.12, ys[-1], f"{label} {ys[-1]:.2f}", color=INK, fontsize=14 * scale, va="center")
    ax.set_xlim(-0.2, 5.9)
    ax.set_ylim(0.4, 1.0)
    ax.set_xticks(range(6))
    ax.set_xlabel("Proof depth (inference steps needed)", color=MUTED, fontsize=14 * scale)
    ax.set_ylabel("AUROC (0.5 = no information)", color=MUTED, fontsize=14 * scale)
    ax.legend(loc="upper right", frameon=False, fontsize=15 * scale)
    fig.savefig(IMAGES / name, facecolor=BACKGROUND)
    plt.close(fig)


def accuracy(rows, size, scale, name):
    fig, ax = plt.subplots(figsize=size, dpi=DPI)
    fig.subplots_adjust(left=0.1, right=0.95, top=0.74, bottom=0.14)
    frame(fig, ax, "The deeper the reasoning, the wider the gap",
          "Accuracy by proof depth on the same 3,600 problems, one request each, no examples", scale)
    for key, color, marker, label in (("jev", JEV, "o", "Jev"), ("luna_bench", LUNA, "^", "GPT-6 Luna (reasoning off)")):
        ys = []
        for d in range(6):
            g = [r for r in rows[key] if r["depth"] == d]
            ys.append(sum(r["correct"] for r in g) / len(g))
        ax.plot(range(6), ys, color=color, linewidth=3, marker=marker, markersize=12, markeredgecolor=PANEL,
                markeredgewidth=2, label=label)
        ax.text(5.12, ys[-1], f"{ys[-1]:.0%}", color=INK, fontsize=15 * scale, va="center")
    ax.set_xlim(-0.2, 5.6)
    ax.set_ylim(0.3, 1.02)
    ax.set_yticks([0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], ["40%", "50%", "60%", "70%", "80%", "90%", "100%"])
    ax.set_xticks(range(6))
    ax.set_xlabel("Proof depth (inference steps needed)", color=MUTED, fontsize=14 * scale)
    ax.set_ylabel("Accuracy", color=MUTED, fontsize=14 * scale)
    ax.legend(loc="lower left", frameon=False, fontsize=15 * scale)
    fig.savefig(IMAGES / name, facecolor=BACKGROUND)
    plt.close(fig)


def main():
    rows = load()
    reliability(rows, (16, 9), 1.0, f"{SLUG}-reliability.png")
    reliability(rows, (12, 6.3), 0.8, f"{SLUG}-preview.png")
    by_depth(rows, (16, 9), 1.0, f"{SLUG}-auroc-by-depth.png")
    accuracy(rows, (16, 9), 1.0, f"{SLUG}-accuracy-by-depth.png")
    print("wrote", ", ".join(f"{SLUG}-{n}.png" for n in ("reliability", "preview", "auroc-by-depth", "accuracy-by-depth")))


if __name__ == "__main__":
    main()
