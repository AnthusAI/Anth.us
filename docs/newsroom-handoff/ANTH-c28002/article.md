---
title: "Thrifty tokenmaxxing"
suggested_title: "Stop Burning Tokens: The Practical Guide to Context Hygiene and Quota Thrift"
slug: "thrifty-tokenmaxxing"
date: "2026-09-01"
authors:
  - author: <a href="/ryan">Ryan Porter</a>
tags:
  - articles
copy: "Gemini 3.7 Flash High (bc-c922fab2-56c4-5894-8267-ca3abca6b4b9)"
editor: "Cloud agent bc-01a05cc5 — restored analog, firsthand Fast, merged context-techniques.md items Gemini missed, cut invented session-size numbers"
state: draft
note: "Newsroom draft — not site MDX. Do not publish until Ryan says so. Recheck live quota numbers, model ids, and Fast multipliers before ship."
---

They offer you Fast — or whatever the new premium default is this month — like a dealer sliding you a free first hit. Except it isn't free.

Open a new workspace and you're already on the flagship, priority queueing on, Auto routing, every plugin loaded. It feels generous on day one. By day fifteen the included pool is gone, you're on metered overage, and nobody can point to a PR that needed that firehose.

Their incentive is simple: more tokens, more-expensive tokens, faster trip into overage. Yours is the opposite: ship the work on a watched budget. Interests aren't aligned. They don't want you to notice. You are your own advocate. Just say no.

That's the rate trick. I wrote the tax table in [Never Use Fast](/blog/never-use-fast/). Don't reprint it here. You can dodge the multiplier and still get crushed by volume. Context is the bill. Every turn re-reads the pile. Leave junk in the window and you pay for it again, and again.

This isn't a spreadsheet piece. It's three principles, a catalog of volume moves, and the per-app gotchas that fight you while you work.

## Three principles

Managing coding-agent cost isn't about pinching pennies on work that matters. It's about cutting waste so the included pool covers more of the work that does.

1. **Resist temptation.** Default off the flagship and the premium latency lane. Make the expensive model earn the turn. [Maximize Value, Not Intelligence](/blog/maximize-value-not-intelligence/) is the buying philosophy; this piece is the fight plus the settings.
2. **Monitor.** You can't trim what you don't measure. Live leftover and historical burn are different jobs. Follow both.
3. **Maximize included pools only.** Subscription buckets are use-it-or-lose-it. Empty them before they reset. Fast and on-demand are not that pool. They're retail.

I turn Fast off. Cursor turns it back on. I'm working async on purpose — nobody is waiting on the stream — and the product still re-offers the hit. That's Resist as a live fight, not a one-time click. I said it doubles the bill; last time we measured, Composer Fast was 6× Standard. Check your product's multiplier. Then turn it off again.

## Context is the bill

Pick a cheaper model and you only lowered the rate. The volume multiplier is the window.

On turn twenty-five the agent isn't reading your latest instruction. It's re-ingesting the system prompt, the tool list, the rules files, every command, every compiler error, and every intermediate dump from turns one through twenty-four. Context itself grows roughly linearly. The *bill* compounds: each turn re-sends the whole pile.

Other people's thrifty-coding writing already says this. ashu.co put effective context in long chats around 16% — meaning most of what you're paying to transmit is sludge. BSWEN's 80/20 is the same shape: unmanaged runaway sessions dominate spend. The Tokenminning wiki and Continuum's "stop putting Opus on routine work" crowd already cover Resist-flagship. Maximize-the-included-pool is the thinner public lane. What's below is the volume catalog.

Shrink the pile.

## The catalog

Record everything. Proofreading can cut later.

### 1. Manager holds the long thread. Workers start fresh.

This is the architecture, not a slogan.

Keep one manager thread for planning and synthesis. Compact *that* thread separately. When it's time to write code, spawn a worker with a fresh context that contains only the brief — not the manager's junk drawer. Isolation can save because the worker doesn't re-bill parent history on every edit.

Caveat: clean chat isn't thin context. Cursor children inherit all MCP. Claude loads `CLAUDE.md` except in Explore/Plan. Claude `fork` copies the junk drawer; non-fork is brief-only. Pin cheap models on workers. Unset inheritance is expensive fan-out.

