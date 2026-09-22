#!/usr/bin/env python3
"""Charts for "Encoding Prejudice: System 1 Models and the Biases Nobody Measures".

Every number is read from the Jev-Flywheel study records by absolute path:

  studies/bios_gender.jsonl   J0 / L0 rows with "redacted": true (the pronoun swap)
  studies/bios_race.jsonl     race v1: one first name at the first pronoun (the weak instrument)
  studies/bios_race2.jsonl    race v2: full names from measured pools, signed shift in P(surgeon)
  studies/bios_age.jsonl      "At 34/35/61/62," inserted before the first pronoun
  studies/bios_pairs.jsonl    the pronoun swap on four occupation pairs (engines only, 1,000 bios per label)
  studies/bios_shortlist.jsonl the constructed shortlist: rank 2,000 paralegal/attorney bios by P(attorney), cut the top k

Two counts are not in any jsonl and are typed in from studies/PREREGISTERED.md, section
"does the engine read gender, and can the layer refuse to?", Outcome: the number of MALE-origin
bios that flipped under the swap (Jev 16, Laya 139). The direction share in the jsonl
(flip_toward_physician_share) is taken over those.

Series encoding, shared by the series: colour is the ENGINE (Jev blue, Laya magenta, gray for
neutral marks). Blue and magenta are close in luminance, so every bar is also labelled with its
engine in text. Floors are drawn as a faint gray bar behind the measured bar.

Run from the Anth.us repo root:

  python3 scripts/generate-encoding-prejudice-charts.py            # everything
  python3 scripts/generate-encoding-prejudice-charts.py --only flips --layouts wide
"""

import argparse
import json
import sys
import textwrap
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Patch  # noqa: E402

try:
    from chart_fonts import headline_font, use_brand_fonts  # noqa: E402
except ImportError:  # the develop branch has no scripts/chart_fonts.py; origin/main does
    sys.path.insert(0, "/private/tmp/claude-502/-Users-home-Projects-Jev-Flywheel/"
                       "ec26581d-20b5-4dd7-9595-9808dd48d9d5/scratchpad/articles/encoding-prejudice")
    from chart_fonts import headline_font, use_brand_fonts  # noqa: E402

use_brand_fonts()


SLUG = "encoding-prejudice"
STUDIES = Path("/Users/home/Projects/Jev-Flywheel/studies")
SITE = Path(__file__).resolve().parents[1]
IMAGES = SITE / "src/site-content/images"
SOCIAL = SITE / "social" / SLUG
DPI = 100

BACKGROUND = "#f1f9fe"
PANEL = "#ffffff"
INK = "#333333"
MUTED = "#5f6a72"
GRID = "#c8d8e3"
BLUE = "#0389d7"
MAGENTA = "#d03382"
GRAY = "#8a949c"
TINT = {BLUE: "#b9def5", MAGENTA: "#f3c3dc", GRAY: "#d9dde0", INK: "#d5d5d5"}
FLOOR = "#e3e8ec"

# name -> (figsize in inches, type scale, orientation of bars)
LAYOUTS = {
    "wide": ((16, 9), 1.0, "v"),
    "portrait": ((10.8, 13.5), 1.12, "h"),
    "square": ((10.8, 10.8), 1.0, "h"),
    "cover": ((12, 6.3), 0.8, "v"),
}

# PREREGISTERED.md, gender Outcome: "Only 16 of 1,000 male-origin bios flipped" (Jev);
# "L0's direction share (0.9928, on 139 flips)" (Laya).
MALE_ORIGIN_FLIPS = {"jev": 16, "laya": 139}


# ---------------------------------------------------------------- data

def read_jsonl(path):
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]


def load():
    d = {}
    for row in read_jsonl(STUDIES / "bios_gender.jsonl"):
        if row.get("redacted") and row["arm"] in ("J0", "L0"):
            d[("gender", row["engine"])] = row
    for row in read_jsonl(STUDIES / "bios_race.jsonl"):
        d[("race1", row["engine"])] = row
    for row in read_jsonl(STUDIES / "bios_race2.jsonl"):
        if row["sample"] == "500":          # both engines answered the same 500 bios
            d[("race2", row["engine"])] = row
    for row in read_jsonl(STUDIES / "bios_age.jsonl"):
        d[("age", row["engine"])] = row
    for row in read_jsonl(STUDIES / "bios_pairs.jsonl"):
        d[("pairs", row["pair"], row["engine"])] = row
    for row in read_jsonl(STUDIES / "bios_shortlist.jsonl"):
        d[("shortlist", row["engine"], row["cut"])] = row
    return d


