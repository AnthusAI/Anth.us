# Prior art: specific, current money-saving pointers for AI coding tools

Fetched 2026-09-01 by Composer 2.5 research + gofer. Not a finished report.

Question Ryan asked: what prior art exists of people giving specific, current pointers for saving money with Claude Code, Codex, Cursor, Antigravity, Grok Bot, PostHog, etc.

## Landscape

Crowded but fragmented. Nobody owns a single current cross-tool *settings catalog* in narrative form.

- **Tokenminning** (`tokenminning.ai`) is the closest handbook: per-IDE wikis, same 5-step sequence (measure → route → trim context → tighten prompts → guardrails). Updated late August 2026.
- **Continuum** owns the best editorial Claude Code cost list.
- **Official vendor docs** are the durable primaries (Anthropic Help + costs, Cursor usage/pricing, GitHub Copilot optimize-AI-usage). They do not write the adversarial frame.
- **Quota CLIs** (`aiuse`, `aiquota`, `quotamax`) own use-it-or-lose-it / multiplex pacing. Weak on per-product settings.
- Cultural **“tokenmaxxing”** (`tokenmaxxing.com`, Built In) is a vanity-burn definition. Room to flip it: *thrifty* tokenmaxxing = extract paid quota without waste.

Our planned shape is still open: analog → Resist temptation → per-app catalog → multiplex unused quota. Tokenminning is a wiki. Continuum is Claude-heavy. Fast and Auto residue is stale and still circulating.

## What we already own (do not retell)

| Piece | URL | Already said | Leave it there |
| --- | --- | --- | --- |
| Never Use Fast (`8bde91`) | https://anth.us/blog/never-use-fast/ | Fast tax table; pin vs Auto; Codex `gpt-5.6`→Sol; empty the buckets | Fast multiples; Fast-vs-Flash essay; three-pool table as Fast context |
| Maximize Value (`0b6e8b`) | https://anth.us/blog/maximize-value-not-intelligence/ | Cheapest model that clears the bar; two-tier policy | Scoreboard, 2023 parable, Jevons resolution |
| Coding became a commodity (`ecc2ae`) | https://anth.us/blog/ai-coding-cost-collapse-2026/ | Cost per resolved task; Jevons catch | MIT/Dialogue-SWEBench arc |
| Grok Bot review (`629b47`) | https://anth.us/blog/grok-bot-gave-my-coding-agents-a-boss/ | Control-room product review | Workflow narrative, not billing |
| Pair programmer → executive | https://anth.us/blog/from-pair-programmer-to-executive/ | Coinage: “tokenmaxxing for fun and profit” | Do not re-coin |
| Cheap output, expensive cache (`ef4df5`) | unpublished | — | Not this article |

This card adds: the fight, live settings levers, cheap-model picker map, scheduling across misaligned pools.

## External catalog (worth knowing)

### Cross-tool handbooks

1. **Tokenminning IDE hub** — https://tokenminning.ai/ides — Aug 26–30, 2026. Cursor, Grok Bot, Windsurf, Devin, Cline, Copilot, Claude Code, OpenCode, Aider, Zed, Trae. Same 5-step recipe. Cursor: two pools, new chat per task, shorten rules, disable unused MCP, Composer/Auto for routine (Auto advice is now stale). **Compete** on catalog breadth.
2. **Tokenminning in Cursor** — https://tokenminning.ai/ides/cursor — Aug 30, 2026. Routing table, cache-reset on mid-chat model switch, anti-patterns (frontier for grep, Max Mode default). Claims 60–90% savings — editorial, not vendor.
3. **CodeWalnut, Token Economics for Coding Agents** — https://www.codewalnut.com/insights/token-economics-for-coding-agents — 2026. Framework: reduce input / route / reduce output. Not a settings catalog.
4. **tokenmaxxing.com** — https://tokenmaxxing.com/guides/what-is-tokenmaxxing — cultural definition only. Cite for the word, not the knobs.

### Claude Code (most written beat)

5. **Continuum, 11 changes** — https://continuumcode.ai/guides/reduce-claude-code-costs/ — Aug 2026. Ranked: Sonnet default, name files, `/clear`, `/effort low`, `/model opusplan`, `CLAUDE.md` <200 lines, disable MCP, cache TTL 1h subscription vs 5min API. Strongest non-vendor list.
6. **Anthropic Help: models, usage, limits** — https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code — five official habits; path refs vs `@file`; `opusplan`.
7. **Claude Code costs** — https://code.claude.com/docs/en/costs — `/usage` flags, subagent `model: haiku`, hooks, `--max-budget-usd`, agent teams ~7× tokens.
8. **Stephen Burns playbook** — https://stephenburns.ai/blog/token-efficient-claude-code-playbook — 2026-07-30. Two-strikes then `/clear`; MCP <10 / tools <80; 40% context rule.
9. **amux.io Max plan** — https://amux.io/guides/claude-code-max-plan/ — claims per-model quotas are independent (route Sonnet/Haiku to stretch Opus); parallel agents can use fewer tokens than one long thread; burn after weekly reset. Product-pitchy. Verify independence before we repeat it.

