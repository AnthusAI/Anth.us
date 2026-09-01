# How our principles line up (2026-09-01)

Ryan asked: how does this align with what other people are saying? What other principles are emerging? What other tips?

Not a finished report. Composer 2.5 researcher + gofer.

## Alignment

| Ours | Outside | Fit |
| --- | --- | --- |
| **Resist temptation** | Continuum / Anthropic / Burns: sufficient model, don’t leave Opus on | **Same.** They lack the adversarial vendor frame. That’s ours. |
| | Tokenminning Cursor + GitHub Copilot: leave Auto on | **We diverge.** Stale or vendor-blessed. Punch this. |
| **Monitor** | aiuse Burn/Conserve/On pace; aiquota projected-at-reset colors; Tokenminning “measure first” | **Same.** They have the meters. We have the habit. |
| **Maximize included only** | BSWEN perishable credits; afterburner / token-burn “burn what you’d lose” | **Same, fringe.** Vendors will not say this. They sell overage. |
| **Spot tasks** | spareloop “spare capacity”; BSWEN “find something to use it on”; afterburner / burnrate | **Cousin.** We named the capacity. They have single-vendor chores. |

Serious crowd agrees on Resist-flagship and Monitor. Maximize-included is editorial + OSS, not doctrine. Spot tasks is the least named; we are ahead if we keep the spot-instance analog.

## Emerging principles (not yet on our spine)

These keep showing up. Short names. Decide later which are siblings vs catalog tips.

| Name | One sentence | Where it lives |
| --- | --- | --- |
| **Context is the bill** | History, MCP tool lists, rules files, and pasted logs are a per-turn tax. Clear between tasks. | Anthropic, Burns, Copilot, Tokenade, Giancini |
| **One agent, one job** | One outcome, one branch, one stop. Split when the task changes shape. | Junction, Jon Jones, Adnan Masood |
| **Prescribe, don’t explore** | Name files and paths. Don’t let it grep the repo blind. Bare path ≠ `@file` (Anthropic: `@` injects the file). | Anthropic Help, Continuum, habib23me |
| **Warm the cache** | Don’t switch model/tools/reasoning mid-chat. Stale session >1h can re-bill the prefix. | Continuum, Copilot, Anthropic on HN |
| **Phase it** | Research → plan → implement in separate sessions. Orchestrator plans, cheap worker implements. | Copilot, Burns, DeepakNess, Aider architect/editor |
| **Cap the run** | Session spend limit / org billing stop so an unattended agent cannot eat the month. | Copilot `--max-ai-credits`, PostHog billing limit |
| **Match effort** | Don’t pay max thinking on mechanical turns. | Anthropic `/effort`, Copilot reasoning level |
| **Parallelize the ceiling** | One human + one agent tops out ~16% of a window. Parallelism consumes allowance. | ashu.co, amux.io |
| **Rotate vendors** | When one wall hits, switch tools. Don’t stop. | BSWEN |
| **Pin the children** | Subagents inherit the parent. Unset model = expensive fan-out. | Claude issue #84667, Totalum, Cursor composer-2.5 workers |

**Already ours, don’t re-coin:** Match sufficient = Maximize Value. Orchestrator/worker = Never Use Fast + Grok Bot. Jevons = commodity article.

**Candidates for this how-to (editor):** add **Context is the bill** as a fourth in-article principle, or as the first catalog section. The rest are tips under the per-app list. Do not add Parallelize-the-ceiling as a principle here — it slides into always-on agenting; point at spot tasks instead.

## Crowd that fights us

- Leave Auto on (Tokenminning Cursor, stale blogs, Copilot official 10% Auto discount).
- Use as much capability as the task requires (Copilot) — sounds fine, becomes never-down-route.
- Burn Max + API overflow (amux.io) — violates included-only.
- Tokenmaxxing as vanity volume (tokenmaxxing.com). We flip it.

## Tips worth stealing (not already in prior-art.md)

- afterburner strips API keys so “burn” stays on subscription, not accidental API.
- afterburner uses interactive `claude`, not `claude -p` — windows track differently.
- burnrate: on 5h reset, top-N `claude -p` in worktrees → draft PRs; resume rate-limited runs.
- MCP deferred-tools enum ~4k tokens/session; CLI over MCP when both work.
- Two-strikes then `/clear`.
- Cursor: model switch mid-chat resets cache — new chat.
- Copilot `/chronicle cost-tips`; `--max-ai-credits` on unattended CLI.
- Cline: Plan then Act; `.clineignore`; path-scoped rules.
- Aider: `/drop` finished files; `--architect` + cheap `--editor-model`.
- OpenCode: cheap model on `quick` / Explore agents.
- Antigravity: Gemini bars can share one pool — unused bar is not spare capacity.
- Claude Max: four buckets (`five_hour`, `seven_day`, `seven_day_opus`, OAuth-app), not two.
- Prewarm the 5h window with a ping (window alignment, not burn). Singleton-ish; don’t overclaim.

## Editorial cut

Keep the three + spot-tasks park. Steal **Context is the bill** into the how-to if the spine can take a fourth without burying the analog. Use their tips in the catalog. Keep the fight: they say sufficient; we say the vendor is not your friend.
