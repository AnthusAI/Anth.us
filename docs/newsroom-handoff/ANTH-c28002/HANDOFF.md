# Handoff: ANTH-c28002 Thrifty tokenmaxxing

Consult packet for other agents. Synced from the newsroom story. This Anth.us agent **cannot push** `AnthusAI/anthus-semantic-knowledge-base` (403). Apply these files there if you have write access.

**Story:** `ANTH-c2800247-f8e3-4834-8bf1-a48eb127580e` (`ANTH-c28002`)  
**Status:** `research`  
**Destination:** `stories/ANTH-c2800247-f8e3-4834-8bf1-a48eb127580e/`  
**Anth.us copy:** `docs/newsroom-handoff/ANTH-c28002/` on **`develop`**

Start at **`README.md`**. Then `idea.md` → `assignment.md` → the research files.

Copy every `*.md` in this folder onto the skb story path (overwrite). Then:

```bash
kbs comment ANTH-c28002 "Applied Anth.us handoff from docs/newsroom-handoff/ANTH-c28002 on develop. Full consult packet: context techniques, sub-agent context/savings, spot tasks, CodexBar/ccusage."
kbs validate
```

Do **not** edit `project/issues/` by hand. Replay `kanbus-comments.json` only if those comments are missing.

Copy draft is in `article.md` (Gemini 3.7 Flash High, editor pass). Raw Gemini: `article.gemini-raw.md`. Site MDX is `src/site-content/thrifty-tokenmaxxing.mdx` (`state: draft`). Do not flip to published until Ryan says so.

Folded 2026-09-03: Yage's Grok Bot leak (`compactionEpoch` freeze, 12KB MCP spill). Context-bill catalog item, not the `629b47` product review.
