# Sub-agents that actually save money

Ryan, 2026-09-01: simple suggestions. Counterintuitive: more workers can cost *less* because **input context is the volume knob**. Then Jevons: cheaper tasks → you do more tasks → the bill can still rise. Record in the article. One Jevons beat, then link `ecc2ae` / Maximize Value. Do not retell coal or the scoreboard.

## Why it can be cheaper

One fat manager thread re-bills the junk drawer **every turn** (grep, logs, failed patches, the last three files). A worker starts from a brief. It never sees that pile. The manager only pays for a **summary** on the way back.

So: you expect parallel delegation to cost more (N windows). You save when the alternative was N more turns of a huge prefix. Isolation beats parallelism. Parallelism is a latency move that *multiplies* windows.

amux.io claims parallel agents can use fewer tokens than one long session — same mechanism, product-pitchy. Anthropic also warns agent teams can run ~7× tokens in plan mode. Both can be true: isolation saves; farms spend.

## Simple moves

1. **Research and log-reads go to a worker.** Grep, `git log`, test output, “find the call sites.” That junk never enters the manager.
2. **Write a brief, take a summary.** Don’t paste the worker’s transcript back up. The product already returns a summary. Leave it that way.
3. **Pin a cheap model on the worker. Fast off.** Don’t `inherit` if the manager is Auto, Opus, or Sol. Copilot’s own optimize doc: cheaper models for subagents because the task is scoped.
4. **Don’t fork** unless the worker *needs* the story. Fork copies the junk drawer (Claude). That’s the expensive opt-in.
5. **Compact the manager.** That’s the long context. Workers stay small; the manager is where `/compact` earns its keep.
6. **Isolation ≠ parallel.** One worker at a time still saves vs a fat thread. Eight at once is eight prefixes plus eight MCP lists. Use parallel when you want wall-clock, not as a thrift default.
7. **Strip standing tax on workers.** Cursor inherits all MCP. Claude loads CLAUDE.md. Kill tools the worker doesn’t need. Antigravity custom agents default to no tools — copy that habit.
8. **Don’t return novels.** A worker that dumps 10k tokens of “findings” into the manager just moved the junk drawer upstairs.

## Then Jevons

Each task got cheaper, so more tasks become worth doing. You keep the farm on. Total spend can rise even though cost-per-task fell. That’s the catch we already wrote in [The Year Coding Became a Commodity](https://anth.us/blog/ai-coding-cost-collapse-2026/) and resolved (sometimes) in Maximize Value.

This article: one beat. The technique still pays when the extra work is *included quota you’d lose* (spot tasks / maximize-included). It does not pay when the extra work is on-demand or Fast. Don’t let “workers are cheaper” become “always be agenting.”
