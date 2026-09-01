# Research notes

Starter pack, 2026-09-01. Cursor Auto cite pack added the same morning. Not a finished report. Drafting paused until Ryan says go.

Full Cursor receipts (live docs + staff forum, fetched 2026-09-01): `stories/ANTH-c28002/cursor-auto-factcheck.md`.

## Lead (do not bury)

Ryan, 2026-09-01: open on the analog. Token vendors offer the new Fast (or whatever premium default) like a drug dealer giving you a free first hit, except it isn't even free. You are your own advocate. Interests are misaligned. They don't want you to notice. Just say no.

That is the first principle: Resist temptation. Specific settings come after. Auto is another named example of that principle, not a sequel to Never Use Fast.

Ryan, later 2026-09-01: two sibling principles. **Monitor** your usage. **Maximize** included, resetting, subsidized pools (use-it-or-lose-it) — not on-demand, not Fast. Full research: `quota-dispatch.md`.

Ryan, still later 2026-09-01: the dispatcher would also be a Chattic.us feature page and would use Kanbus. This agent cannot file on those repos. Park the spin-off on this card (`quota-dispatch.md` § Parked here). Not `bef418`.

Ryan, still later 2026-09-01: **call it spot tasks.** Like spot instances, but tasks. Unused included quota is spare capacity. Deferrable chores fill it before reset. Working name locked unless he renames again.

## Job after the lead

Catalog thrifty techniques other than Fast, per coding app. Verify quota pools, reset cycles, default aliases, cheap-model names.

## Split

- `8bde91` Never Use Fast — Fast surcharge table. Link it. Do not reprint the tax table here.
- `0b6e8b` Maximize Value — philosophy.
- `ef4df5` Cheap output, expensive cache — rate card vs workload mix. Charts stay there.
- `ecc2ae` Commodity — market.
- `629b47` Grok Bot review — not this piece.
- This card (`c28002`) — the fight, then buttons, buckets, aliases, multiplex.

## Known notes to verify (leaked into Never Use Fast)

| App | Technique | Last checked | Risk |
| --- | --- | --- | --- |
| Antigravity / Google AI Pro | Two pools: Gemini vs Claude/GPT. Exhaust both. Weekly + 5h rolling. | 2026-08-29 | Plan names move |
| Cursor | Cursor Models vs Other Models. Pin Composer 2.5 Standard. Auto bills at routed-model list. Individuals have Auto, not Router. | **2026-09-01** | Pool unpublished; Pro Individual exception no longer in live docs |
| Grok Bot | Own weekly pool on paid Cursor plans. Unused dies. | 2026-08-29 | Was wrongly called calendar-month |
| Codex | Bare `gpt-5.6` routes to Sol. Use `gpt-5.6-luna`. | 2026-08-29 | Aliases retire |
| Claude | Opus 5 vs Fable 5 habit. | 2026-08-29 | Fast mode belongs on 8bde91 |
| Any picker | Kimi, GLM 5.2, DeepSeek, Qwen | 2026-08-27 | Which apps actually expose them |

## Cursor Auto — fact-checked 2026-09-01 (the other free-hit lever)

Situation: Auto used to be the thrift default. From June 2025 until each seat's next renewal after 2025-09-15, Cursor said Auto was unlimited for individuals. Guides still tell people to leave Auto on. Live docs now: all Auto modes bill at the list price of the model each request is routed to. Help's example is Opus 5.

Ryan's four claims, with receipts:

1. **Auto used to be the cheap path — TRUE.** Cursor blog [Updates to Teams and Auto](https://cursor.com/blog/aug-2025-pricing): Dec 2023–Jun 2025 Auto cost the same as other premium models; Jun 2025–next renewal after 2025-09-15 **unlimited for individuals**. Forum residue still says leave Auto on to save money.
2. **Auto can now cost a lot more than the cheapest pin — TRUE.** [models-and-pricing](https://cursor.com/docs/models-and-pricing): “All Auto modes bill at the list price of the model each request is routed to.” [Help](https://cursor.com/help/account-and-billing/pricing.md): “if your request is routed to Opus 5, you are billed at Opus 5 pricing.” Composer 2.5 Standard is $0.50 / $2.50. Opus 5 is $5 / $25. Included usage is a pool, not a discount; on-demand is the same list. Do **not** write “Pro Auto is still $1.25/$6.” That leftover flat card is **legacy Enterprise Auto Cost until 2026-09-07**, then it joins list-price billing. Even $1.25/$6 is already above Composer Standard.
3. **Pin Composer 2.5 because Auto uses dearer models — MIXED.** Pin **Standard**, not Fast. Fast is a different knob (belongs on `8bde91`; do not reprint the 6× table). Auto *may* land on Composer, or on Grok / Sol / Opus / Fable. Pool is unpublished ([deanrie, 2026-07-30](https://forum.cursor.com/t/which-models-are-behind-cursor-auto-mode/167010)). Pinning caps the rate at $0.50/$2.50 and keeps you on the larger Cursor Models pool. Luna is cheaper *list* ($0.20/$1.20) but drains the smaller Other Models pool.
4. **No router unless you are Enterprise — MIXED.** Right about individuals, wrong that it is Enterprise-only. [cursor-router](https://cursor.com/docs/cursor-router): “currently only available on Teams and Enterprise plans.” [Changelog 2026-07-22](https://cursor.com/changelog/router): on by default for **Teams**; Enterprise admins enable from the dashboard (**off** by default). Staff Colin 2026-07-24: “Cursor Router is currently not available on individual plans!” Do **not** write “you lack a router because you are not Enterprise.” Write: individuals have Auto, not Router; Teams has Router on; Enterprise has Router off until an admin flips it.

### Cursor instruction candidates (settings, after the principle)

1. Pin the model. Do not leave Auto. Model picker, or Settings → Models. ([agent prompting](https://cursor.com/docs/agent/prompting))
2. Pin Composer 2.5 **Standard**. Fast off is the Never Use Fast row; screenshot the hover-Edit toggle in-product (forum staff, not a docs click path).
3. Subagents: `model: composer-2.5[]` or `composer-2.5[fast=false]`. Do not `inherit` if the parent is Auto. ([subagents](https://cursor.com/docs/subagents))
4. Teams: Auto → Optimize For. Balance is the default for new users and is the one that billed people at Sol/Opus list. Prefer Cost, or leave Auto.
5. Teams/Enterprise admin: unhide Underlying model. If the chip changes mid-session, you paid a cache miss. Do not Impose Auto unless you mean it (soft and hard both default off).
6. Enterprise: leave Router off unless you have a reason. After 2026-09-07, even Cost mode loses the $1.25/$6 card.
7. Start (India): already no Auto and Fast cannot be enabled. Stay on Composer 2.5 / Grok in Cursor Models. Do not upgrade “for Auto.”

### Cursor prices fetched 2026-09-01 (writer table, not the lede)

Source: https://cursor.com/docs/models-and-pricing

| Model | Input / 1M | Cache read | Output / 1M |
| --- | --- | --- | --- |
| Composer 2.5 Standard | $0.50 | $0.20 | $2.50 |
| Grok 4.6 | $2.00 | $0.50 | $6.00 |
| GPT-5.6 Luna | $0.20 | $0.02 | $1.20 |
| GPT-5.6 Sol | $4.00 | $0.40 | $20.00 |
| Claude Opus 5 | $5.00 | $0.50 | $25.00 |
| Legacy Enterprise Auto Cost (until 2026-09-07) | $1.25 | $0.25 | $6.00 |

Composer Fast rates stay on `8bde91`. Do not reprint them here.

Cursor Token Rate $0.25/M on third-party is Teams/Enterprise only, not on Grok/Composer, not on individual Auto.

## Prior art (2026-09-01)

Ryan asked what specific, current money-saving pointers already exist. Full catalog: `prior-art.md`.

Short version: the beat is crowded but fragmented. Tokenminning owns the per-IDE wiki. Continuum owns Claude Code lists. Vendors own fragments. Quota CLIs (`aiuse`, `aiquota`) own use-it-or-lose-it pacing. Nobody has analog → Resist temptation → cross-app catalog → multiplex unused quota in one narrative. Cultural “tokenmaxxing” still means vanity burn; we flip it.

Stale residue still ranks: leave Cursor Auto on. That is the other free-hit. See `cursor-auto-factcheck.md`.

Cite if we write: Anthropic Help + costs, Cursor usage/pricing, Cursor forum subagent leak, Copilot optimize-AI-usage, OpenAI Luna/Terra price post, Google Antigravity wrong-pool thread, Tokenminning hub (as the competing catalog).

## Still to research

- Recheck Antigravity, Grok Bot, Codex, Claude live quota docs against `prior-art.md` before report.
- Other apps with a real bucket trick (only if verified). Do not invent a fifth app.
- Multiplex arithmetic without restating Fast. Nobody has editorialized a reset calendar across four paid tools.
- Other “free first hit” levers besides Fast and Auto (aliases, try-the-flagship trials).
- Verify amux.io claim that Claude Max per-model quotas are independent before repeating it.

## Do not

- Reprint Fast multiples.
- Open the piece on a spreadsheet.
- Invent a fifth app to fill a table.
- Treat `ef4df5` as this article.
- Write “router is enterprise-only.”
