# Midjourney prompts — AI-economics set + Cybernetic Development

Six images. Every prompt already carries `--p m7356469336623546368`.

**Run these first.** They are the long pole: generation is async, selection is
human, and re-rolls are likely. The code-generated visuals are deterministic and
can be produced in parallel while these render.

**Order matters for #1 only.** The Cybernetic Development hero is the social card
for the article the new homepage links to from both the hero and the approach CTA,
and it is the last thing gating that merge. Everything after it is unordered.

---

## The house character

Five of these six use the recurring Anthus robot. Reference images already in repo:

- `src/blog/images/give-an-agent-a-tool.png` — the canonical shot. Small white
  ceramic robot, glowing magenta ring eyes, chrome accents, warm shallow-focus
  setting. **Use this as `--sref` / image prompt on every robot shot** so the
  character stays consistent across the set.
- `src/images/serverless-ai-software-solutions.png` — homepage hero, same character.

Keep the robot **friendly** in all of them, including the security ones. The
unease in this set is supposed to come from arithmetic and from objects, never
from menacing the character. That restraint is the point.

---

## 1. Cybernetic Development — hero  ← START HERE

`src/blog/images/cybernetic-development.png` · square · replaces a 6KB placeholder

The article's own etymology: *kybernētēs* is Greek for steersman. **Both** hands on
the wheel — the robot alone is the glass-cockpit failure the article warns about,
the human alone is the old world.

```
Photorealistic close shot of a polished wooden ship's wheel at sea. A human hand grips one spoke; the white ceramic hand of a small robot with glowing magenta eyes grips the adjacent spoke. Both steering together. Warm low sun, soft ocean bokeh behind, shallow depth of field, wheel and both hands sharp. Calm and purposeful, not tense. --ar 1:1 --p m7356469336623546368
```

---

## 2. Bugonomics — hero

`src/blog/images/bugonomics-cheap-exploits-2026.png` · square

A deliberate **visual rhyme** with `give-an-agent-a-tool.png`: same robot, same
framing, same warm light — the tool is just a lockpick set instead of a fishing
rod. That one swap is the article's thesis. Keep it cheerful; breaking the rhyme
breaks the mechanism.

```
Photorealistic close shot of a small friendly white ceramic robot with glowing magenta eyes, standing on a pale countertop, holding an open lockpick set in one hand and a tension wrench in the other, examining them with interest. Warm domestic light, soft bokeh background, shallow depth of field, robot and picks sharp. Cheerful product-photo tone. --ar 1:1 --p m7356469336623546368
```

---

## 3. Bugonomics — trying every door

`src/blog/images/trying-every-door.png` · 3:2 · caption: *"What got cheap was not
breaking in. It was trying."*

Carries **volume, not menace**. It does not matter that almost every door is
locked — the arms are free.

```
Wide cinematic photograph looking down an impossibly long corridor lined on both sides with identical closed metal doors receding into darkness. At every single door an identical robotic arm grips the handle, all turning at once. Cold blue-grey light, hard shadows, deep one-point perspective, shallow depth of field at the far end. No people. 35mm, slight film grain, quietly menacing. --ar 3:2 --p m7356469336623546368
```

---

## 4. Cost collapse — the robot workstation army

`src/blog/images/robot-workstation-army.png` · 3:2

Lands on "the $20 that used to buy one assistant now buys a small team of them."

```
Wide cinematic photograph of a vast dim open-plan office that reads like a server hall. Endless identical rows of humanoid white robots seated at cheap matching developer workstations, each tethered to its desk by a thick braided cable. Monitors glow with dense code. Cool teal and green light, deep shadows, shallow depth of field falling into darkness at the back. Industrial scale, quietly dystopian, no visible humans. 35mm, slight film grain. --ar 3:2 --p m7356469336623546368
```

---

## 5. Cybernetic Development — the glass cockpit

`src/blog/images/glass-cockpit.png` · 3:2

**Hands off the yoke is the entire shot.** The automation is working perfectly and
the human has drifted out of the loop. "Airplane" alone does not carry the idea.

```
Cinematic night interior of a modern airliner glass cockpit, shot from behind and between the two seats. Six large flight displays glow softly in blue and green, every readout nominal. Both pilots' hands rest in their laps, well away from the yokes. No visible faces. Cool desaturated palette, deep shadows, shallow depth of field with instruments sharp and crew falling soft. Quiet, uneventful, faintly uneasy. 35mm, slight film grain. --ar 3:2 --p m7356469336623546368
```

---

## 6. Maximize value — the backlog quietly worked

`src/blog/images/the-backlog-worked.png` · 3:2

The chores that were never worth doing, getting done overnight. Warm, not
dystopian — this one is supposed to feel like relief.

```
Photorealistic dim back office at night, towering stacks of dusty paper trays and manila folders receding into shadow. A single small white robot with glowing magenta eyes methodically files one sheet at a time under a warm desk lamp. Everything outside the pool of lamplight falls into darkness. Patient, unglamorous, quietly satisfying. 35mm, shallow depth of field. --ar 3:2 --p m7356469336623546368
```

---

## After generation

1. Upscale the chosen variant; export at the size named per image above.
2. Drop into `src/blog/images/` at the exact filename given.
3. Delete the matching `<div className="blockDiagram visualPlaceholder">` block
   and its `{/* VISUAL … */}` comment from the article.
4. For heroes, confirm the alt text on the `<BlogImage>` describes the real image —
   several currently describe art that was never made.
