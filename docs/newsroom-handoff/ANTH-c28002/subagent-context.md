# Sub-agent context (technique 1)

Ryan, 2026-09-01: how does “new thread per job” work if you use **sub-agents** instead of `/clear`? Do children inherit the full parent context?

Fetched official docs 2026-09-01. Not finished copy. Record in the article; proofreading may cut.

## Short answer

**Most products: the child does not get the parent chat.** The parent writes a brief. The child starts a clean window and returns a summary.

That is **not** the same as `/clear`.

- `/clear` / new chat = new *mission*. Parent junk is gone. Continuity is gone.
- Sub-agent = same mission, isolate *noise*. Parent stays. Child usually still loads **rules files** and often **inherits tools/MCP** (standing context tax).
- Vendors recommend **both**, for different jobs. Anthropic: `/clear` for a new feature; sub-agents for exploration/tests; `/compact` when the same task got fat.

## What matters for cost

Clean chat ≠ thin context. A Cursor/Claude child with a short prompt can still pay for the full MCP tool list and `CLAUDE.md` / rules every turn. Pin cheap models on children. Scope tools. Don’t fork unless you *want* the junk drawer.

Duplicate work: N children ≈ N input windows. Isolation saves the *parent*. Parallelism can raise the *total*.

## Comparison (default spawn, not fork)

| Product | Parent chat to child? | Parent brief? | Rules / CLAUDE.md | Tools / MCP | Isolation | Model default |
| --- | --- | --- | --- | --- | --- | --- |
| **Cursor** Task | **No.** Clean context. | Yes — Task `prompt` | **Docs silent.** Forum mixed. | **Inherits all parent tools including MCP** (cloud: team MCP) | Shared cwd. Optional worktree / cloud VM | `inherit` (explore uses faster) |
| **Claude Code** | **No**, except **fork** = full history | Yes — delegation message | **Yes**, full CLAUDE.md stack (Explore/Plan skip) | Inherit, then filter. Inline `mcpServers` can keep MCP off parent | Default parent cwd. `isolation: worktree` | Inherit |
| **Codex** | Separate threads + summaries. **Docs do not say “no parent transcript.”** `fork_turns` in API guide; **CLI default undocumented** | Yes | AGENTS.md can trigger delegation | Sandbox, MCP, skills inherit if omitted | Sandbox inherit. Worktree not on subagents page | Inherit model + reasoning |
| **Copilot** CLI/SDK | **No.** Isolated window | Yes | AGENTS.md: silent whether child reloads full stack | Same tools as parent (task agent: almost all). Skills opt-in on SDK | Experimental `/worktree` | Inherit unless agent sets cheaper. Copilot *says* use cheaper models for subagents |
| **Antigravity** | **No.** Clean slate | Yes — `invoke_subagent` Prompt | Silent on repo rules | Custom agents: tools default **[]**. Scopes/sandbox inherit | `inherit` / `branch` (worktree) / `share` | `inherit` |
| **Grok Bot → Cloud Agent** | **Not documented** | Unknown | Unknown | MCP policy exists | Cloud VM pattern | Cursor-managed |
| **Cline** | Separate context + task prompt | Yes | — | Read-only, no MCP, no writes | Same workspace | Undocumented |
| **OpenCode** | Fresh child session | Yes | Project instructions added separately | Child’s **own** permissions, not a copy of parent | — | Inherit if unset |
| **Aider CLI** | No sub-agents | — | — | — | — | — |
| **AiderDesk** | Configurable: `off` / `last-message` / `full-context` | Yes | — | Per profile | — | Per profile |

## Exceptions (junk drawer on purpose)

- **Claude fork** (`/subtask` / fork type): full conversation, same tools. Prompt-cache reuse can be *cheaper* than a fresh child when the child *needs* the background. Opposite of isolation.
- **Cursor resume:** continues the *child’s* thread, not a dump of parent on first spawn. `resume: "self"` as parent-fork: **forum only, not in docs**. Don’t publish.
- **Antigravity `self`:** clone of instructions/tools, still clean *history* per Context Isolation quote.
- **Codex:** treat as risk until we pin `fork_turns`. Community (Mar 2026): omitting it → FullHistory. Not in Codex subagents page.

## Options that matter (article checklist)

1. **Does the child see parent chat?** Default no on Cursor / Claude / Copilot / Antigravity. Write the brief; don’t assume it saw the last hour.
2. **Does it still load rules?** Claude: yes (except Explore/Plan). Cursor: unknown — verify in product before stating.
3. **Does it inherit MCP?** Cursor: yes, all of them. That’s a standing tax on every child. Claude: can give a child MCP the parent doesn’t have (keeps descriptions off the parent). Antigravity custom: default no tools until you list them — tightest default.
4. **Can you pin a cheap model?** Cursor `model: composer-2.5[fast=false]`. Don’t `inherit` if parent is Auto/Opus. Copilot explicitly: cheaper models for subagents. Codex inherit unless you set `default_subagent_model`.
5. **Worktree?** Claude `isolation: worktree`. Antigravity `branch`. Cursor optional. Stops children from sharing a dirty checkout. Filesystem isolation ≠ context isolation.
6. **Fork vs fresh?** Fork when the child needs the story. Fresh when the child is a researcher/grepper. `/clear` when *you* are starting a different article.

## Sources

- https://cursor.com/docs/agent/subagents
- https://code.claude.com/docs/en/subagents
- https://developers.openai.com/codex/subagents.md
- https://docs.github.com/en/copilot/tutorials/optimize-ai-usage
- https://www.antigravity.google/docs/subagents/

Fetched 2026-09-01.