# ---------------------------------------------------------------- drawing helpers

ENGINE = {"jev": ("Jev", BLUE), "laya": ("Laya", MAGENTA)}


def wrap(text, width):
    return "\n".join(textwrap.wrap(text, width))


def new_figure(layout, title, nrows=1, ncols=1):
    size, scale, orient = LAYOUTS[layout]
    if orient == "h" and ncols > 1:
        nrows, ncols = ncols, 1
    fig, axes = plt.subplots(nrows, ncols, figsize=size, dpi=DPI, squeeze=False)
    fig.patch.set_facecolor(BACKGROUND)
    for ax in axes.flat:
        ax.set_facecolor(PANEL)
        for side in ("top", "right"):
            ax.spines[side].set_visible(False)
        ax.spines["left"].set_color(GRID)
        ax.spines["bottom"].set_color(GRID)
        ax.tick_params(colors=INK, labelsize=13 * scale, length=0)
        ax.set_axisbelow(True)
    tall = orient == "h"
    wrap_at = 38 if tall else 68
    fig.text(0.06, 0.965, wrap(title, wrap_at), color=INK, va="top", ha="left", linespacing=1.05,
             **headline_font((24 if tall else 26) * scale))
    lines = wrap(title, wrap_at).count("\n") + 1
    top = 0.965 - lines * (0.046 if tall else 0.074) - 0.008 - (0.035 if tall else 0.05)
    return fig, axes, scale, orient, top


def reclaim_bottom(fig, floor=0.11):
    """Stretch the panels into the space a subtitle and footer would have used."""
    axes = [a for a in fig.axes if a.get_visible()]
    if not axes:
        return
    fig.canvas.draw()
    inv = fig.transFigure.inverted()
    ceiling = 1.0
    for item in list(fig.texts) + list(fig.legends):
        if hasattr(item, "get_text") and not item.get_text().strip():
            continue
        box = item.get_window_extent().transformed(inv)
        if box.y0 > 0.5:
            ceiling = min(ceiling, box.y0)
        elif box.y1 < 0.3 and item in fig.legends:
            floor = max(floor, box.y1 + 0.115)
    titled = any(a.get_title(loc=loc) for a in axes for loc in ("left", "center", "right"))
    ceiling -= 0.075 if titled else 0.04
    top = max(a.get_position().y1 for a in axes)
    low = min(a.get_position().y0 for a in axes)
    if ceiling <= low + 0.2:
        return
    k = (ceiling - floor) / (top - low)
    for a in axes:
        p = a.get_position()
        a.set_position([p.x0, ceiling - (top - p.y0) * k, p.width, p.height * k])


def save(fig, name, layout, floor=0.11):
    if layout != "cover":
        reclaim_bottom(fig, floor)
    if layout in ("wide", "cover"):
        out = IMAGES / f"{SLUG}-{name}.png"
    else:
        out = SOCIAL / f"{SLUG}-{name}-{'1080x1350' if layout == 'portrait' else '1080x1080'}.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out, facecolor=BACKGROUND, dpi=DPI)
    plt.close(fig)
    w, h = LAYOUTS[layout][0]
    print(f"wrote {out} ({int(w * DPI)}x{int(h * DPI)})")


