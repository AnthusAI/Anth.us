---
title: "Stop Burning Tokens: The Practical Guide to Context Hygiene and Quota Thrift"
slug: "stop-burning-tokens"
date: "2026-09-01"
copy: "Gemini 3.7 Flash High"
agent: "bc-c922fab2-56c4-5894-8267-ca3abca6b4b9"
note: "Raw Gemini output. Editor pass is article.md. Newsroom draft — not site MDX."
---

AI developer tooling has settled into an uncomfortable commercial pattern: the defaults are designed to burn as much compute as possible before you notice.

Open a new workspace or agent session, and you're dropped straight into the highest-priced flagship model, priority queueing turned on, auto-routing enabled, and every available plugin or context scraper pre-loaded. It feels generous on day one. By day fifteen, your included pool has evaporated, your team has spilled into on-demand metered billing, and nobody can point to a single PR that actually required that firehose of tokens.

The vendor's commercial incentive is simple: maximize token volume and accelerate your trip into overage fees. Your engineering goal is the exact opposite: ship high-quality code while keeping total spend predictable. Our interests aren't aligned here. You have to be your own advocate.

Turning off the priority lane—which I covered in [Never Use Fast](/blog/never-use-fast/)—is just the rate side of the equation. You can dodge the priority multiplier and still get crushed by pure volume. Context is the bill. Every turn in an unmanaged agent thread re-reads everything that came before it. If you don't manage context volume with the same rigor you apply to memory leaks or database queries, your tooling costs will balloon while your agent's actual reasoning degrades.

Controlling that spend doesn't start with an accounting spreadsheet. It starts with three engineering principles, a systematic catalog of context hygiene techniques, and an understanding of how your tools bill your sessions under the hood.

---

## The Three Principles

Managing AI coding costs isn't about pinching pennies on productive work. It's about eliminating waste so you can run more agents on the problems that matter. Everything in this guide flows from three core principles:

1. **Resist temptation.** Default away from frontier overkill and premium latency tiers. Route mechanical work to fast, economical models, and make expensive reasoning models earn their way in. ([Maximize Value, Not Intelligence](/blog/maximize-value-not-intelligence/) walks through the economics of choosing the cheapest model that clears your quality bar).
2. **Monitor.** You can't trim what you don't measure. Track live token burn and remaining pool balances so you know your burn rate before you hit an overage cliff.
3. **Maximize included pools only.** Subscription quotas are strictly use-it-or-lose-it. Empty your included buckets every cycle, because their marginal cost is zero and their salvage value is zero. But never let background work spill over into Fast multipliers or on-demand retail meters.

Fast mode and on-demand overages aren't part of your included pool. They're metered retail purchases. The moment an agent crosses that line without human approval, you're paying a premium for compute nobody asked for.

---

## Context Is the Bill

Why does context volume dominate your invoice? Because LLM agent loops operate with quadratic context accumulation.

When an agent runs for 25 turns, it doesn't just read the current instruction. On turn 25, it re-ingests the system prompt, tool definitions, rules files, every command executed, every compiler error, and every intermediate file dump from turns 1 through 24.

The developer community has started documenting the scale of this waste. In an analysis of agent token efficiency, ashu.co observed that effective context in long-running chats often hovers around 16%—meaning roughly 84% of what you're paying to transmit on every turn is conversational sludge, stale error traces, and redundant directory dumps. BSWEN documented an 80/20 rule for AI developer spend: roughly 80% of unmanaged token costs come from the 20% of runaway sessions where context was allowed to compound unchecked.

Earlier community discussions, from the Tokenminning wiki to Continuum's practical advice on right-sizing away from top-tier models for routine tasks, focused on picking cheaper models. But picking a cheaper model only lowers the rate; it doesn't fix the volume multiplier. If an agent carries a 150k token context window into a three-line docstring update, you're still throwing money away.

---

## The 15 Techniques for Context Hygiene and Model Thrift

Here's the complete catalog of techniques to keep agent context lean, fast, and economical.

### 1. Sub-Agent Isolation vs. One Growing Thread
The single most effective architectural pattern is separating the manager from the workers. Keep your manager thread long-lived for planning and synthesis, but compact that manager thread separately. When it's time to write code, spawn dedicated worker sub-agents that receive a fresh, clean context initialized with only their specific task brief—not the manager's accumulated junk drawer.

