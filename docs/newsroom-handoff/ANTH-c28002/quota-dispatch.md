# Monitor + maximize + spot tasks

Ryan, 2026-09-01. Two more principles next to Resist temptation. Plus: is there a system that queues chores and dispatches them to whichever coding-agent product still has expiring quota?

Working name, locked 2026-09-01: **spot tasks.** Like AWS spot instances — spare capacity, interruptible, cheaper than on-demand — but the capacity is unused included quota and the work is deferrable chores. Older notes said “leftover dispatch.” Same thing. Use **spot tasks**.

Fetched the same day by Composer 2.5 researcher + gofer. Not a finished report.

## Verdict

Ryan’s exact box — one backlog, live remaining quota across Claude Code / Codex / Cursor / Antigravity / Grok Bot / etc., fire background chores if the human hasn’t used the included allotment by a deadline — **is not a shipping product**. It is a near-miss stack. Monitor/advise is crowded. Single-vendor burners exist. Nobody wires monitor → multi-product queue → agent launcher → HITL.

That combination **would be a new tool**, and a **separate article** from this how-to. This card should name the principles and point at the near-misses. Do not pretend spot tasks exist as a product.

## Three principles (proposed spine)

| Principle | Scope | Collision watch |
| --- | --- | --- |
| **Resist temptation** | Don’t overpay. Fast, Auto, flagship defaults, try-the-hit. | Already the lede. |
| **Monitor** | Know which pool, which clock, pace vs linear. | Sibling. Vendors already expose `/usage`, Spending tabs. |
| **Maximize (included pools only)** | Spend expiring prepaid allowance on reviewable chores. | Must **not** mean “always be agenting” or Fast/on-demand. Different from Maximize Value (quality per discretionary dollar). Extends Never Use Fast “empty every bucket.” |

## Are spot tasks a thing?

**~40% exists for two CLIs. The rest is plumbing.**

