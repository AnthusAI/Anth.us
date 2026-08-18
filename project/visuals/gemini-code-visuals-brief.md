# Brief: code-generated visuals for four articles

Sixteen visuals that are produced by code, not by an image model. Repo:
`/Users/ryan/Projects/anth.us`, branch `feature/homepage-2026-positioning`.

Six Midjourney images are being generated in parallel; ignore those. Anything
whose placeholder title says `photoreal` or `robot concept scene` is not yours.

---

## Ground rules

**Every one of these already has a written brief in the article.** Find the
`{/* VISUAL … */}` comment immediately above each
`<div className="blockDiagram visualPlaceholder">` block. It states the structure,
what the figure must make obvious, and the alt text. Several also state what to
*resist* adding. Follow them; do not redesign from the placeholder summary alone.

**Prefer HTML.** House style is inline HTML diagrams using the existing class
vocabulary, not generated images — they theme with the site, stay legible in dark
mode, need no build step, and reflow on mobile. Reference implementation:
`src/blog/how-ai-agents-do-things.mdx`. Available classes, all defined in
`src/components/layout.scss`:

- `blockDiagram`, with `request` / `response` variants
- `container technologyStack` for stacked layers, `row` for side-by-side
- `messages` + `role` + `content` for conversation transcripts
- `title` for a label bar

**Do not touch `.visualPlaceholder` styling** or the `table:not(.data):not(.messages)`
scoping in `layout.scss` — both were fixed recently and are load-bearing.

**Charts** go in `scripts/generate-<name>.py`, matplotlib, writing to
`src/blog/images/<name>.png`. Follow the existing scripts, which are the style
reference: white ground, log scale where rates are the subject, red dashed
annotation for the "here's the point" marker, and **measured text widths rather
than estimated ones** when placing labels — see the label-packing logic in
`scripts/generate-value-over-time.py`, which exists because estimated widths
produced overlapping labels.

**Illustrative figures must say so on the figure.** `generate-break-even-crossing.py`
carries `"Illustrative ordering, not measured adoption dates."` Match that wherever
numbers are chosen rather than measured.

**When you finish one:** replace the placeholder div and its comment with the real
diagram (HTML) or a `<BlogImage>` (chart). Do not leave both.

---

## Do these first

**1. `verification-debt.png`** — cybernetic-development, matplotlib, 1200×630.
The strongest passage in the article ("you cannot afford a 100x generator with a
1x verifier") is carried entirely by prose. Three curves on a log scale:
generation capacity exponential, manual verification flat, automated verification
tracking generation. Shade the gap, label it verification debt, annotate the
crossing as "you are now shipping code nobody has read." Mark illustrative.

**2. Engine / Governor loop** — cybernetic-development, HTML, no asset.
The article's central metaphor, currently prose-only; everything downstream
elaborates it. Two boxes, two arrows, closed loop. The brief explicitly warns
against expanding this into the full SDLC — its value is being the simplest
possible statement of the thesis.

**3. `agentjacking-chain.svg`** — bugonomics, PlantUML. Marked *highest priority*
in its own brief. Toolchain already exists: `src/blog/diagrams/*.puml` → `.svg`.
A concrete ordered multi-actor attack flow is the single highest-value visual in
that article.

---

## The rest

**Cybernetic Development** (`src/blog/cybernetic-development.mdx`)
- System 1 / System 2 mapping — HTML two-panel. Tint the two columns and reuse
  those tints for Engine and Governor elsewhere so the colour coding carries.
- Five-governors Swiss cheese — HTML or SVG. Populated with *this article's* five
  layers, not the generic textbook version; the labels are the value. One arrow
  threading all five gaps.
- Abstraction spectrum — HTML `technologyStack`. Three tiers with opposing
  human-legible / agent-manipulable gauges. The inversion is the point.
- Pair programming vs. delegation — HTML two-panel. 1:1 against 1:N through a task
  system. Keep the human the same size in both panels.

**Cost collapse** (`src/blog/ai-coding-cost-collapse-2026.mdx`)
- Hero chart treatment — 1200×630 render of `price-of-fixed-capability`, title
  baked in, detail thinned to survive thumbnailing. Script already exists; do not
  re-derive the data. The in-article copy stays.
- The fast tier inverted — HTML `comparisonChart`. 2025 vs 2026 tiers.
- The pricey context snowball — HTML `blockDiagram`. Turns 1/10/25/50 with
  proportional bars, ending on the 25:1 input:output ratio.

**Bugonomics** (`src/blog/bugonomics-cheap-exploits-2026.mdx`)
- `same-curve-both-directions.png` — matplotlib. Cost to build and cost to break,
  same axes, same downward slope. Literally draws "the same curve."
- `500k-to-14-funnel.png` — matplotlib or HTML. 500,000 findings → 14 exploitable
  endpoints, annotated ~35,000:1.
- LiL taxonomy — HTML three-panel. Marked optional in its brief.

**Maximize value** (`src/blog/maximize-value-not-intelligence.mdx`)
- Hero chart treatment — 1200×630 render of `value-frontier`. Thin the fourteen bar
  labels to the few that carry the story; **keep the Sol→Luna arrow and the 23×
  callout**, which is why the chart works as a card. Script exists.
- Routing loop — PlantUML activity diagram, plus an HTML `comparisonChart` for the
  tiers. Both described in one placeholder.
- `cache-economics.png` — matplotlib, 1200×500, two panels. Fresh vs cached input
  ~10× apart, shown against the 25:1 ratio so it is clear caching hits the
  dominant term.

---

## Verify before handing back

```bash
npm start
```

- All four articles compile and render: `/blog/cybernetic-development/`,
  `/ai-coding-cost-collapse-2026/`, `/bugonomics-cheap-exploits-2026/`,
  `/maximize-value-not-intelligence/`
- No `{/* VISUAL … */}` prompt text leaks into rendered output.
- HTML diagrams are legible at 375px as well as 1280px, and do not introduce
  horizontal page scroll.
- Charts land at their stated dimensions and no label overlaps another. Check by
  looking at the PNG, not by trusting the script.
- Every replaced placeholder is gone — no orphan `.visualPlaceholder` divs, no
  duplicate figures.