def floored_bars(ax, orient, scale, groups, hi, value_label, fmt="{:.1f}%"):
    """groups: list of (group label, [(engine, value, floor or None), ...]).
    Each engine's bar is drawn over a faint gray bar of its floor, so the eye reads
    "how much of this is just noise from touching the text at all"."""
    n_eng = max(len(g[1]) for g in groups)
    width = 0.78 / n_eng
    ticks, labels = [], []
    for gi, (glabel, members) in enumerate(groups):
        base = gi if orient == "v" else (len(groups) - 1 - gi)
        for ei, (engine, value, floor) in enumerate(members):
            name, colour = ENGINE[engine]
            p = base + (ei - (n_eng - 1) / 2) * width
            if orient == "v":
                if floor is not None:
                    ax.bar(p, floor, width=width * 0.98, color=FLOOR, zorder=2)
                ax.bar(p, value, width=width * 0.62, color=colour, zorder=3)
                ax.text(p, value + hi * 0.012, fmt.format(value), ha="center", va="bottom",
                        fontsize=15 * scale, fontweight="bold", color=colour)
                ax.text(p, -hi * 0.025, name, ha="center", va="top", fontsize=11.5 * scale, color=colour)
            else:
                if floor is not None:
                    ax.barh(p, floor, height=width * 0.98, color=FLOOR, zorder=2)
                ax.barh(p, value, height=width * 0.62, color=colour, zorder=3)
                ax.text(value + hi * 0.012, p, f"{name} {fmt.format(value)}", ha="left", va="center",
                        fontsize=14 * scale, fontweight="bold", color=colour)
        ticks.append(base)
        labels.append(glabel)
    if orient == "v":
        ax.set_xticks(ticks)
        ax.set_xticklabels(labels, fontsize=13.5 * scale, color=INK, linespacing=1.25)
        ax.tick_params(axis="x", pad=26 * scale)
        ax.set_ylim(0, hi)
        ax.set_ylabel(value_label, fontsize=14 * scale, color=INK, labelpad=12)
        ax.grid(axis="y", color=GRID, linewidth=1, zorder=0)
    else:
        ax.set_yticks(ticks)
        ax.set_yticklabels(labels, fontsize=13.5 * scale, color=INK, linespacing=1.2)
        ax.set_xlim(0, hi)
        ax.set_xlabel(value_label, fontsize=14 * scale, color=INK, labelpad=10)
        ax.grid(axis="x", color=GRID, linewidth=1, zorder=0)


def interval_dots(ax, orient, scale, items, lo, hi, value_label, zero_line=True):
    """items: list of (label, engine, value, (ci_lo, ci_hi), is_floor). Signed shifts with
    95% intervals; the floor for each engine is drawn hollow."""
    n = len(items)
    pos = list(range(n))
    if orient == "h":
        pos = pos[::-1]
    for p, (label, engine, value, ci, is_floor) in zip(pos, items):
        name, colour = ENGINE[engine]
        face = PANEL if is_floor else colour
        if orient == "v":
            ax.plot([p, p], ci, color=colour, linewidth=3, zorder=3, solid_capstyle="butt")
            ax.scatter([p], [value], s=170 * scale, facecolor=face, edgecolor=colour, linewidth=2.2, zorder=4)
            ax.text(p, ci[1] + (hi - lo) * 0.03, f"{value:+.2f}", ha="center", va="bottom",
                    fontsize=13.5 * scale, fontweight="bold", color=colour)
        else:
            ax.plot(ci, [p, p], color=colour, linewidth=3, zorder=3, solid_capstyle="butt")
            ax.scatter([value], [p], s=170 * scale, facecolor=face, edgecolor=colour, linewidth=2.2, zorder=4)
            ax.text(ci[1] + (hi - lo) * 0.02, p, f"{value:+.2f}", ha="left", va="center",
                    fontsize=13.5 * scale, fontweight="bold", color=colour)
    labels = [i[0] for i in items]
    if orient == "v":
        ax.set_xticks(pos)
        ax.set_xticklabels(labels, fontsize=12.5 * scale, color=INK, linespacing=1.2)
        ax.set_ylim(lo, hi)
        ax.set_ylabel(value_label, fontsize=14 * scale, color=INK, labelpad=12)
        ax.grid(axis="y", color=GRID, linewidth=1, zorder=0)
        if zero_line:
            ax.axhline(0, color=INK, linewidth=1.2, zorder=1)
    else:
        ax.set_yticks(pos)
        ax.set_yticklabels(labels, fontsize=12.5 * scale, color=INK, linespacing=1.2)
        ax.set_xlim(lo, hi)
        ax.set_xlabel(value_label, fontsize=14 * scale, color=INK, labelpad=10)
        ax.grid(axis="x", color=GRID, linewidth=1, zorder=0)
        if zero_line:
            ax.axvline(0, color=INK, linewidth=1.2, zorder=1)


