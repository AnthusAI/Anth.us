# Midjourney prompts — AI-economics set + Cybernetic Development

Five images remain. Every prompt carries `--profile pyq37xu`.

**Done already:** the Cybernetic Development hero (nested-control ship's wheel) is
installed at `src/blog/images/cybernetic-development.png`. The cost-collapse and
maximize-value heroes are no longer Midjourney jobs — both became matplotlib chart
treatments instead, since their articles' arguments are data trends, not scenes.

---

## The house character

Four of these five use the recurring Anthus robot. Reference image already in repo:

- `src/blog/images/give-an-agent-a-tool.png` — the canonical shot. Small white
  ceramic robot, glowing magenta ring eyes, chrome accents, warm shallow-focus
  setting. **Use this as `--sref` / image prompt on every robot shot** so the
  character stays consistent across the set.

Keep the robot **friendly** in all of them, including the security one. The unease
in this set is supposed to come from arithmetic and from objects, never from
menacing the character. That restraint is the point.

---

## 1. Cybernetic Development — the glass cockpit

`src/blog/images/glass-cockpit.png` · 3:2

No robot in this one. **Hands off the yoke is the entire shot.** The automation is
working perfectly and the human has drifted out of the loop.

```
Cinematic night interior of a modern airliner glass cockpit, shot from behind and between the two seats. Six large flight displays glow softly in blue and green, every readout nominal. Both pilots' hands rest in their laps, well away from the yokes. No visible faces. Cool desaturated palette, deep shadows, shallow depth of field with instruments sharp and crew falling soft. Quiet, uneventful, faintly uneasy. 35mm, slight film grain. --ar 3:2 --profile pyq37xu
```

---

## 2. Bugonomics — hero

`src/blog/images/bugonomics-cheap-exploits-2026.png` · square

A deliberate **visual rhyme** with `give-an-agent-a-tool.png`: same robot, same
framing, same warm light — the tool is just a lockpick set instead of a fishing
rod. That one swap is the article's thesis. Keep it cheerful; breaking the rhyme
breaks the mechanism.

```
Photorealistic close shot of a small friendly white ceramic robot with glowing magenta eyes, standing on a pale countertop, holding an open lockpick set in one hand and a tension wrench in the other, examining them with interest. Warm domestic light, soft bokeh background, shallow depth of field, robot and picks sharp. Cheerful product-photo tone. --ar 1:1 --profile pyq37xu
```

---

## 3. Bugonomics — trying every door

`src/blog/images/trying-every-door.png` · 3:2 · caption: *"What got cheap was not
breaking in. It was trying."*

**Revised** — the original "robotic arm gripping the handle" (no body) rendered
literally: arms growing out of the doors, which reads as broken, not uncanny.
Swapped to the full house robot standing at each door — an embodied figure the
model can actually render coherently at that repetition. Also dropped "quietly
menacing": house rule is the robot stays friendly even here. Carries **volume,
not menace** — it does not matter that almost every door is locked, there are as
many robots as there are doors.

```
Wide cinematic photograph looking down an impossibly long corridor lined on both sides with identical closed metal doors receding into darkness. At every single door stands an identical small white robot with glowing magenta eyes, each calmly reaching for its door handle. Cold blue-grey light, hard shadows, deep one-point perspective, shallow depth of field at the far end. No people. Orderly, patient, endless. 35mm, slight film grain. --ar 3:2 --profile pyq37xu
```

---

## 4. Cost collapse — the robot workstation army

`src/blog/images/robot-workstation-army.png` · 3:2

Lands on "the $20 that used to buy one assistant now buys a small team of them."

```
Wide cinematic photograph of a vast dim open-plan office that reads like a server hall. Endless identical rows of humanoid white robots seated at cheap matching developer workstations, each tethered to its desk by a thick braided cable. Monitors glow with dense code. Cool teal and green light, deep shadows, shallow depth of field falling into darkness at the back. Industrial scale, quietly dystopian, no visible humans. 35mm, slight film grain. --ar 3:2 --profile pyq37xu
```

---

## 5. Maximize value — the backlog quietly worked

`src/blog/images/the-backlog-worked.png` · 3:2

The chores that were never worth doing, getting done overnight. Warm, not
dystopian — this one is supposed to feel like relief.

```
Photorealistic dim back office at night, towering stacks of dusty paper trays and manila folders receding into shadow. A single small white robot with glowing magenta eyes methodically files one sheet at a time under a warm desk lamp. Everything outside the pool of lamplight falls into darkness. Patient, unglamorous, quietly satisfying. 35mm, shallow depth of field. --ar 3:2 --profile pyq37xu
```

---

## After generation

1. Upscale the chosen variant; export at the size named per image above.
2. Drop into `src/blog/images/` at the exact filename given.
3. Delete the matching `<div className="blockDiagram visualPlaceholder">` block
   and its `{/* VISUAL … */}` comment from the article.
4. For the hero (bugonomics), confirm the `<BlogImage>` alt text describes the
   real image — it may still describe a placeholder.
