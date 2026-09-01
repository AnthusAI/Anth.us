# Handoff: ANTH-c28002 Thrifty tokenmaxxing + spot tasks

Ryan asked this Anth.us-only agent to file work it could not push to `AnthusAI/anthus-semantic-knowledge-base` (403). Apply these files there, then look into **spot tasks**.

## Apply to the newsroom repo

Repo: `AnthusAI/anthus-semantic-knowledge-base`  
Story: `ANTH-c2800247-f8e3-4834-8bf1-a48eb127580e` (short `ANTH-c28002`)  
Status: `research`  
Destination: `stories/ANTH-c2800247-f8e3-4834-8bf1-a48eb127580e/`

Copy over (overwrite):

- `idea.md`
- `assignment.md`
- `research.md`
- `quota-dispatch.md` — research + parked **spot tasks** spec
- `prior-art.md`
- `cursor-auto-factcheck.md`

Then from the skb root:

```bash
kbs comment ANTH-c28002 "Applied Anth.us handoff docs/newsroom-handoff/ANTH-c28002. Spot tasks name locked. Next: file Chattic feature page + Kanbus queue when you have those repos."
kbs validate
```

Replay comments from `kanbus-comments.json` only if they are not already on the card.

Do **not** edit `project/issues/` by hand.

## What Ryan wants investigated (spot tasks)

Working name **locked 2026-09-01: spot tasks.** Like AWS spot instances, but tasks.

- Unused included quota is spare capacity.
- Interactive human work is on-demand.
- Deferrable, interruptible chores fill leftover pools before reset.
- Preempt when the human needs the pool.
- Not “always be agenting.” Not Fast. Not on-demand spend.

Near-miss, not a shipping product. Closest executor: `owayo/token-burn` (Claude + Codex). Closest advisor: `quotabot`. Closest monitors: `aiuse` / `aiquota`. Native schedulers are time-based, not leftover-based.

Would later touch (this agent could not open them):

| Repo | Job |
| --- | --- |
| `AnthusAI/Chattic.us` | Feature page: **Spot tasks** |
| `AnthusAI/Kanbus` | The chore queue |
| skb + `anthus-site-content` | Later product article, not this how-to |
| Maybe a new product repo, or Chattic as home | The runner |

Not `bef418` Overnight products, leftover **gates** (QA/privacy/security). Same word, different leftover.

## This how-to vs the spin-off

`ANTH-c28002` stays the public Anth.us how-to: analog → Resist temptation → Monitor → Maximize included pools → per-app catalog. Mention spot tasks. Do not write the Chattic spec or build the runner from that assignment. Drafting still paused until Ryan says go.

Start at `quota-dispatch.md` § Parked here.