Worker isolation saves massive token volume because the worker doesn't re-bill parent history on every edit. But keep an eye on parallelism: running five sub-agents in parallel multiplies active context windows simultaneously. This introduces a quick beat of Jevons paradox: making sub-tasks cheaper and easier encourages you to run far more of them, which can push total token volume higher. That extra work is great if it's soaking up included subscription quota you'd lose anyway; it's a disaster if it's burning on-demand credits or Fast multipliers (a dynamic explored in [The Year Coding Became a Commodity](/blog/ai-coding-cost-collapse-2026/)).

When you aren't delegating to sub-agents, treat `/clear` as a mission reset. Don't let a completed feature ticket linger in the session when you start your next bug fix.

### 2. Context Hygiene Commands
Use native context commands aggressively. Run `/context` to inspect what's currently resident in the window, and trigger `/compact` to compress conversational history before entering a multi-turn implementation loop. Use session rewind, branch duplication, and summarize-and-restart workflows when a thread wanders. And never paste the same 50-page PDF, API spec, or documentation dump twice in the same conversation.

### 3. Plan vs. Execute Split
Separate your planning phase from your execution phase. Run your brainstorming, architecture debates, and option exploration in a heavy, throwaway thread. Once the approach is solid, extract the final markdown plan and paste it as the initial brief for a brand new, lightweight execution thread. Your coding agent doesn't need to pay to read the fifteen rejected designs that preceded the final spec.

### 4. Don't Dump the Repo
Avoid broad repository dumps. Never paste raw 400-file directory trees or run unchecked wildcard file inclusions. Use targeted `@`-mentions for specific files and rely on scoped ripgrep searches. Let the agent discover what it needs through precision lookups rather than force-feeding it your entire codebase upfront.

### 5. Lean Rules, Modular Skills, and MCP Unloading
Project instructions like `CLAUDE.md`, `.cursorrules`, and Cursor User Rules load on every single turn. Keep them ruthlessly edited, concise, and focused on invariant repository standards. Unload Model Context Protocol (MCP) servers you aren't actively using during the current session. Keep in mind that Cursor child sub-agents inherit *all* active MCP tool declarations from the parent environment, which inflates their base prompt on every turn. Conversely, Claude Code's Explore and Plan phases are optimized to skip redundant rule injections.

### 6. Screenshots and Images Are Token Bombs
High-resolution images and UI screenshots chew through thousands of tokens per pass. Never paste screenshots "for vibe" or general context. If you must provide visual bug evidence, downscale the image, crop tightly to the affected UI element, and never re-attach the same screenshot on subsequent turns in the same chat.

### 7. Tame the Tool-Result and Compaction Tax
Tool outputs are a primary source of context pollution. A single unformatted JSON dump, verbose test trace, or browser screenshot embedded in a tool log can inject 20,000 tokens of noise into your history. Explicitly instruct agents to return unified diffs instead of full file contents, filter unit test output to only show failures, and rein in noisy MCP servers that return essay-length responses to basic status queries.

### 8. Don't Retry the Same Failure in the Same Window
If an agent fails a build or test loop two or three times in a row, stop. The active context is now saturated with misleading error logs and failed repair attempts. Continuing to prompt in that polluted window causes the model to fixate on its own hallucinated workarounds. Kill the session, write a two-sentence summary of why the attempt failed, and start a fresh worker with that constraint added to the brief.

### 9. Prompt Caching and Prefix Stability
Modern LLM pricing relies heavily on prompt caching discounts, which require byte-identical prefix matching. Keep invariant elements—system instructions, core tool schemas, and base project rules—at the very beginning of the prompt. Place volatile elements—user input, dynamic files, and turn-specific instructions—at the end. Avoid editing or reshuffling rule files mid-session, which instantly invalidates cache hits across your team's active sessions.

### 10. Spec Before Code
Writing a crisp, ten-line specification or interface contract before asking for code results in a tighter first patch. A clean first patch eliminates five to ten subsequent repair loops full of compiler errors, test failures, and context sludge. A few minutes spent refining the prompt saves thousands of tokens in downstream corrections.

