# Quota-monitor community (2026-09-01)

Ryan: not 0-star CLIs. Well-maintained, people working together, tools that chase rapid vendor change.

**aiuse / kohii aiquota are real and tiny.** Glue, not the community. Cite as watch-this-space, not “join this project.”

## Where the community actually is

Two jobs. Don’t mix them.

### Live leftover quota (remaining %, reset clocks)

| Project | URL | Scale | Notes |
| --- | --- | --- | --- |
| **CodexBar** | https://github.com/steipete/CodexBar · https://codex.bar | ~21k★, 100+ contributors, commits today, ~1.8k forks | De facto live-quota standard. Menu bar + `codexbar` CLI. Codex, Claude, Cursor, Copilot, Grok, Antigravity, many more. This is the one that will chase API changes. |
| **OpenUsage (desktop)** | https://github.com/robinebers/openusage · openusage.ai | ~4k★, 12 contributors, Homebrew, local API :6736 | macOS menu bar, coding subscriptions, plugin architecture. **Different product** from openusage.sh. |
| **tokscale** | https://github.com/junhoyeo/tokscale · tokscale.ai | ~5k★, 100+ contributors, ~26k npm/wk | Cross-platform TUI + `tokscale usage --json`. History *and* live quotas. |
| **OpenUsage.sh** | https://github.com/janekbaraniewski/openusage | ~180★, 10 contributors | Terminal-first dashboard. Smaller, real team. Name collision with desktop OpenUsage. |

### Historical spend (what did I burn, from local logs)

| Project | URL | Scale | Notes |
| --- | --- | --- | --- |
| **ccusage** | https://github.com/ccusage/ccusage · https://ccusage.com | ~18k★, 77 contributors, **~85k npm/wk** | Parses local JSONL. Not live remaining-%. Closest thing to a common unit of measurement. Continuum already wrote a guide. |
| **codeburn** | https://github.com/getagentseal/codeburn | ~10k★, 80 contributors | Fast-rising spend dashboard + optimize CLI. |

## If Ryan follows one

**CodexBar** for live leftover. **ccusage** for “what did this week cost.” Optionally **tokscale** if he wants both in a TUI.

Do not recommend: Claude-Code-Usage-Monitor (8.6k★, last push July 2026 — stalled), caut (sharp Rust port, solo), aiuse, aiquota.

The **spot-tasks dispatcher** still has no community. The healthy repos watch. They do not dispatch.