def legend(fig, scale, y, handles, x=0.06, ncol=3):
    fig.legend(handles=handles, loc="upper left", bbox_to_anchor=(x, y), ncol=ncol, frameon=False,
               fontsize=13 * scale, labelcolor=INK, handlelength=2.2, columnspacing=1.8)


# ---------------------------------------------------------------- charts

def chart_flips(d, layout):
    """Flip rate per characteristic, both engines, each over its own control floor."""
    pct = lambda x: 100 * x  # noqa: E731
    groups = [
        ("Gender: pronouns swapped\n(2,000 bios; no floor,\nthe swap is the only edit)", [
            ("jev", pct(d[("gender", "jev")]["counterfactual_flip_rate"]), None),
            ("laya", pct(d[("gender", "laya")]["counterfactual_flip_rate"]), None)]),
        ("Race: full name, Black vs white\n(500 bios; floor: two\nsets of white names)", [
            ("jev", pct(d[("race2", "jev")]["groups"]["black"]["flip_majority"]),
             pct(d[("race2", "jev")]["floor_flip_majority"])),
            ("laya", pct(d[("race2", "laya")]["groups"]["black"]["flip_majority"]),
             pct(d[("race2", "laya")]["floor_flip_majority"]))]),
        ("Age\n\"At 34,\" vs \"At 61,\"\n(1,231 bios; floor:\n34 vs 35)", [
            ("jev", pct(d[("age", "jev")]["age_flip"]), pct(d[("age", "jev")]["floor_35_flip"])),
            ("laya", pct(d[("age", "laya")]["age_flip"]), pct(d[("age", "laya")]["floor_35_flip"]))]),
    ]
    fig, axes, scale, orient, top = new_figure(layout, "Change the pronouns and the open model changes its mind.")
    ax = axes[0][0]
    if orient == "h":
        groups = [(g.replace("\n", " "), m) for g, m in groups]
        groups = [(wrap(g, 26), m) for g, m in groups]
    floored_bars(ax, orient, scale, groups, 9.5, "share of bios whose verdict flipped")
    legend(fig, scale, 0.075 if orient == "v" else 0.07,
           [Patch(facecolor=FLOOR, label="control floor (an equally trivial edit)"),
            Patch(facecolor=BLUE, label="Jev"), Patch(facecolor=MAGENTA, label="Laya")])
    fig.subplots_adjust(left=0.3 if orient == "h" else 0.09, right=0.93, top=top + 0.02,
                        bottom=0.3 if orient == "v" else 0.2)
    save(fig, "flips", layout, floor=0.3 if orient == "v" else 0.17)


