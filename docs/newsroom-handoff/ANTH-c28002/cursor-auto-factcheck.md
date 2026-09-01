# Fact-check pack: Auto vs pin Composer 2.5 vs Cursor Router

- **For:** Anth.us collection of specific tokenmaxxing *instructions* (settings, what to pin, what to turn off). Never Use Fast is one technique in that list, not a piece to avoid repeating.
- **Date fetched:** 2026-09-01 (America/New_York)
- **Prior pack:** `/workspace/research-tokenmaxxing-2026-09-01.md` (cites already fetched; every Cursor URL below was re-fetched live today)
- **Rule:** No invented prices or quotes. Every dollar figure has a source URL + fetch date.

---

## Situation

Auto used to be the thrift default in Cursor. From June 2025 until each seat’s next renewal after 2025-09-15, Cursor itself said Auto was **unlimited for individuals**. Guides still tell people to leave Auto on to save money. That advice is now stale in two different ways, and they are not the same product.

**Auto** is a row in the IDE model picker. Hobby, Pro, Pro+, and Ultra still have it. India Start does not. **Cursor Router** is the 2026-07-22 Teams/Enterprise product that sits *behind* Auto when it is enabled: Cost / Balance / Intelligence, per-request classification, admin lock. It is **not** on individual plans. It is **not** Enterprise-only either: Teams gets it **on by default**; Enterprise gets it **off by default** and an admin must opt in.

Current billing (live 2026-09-01 docs): “All Auto modes bill at the list price of the model each request is routed to.” Help’s example is Opus 5. Composer 2.5 Standard is $0.50 / $2.50 per 1M in/out. Grok 4.6 is $2 / $6. Opus 5 is $5 / $25. Composer 2.5 Fast is a *different knob* at $3 / $15 (6× Standard). The cheapest *list* third-party row on the same page is GPT-5.6 Luna at $0.20 / $1.20, but Luna draws the smaller Other Models pool; Composer/Grok draw the larger Cursor Models pool.

So the instruction the collection can actually ship is not “never Auto.” It is: **pin Composer 2.5 Standard, turn Fast off, do not leave Auto to shop models for you, and if you are on Teams, treat Router Balance/Intelligence as a spend risk unless you can name why you want it.** Fast is still a technique in the same list (see Never Use Fast). Router-vs-Auto is the new one.

---

## Claim 1 — Auto used to be (or was widely described as) the cheapest way to code in Cursor

**Verdict: TRUE**

Cursor’s own history, plus a large residue of “just use Auto” blogs, all say Auto was the cheap / unlimited path. The cheapness was a *billing rule* (unlimited, then flat Auto Cost), not “Auto always picked the cheapest model.”

### Official history