Parallelism is the other knob. Five workers means five windows at once. Then one beat of Jevons: cheaper tasks → more tasks → the total can rise. Extra work is fine if it's included quota you'd lose anyway. It isn't fine if it burns on-demand or Fast. That's the catch in [The Year Coding Became a Commodity](/blog/ai-coding-cost-collapse-2026/). Don't retell it here.

`/clear` is the mission reset. It is not competing with sub-agents. Clear when the *job* changes. Compact when you're still on the same job and the history is getting loud.

### 2. `/clear` vs `/compact`

Clear between jobs (free reset). Compact inside one long job (summarize and continue). Don't compact junk you should have cleared. Use `/context` when the product has it. Rewind, duplicate, summarize-and-restart when a thread wanders. Don't paste the same PDF twice.

### 3. Plan in a heavy thread. Execute in a thin one.

Brainstorm and argue architecture in a throwaway window. Extract the plan. Paste that plan as the brief for a new execution thread. The coder doesn't need the fifteen rejected designs.

### 4. Name the file. Don't dump the repo.

A bare path isn't `@file`. `@` injects the whole file; a path lets the agent read what it needs. Don't paste a 400-file tree. Don't grep the repo blind. Point at symbols and paths. Exploration is input tokens.

### 5. Keep always-on rules thin. Unload MCP you aren't using.

`CLAUDE.md`, Cursor User Rules, Copilot instructions: per-message tax, not a one-time setup. Keep them short. Path-scope rules when the app allows it. Tool lists are standing context. Turn MCP off until you need it. Prefer a short CLI call over an always-connected server.

### 6. Images are token bombs.

Don't paste a screenshot "for vibe." Downscale. Crop. Don't re-attach. Codex vision is expensive. If the bug is in the pixels, send the pixels once.

### 7. Tame the tool-result tax.

Verbose traces, giant JSON, screenshots in the tool log: that's how windows die. Ask for diffs, not full files. Keep test failures, drop passing noise. Rein in MCP that returns novels.

### 8. Two strikes, then clear.

If the agent fails the same build twice, stop arguing in the junk drawer. Write a two-sentence constraint. New worker. Same window after a few loops is how models fixate on their own leftover mistakes.

### 9. Don't switch models mid-chat. Keep the prefix stable.

Cache discounts want a byte-identical prefix. Invariant stuff first: system, tools, rules. Volatile user last. Don't reshuffle rules mid-session. Don't switch tiers in the same thread — that's a cache miss. New chat if you change models.

### 10. Don't resume a stale session.

Idle long enough and some products re-bill the prefix. `/clear` and start. Don't wake last Tuesday's agent to fix a one-line typo.

### 11. Spec before code.

A tight first patch beats five repair loops. Write the interface contract. Then ask for the diff.

### 12. Drop finished files. One agent, one job, one branch.

When the refactor of `foo.ts` is done, drop it. Don't keep the whole tour in context. Split when the shape of the work changes. One agent, one checkout: worktrees for parallel agents. Don't share a dirty tree.

### 13. Pin worker models. Route by phase.

Mechanical edits, lint, search: cheap/fast models (Haiku, Luna, Composer, Flash). Hard reasoning: flagship, and only then. Resist staying on Opus or Sol out of habit. Pin workers explicitly. Sub-agents that inherit the parent will spend like the parent.

### 14. Local for mechanical work. Cap unattended runs.

Continue + Ollama for autocomplete and docstrings isn't "local is always cheaper." Hardware isn't free. It *is* quota preservation: keep the included cloud pool for work that needs the cloud. On unattended CLI, set a volume fuse (`--max-ai-credits` and friends). That's not Fast. That's a kill switch.

### 15. Batch, reuse, ask for the patch, stop before sludge.

One compile, many questions. Don't re-read the same file in five chats — summarize once, share the summary. Ask for the diff, not the essay. Suppress billed thinking on mechanical tasks. Stop before the window is sludge: commit, summarize, new session. Don't wait for the product to degrade the answers and raise the per-turn cost at the same time.

## Per-app notes (recheck before publish)

### Cursor

Auto is a router at the routed model's list price. It is not a discount. Don't leave Auto on as a savings strategy in 2026.

Fast is a separate multiplier. The product flips it back on while I work async. Check the chip before you launch a long agent. Privacy Mode, per Cursor's pricing FAQ, may disable some extra-usage paths — verify live.

Max Mode is 200k vs 800k. Don't leave 800k on for a 200-line module.