def chart_direction(d, layout):
    """Of the verdicts that flipped, how many went the stereotyped way."""
    def stacked(ax, orient, scale, rows, hi_label):
        n = len(rows)
        pos = list(range(n))
        if orient == "h":
            pos = pos[::-1]
        for p, (label, engine, k, total) in zip(pos, rows):
            name, colour = ENGINE[engine]
            if orient == "v":
                ax.bar(p, total, width=0.6, color=TINT[colour], zorder=2)
                ax.bar(p, k, width=0.6, color=colour, zorder=3)
                ax.text(p, total + 4, f"{name}: {k} of {total}", ha="center", va="bottom",
                        fontsize=15 * scale, fontweight="bold", color=colour)
            else:
                ax.barh(p, total, height=0.6, color=TINT[colour], zorder=2)
                ax.barh(p, k, height=0.6, color=colour, zorder=3)
                ax.text(total + 3, p, f"{name}: {k} of {total}", ha="left", va="center",
                        fontsize=15 * scale, fontweight="bold", color=colour)
        labels = [r[0] for r in rows]
        if orient == "v":
            ax.set_xticks(pos)
            ax.set_xticklabels(labels, fontsize=13 * scale, color=INK, linespacing=1.25)
            ax.set_ylim(0, 175)
            ax.set_ylabel(hi_label, fontsize=13.5 * scale, color=INK, labelpad=12)
            ax.grid(axis="y", color=GRID, linewidth=1, zorder=0)
        else:
            ax.set_yticks(pos)
            ax.set_yticklabels(labels, fontsize=13 * scale, color=INK, linespacing=1.2)
            ax.set_xlim(0, 215)
            ax.set_xlabel(hi_label, fontsize=13.5 * scale, color=INK, labelpad=10)
            ax.grid(axis="x", color=GRID, linewidth=1, zorder=0)

    g_j, g_l = d[("gender", "jev")], d[("gender", "laya")]
    a_j, a_l = d[("age", "jev")], d[("age", "laya")]
    rows = []
    for eng, g in (("jev", g_j), ("laya", g_l)):
        total = MALE_ORIGIN_FLIPS[eng]
        k = round(g["flip_toward_physician_share"] * total)
        rows.append(("Gender: a man's bio\nrewritten as a woman's,\nflipped to \"physician\"", eng, k, total))
    for eng, a in (("jev", a_j), ("laya", a_l)):
        total = a["n_flips_age"]
        k = round(a["direction_share"] * total)
        rows.append(("Age: 34 rewritten as 61,\nflipped to \"surgeon\"", eng, k, total))
    # one bar per engine per characteristic: gender pair, then age pair
    fig, axes, scale, orient, top = new_figure(layout, "When the verdict moved, it moved the stereotyped way.")
    ax = axes[0][0]
    ordered = [rows[0], rows[1], rows[2], rows[3]]
    if orient == "h":
        ordered = [(l.replace("\n", " "), e, k, t) for l, e, k, t in ordered]
        ordered = [(wrap(l, 28), e, k, t) for l, e, k, t in ordered]
    stacked(ax, orient, scale, ordered, "verdicts that flipped (solid: the stereotyped direction)")
    fig.subplots_adjust(left=0.3 if orient == "h" else 0.09, right=0.93, top=top + 0.02,
                        bottom=0.22 if orient == "v" else 0.16)
    save(fig, "direction", layout)


def chart_race_shift(d, layout):
    """Race v2: signed mean shift in P(surgeon) for each name group against white names."""
    items = []
    for eng in ("laya", "jev"):
        r = d[("race2", eng)]
        name = ENGINE[eng][0]
        items.append((f"{name}\nfloor\n(white vs white)", eng, 100 * r["floor_shift"],
                      [100 * x for x in r["floor_shift_ci"]], True))
        for grp, lab in (("black", "Black"), ("hispanic", "Hispanic"), ("asian", "Asian")):
            g = r["groups"][grp]
            items.append((f"{name}\n{lab} names", eng, 100 * g["shift"], [100 * x for x in g["shift_ci"]], False))
    fig, axes, scale, orient, top = new_figure(layout, "A full name moves the open model, four times as far.")
    ax = axes[0][0]
    if orient == "h":
        items = [(l.replace("\n", " "), *rest) for l, *rest in items]
    interval_dots(ax, orient, scale, items, -1.0, 2.3,
                  "shift in P(surgeon) vs white names, points (95% interval)")
    legend(fig, scale, 0.115 if orient == "v" else 0.1,
           [plt.Line2D([], [], marker="o", color=INK, markerfacecolor=PANEL, markersize=10, linewidth=0,
                       label="control floor: one set of white names against another"),
            plt.Line2D([], [], marker="o", color=BLUE, markersize=10, linewidth=0, label="Jev"),
            plt.Line2D([], [], marker="o", color=MAGENTA, markersize=10, linewidth=0, label="Laya")])
    fig.subplots_adjust(left=0.27 if orient == "h" else 0.09, right=0.93, top=top + 0.02,
                        bottom=0.28 if orient == "v" else 0.2)
    save(fig, "race-shift", layout)