### 11. Model Routing by Phase
Match the model tier to the cognitive load of the task. Use fast, cost-effective models (Flash, Haiku, Luna, Composer) for mechanical edits, boilerplate generation, lint fixes, and targeted searches. Reserve flagship reasoning models (Opus, Sol) exclusively for complex architectural decisions, thorny debugging triage, or ambiguous system design. Resist the temptation to stay on the flagship tier out of habit.

### 12. Local and Offline Models for Mechanical Chores
Running local models via tools like Continue and Ollama (using Qwen, DeepSeek-Coder, or Llama) for inline autocomplete, docstring generation, and simple unit tests isn't about claiming "local is always free." Hardware and electricity have real costs. The real value is quota preservation: routing mechanical tasks locally keeps your high-end cloud subscription quotas intact for the heavy reasoning work that actually demands cloud models.

### 13. Batch and Reuse
Run a single build, test, or compilation pass and ask multiple questions against that output, rather than triggering separate execution passes for each inquiry. If five parallel sub-tasks require information from the same large dependency file, extract a shared summary once rather than having all five workers read the full source independently.

### 14. Output Discipline
Ask the model for the diff or patch directly, without conversational fluff, narrative preambles, or patronizing summaries. Furthermore, when using models with extended reasoning (chain-of-thought) in products that meter or bill thinking tokens separately, suppress verbose thinking modes on deterministic, mechanical tasks that don't require deep deliberation.

### 15. Session Budgets and Hard Stop Ceilings
Establish a hard ceiling on session length. When a thread crosses 40k to 50k tokens of accumulated history, reasoning quality drops while per-turn costs spike. Stop before the window turns to sludge: commit the clean diffs, summarize the remaining work, and launch a fresh session to finish the job.

---

## Per-App Quirks and Gotchas (2026 Reality)

Every tool has its own billing quirks, defaults, and hidden toggles. Here is how the landscape looks today:

### Cursor
- **Auto Mode**: Cursor's Auto mode is an automated router that bills at the list price of whichever model it chooses—it is not a discounted rate. Don't leave Auto on as a cost-saving strategy.
- **Fast Multiplier**: Fast mode is a separate priority multiplier. Watch out: the product has a habit of silently flipping Fast back on across updates or new sessions. Check your model chip before launching long async agent runs. (Check your product's specific multiplier; while Composer Fast was documented at 6× Standard in our earlier checks, multipliers shift frequently).
- **Max Mode**: Cursor offers a 200k vs. 800k context toggle. Don't leave 800k enabled when you're editing a standard 200-line module.
- **Sub-Agent Mechanics**: Cursor sub-agents receive parent-written briefs rather than the raw chat transcript, but they inherit *all* configured MCP servers from the host environment, which inflates base token consumption.
- **Monitoring**: Check the Usage page in your Cursor dashboard regularly. There is no first-party leftover CLI, but community tools like `CodexBar` can track your quota status. Note that Cursor's pricing FAQ indicates Privacy Mode may disable certain extra usage telemetry.

### Codex
- **Pool Structure**: Operates on a dual pool system: a rolling 5-hour refresh plus a weekly allotment, with extra credits available for overages.
- **Tiers**: Distinguishes between Fast mode and Extra Extra usage tiers.
- **Context Forking**: The `fork_turns` flag exists for branching context, though its CLI default is undocumented. Avoid deep forks when a fresh brief will do.
- **Input Costs**: Vision and image inputs remain exceptionally expensive.
- **Monitoring**: Use community utilities like `natefik/codexbar` or `pskl/codexbar` to inspect live pool balances.

### Claude Code
- **Billing**: Extra Usage triggers automatically once your included weekly tier is exhausted.
- **Hygiene Commands**: Native support for `/context` and `/compact`.
- **Rule Loading**: `CLAUDE.md` is re-injected every turn, though the specialized Explore and Plan modes are optimized to skip redundant rule injections.
- **Forking**: Running `fork` copies the entire parent conversation history; spawning standard non-fork workers passes brief-only context.
- **Modes**: Effort and fast modes are controlled via dedicated product flags.
- **Monitoring**: `ccusage` is the standard tool for parsing local logs and inspecting historical token spend.

### Antigravity (Google AI)
- **Quotas**: Features a 5-hour rolling pool alongside a weekly limit. Standard tiers include default Fast quota, with Pro, Ultra, and Max tiers expanding capacity.
- **Model Strategy**: Offers Auto vs. Manual routing. Switch to Manual if you want to prevent the system from automatically escalating mechanical tasks to expensive flagship tiers.
- **Workflow**: Generate an Implementation Plan artifact first, then spin up targeted task agents to execute individual steps.
- **Billing**: Pay attention to preview model designations and prompt-only vs. credit billing.

### Grok Bot
- **Model Selection**: Offers Grok 4 Fast vs. Grok 4.1, along with SuperGrok vs. Heavy reasoning tiers.
- **Billing**: Treats the context window as a billed geometric shape. On paid Cursor plans, included Grok Bot usage resets weekly, with overages spilling directly into on-demand billing.

### The Auto-Discount Exception: GitHub Copilot
While Cursor and Claude Code route Auto models at full list price, GitHub Copilot remains an exception: its documentation still lists a 10% discount when using its automated model selector. Keep that distinction in mind if you work across multiple IDE ecosystems.

---

## Tooling and Monitoring: What to Run

Don't rely on guesswork or raw invoices to track token consumption. Follow established open-source tools with active community support:

- **CodexBar** (~21k GitHub stars): The standard live menubar and CLI tool for monitoring real-time remaining quota across multiple AI providers (Cursor, Codex, Claude, and Antigravity). It shows you exactly how much included capacity remains in your 5-hour and weekly pools.
- **ccusage** (~18k stars, ~85k weekly npm downloads): The essential tool for inspecting Claude Code logs, breaking down token burn by session, model, and caching efficiency.

Skip tiny, unmaintained zero-star wrapper scripts. Stick to tools that accurately parse official logs and API counters.

---

## Spot Tasks: The Unused Quota Opportunity

Subscription quotas are structured with rolling 5-hour windows and weekly resets. If you have 40% of your pool remaining thirty minutes before a reset, that compute simply vanishes.

Unused included quota is spare capacity, exactly like AWS spot instances.

Interactive development—where an engineer is actively waiting for an answer—is on-demand compute. Deferrable, interruptible chores—backfilling unit tests, syncing documentation, checking for dead code, scanning for dependency drift, or exploring refactoring paths—are spot tasks.

In an ideal workflow, background spot tasks would automatically spin up to consume leftover quota right before a reset, and immediately yield (preempt) the moment a developer sends an interactive prompt. Today, this is a near-miss: tools like `afterburner`, `token-burn`, and community leftover monitors attempt to track this space, but native IDE schedulers are still strictly time-based (cron) rather than leftover-aware.

Until first-party tools support true spot scheduling, you can capture that value manually: when your monitor shows spare quota nearing a reset window, queue up non-urgent maintenance briefs in fresh worker threads. Just ensure those tasks are killed before they spill into on-demand billing.

---

## Be Your Own Advocate

Tooling providers will continue to make priority lanes, heavy models, and auto-expanding context windows the default. That makes sense for their balance sheets. But our job is to deliver reliable software efficiently.

Take control of your environment:
- Turn off Fast mode unless someone is actively waiting on the output.
- Keep your system prompts and rules files lean.
- Isolate your workers with fresh briefs instead of dragging around 100k tokens of conversational baggage.
- Monitor your pools with `CodexBar` and `ccusage`, and empty your included buckets before they reset.

Context hygiene is just engineering discipline applied to agent workflows. Manage your context with the same care you give your codebase, and you'll get faster, sharper results at a fraction of the cost.

---

### Companion Pieces
- [Never Use Fast](/blog/never-use-fast/) — Why priority latency lanes are almost never worth the multiplier for asynchronous agent work.
- [Maximize Value, Not Intelligence](/blog/maximize-value-not-intelligence/) — The economic framework for routing work to the cheapest model that clears your quality threshold.
- [The Year Coding Became a Commodity](/blog/ai-coding-cost-collapse-2026/) — How falling capability costs and expanding agent loops multiply to change software engineering economics.
