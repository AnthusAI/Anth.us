# Context is the bill — techniques catalog

Ryan, 2026-09-01: this is not a slogan. It is a list of specific, useful, actionable things. Other people’s thrifty-coding writing already treats **input context** as a cost lever. Steal the moves. Cite them. Don’t reprint Fast.

Principle in one line: you pay the pile again every turn. Shrink the pile.

## Do these

1. **New thread per job.** `/clear` or new chat when the *mission* changes. For noisy side work on the *same* mission, spawn a sub-agent: most products give the child a **clean chat**, not the parent transcript — the parent writes a brief. That is not a full reset: children often still load rules (`CLAUDE.md`) and **inherit MCP/tools**. Claude **fork** copies the junk drawer on purpose. Sub-agents ≠ `/clear`. See `subagent-context.md`. (Anthropic, Cursor, Copilot, Antigravity docs 2026-09-01)
2. **`/clear` vs `/compact`.** Clear between jobs (free reset). Compact inside one long job (summarize and continue). Don’t compact junk you should have cleared. (Anthropic, SSD Nodes, Copilot)
3. **Name the file. Don’t paste it.** Bare path ≠ `@file`. Anthropic: `@` injects the whole file. A path lets the agent read what it needs. (Anthropic Help habit #3, Continuum)
4. **Don’t grep the repo blind.** Point at symbols and paths. Exploration is input tokens. (Continuum “prompt precision”)
5. **Keep always-on rules thin.** `CLAUDE.md`, `.cursor/rules`, Copilot instructions: per-message tax, not a one-time setup. Burns via Willison. Anthropic ~200 lines. Path-scope rules when the app allows it (Cline `paths:`).
6. **Turn MCP off until you need it.** Tool lists are standing context. Deferred MCP enum can be ~4k tokens/session. Prefer a short CLI call over a always-connected server. (Burns, Tokenminning, Giancini, bokuwalily)
7. **Don’t paste test logs.** Hook or habit: keep failures, drop passing noise. Continuum PreToolUse Bash example. Aider: compress dumps first.
8. **One agent, one job, one branch.** Split when the shape changes. (Junction, Jon Jones)
9. **Don’t switch models mid-chat.** Cache miss. New thread if you change tier. Cursor Tokenminning; Copilot Auto only switches at cache boundaries.
10. **Don’t resume a stale session.** Idle >1h can re-bill the prefix. `/clear` and start. (Anthropic on HN)
11. **Two strikes, then clear.** Two failed corrections on the same bug → new thread, don’t argue in the junk drawer. (Burns)
12. **Drop finished files.** Aider `/drop`. Don’t keep the whole refactor in context.
13. **Pin worker models.** Subagents inherit the parent. Unset = expensive fan-out. Cursor: `composer-2.5[fast=false]` on children. (Claude #84667, DeepakNess)
14. **Cap the run** on unattended CLI. Copilot `--max-ai-credits`. PostHog billing stop. Different from Fast; this is a volume fuse.
15. **Worktrees for parallel agents.** One agent, one checkout. Don’t share a dirty tree. (Claude worktrees, Tim Schipper)

## Per-app clicks (after the principle, in the catalog)

- **Claude Code:** `/clear`, `/compact`, `/effort`, `/model opusplan`, lean CLAUDE.md, hooks on bash output, Haiku/Composer-cheap on subagents, `isolation: worktree`.
- **Cursor:** new chat per task; pin Standard not Fast; `.cursorignore`; `@file`/`@symbol`; watch `.cursor/rules` size; don’t inherit Auto onto subagents.
- **Codex:** named `gpt-5.6-luna` not bare `gpt-5.6`; don’t assume children cheap-route.
- **Copilot:** `/new` vs `/compact`; `/chronicle cost-tips`; session credit cap.
- **Cline:** Plan then Act; `.clineignore`; New Task; path-scoped rules.
- **Aider:** `/drop`; `--architect` + cheap `--editor-model`; `--map-tokens`.
- **Windsurf:** tag the files Cascade should touch; fresh Flow after ~5–10 turns.

## Not this section

Fast multiples → Never Use Fast. Sufficient-not-smartest → Maximize Value. Spot tasks stay parked. This list is the input-volume knob.