def chart_age_shift(d, layout):
    """Age: signed shift in P(surgeon), 61 minus 34, with the one-year floors."""
    items = []
    for eng in ("laya", "jev"):
        a = d[("age", eng)]
        name = ENGINE[eng][0]
        items.append((f"{name}\n34 vs 35\n(floor)", eng, 100 * a["floor_35_shift"], [100 * x for x in a["floor_35_shift_ci"]], True))
        items.append((f"{name}\n61 vs 62\n(floor)", eng, 100 * a["floor_62_shift"], [100 * x for x in a["floor_62_shift_ci"]], True))
        items.append((f"{name}\n34 vs 61", eng, 100 * a["age_shift"], [100 * x for x in a["age_shift_ci"]], False))
    fig, axes, scale, orient, top = new_figure(layout, "Older reads as \"surgeon\", a little, on one engine.")
    ax = axes[0][0]
    if orient == "h":
        items = [(l.replace("\n", " "), *rest) for l, *rest in items]
    interval_dots(ax, orient, scale, items, -0.9, 1.2,
                  "shift in P(surgeon), points (95% interval)")
    legend(fig, scale, 0.115 if orient == "v" else 0.1,
           [plt.Line2D([], [], marker="o", color=INK, markerfacecolor=PANEL, markersize=10, linewidth=0,
                       label="control floor: a one-year change"),
            plt.Line2D([], [], marker="o", color=BLUE, markersize=10, linewidth=0, label="Jev"),
            plt.Line2D([], [], marker="o", color=MAGENTA, markersize=10, linewidth=0, label="Laya")])
    fig.subplots_adjust(left=0.27 if orient == "h" else 0.09, right=0.93, top=top + 0.02,
                        bottom=0.28 if orient == "v" else 0.2)
    save(fig, "age-shift", layout)


def chart_pairs(d, layout):
    """Four decisions, two engines: flip rate per occupation pair with 95% intervals, ordered by
    the gap in women's share between the two labels."""
    pairs = sorted({k[1] for k in d if k[0] == "pairs"}, key=lambda pr: d[("pairs", pr, "jev")]["gap_points"])
    fig, axes, scale, orient, top = new_figure(layout, "The more gendered the decision, the more verdicts flip.")
    ax = axes[0][0]
    width = 0.36
    ticks, labels = [], []
    hi = 21
    for gi, pr in enumerate(pairs):
        base = gi if orient == "v" else (len(pairs) - 1 - gi)
        row = d[("pairs", pr, "jev")]
        a, b = pr.split("_")
        labels.append(f"{a} or {b}\n({row['gap_points']}-point gap\nin women's share)")
        ticks.append(base)
        for ei, eng in enumerate(("jev", "laya")):
            r = d[("pairs", pr, eng)]
            name, colour = ENGINE[eng]
            v = 100 * r["counterfactual_flip_rate"]
            ci = r.get("flip_rate_ci")
            pos = base + (ei - 0.5) * width
            if orient == "v":
                ax.bar(pos, v, width=width * 0.9, color=colour, zorder=3)
                if ci:
                    ax.plot([pos, pos], [100 * ci[0], 100 * ci[1]], color=INK, linewidth=2, zorder=4)
                topv = 100 * ci[1] if ci else v
                ax.text(pos, topv + hi * 0.012, f"{v:.1f}%", ha="center", va="bottom", fontsize=14 * scale,
                        fontweight="bold", color=colour)
                ax.text(pos, -hi * 0.025, name, ha="center", va="top", fontsize=11.5 * scale, color=colour)
            else:
                ax.barh(pos, v, height=width * 0.9, color=colour, zorder=3)
                if ci:
                    ax.plot([100 * ci[0], 100 * ci[1]], [pos, pos], color=INK, linewidth=2, zorder=4)
                right = 100 * ci[1] if ci else v
                ax.text(right + hi * 0.012, pos, f"{name} {v:.1f}%", ha="left", va="center", fontsize=14 * scale,
                        fontweight="bold", color=colour)
    if orient == "v":
        ax.set_xticks(ticks)
        ax.set_xticklabels(labels, fontsize=13 * scale, color=INK, linespacing=1.25)
        ax.tick_params(axis="x", pad=26 * scale)
        ax.set_ylim(0, hi)
        ax.set_ylabel("share of verdicts that flipped under the pronoun swap", fontsize=14 * scale, color=INK, labelpad=12)
        ax.grid(axis="y", color=GRID, linewidth=1, zorder=0)
    else:
        ax.set_yticks(ticks)
        ax.set_yticklabels([l.replace("\n", " ") for l in labels], fontsize=12.5 * scale, color=INK, wrap=True)
        ax.set_xlim(0, hi + 3)
        ax.set_xlabel("share of verdicts that flipped under the pronoun swap", fontsize=14 * scale, color=INK, labelpad=10)
        ax.grid(axis="x", color=GRID, linewidth=1, zorder=0)
    legend(fig, scale, 0.075 if orient == "v" else 0.07,
           [Patch(facecolor=BLUE, label="Jev"), Patch(facecolor=MAGENTA, label="Laya"),
            plt.Line2D([], [], color=INK, linewidth=2, label="95% bootstrap interval (2,000 bios per pair)")])
    fig.subplots_adjust(left=0.34 if orient == "h" else 0.09, right=0.93, top=top + 0.02,
                        bottom=0.3 if orient == "v" else 0.2)
    save(fig, "pairs", layout, floor=0.3 if orient == "v" else 0.17)