### Cursor / Grok Bot

10. **Cursor usage + models** — https://cursor.com/help/models-and-usage/usage-limits — https://cursor.com/docs/models-and-pricing — two monthly pools, no rollover, Auto = list price of routed model. Primary.
11. **Forum: subagent leak** — https://forum.cursor.com/t/unclear-usage-billing/166069 — Auto/Grok parent can spawn Opus/Sonnet Task subagents onto Other Models. Pin subagent to Composer 2.5. High-value gotcha, forum-only.
12. **Forum: Auto spillover** — https://forum.cursor.com/t/why-does-auto-silently-fall-back-to-api-usage/164874 — Auto+Composer pool → included API quota → on-demand. No toggle; $0 spend cap to hard-stop.
13. **Grok Bot plans** — https://cursor.com/help/grok-bot/plans — weekly pool on paid Cursor, separate from the two monthly pools. Unused dies. Allowance size unpublished. Staff had to correct “it eats main Cursor quota.”
13b. **Yage, Grok Bot leak / frozen system prompt** — https://yage.ai/share/grok-bot-context-engineering-en-20260827.html — 2026-08-27. `compactionEpoch` freeze: memory + profile byte-stable until compaction. Manus 2025 “Keep your prompt prefix stable.” 12KB MCP spill to `agent-tools/` + `hasReadPath`. Sibling: dynamic tools leak. Belongs on this card (context bill), not `629b47` product review.
14. **Stale residue still ranking:** Finout / AIToolsRecap / CodePick still say leave Auto on / Auto is unlimited. That is the other free-hit. Our Cursor Auto pack already fact-checks this (`cursor-auto-factcheck.md`).

### Codex

15. **backgrind GPT-5.6 Sol/Terra/Luna** — https://backgrind.com/blog/gpt-5-6-sol-terra-luna/
16. **Codex KB migration** — https://codex.danielvaughan.com/2026/08/05/gpt-5-6-model-migration-codex-cli-luna-terra-sol-config-profiles-task-routing/ — `~/.codex/config.toml` profiles; subagents inherit parent model (Sol parent cannot cheap-route children).
17. **OpenAI community price drop** — https://community.openai.com/t/announcing-a-major-price-drop-for-5-6-terra-and-luna-and-fast-mode-for-5-6-sol/1388484 — Luna $0.20/$1.20; Auto-review → Luna. Primary for prices.
18. Official “save money with Codex” page is thin. Weekly message-count tables conflict across OpenAI pages. **Do not invent weekly caps.**

### Antigravity

19. **Google forum, wrong pool** — https://discuss.ai.google.dev/t/rate-limited-but-drawn-from-wrong-pool/173716 — staff: Gemini vs Claude/GPT separate; 5h burst can zero a group while weekly % still looks healthy.
20. **sanj.dev quota problems** — https://sanj.dev/post/google-antigravity-quota-problems-fix/
21. **Official plans** — https://antigravity.google/docs/plans — 5h refresh until weekly cap (Pro/Ultra); Free is weekly only. Blog: Gemini = one shared pool; non-Gemini = separate fixed limit. “Exhaust both” is *our* tactic, not Google advice.
22. **antigravitylab.net token-halving** — API/self-host agents, not Google AI Pro. Ignore for the subscription catalog.

### Copilot, Windsurf, Cline, Aider, PostHog