Sub-agents get a parent-written brief, not the chat. They inherit all MCP. Best-of-N and parallel agents multiply windows. Pin `fast=false` on children when you can. New chat per task. Watch `.cursor/rules` size. `.cursorignore` exists; use it.

Usage page in the dashboard. No first-party leftover CLI. CodexBar covers Cursor leftover.

### Codex

Rolling 5-hour pool plus weekly, then extra credits. Fast vs Extra Extra usage are different meters. Name `gpt-5.6-luna` when you want Luna; bare `gpt-5.6` has been routing to Sol — recheck before ship. `fork_turns` exists; the CLI default is undocumented, so this draft will not invent a number. Prefer a fresh brief over a deep fork. Image inputs are expensive. Azure provisioned vs pay-go is a different bill.

Live leftover: CodexBar (`steipete/CodexBar`). Don't treat tiny one-off bars as the community.

### Claude Code

Included weekly, then Extra Usage. `/context` and `/compact` are first-party. `/clear` between jobs. `CLAUDE.md` every turn except Explore/Plan. Fork copies parent; non-fork is brief-only. Effort / fast mode is a product flag, not "the included pool." Pin cheap models on sub-agents. Hooks that keep test failures and drop passing noise. `isolation: worktree` when you're paralleling. `ccusage` for historical logs.

### Antigravity

5-hour plus weekly. Default Fast quota on some tiers; Pro/Ultra/Max expand capacity. Separate Gemini vs Claude/GPT pools on Google AI Pro — exhaust both, don't leave one idle. Model Strategy Auto vs Manual: Manual if you need to stay off expensive models. Implementation Plan first, then task agents. Artifacts vs chat. Preview-model and prompt-only vs credits: read the meter you're actually on.

### Grok Bot

Grok 4 Fast vs Grok 4.1. SuperGrok vs Heavy. Context window is a billed shape — don't treat max context as free headroom. On paid Cursor plans, Grok Bot has had its own weekly pool; unused dies. Recheck before publish. Don't invent X.ai seat prices here. Product review lives on another card.

### Copilot, only as the Auto exception

GitHub Copilot's docs still list a 10% Auto discount. Cursor and Claude Auto bill at list. `/new` vs `/compact`. Session credit caps exist. Not the fifth how-to app in this piece — just don't copy Copilot's Auto advice onto Cursor.

## Monitor

Two jobs. Don't mix them.

**CodexBar** (~21k GitHub stars): live leftover. Menu bar plus CLI. Codex, Claude, Cursor, Copilot, Grok, Antigravity. Reset clocks and remaining percent. This is the one that chases vendor API changes.

**ccusage** (~18k stars, ~85k npm/week): historical logs. What did this week cost, by session and model. Not live remaining-%.

Optional if you want both in a TUI: tokscale. Skip tiny glue (`aiuse`, `aiquota`). Real, and not the community.

## Spot tasks (near-miss)

Unused included quota is spare capacity, like AWS spot instances. Interactive work — you're waiting on the answer — is on-demand. Deferrable, interruptible chores (backfill tests, docs, dead-code scans, dependency drift) can fill leftover before the reset, then preempt when you need the pool.

That dispatcher is almost a thing. It is not a product. `token-burn` and leftover bars watch. Native schedulers are still time-based, not leftover-based. Until something actually preempts, do it by hand: CodexBar shows spare quota near a reset, you queue a maintenance brief in a fresh worker, and you kill it before it spills into on-demand.

Don't build Chattic or Kanbus from this article. That's a later card.

## Be your own advocate

Vendors will keep making the premium default feel like a gift. Just say no.

Turn Fast off, and check that it stayed off. Pin cheap workers. Compact the manager; give each worker only the brief. Follow CodexBar and ccusage. Empty included buckets before they die. Spend leftover on interruptible chores, not on a latency lane nobody asked for.

Context hygiene is ordinary engineering applied to agent windows. Manage the pile the way you already manage memory leaks. The models get sharper. The bill gets quieter.

## Companion pieces

- [Never Use Fast](/blog/never-use-fast/) — the latency surcharge. Tax table lives there.
- [Maximize Value, Not Intelligence](/blog/maximize-value-not-intelligence/) — cheapest model that clears the bar.
- [The Year Coding Became a Commodity](/blog/ai-coding-cost-collapse-2026/) — Jevons and the market. One beat, not a retell.