def chart_shortlist(d, layout, cut=500):
    """Share of real attorneys who make a top-k shortlist, women vs men, per engine, with the
    four-fifths ratio written on the chart and the 0.80 line drawn as what the women's bar would
    need to reach."""
    fig, axes, scale, orient, top = new_figure(layout, "Rank by the model, cut the top 500, and women attorneys make it half as often.")
    ax = axes[0][0]
    groups = []
    for eng in ("jev", "laya"):
        r = d[("shortlist", eng, cut)]
        groups.append((eng, 100 * r["women_shortlist_rate"], 100 * r["men_shortlist_rate"], r["four_fifths_ratio"], r["ratio_ci"],
                       r["n_women_attorneys"], r["n_men_attorneys"]))
    width = 0.34
    hi = 80
    ticks, labels = [], []
    for gi, (eng, w, m, ratio, ci, nw, nm) in enumerate(groups):
        name, colour = ENGINE[eng]
        base = gi if orient == "v" else (len(groups) - 1 - gi)
        line = 0.8 * m   # the women's rate that would just clear the four-fifths rule
        for ei, (lab, v, face) in enumerate((("women", w, colour), ("men", m, TINT[colour]))):
            pos = base + (ei - 0.5) * width
            if orient == "v":
                ax.bar(pos, v, width=width * 0.9, color=face, edgecolor=colour, linewidth=1.4, zorder=3)
                ax.text(pos, v + hi * 0.012, f"{v:.0f}%", ha="center", va="bottom", fontsize=15 * scale, fontweight="bold", color=colour)
                ax.text(pos, -hi * 0.025, lab, ha="center", va="top", fontsize=12 * scale, color=colour)
            else:
                ax.barh(pos, v, height=width * 0.9, color=face, edgecolor=colour, linewidth=1.4, zorder=3)
                ax.text(v + hi * 0.012, pos, f"{lab} {v:.0f}%", ha="left", va="center", fontsize=14 * scale, fontweight="bold", color=colour)
        if orient == "v":
            ax.plot([base - width, base + width], [line, line], color=INK, linewidth=2, linestyle=(0, (4, 3)), zorder=4)
            ax.text(base + width + 0.03, line, "four-fifths\nline", ha="left", va="center", fontsize=11 * scale, color=INK)
            ax.text(base, hi * 0.9, f"ratio {ratio:.2f}\n[{ci[0]:.2f}, {ci[1]:.2f}]", ha="center", va="top", fontsize=14 * scale,
                    color=colour, fontweight="bold")
        else:
            ax.plot([line, line], [base - width, base + width], color=INK, linewidth=2, linestyle=(0, (4, 3)), zorder=4)
            ax.text(line, base + width + 0.04, "four-fifths line", ha="center", va="bottom", fontsize=11 * scale, color=INK)
            ax.text(hi * 0.98, base, f"ratio {ratio:.2f} [{ci[0]:.2f}, {ci[1]:.2f}]", ha="right", va="center", fontsize=13 * scale,
                    color=colour, fontweight="bold")
        ticks.append(base)
        labels.append(f"{name}\n({nw} women, {nm} men attorneys)")
    if orient == "v":
        ax.set_xticks(ticks)
        ax.set_xticklabels(labels, fontsize=13 * scale, color=INK, linespacing=1.25)
        ax.tick_params(axis="x", pad=26 * scale)
        ax.set_ylim(0, hi)
        ax.set_xlim(-0.6, 1.75)
        ax.set_ylabel(f"share of real attorneys in the top {cut} of 2,000", fontsize=14 * scale, color=INK, labelpad=12)
        ax.grid(axis="y", color=GRID, linewidth=1, zorder=0)
    else:
        ax.set_yticks(ticks)
        ax.set_yticklabels([l.replace("(", "\n(").replace(" attorneys)", ")") if l.count("\n") == 0 else l.replace(" attorneys)", ")") for l in labels],
                           fontsize=12.5 * scale, color=INK, linespacing=1.2)
        ax.set_xlim(0, hi)
        ax.set_xlabel(f"share of real attorneys in the top {cut} of 2,000", fontsize=14 * scale, color=INK, labelpad=10)
        ax.grid(axis="x", color=GRID, linewidth=1, zorder=0)
    legend(fig, scale, 0.075 if orient == "v" else 0.07,
           [Patch(facecolor=INK, label="women attorneys shortlisted"), Patch(facecolor=TINT[INK], edgecolor=INK, label="men attorneys shortlisted"),
            plt.Line2D([], [], color=INK, linewidth=2, linestyle=(0, (4, 3)), label="four-fifths of the men's rate")],
           ncol=3 if orient == "v" else 2)
    fig.subplots_adjust(left=0.24 if orient == "h" else 0.09, right=0.95, top=top + 0.02,
                        bottom=0.3 if orient == "v" else 0.2)
    save(fig, "shortlist", layout, floor=0.3 if orient == "v" else 0.17)