23. **GitHub: Optimizing your AI usage** — https://docs.github.com/en/copilot/tutorials/optimize-ai-usage — Auto model selection 10% discount; `/compact` `/new`; session `--max-ai-credits`. Best official Copilot thrift page.
24. **Windsurf** — Tokenminning + https://www.verdent.ai/guides/windsurf-pricing-2026 — SWE-1.5/1.6 free on Pro+; pin vs adaptive router; monthly quota no rollover, add-on credits do. Rebrand to Devin Desktop — currency risk.
25. **Cline** — Tokenminning + Cline model-orchestration sample. Plan→Act, `.clineignore`, no built-in spend cap (issue #5870).
26. **Aider** — https://aider.chat/docs/config/adv-model-settings.html — `weak_model_name` / `editor_model_name`. BYOK, not a subscription pool game.
27. **PostHog Code** — https://posthog.com/docs/posthog-code/pricing — $20/mo free, pass-through model prices, default $50 billing limit. Not a quota-pool peer. One paragraph at most.
28. **Continue.dev** — dead (Cursor acquired June 2026). Ignore except as a footnote that per-role routing migrated into Cursor.

### Multiplex / use-it-or-lose-it

29. **aiuse** — https://github.com/djbclark/aiuse — ranks what to burn *now* before reset; treats Cursor pools separately.
30. **aiquota** — https://github.com/kohii/aiquota
31. **quotamax** — https://github.com/jhammant/quotamax — JSON advice for orchestrator parallelism caps.
32. **ashu.co** — https://www.ashu.co/cursor-to-claude-code-stuck-at-16-percent-utilization/ — single-agent ceiling ~16% weekly; parallelism required to consume quota.
33. **BSWEN** — 80/20 burn early in cycle; backup-tool matrix.

## Per-tool coverage

| Tool | Best outside source | Specificity | What nobody documents well |
| --- | --- | --- | --- |
| Claude Code | Continuum + Anthropic Help + costs | High | Verified Max per-model quota independence; cross-plan pacing vs Codex/Cursor |
| Cursor | Official pools + forum subagent leak + Tokenminning | High on pools, medium on tactics | Current spillover order; pin Composer Standard vs Luna pool tradeoff; Pro vs Teams Router |
| Codex | backgrind + Codex KB + OpenAI price post | High on Luna/Terra/Sol, low on weekly limits | Official save-money page; subagent inheritance lock; conflicting 5h tables |
| Antigravity | Google forum + plans doc | Medium mechanics, low settings | Official quota numbers; AI Credits toggle side effects |
| Grok Bot | Cursor Grok Bot plans + forum | Medium separation, low sizing | Weekly allowance units; routine context re-send cost |
| PostHog Code | PostHog pricing | Low | Skip or one graph |
| Copilot | GitHub official optimize doc | High | Less pool-game material |
| Windsurf | Tokenminning + Verdent | Medium | Devin Desktop rebrand dates |
| Cline / Aider | Docs + Tokenminning | Medium, BYOK | Spend caps still missing on Cline |

## What nobody has written (our gap)

1. One narrative: Claude Code + Cursor + Codex + Antigravity + Grok Bot, current pool names, spillover, Resist temptation.
2. Cursor subagent → Other Models leak as a first-class warning.
3. Grok Bot routine context re-send with a worked example.
4. Codex subagent inheritance lock (Sol parent, Luna children).
5. Antigravity “wrong pool” UX when 5h Claude is 0% and weekly Claude looks fine.
6. A verified multiplex calendar across Codex weekly / Cursor monthly / Claude 5h+weekly.
7. Unused-quota dollar-at-risk across all subscriptions in one editorial piece (`aiuse` is a CLI).
8. Plan-tier games: when Pro+Cursor+Codex Plus beats one Max seat.
9. Official Codex weekly cap — absent. Anyone quoting weekly message counts is guessing.

## Cite if we write (8)

1. https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code
2. https://code.claude.com/docs/en/costs
3. https://cursor.com/help/models-and-usage/usage-limits and https://cursor.com/docs/models-and-pricing
4. https://forum.cursor.com/t/unclear-usage-billing/166069
5. https://docs.github.com/en/copilot/tutorials/optimize-ai-usage
6. https://community.openai.com/t/announcing-a-major-price-drop-for-5-6-terra-and-luna-and-fast-mode-for-5-6-sol/1388484
7. https://discuss.ai.google.dev/t/rate-limited-but-drawn-from-wrong-pool/173716
8. https://tokenminning.ai/ides — competing catalog; we differentiate (narrative, multiplex, current Auto/Codex/Grok quirks)

Honorable: Continuum Claude guide, Stephen Burns, `aiuse` README, Cursor Grok Bot plans.

## Verification hits from the gofer (do not treat story notes as true)

| Note | Verdict | Say instead if needed |
| --- | --- | --- |
| Antigravity two pools | Partial | Gemini = one shared pool; non-Gemini = separate. UI string “Claude and GPT” is forum/UI, not current models-doc title |
| Exhaust both | Unverified as vendor advice | Our scheduling tactic |
| Weekly + 5h | Structure verified | Pro/Ultra: 5h until weekly cap |
| Cursor two pools | Verified | Monthly, no rollover |
| Pin Composer 2.5 or Luna | Levers yes; Luna ≠ Composer | Luna is GPT-5.6 Luna on Other Models. Pin Composer 2.5 **Standard** for the big pool |
| Auto = routed list price | Verified | 2026-09-01 docs |
| Grok Bot weekly pool, unused dies | Verified | Size unpublished |
| `gpt-5.6` → Sol | Verified (API + Codex Power default) | Use `gpt-5.6-luna` for cheap |
| Kimi / GLM 5.2 / DeepSeek / Qwen | Cursor has Kimi + GLM 5.2 pages. DeepSeek/Qwen: no official Cursor model pages. Codex/Claude/Antigravity: not first-party |

Stale landmines: CodePick $20 Agent-credit Cursor articles; Continue.dev; pre-June-2026 Gemini CLI daily limits; “leave Auto on.”