Cursor blog **Updates to Teams and Auto** (fetched 2026-09-01, https://cursor.com/blog/aug-2025-pricing):

> “Second, we’re updating our limits on ‘Auto’ for individuals. At your next billing renewal after September 15, Auto will contribute to your included monthly usage at competitive token rates. From December 2023 to June 2025, Auto was priced at the same cost as other premium models. Since June 2025, Auto has been unlimited for individuals and priced at the same cost as other premium models for teams.”

Timeline that sentence locks in:

| Period | Auto billing (Cursor’s words) |
|---|---|
| Dec 2023 – Jun 2025 | Same cost as other premium models |
| Jun 2025 – next renewal after 2025-09-15 | **Unlimited for individuals**; teams still paid premium-model rates |
| After that renewal | Consumes included monthly usage at “competitive token rates” |
| 2026-07-22 | Cursor Router relaunches Auto as Cost / Balance / Intelligence for Teams + Enterprise |

Forum users quoted that same paragraph when unlimited Auto went away (https://forum.cursor.com/t/unlimited-usage-for-auto-will-basically-gone/130277, 2025-08-17; https://forum.cursor.com/t/cursor-pro-auto-mode-unlimited-usage-no-longer-feels-unlimited/148050).

### “Use Auto to save money” culture

These are independent of Anth.us. Treat blog dollar figures as *what people were told*, not as 2026-09-01 list prices.

- Forum user **shuvo**, 2026-07-23, on the Router launch thread (https://forum.cursor.com/t/introducing-cursor-router/166386): “Cursor’s ‘Auto’, to me, used to mean ‘cheap flat rate, don’t worry which model actually ran behind the scenes’… Historically, ‘Auto’ meant a predictable, cheap flat rate regardless of the underlying model. Operating under that assumption today (July 22, 2026) is a significant financial risk.”
- Cursor staff **deanrie** (CursorStaff), 2026-08-03, to a Pro Individual user (https://forum.cursor.com/t/cursor-auto-mode-in-2026-aug/167118): “If Auto ends up using a frontier model under the hood, like Grok 4.5, you still get charged the fixed Auto rate, not that model’s rate. That leads to two things: 1 Auto is often cheaper for many tasks than manually picking the same model…”
- Same staff, 2026-08-05: Auto Cost cache-read “$0.25/1M vs $0.50/1M” for Grok 4.5, so “Auto Cost is usually cheaper in practice” than pinning Grok. (That flat-rate claim was later walked back on 2026-08-26 when docs changed — see Claim 2.)
- Third-party residue still repeating the old rule on 2026-09-01 search: Finout (“Use Auto mode whenever possible… unlimited on paid plans”), AIToolsRecap (“Auto mode is unlimited… does NOT consume your credit pool”), CodePick (“Use Auto Mode — Let Cursor Pick the Cheapest Adequate Model”). Flexprice is more current: “Auto genuinely was unlimited… Cursor Router ended it.”

### What this does *not* say

“Cheapest” was relative to **manually picking a frontier model**, not relative to pinning Composer 2.5 Standard (which did not exist as a $0.50/$2.50 SKU until 2026-05-18). From Dec 2023–Jun 2025 Auto was *not* cheaper than named premium models; Cursor said it was priced the same.

---

## Claim 2 — Auto can NOW cost significantly more than the cheapest Cursor path

**Verdict: TRUE** (Teams/Enterprise Balance + Intelligence, and any Auto that bills at routed-model list). **MIXED** only on the leftover question of whether Pro Individual still has a hidden flat Auto-Cost rate — current docs say no.

### Current billing (live 2026-09-01)

https://cursor.com/docs/models-and-pricing, section **Auto modes**:

> “All Auto modes bill at the list price of the model each request is routed to. See Model pricing for per-model rates. Third-party models also incur the Cursor Token Rate.”

https://cursor.com/docs/cursor-router, **Pricing**:

> “All Auto modes bill at the list price of the model each request is routed to. Third-party models also incur the Cursor Token Rate.”
>
> “Until September 7, 2026, Enterprise Auto Cost pricing is set per million tokens, regardless of which model is used ($1.25/1M input and cache write, $0.25/1M cache read, $6.00/1M output).”

https://cursor.com/help/account-and-billing/pricing.md, **What is Auto?**:

> “Auto balances intelligence, cost, and reliability through Cursor Router. All Auto modes bill at the list price of the model each request is routed to. For example, if your request is routed to Opus 5, you are billed at Opus 5 pricing for that request.”

That example is the whole claim. Opus 5 list today is **$5 / $25** per 1M in/out. Composer 2.5 Standard is **$0.50 / $2.50**. Same page. Auto *can* cost 10× the cheapest first-party pin on both axes.

https://cursor.com/help/models-and-usage/usage-limits:

> “Cursor Router requests are billed at the routed model's cost and can draw from both the Cursor Models pool and the third-party Other Models pool, depending on which model handles the request.”
>
> “When included usage runs out, on-demand charges apply if you have on-demand usage enabled.”

https://cursor.com/docs/models-and-pricing, **What happens when I reach my limit?**:

> “Add on-demand usage: Continue at the same API rates with pay-as-you-go billing”
>
> “On-demand usage is billed monthly at the same rates. Requests are never downgraded in quality or speed.”

So: included usage is a pool, not a discount. Auto burns the pool at the routed model’s list. Then on-demand, if enabled, is the same list. Auto is not a cheaper SKU anymore except the **legacy Enterprise Auto Cost** flat $1.25/$6, which expires **2026-09-07** (six days after this pack). Even that flat rate is *more expensive* than Composer 2.5 Standard ($0.50/$2.50).

### Cheapest Cursor path vs Auto, list prices fetched 2026-09-01

| Path | Input / 1M | Output / 1M | Pool | vs Composer Standard |
|---|---|---|---|---|
| Composer 2.5 Standard (pin) | $0.50 | $2.50 | Cursor Models (larger) | 1× |
| GPT-5.6 Luna (pin) | $0.20 | $1.20 | Other Models (smaller) | cheaper *list*, smaller included bucket |
| Composer 2.5 Fast | $3.00 | $15.00 | Cursor Models | 6× — this is Fast, not Auto |
| Grok 4.6 | $2.00 | $6.00 | Cursor Models | 4× in / 2.4× out |
| Auto → Opus 5 (docs’ own example) | $5.00 | $25.00 | Other Models + $0.25/M CTR on Teams/Ent | 10× / 10× |
| Auto → GPT-5.6 Sol | $4.00 | $20.00 | Other Models + CTR | 8× / 8× |
| Auto → Claude Fable 5 | $10.00 | $50.00 | Other Models + CTR | 20× / 20× |
| Legacy Enterprise Auto Cost (until 2026-09-07) | $1.25 | $6.00 | n/a (flat) | 2.5× / 2.4× vs Composer Standard |

Source for every row: https://cursor.com/docs/models-and-pricing (2026-09-01). CTR = Cursor Token Rate $0.25/M, Teams/Enterprise only, not on Grok/Composer.

Forum confirmation that this already hit wallets: **shuvo**, 2026-07-23, https://forum.cursor.com/t/introducing-cursor-router/166386 — Auto “migrated to Auto Balance” and “immediately started to draw frontier rates from my API tiers”; “GPT-5.6 Sol (Auto Balanced) billed to your account under On-Demand.”

### Individual-plan caveat (why Mixed is in the parenthetical)

CursorStaff **deanrie**, 2026-08-03: Pro Individual Auto is “classic Auto… Auto Cost… pricing is a flat per token rate.” Same person, **2026-08-26**, after the user pasted the new list-price docs:

> “the current docs describe Auto as billing the request at the list price of the model it actually routed to, so Auto is not a single fixed rate. The exact mechanics for Individual during the transition period (which pool Auto charges, and what happens when one pool runs out…) aren’t clearly spelled out in the docs, so I’ll check with the team and get back to you with specifics.”

No public follow-up was on that thread as of this fetch. Live docs on 2026-09-01 do **not** publish a flat Auto rate except Legacy Enterprise Auto. Do not write “Pro Auto is still $1.25/$6.” Write: **docs now say list-of-routed-model; staff has not republished a Pro Individual exception.**

---

## Claim 3 — Pinning Composer 2.5 is cheaper than Auto because Auto uses more expensive models

**Verdict: MIXED** — pinning Composer 2.5 **Standard** is cheaper than Auto *whenever Auto routes off Composer Standard*. Cursor does not publish the Auto pool, so “because Auto uses more expensive models” is a tendency, not a guarantee. Composer 2.5 **Fast** is a different knob ($3/$15) and must not be confused with Auto.

### Composer 2.5 list, re-verified 2026-09-01

Changelog **2026-05-18**, https://cursor.com/changelog/composer-2-5:

> “Standard: $0.50/M input, $2.50/M output tokens”
> “Fast (default): $3.00/M input, $15.00/M output tokens”

Docs **Composer 2.5**, https://cursor.com/docs/models/cursor-composer-2-5 (2026-09-01):

> “A faster variant with the same intelligence is also available at $3/M input and $15/M output tokens. Fast is the default in the product…”
> “Default fast variant for interactive sessions; standard tier further optimized for cost per token.”

Pricing table, https://cursor.com/docs/models-and-pricing (2026-09-01): Composer 2.5 **$0.5 / $0.2 cache read / $2.5**; Composer 2.5 (Fast) **$3 / $0.5 cache read / $15**. Matches the changelog. Matches Never Use Fast’s 2026-08-29 table.

6× is Fast. Auto is not Fast. Fast can *also* be selected by Auto (undocumented; staff said they would confirm — see Q4 below).

### Which models does Auto actually route to?

Cursor will not name the pool.

- Docs, https://cursor.com/docs/cursor-router: “You can't hand-pick which model handles a request, and the model pool changes over time as new models ship.” Grok 4.5 “is a requirement for the router to work” on Enterprise (blocked-model fallback). Blog, https://cursor.com/blog/router: “Simple work goes to the most price-efficient models… more complex, long-horizon problems go to frontier reasoning models.” Composer is named as “the everyday path.” Comparisons in the same post are vs **Fable**, **Opus 4.8**, **GPT-5.6 Sol**.
- Staff **Colin**, 2026-07-24, https://forum.cursor.com/t/introducing-cursor-router/166386: “Auto Cost draws from your first-party quota. Auto Intelligence and Auto Balance bill against whichever pool the selected underlying model belongs to, and you’ll be able to see which model that is!”
- Staff **deanrie**, 2026-07-30, https://forum.cursor.com/t/which-models-are-behind-cursor-auto-mode/167010: “We don’t keep a separate public list of exactly which models are in Auto right now. The set is dynamic and depends on your plan and capacity.” Workaround: “skip Auto and manually pick a specific model.”
- Anecdotes, not a catalog: staff 2026-08-05 said individual Auto “often routes to Grok 4.5 under the hood”; user G4Q4 2026-07-30 said Auto “route[s] virtually 100% of my requests to Composer 2.5”; same user previously saw Opus on hard tasks. Forum thread “Auto router broken, ONLY ever picks Grok 4.5” exists as a related link. None of these are an official pool.

If Auto bills at list:

- Route to Composer 2.5 Standard → **same price as pinning**.
- Route to Grok 4.6 → **4× input / 2.4× output**.
- Route to Opus 5 → **10× / 10×** (docs’ own example).
- Route to Composer 2.5 Fast → **6×**, and you did not toggle Fast.

So the instruction “pin Composer 2.5 Standard instead of Auto” is the right *default* because you cap the rate at $0.50/$2.50 and you stay in the larger Cursor Models pool. It is **not** true that Auto never uses Composer. It is true that Auto *can* (and, on Balance/Intelligence, is designed to) spend at Grok / Sol / Opus / Fable rates.

Staff **deanrie**, 2026-08-26, Q4 (Fast variants in Auto): “There’s no documented user toggle on Individual to block fast variants in Auto.” That is an independent reason to pin: pinning is how you turn Fast off.

---

## Claim 4 — A normal (non-enterprise) account does NOT have Cursor’s model router feature

**Verdict: MIXED — Ryan is right about individuals, wrong about “enterprise-only.”**

Split the product:

| Thing | What it is | Who has it (live 2026-09-01) |
|---|---|---|
| **(a) Auto** | A model in the IDE picker | Hobby (limited), Pro / Pro+ / Ultra. **Not** Start. Teams/Enterprise also have the picker row. |
| **(b) Cursor Router** | Cost / Balance / Intelligence classifier behind Auto, plus admin controls | **Teams** (on by default) and **Enterprise** (off by default). **Not** Hobby / Pro / Pro+ / Ultra. |

Ryan’s belief “router is enterprise-only and individual accounts lack it” is **false on the first half, true on the second.** Teams *is* the default-on Router plan. Individuals lack Router but still see **Auto**.

### Official quotes

https://cursor.com/docs/cursor-router (fetched 2026-09-01):

> “Cursor Router is currently only available on Teams and Enterprise plans.”
>
> “Enterprise teams must enable the router manually as it's off by default.”

https://cursor.com/changelog/router, 2026-07-22:

> “Auto mode is now powered by Cursor Router.”
> “It is on by default for Teams plans. Enterprise admins can enable it from the dashboard.”

https://cursor.com/blog/router:

> “Today we're launching Cursor Router, our intelligent model router for teams and enterprises.”
> “Cursor Router is available today for Teams and Enterprise plans across desktop, web, iOS, CLI, and our SDK.”

Staff **Colin** (CursorStaff), 2026-07-24, to a user who could not see Router in the IDE (https://forum.cursor.com/t/introducing-cursor-router/166386 post 14):

> “Cursor Router is currently not available on individual plans!”

Staff **deanrie**, 2026-08-26 (https://forum.cursor.com/t/cursor-auto-mode-in-2026-aug/167118):

> “These modes are part of Cursor Router, and Router is currently on Teams and Enterprise. Individual plans (Hobby, Pro, Pro+, Ultra) will get it later, so you won’t see the mode picker in your UI yet.”

Help page is slightly stale in tense but agrees on scope (https://cursor.com/help/account-and-billing/pricing.md):

> “Cursor Router will launch for Teams and Enterprise plans. Individual plans (Hobby, Pro, Pro+, Ultra) will receive this update a few months after launch. Enterprise teams start with Cursor Router off; an admin must opt in.”

Feature request still open 2026-08-26: https://forum.cursor.com/t/bring-cursor-router-to-individual-plans-pro-pro-ultra/169498 — “as an Individual plan user, I can read about Router but cannot use or configure it.”

### What each individual user actually sees

- **Hobby:** Auto is available with limited Agent usage. Help: “You can use Agent, Chat, and Tab completions with the Auto model.” No Router modes. (https://cursor.com/help/account-and-billing/pricing.md)
- **Start (India, ₹649/mo):** **No Auto.** Docs: “Start does not include the Other Models pool, on-demand usage, Bugbot, Auto, Automations, or the Cursor SDK.” Fast is already off (cannot enable). Pin Composer 2.5 / Grok from the Cursor Models pool. (https://cursor.com/docs/models-and-pricing)
- **Pro / Pro+ / Ultra:** Auto in the model picker. **No** Cost / Balance / Intelligence submenu. **No** team-dashboard Router toggle. **No** “show underlying model” admin control. Staff: this Auto is the old Cost-like behavior, now documented as list-price-of-routed-model. Token Rate $0.25/M does **not** apply (staff 2026-08-26: “only applies to Teams and Enterprise”).
- **Teams Standard/Premium:** Auto + Router. Router **on by default**. Balance is “the default mode for new users” (https://cursor.com/help/models-and-usage/cursor-router). Admins can impose Auto (soft or hard; both off by default).
- **Enterprise:** Auto + Router **available**, Router **off until an admin enables it**. Model allow/block for the router is Enterprise (Colin: Model Access Control). Legacy Auto Cost flat $1.25/$6 until 2026-09-07.

---

## Current price table (only numbers fetched 2026-09-01)

All $ are per million tokens. Source on every row.

| Model | Input | Cache write | Cache read | Output | Source |
|---|---|---|---|---|---|
| Composer 2.5 | $0.5 | — | $0.2 | $2.5 | https://cursor.com/docs/models-and-pricing |
| Composer 2.5 (Fast) | $3 | — | $0.5 | $15 | same; also https://cursor.com/changelog/composer-2-5 (2026-05-18, still matches) |
| Grok 4.6 | $2 | — | $0.5 | $6 | https://cursor.com/docs/models-and-pricing |
| Grok 4.6 (Fast) | $4 | — | $1 | $12 | same |
| Grok 4.5 | $2 | — | $0.5 | $6 | same |
| Grok 4.5 (Fast) | $4 | — | $1 | $18 | same |
| GPT-5.6 Luna | $0.2 | $0.25 | $0.02 | $1.2 | same |
| GPT-5.6 Terra | $2 | $2.5 | $0.2 | $12 | same |
| GPT-5.6 Sol | $4 | $5 | $0.4 | $20 | same |
| Claude 4.5 Haiku | not in the truncated “show more” extract this fetch; **do not invent**. Use Sonnet/Opus/Fable rows below. | | | | |
| Claude Sonnet 5 | $2 | $2.5 | $0.2 | $10 | same |
| Claude Opus 5 | $5 | $6.25 | $0.5 | $25 | same |
| Claude Fable 5 | $10 | $12.5 | $1 | $50 | same |
| Gemini 3.7 Flash | $0.75 | — | $0.075 | $3.5 | same |
| Gemini 3.1 Pro | $2 | — | $0.2 | $12 | same |
| Legacy Enterprise Auto (until 2026-09-07) | $1.25 | $1.25 | $0.25 | $6 | same + https://cursor.com/docs/cursor-router |
| Cursor Token Rate (Teams/Ent, third-party only) | $0.25 per million tokens on top of API | | | | https://cursor.com/docs/models-and-pricing |

Plan sticker prices, same fetch:

| Plan | Price | Source |
|---|---|---|
| Hobby | Free | https://cursor.com/pricing and help pricing.md |
| Start (India) | ₹649/mo tax inclusive | https://cursor.com/docs/models-and-pricing |
| Pro | $20/mo | same + https://cursor.com/pricing |
| Pro Plus / Pro+ | $60/mo | same |
| Ultra | $200/mo | same |
| Teams Standard | $40/user/mo | same |
| Teams Premium | $120/user/mo (5× Standard Agent limits) | same |
| Enterprise | Custom | https://cursor.com/pricing |

Included vs on-demand: both pools reset with the monthly billing cycle; unused does not roll over. On-demand is the same API rates, billed in arrears, if enabled. Start has **no** on-demand. (https://cursor.com/docs/models-and-pricing, https://cursor.com/help/models-and-usage/usage-limits, https://cursor.com/pricing)

Composer Fast vs Standard was independently measured by Artificial Analysis 2026-05-20 (~30% faster wall-clock, ~6× cost per task) — that is in the prior pack, not re-fetched as a price.

---

## Plan matrix: Hobby / Pro / Teams / Enterprise × Auto × Router × Fast

| Plan | Auto in picker? | Cursor Router (Cost/Balance/Intelligence)? | Router default | Fast available? | Notes + source |
|---|---|---|---|---|---|
| **Hobby** | Yes, limited Agent | **No** | n/a | Not documented as blocked; usage is limited | Help: Hobby uses “the Auto model.” Router: individual plans wait. https://cursor.com/help/account-and-billing/pricing.md ; https://cursor.com/docs/cursor-router |
| **Start (India)** | **No** | **No** | n/a | **No** — all Cursor Models run non-fast; cannot enable Fast | “Start does not include … Auto.” https://cursor.com/docs/models-and-pricing |
| **Pro / Pro+ / Ultra** | **Yes** | **No** | n/a | **Yes** (Composer Fast is product default) | Staff: no Optimize-For submenu. Auto bills per current docs at routed-model list. CTR does not apply. https://forum.cursor.com/t/cursor-auto-mode-in-2026-aug/167118 ; https://cursor.com/docs/models/cursor-composer-2-5 |
| **Teams Standard / Premium** | **Yes** | **Yes** | **On** | **Yes** | Changelog + docs. Balance is default mode for new users. Impose Auto soft/hard both default off. CTR $0.25/M on third-party, including Auto routes. https://cursor.com/changelog/router ; https://cursor.com/help/models-and-usage/cursor-router |
| **Enterprise** | **Yes** | **Yes** | **Off** (admin opt-in) | **Yes** | Model allow/block is Enterprise. Legacy Auto Cost $1.25/$6 until **2026-09-07**. Grok 4.5 required for router. https://cursor.com/docs/cursor-router |

---

## Specific instruction candidates (for the collection)

Harvested from Cursor docs where a click path exists; forum staff where docs are silent. Label the source so the writer does not present a forum hover-trick as a docs screenshot.

1. **Pin the model, do not leave Auto.** Model picker dropdown at the top of the chat input, or `Cmd /` / `Ctrl /` to cycle. Set the default in **Cursor Settings → Models**. (https://cursor.com/docs/agent/prompting — “Changing models”)
2. **Pin Composer 2.5 Standard, not Fast.** Fast is the product default and is the same weights at 6× price. Forum staff (not a docs screenshot): in the model picker, hover **Composer 2.5** → **Edit** → toggle Fast **off**. Community shortcut: `Ctrl + Alt + /` in agent chat. (https://forum.cursor.com/t/only-fast-variant-of-composer-2-5-is-available/160976, staff mohitjain 2026-05-19; https://cursor.com/docs/models/cursor-composer-2-5)
3. **Make Standard the default so new chats do not revert.** Never Use Fast already: **Settings → Models → Composer 2.5**, Standard variant, glance at the model chip before long runs. Official docs confirm Settings → Models is where the default lives; they do not print “Standard” as a labeled sub-page. (https://anth.us/blog/never-use-fast/ + https://cursor.com/docs/agent/prompting)
4. **Pin subagents off Fast in frontmatter.** Official: `model: composer-2.5[]` (empty brackets = standard, not fast) or `model: composer-2.5[fast=false]`. Do **not** use `inherit` if the parent is Auto or Fast. (https://cursor.com/docs/subagents)
5. **If you are on Teams and you see Auto:** open the model picker → Auto → **Optimize For**. Cost / Balance / Intelligence. Balance is the default for new users and is the one that billed people at Sol/Opus list. Prefer **Cost** or, better, leave Auto. (https://cursor.com/docs/cursor-router ; https://cursor.com/help/models-and-usage/cursor-router)
6. **Unhide the routed-model chip** (Teams/Enterprise admin): team dashboard → Cursor Router → **Underlying model** → display. Hidden is default. If the chip changes mid-session, you just paid a cache miss. (https://cursor.com/docs/cursor-router)
7. **Do not let an admin Impose Auto** unless you mean it. Soft = every new chat starts on Auto (members can switch). Hard = picker locked to Auto. Both default **off**. (https://cursor.com/docs/cursor-router)
8. **Enterprise admins: leave Router off** unless you have a reason. It is off by default. After **2026-09-07** even Cost mode loses the $1.25/$6 flat card and joins list-price billing. (https://cursor.com/docs/cursor-router)
9. **Start plan users:** you already cannot turn Fast on and you already have no Auto. Stay on Composer 2.5 / Grok in the Cursor Models pool. Do not upgrade “for Auto.” (https://cursor.com/docs/models-and-pricing)
10. **Never Use Fast remains a row in this list**, not a sequel: Fast ≠ Auto ≠ Flash. Buy Fast only when a named human is blocked. (https://anth.us/blog/never-use-fast/)

---

## Never Use Fast — our prior claim, independent Cursor sources

https://anth.us/blog/never-use-fast/ (fetched 2026-09-01). Still holds structurally. Independent Cursor sources for the bits this collection will reuse:

| Anth.us claim | Independent Cursor source 2026-09-01 |
|---|---|
| Composer Fast is 6× Standard | Changelog 2026-05-18 + pricing table today: $0.50/$2.50 vs $3/$15 |
| Fast is the default | Composer 2.5 docs: “Fast is the default in the product” |
| Same intelligence | Composer 2.5 docs: “A faster variant with the same intelligence” |
| Auto bills at list of routed model | Docs Auto modes + Router pricing + Help Opus-5 example |
| Pin Composer 2.5 or Luna instead of Auto | Pricing: Luna $0.20/$1.20 (Other Models); Composer $0.50/$2.50 (Cursor Models). Luna is cheaper *list*; Composer is the cheaper *included-quota* default. |
| Two Cursor pools | Docs usage pools: Cursor Models vs Other Models |
| Fast vs Auto are different knobs | Docs treat Fast as a per-model variant; Router/Auto as a picker row. Forum: Fast is a toggle on Composer, not a separate model. |

AA’s ~30% wall-clock / 6× cost (prior pack C3) is still the only independent speed figure; Cursor’s own Composer Fast docs still publish no speed gain.

---

## Fact-checking receipts — every URL opened 2026-09-01

### Cursor official (re-fetched live)

| URL | What it supplied | Status |
|---|---|---|
| https://cursor.com/docs/cursor-router | Router = Teams/Enterprise only; Cost/Balance/Intelligence; list-price billing; Enterprise off-by-default; Teams on-by-default; $1.25/$6 until 2026-09-07; click path Auto → Optimize For; Impose Auto; unhide model | OK |
| https://cursor.com/changelog/router | 2026-07-22 launch; Auto now powered by Router; Teams on / Enterprise dashboard | OK |
| https://cursor.com/blog/router | Teams and enterprises; 30–50% / 60% vendor claims; cache-aware claim; Fable/Opus/Sol comparisons | OK |
| https://cursor.com/docs/models-and-pricing | Full rate card, pools, plans, Auto modes, CTR, Start excludes Auto, on-demand = same rates | OK (one earlier timeout, then success) |
| https://cursor.com/docs/models/cursor-composer-2-5 | Fast default, same intelligence, $3/$15 Fast, Cursor Models pool | OK (Standard $0.50/$2.50 is on changelog + pricing table, not restated in the truncated model-page body) |
| https://cursor.com/changelog/composer-2-5 | 2026-05-18 Standard $0.50/$2.50, Fast $3/$15 default | OK |
| https://cursor.com/pricing | Hobby / Pro $20 / Teams $40 / Enterprise custom. Usage-based FAQ | OK |
| https://cursor.com/help/account-and-billing/pricing.md | Auto definition + Opus 5 example; Router not on Hobby/Pro/Pro+/Ultra; Hobby has Auto; plan prices | OK |
| https://cursor.com/help/models-and-usage/cursor-router | Router = relaunched Auto; Cost = legacy Auto; Balance default for new users; list-price billing | OK |
| https://cursor.com/help/models-and-usage/usage-limits | Two pools; Router can draw both; on-demand after included | OK |
| https://cursor.com/docs/agent/prompting | Model picker + Settings → Models default; Cmd/Ctrl / | OK |
| https://cursor.com/docs/subagents | `composer-2.5[]` and `composer-2.5[fast=false]` | OK |
| https://cursor.com/blog/aug-2025-pricing | Auto unlimited Jun–Sep 2025 individuals | OK |
| https://cursor.com/docs/models | timeout | FAIL |
| https://cursor.com/help/models-and-usage/available-models | timeout | FAIL |
| https://cursor.com/docs/account/pricing | timeout | FAIL |
| https://cursor.com/blog/jul-4-2025-pricing | 404 (Truell “Clarifying our pricing” is linked from the Aug 2025 post as a related card; exact slug not recovered) | FAIL |

### Cursor forum (staff-tagged where noted)

| URL | What it supplied |
|---|---|
| https://forum.cursor.com/t/introducing-cursor-router/166386 | Colin: Router not on individual; Auto Cost vs Balance/Intelligence pools; shuvo on Auto-used-to-mean-flat-rate; Jay_P1 asking to disable Fast in Auto |
| https://forum.cursor.com/t/cursor-auto-mode-in-2026-aug/167118 | deanrie: Pro Individual = classic Auto/Cost; then 2026-08-26 docs now say list price, mechanics unclear; no Fast-block toggle documented |
| https://forum.cursor.com/t/bring-cursor-router-to-individual-plans-pro-pro-ultra/169498 | 2026-08-26 feature request still open |
| https://forum.cursor.com/t/which-models-are-behind-cursor-auto-mode/167010 | Pool unpublished; anecdotes Composer vs Grok vs Opus |
| https://forum.cursor.com/t/only-fast-variant-of-composer-2-5-is-available/160976 | Hover → Edit → Fast off; staff confirms one model + toggle |
| https://forum.cursor.com/t/unlimited-usage-for-auto-will-basically-gone/130277 | 2025-08 community reaction to losing unlimited Auto |
| https://forum.cursor.com/t/cursor-pro-auto-mode-unlimited-usage-no-longer-feels-unlimited/148050 | Same, later |

### Anth.us + secondary (not used as price authority)

| URL | Role |
|---|---|
| https://anth.us/blog/never-use-fast/ | Our prior claim; re-fetched |
| /workspace/research-tokenmaxxing-2026-09-01.md | Prior pack |
| https://www.finout.io/blog/what-happened-to-cursor-pricing-2026-guide-5-cost-cutting-tips | Stale “Auto is unlimited / use Auto to save money” |
| https://aitoolsrecap.com/Blog/cursor-pricing-explained-2026 | Same stale advice |
| https://codepick.dev/en/guides/cursor-cost-saving/ | Same |
| https://flexprice.io/blog/cursor-pricing-guide | More current: Auto *was* unlimited; Router ended it. Their Auto Cost $1.25/$6 is now **Enterprise-legacy only** — do not copy as a general rate. |
| https://aireiter.com/blog/cursor-router-explained | Plan matrix Hobby/Individual no Router, Teams/Ent yes — consistent with official docs (July 2026 verify date on that page) |
| https://agentpedia.codes/blog/cursor-router-modes-billing-guide | Secondary Router explainer; vendor numbers only |

---

## Caveats the writer must keep

- **Prices rot.** This table is 2026-09-01. Enterprise Auto Cost cliff is **2026-09-07**.
- **Auto pool is unpublished.** Do not write “Auto always uses Grok” or “Auto always uses Composer.” Write “Auto may route to Composer, Grok, or a frontier model; you are billed that model’s list; you cannot pin the pool on individual.”
- **Luna vs Composer.** Luna is cheaper per token. Composer has the generous Cursor Models pool. “Cheapest path” is pool-aware, not just list-price-aware. Never Use Fast already said pin Composer *or* Luna.
- **Stale blogs** still say Auto is unlimited. Cite Cursor’s Aug 2025 post, not Finout, if the piece needs a historical receipt.
- **Help vs docs tense.** Help still says Router “will launch.” Docs and changelog say it launched 2026-07-22 for Teams/Enterprise. Trust changelog + docs + Colin for availability; trust Help for the individual-exclusion sentence.
- Vendor 30–50% / 60% Router savings are first-party A/B vs all-Opus / Fable, not vs pinned Composer 2.5 Standard. A team that already pins Composer is not the population those numbers describe.

---

## What I would tell Anth.us

- The collection’s Auto instruction is: **leave Auto. Pin Composer 2.5 Standard. Fast off.** Same list as Never Use Fast, now with receipts that Auto is no longer the cheap SKU.
- Do **not** write “you don’t have a router because you’re not Enterprise.” Write: **individuals have Auto, not Router; Teams has Router on; Enterprise has Router off until an admin flips it.**
- The click path that exists in Cursor docs is **Settings → Models** for the default, **model picker** for the current chat, **`composer-2.5[]` / `[fast=false]`** for subagents. The hover-Edit Fast toggle is **forum staff**, so screenshot it in-product rather than citing docs.
- Calendar line: **2026-09-07** Enterprise Auto Cost leaves $1.25/$6. If this ships this week, that is news.
- Do not sell Luna as the default pin without saying it drains the *other* pool. Composer Standard is the instruction for the Cursor Models bucket.
- Stale “use Auto to save money” SEO is the antagonist. Quote Cursor 2025-08 (unlimited ended) and Cursor 2026-07-22 (Router bills at list) rather than dunking on listicles.

---

*End of pack. No user contact made. All prices and quotes from pages opened 2026-09-01 unless a dated changelog/blog is the source of a historical sentence.*