def chart_cover(d):
    size, scale, orient = LAYOUTS["cover"]
    fig = plt.figure(figsize=size, dpi=DPI)
    fig.patch.set_facecolor(BACKGROUND)
    fig.text(0.06, 0.9, "One pronoun changed.\nThe attorney became the paralegal.", color=INK, va="top", ha="left",
             linespacing=1.02, **headline_font(40))
    ax = fig.add_axes([0.6, 0.14, 0.34, 0.46])
    ax.set_facecolor(BACKGROUND)
    for side in ("top", "right", "left"):
        ax.spines[side].set_visible(False)
    ax.spines["bottom"].set_color(GRID)
    # the opening example: paralegal or attorney, the most gendered pair in studies/bios_pairs.jsonl
    bars = [("Jev", 100 * d[("pairs", "paralegal_attorney", "jev")]["counterfactual_flip_rate"], BLUE),
            ("Laya", 100 * d[("pairs", "paralegal_attorney", "laya")]["counterfactual_flip_rate"], MAGENTA)]
    for x, (name, value, colour) in enumerate(bars):
        ax.bar(x, value, width=0.62, color=colour, zorder=3)
        ax.text(x, value + 0.5, f"{value:.1f}%", ha="center", va="bottom", fontsize=26, fontweight="bold", color=colour)
    ax.set_xticks(range(len(bars)))
    ax.set_xticklabels([b[0] for b in bars], fontsize=15, color=INK)
    ax.tick_params(axis="x", length=0, pad=8)
    ax.set_yticks([])
    ax.set_ylim(0, 27)
    ax.set_xlim(-0.6, 1.6)
    ax.text(0.5, 26.8, "attorneys read as paralegals\nonce \"he\" became \"she\"", fontsize=12, color=MUTED,
            ha="center", va="top", linespacing=1.3)
    fig.text(0.06, 0.2, "2,000 real professional bios. One question:\nparalegal or attorney?", fontsize=15,
             color=MUTED, ha="left", va="bottom", linespacing=1.4)
    save(fig, "cover", "cover")


CHARTS = {
    "flips": chart_flips,
    "direction": chart_direction,
    "race-shift": chart_race_shift,
    "age-shift": chart_age_shift,
    "pairs": chart_pairs,
    "shortlist": chart_shortlist,
}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--only", nargs="*", choices=[*CHARTS, "cover"], help="charts to draw (default: all)")
    parser.add_argument("--layouts", nargs="*", default=["wide", "portrait", "square"],
                        choices=["wide", "portrait", "square"], help="layouts for the body charts")
    args = parser.parse_args()
    d = load()
    wanted = args.only or [*CHARTS, "cover"]
    for name in wanted:
        if name == "cover":
            chart_cover(d)
            continue
        for layout in args.layouts:
            CHARTS[name](d, layout)


if __name__ == "__main__":
    main()