Closest executor: **[owayo/token-burn](https://github.com/owayo/token-burn)** — scans repos, runs a prompt backlog in tmux before weekly reset, optional `ai-usage --json`, picks the configured agent closest to reset. Claude Code + Codex (+ custom). Not Cursor Cloud Agents, Antigravity, Grok Bot, Copilot, PostHog.

Closest advisor: **[blisspixel/quotabot](https://github.com/blisspixel/quotabot)** — Claude, Codex, Antigravity, Grok. `suggest` has a use-it-or-lose-it boost. Explicitly “advisor, not a proxy.” Will not run chores.

Closest monitor plane: **[djbclark/aiuse](https://github.com/djbclark/aiuse)** (`Burn` / `Conserve` / `On pace`, `serve` HTTP), **[kohii/aiquota](https://github.com/kohii/aiquota)** (blue = use more or lose it), **[jhammant/quotamax](https://github.com/jhammant/quotamax)** + taskgauge (exports `priorities.json` for *external* burners).

Other near-misses:

- [cooco119/claude-quota-tracker](https://github.com/cooco119/claude-quota-tracker) — Claude-only night queue of `claude -p` when under-using.
- [pimmesz/afterburner](https://github.com/pimmesz/afterburner) — “burn the quota you’d lose”; PR-only refactors/tests/docs near weekly reset.
- [VinayJogani14/spareloop](https://github.com/VinayJogani14/spareloop) — queue work into wasted capacity; prewarm 5h window.
- [dujunyi416/claude-nightshift](https://github.com/dujunyi416/claude-nightshift) — quota-aware Claude queue + warmup.
- [vasiliyk/claude-queue](https://github.com/vasiliyk/claude-queue), [JCSnap/claude-code-queue](https://github.com/JCSnap/claude-code-queue) — Claude queues that pause at limit and resume on reset.
- Multi-**account** Claude routers (maxpool, teamclaude, ccswap) — drain the account that resets soonest. Wrong granularity. ToS-gray.
- API request routers (9router, OmniRoute) — failover the *next chat*, not burn a chore backlog.

**Native product features are time-based, not leftover-based.** Cursor Automations, Claude Routines / scheduled tasks, Codex scheduled tasks, Antigravity `/schedule`, Grok Bot Routines, Copilot cloud automations — cron and events. None ship “if included pool is still 60% with 6h to reset, run the chore list.” Claude’s `autoContinueAtUsageLimit` *waits after you hit the wall* (conservation, not burn).

Vendors do **not** tell you to spend leftovers. They say unused does not roll over, then sell overage. Burn-before-reset is community + OSS.

## Monitoring map (short)

| Product | Human | Machine-readable leftover? |
| --- | --- | --- |
| Claude Code | `/usage`, statusline `resets_at` | Yes in-session. No public personal REST quota API. |
| Codex | `/status`, `/usage`, app-server `account/rateLimits/read` | Yes in-session / enterprise analytics. |
| Cursor | Dashboard Spending tab | **No official personal API.** OpenUsage reverse-engineers `api2.cursor.sh`. Teams Admin API is aggregates. |
| Antigravity | Settings + CLI `/usage` `/quota` | TUI only. |
| Grok Bot | Cursor Spending weekly bar | No dedicated API. |
| Copilot | github.com/settings/billing + VS Code icon | Reports, not live leftover JSON. Credits reset 1st 00:00 UTC. |
| PostHog / Windsurf | In-app plan/usage | Billing/spend, not a dispatch surface. |

Menubar/tray: Tokcat, QuotaBar, OpenQuota, DevQuota. Advise, don’t dispatch.

## Closest written playbooks

- BSWEN [usage strategy](https://docs.bswen.com/blog/2026-03-27-ai-coding-usage-strategy/): front-load ~80% after reset, never let credits expire, at 30% with one day left find something to use them on. Closest editorial rule.
- ashu.co [16%](https://www.ashu.co/cursor-to-claude-code-stuck-at-16-percent-utilization/): single-agent ceiling, not a burn playbook.
- Never Use Fast “empty every bucket”: our inventory + misaligned clocks. Do not reprint the table. Point at it.

No vendor or major blog ships “if unused > X% by day Y, dump into background agents.”

## If we built the tool

Unique job: vendor-neutral chore backlog + poll live leftover (reuse aiuse/quotabot/caut, don’t invent scrapers) + score expiring pools + runner adapters (Claude CLI, Codex CLI, Cursor Automations API, …) + repo allowlists / HITL for writes.

Not unique (already crowded): another dashboard, another Claude-only queue, another API failover router.

Frame as personal productivity on owned subscriptions. Multi-account drain tools sit in gray ToS territory.

## Split

- **This article:** Resist / Monitor / Maximize-included as principles. Cite monitors. Mention **spot tasks** as almost-a-thing.
- **Build + Chattic + Kanbus + product article:** parked on this card (below). Do not merge that build into `c28002` copy.

## Parked here 2026-09-01 (Ryan)

This agent can only write the Anth.us newsroom. Do not open Chattic.us, Kanbus, Papyrus, or a new product repo from this run. File the spin-off on `ANTH-c28002` so it is not lost.

Working name: **spot tasks.** Ryan locked it. (Was leftover dispatch / subscription leftover burner.)

What it is: unused included quota is spare capacity, the way spare EC2 capacity is a spot instance. A chore backlog watches live remaining quota across coding-agent products. If the human has not used the included allotment by a deadline, interruptible background work — **spot tasks** — fills whichever pool is about to expire. Near-miss today, not a shipping product. Research above.

The analogy to keep: on-demand / reserved is the human’s interactive work. Spot is the deferrable queue. Preempt when the human needs the pool. Do not sell it as “always be agenting.”

Repos this would touch later (do not implement from this card):

| Place | Why |
| --- | --- |
| `AnthusAI/Chattic.us` | New feature page: **Spot tasks**. Named teammates on a computer you control; this is spare-quota chores. |
| `AnthusAI/Kanbus` | The queue. Issues are the backlog the dispatcher pulls from. |
| `AnthusAI/anthus-semantic-knowledge-base` | A later *new* story for the product/build article. Not this how-to. |
| `AnthusAI/anthus-site-content` + Anth.us | Publish that later article. This how-to only points. |
| Possible new product repo, or Chattic as home | The runner itself. Undecided. Do not create it from here. |

Not this:

- `bef418` Overnight products, leftover gates — leftover **QA/privacy/security** gates after an overnight swarm. Same word, different leftover. Link later if useful. Do not merge.
- `8bde91` Never Use Fast — empty-every-bucket calendar only.
- `0b6e8b` Maximize Value — discretionary quality per dollar.

This how-to must not become the Chattic spec, the Kanbus feature ticket, or the product launch post. It mentions the gap. The parked build lives in this file until someone with those repos files the rest.
