# Content review, October 2026

A review of anth.us against three goals Ryan set: win clients, work, partners and investors; get Auritus, Chatticus and Papyrus ready for ad campaigns; and own search on "fine-tune decision model", "fine-tune Jev" and "align Jev to your data", where a decision model is a fast AI model that answers a bounded question with a verdict and a confidence. It covers what the site is for, who each page serves, where the story breaks, what each product needs before an ad can point at it, and a prioritized list of work. The small fixes found along the way were done during the review and are listed at the end with their Kanbus IDs.

Facts in this memo come from the content repo at commit 4b80f02, the site at develop 2a9d78d, the product repos' READMEs, and the live sites on 2026-10-03.

## What the site is for

The site has one story, written down in `docs/site-story.md`: a team that ran a revenue-critical platform since 2007 started using AI to write code and make decisions, found that a human had to sit in the loop or everything stopped, and built the tools that let a person step out of the loop without losing the record. Every page is supposed to serve one sentence of that paragraph.

The commercial path that story feeds is short and it works: a research article with real numbers, a closing paragraph that says we run this loop for clients, and the engagement page, which promises a scoped first month and a scorecard the client can inspect. Nine published articles carry the `client-acquisition` tag and end on `/engage`. That is the strongest thing on the site and the review's first recommendation is to protect it.

The site is a services site. Products appear as components of the platform, as proof of how we work, and as the subjects of research. None of them has a page that an ad could point at.

## Inventory

128 MDX files in the content repo.

| Section | Published | Draft | Notes |
| --- | --- | --- | --- |
| Articles (root) | 46 | 15 | 2023 to 2026. The 2026 Jev series (eleven pieces since September 17) is the current center of gravity. |
| Posts | 48 | 0 | Short link posts, 2024 to 2026, including the `reading` entries. |
| Solutions | 19 | 0 | Ten of these are 56 to 81 word stubs from 2014 to 2023 (Marketo, Salesforce, Ticket-Driver and the other Venue Driver integrations). |
| Platform | 11 | 0 | Plexus, Kanbus, Tactus, Biblicus, Babulus, Caducus, Korporus, VideoML, Virtuus, Antharchy, Chatticus. No Auritus, no Papyrus. |

Eleven articles carry `client-acquisition`; ten are published and nine of those close on `/engage` (`decision-models-are-not-calculators` does not). Three research pieces from the last week (`glide-decision-model-ten-seconds`, `openai-decisions-api-preview`, `can-averaging-reduce-noise`) have neither the tag nor the close, and all three are about decision models.

Fifteen drafts are unpublished. Task kanbus-ce099b already covers the triage; nothing here changes it.

## What Limatus found

All 102 published articles, posts and solutions were scanned with the Anthus style profile on the Limatus `plain-statement-checks` branch. The judge checks need an API key this environment does not have, so these are the deterministic checks only.

The patterns that matter, rather than the counts:

- **"Honest" for "calibrated", eight times across the Jev series** (`plexus-classifier-lab`, `can-you-trust-jev-confidence`, `distilling-jev-into-a-classifier`, `jev-vs-laya`). Fixed in content PR #19. The same series also said twice that confidence gating lets a QA operation review every call; both now say "far more calls than a sampled audit", since full coverage is not a claim we make.
- **"Decision model" undefined in the opening paragraph** of `plexus-classifier-lab`, `one-word-test`, `glide-decision-model-ten-seconds` and `can-averaging-reduce-noise`. The flagship pieces (`encoding-prejudice`, `fine-tuning-jev`) define it in the first sentence and read better for it. Not fixed; each needs an author's sentence.
- **Punch-line cadence, 68 findings after the Limatus fix below.** Most are real: "So we did." "Nobody trained anything." "The control has to be structural." They cluster in the Jev series, which was written fast. Worth one editing pass per article rather than a sweep.
- **435 uncontracted forms and 201 passive sentences**, concentrated in the long 2023 to 2025 pieces (`cybernetic-development` alone has 81 of each). The profile favors contractions; these older pieces predate it. Low value to fix by hand.
- **Six pieces fail the density thresholds** (`langchain-by-example`, `how-ai-agents-do-things`, `from-pair-programmer-to-executive`, `the-dominance-of-ones`, `maximize-profit-not-intelligence`, `rethinking-ai-hallucination`), all because the gzip ratio is under 0.35, which on long technical pieces usually means repeated code or tables, not padding.
- **Banned intensifiers** survive only in legacy copy: "seamlessly" and "cutting-edge" in the Venue Driver excerpt (fixed in PR #19), "seamless" on the Ryan page and in the Vault stub, "Leverage" in the About values list.

Two Limatus defects turned up while scanning and are fixed in Limatus PR #43: the document intent was the MDX `import` line in 84 of 102 scans, and the punch-line check flagged short closing sentences that state a number.

## Page by page

| Page | Sentence of the story it serves | State |
| --- | --- | --- |
| Homepage | Who we are; the proof line | Hero and proof line do their job. The "How we work" paragraph is 130 words in one breath and would read better split at "Everything we ship now". The case-study box names Call Criteria below the fold while the hero anonymizes it; the story doc allows this, but it is the one place the name appears on the page. |
| About | The turning point, in full | Two pages stitched together. The top half is 2023 brochure copy (Tiësto tour, Marketo and Paytronix integrations, "innovative", "impeccable record", "harnessing serverless architectures", "Leverage DevOps"). The bottom half, from the tweet onward, is in the house voice and is the best writing on the site. Key Facts and the FAQ carried "14+ years" and "two years" until this review. |
| AI Solutions | The four capability boxes | The homepage source comments call this "2023 copy" and link past it on purpose. It still appears first in the menu. |
| Engage | The vision, in the reader's terms | The strongest page. Three example shapes, a first month, a month six. Nothing to change. |
| Decision models hub | The loop, taught | Sound structure: FAQ with schema, the loop in order, the engagement box. Two phrasings fixed in this review ("This is that loop", "That is the whole labelling effort"). Not in the menu. |
| Benchmarks | Measurements published | Fine. The Hard-Decisions card quotes a different headline figure from the live leaderboard (kanbus-f441f5). `/biased-decisions/` is on develop and 404s in production until the next release. |
| Platform | The choice, told as what we built | Eleven components. Auritus and Papyrus are missing, and they are two of the three products Ryan wants campaigns for. |
| Solutions listing | Values in action | Call Criteria, DataParade, Venue Driver and SQLBot are real case studies. Ten stubs under 80 words sit beside them and date the whole section to 2014. |
| Research | Teaching | Works. It is where the Jev series lives and the hub's "every step is a published experiment" line points here. |

## Tone

Two registers coexist. The 2026 research writing is plain, specific and numeric, and the voice guide describes it accurately. The 2023 to 2024 marketing copy on About, AI Solutions, the Plexus solution page (before this review) and the Venue Driver excerpt is in the register the guide bans: intensifiers, "innovative" and "pioneering", capabilities stated without a number. A reader who arrives from a Jev article and clicks About meets a different company.

`AGENTS.md` still carries a "Strategic Marketing Terminology" section that tells writers to emphasize "Hyperautomation", "Cybernetic Systems" and "Self-Evolving AI Agents". It contradicts the voice guide's lexicon and the plain-statement rule, and it was the source of the "two years" claim that kept resurfacing. It should be cut down to the terms we can prove (RLHF in production, data flywheel, human in the loop, decision model) with the proof beside each.

`plexus.anth.us` presents Plexus as an "AI Agent Incubator" in "Early Access". anth.us presents it as an MLOps platform and classifier lab that has run in production for years. Both are true of different parts of the product, but a client who checks the product site after reading the case study finds a different pitch.

## Gaps by audience

**Clients.** The research-to-engage path covers the judgment-task client well. Missing: a second named engagement besides Call Criteria and DataParade (the site story asks for this and notes the Call Criteria name can't carry the homepage); any client quotation (none exists on the site, and none should be written without a real one); and the three newest research pieces closing on `/engage`.

**Partners.** Nothing on the site addresses a partner: an agency that would resell the classifier lab, a model vendor (TypeSafe, Fastino, Desert Ant Labs appear in the research) that would co-publish, or an integrator that would run Plexus. The research articles are the natural partner material, since they test vendors' models in public. One section on the engagement page, "If you build or sell a decision model", would be enough to start.

**Investors.** Nothing. The site is a services site and the products that an investor would ask about (Plexus, Chatticus, Papyrus, Auritus) are described as platform components. Whether the investor story lives on anth.us at all is Ryan's decision; if it does, it is one page that says what we are building, what already runs, and the public record behind it, with no forward-looking claims the site can't back.

**Product customers.** Covered below, product by product.

## Search: who owns which phrase

| Phrase | Owner | Supporting pages | Risk |
| --- | --- | --- | --- |
| align Jev to your data | `/decision-models/` (H1 "Aligning Jev and other decision models to your data") | `plexus-classifier-lab`, `fine-tuning-jev` | Low. The hub has it in the title and the FAQ. |
| fine-tune Jev | `/blog/fine-tuning-jev/` (title "Fine-Tuning Jev: You Can't") | hub FAQ "Can you fine-tune Jev?" | The hub's meta description opens with the same sentence as the article ("You can't fine-tune Jev"). Both pages compete for the same query. The hub description should lead with "align". |
| fine-tune decision model | Nobody. | `jev-vs-laya` (fine-tunes Laya), `distilling-jev-into-a-classifier`, `fine-tuned-classification-with-confidence` (2025) | The phrase appears in no title or H2. The hub FAQ "Can you fine-tune Jev?" should become "Can you fine-tune a decision model?" with Jev as the example, which also stops it competing with the article. |
| decision model benchmark | hard-decisions.anth.us | `/benchmarks/`, `/biased-decisions/` | No overlap with the fine-tune phrases. The benchmarks page should keep pointing out rather than restating. |

Before this review the hub had four inbound links on the whole site (homepage box, benchmarks page, two articles) and none from the six Jev articles it summarizes. PR #19 adds a link from each. The hub is also absent from the menu; "Research" and "Benchmarks" are there, and the hub is the page between them that a buyer wants. Adding it is a one-line change in `gatsby-config.mjs`, left for Ryan because the menu is already seven items.

## What each product needs before an ad can point at it

An ad needs one page with the one-sentence promise, the proof, and a call to action that matches where the product is.

**Auritus.** Live at aurit.us, open source under MIT, and the only one of the three that is ready for a campaign today. Promise: narrate your pages with an open voice model on a GPU you run, with AWS taking over only when that worker is offline, so your page text never goes to a TTS vendor. Proof: the example pages play six backends (Kokoro, Qwen 3 CustomVoice, F5-TTS, Higgs Audio v3, Chatterbox, Fish Speech). Limits to state: the operator CLI is not on PyPI yet; install from source or a release. Call to action: the embed snippet and the repository. Missing on anth.us: any mention at all. Needs a platform page and one article (filed as ANTH-134bbc).

**Chatticus.** Pre-launch. The repo says v1 is "one household, one AWS account", the production front door at hey.chattic.us is dark by design, and chattic.us already runs a waitlist. anth.us correctly says "Active development" and the site story keeps it out of the paragraph on purpose. A campaign can only sell the waitlist. Promise: named bots with their own memory, one shared computer, and an approval before anything consequential. Proof: none yet that a customer could check; the public dev environment is not proof. Recommendation: no spend until hey.chattic.us is open or the waitlist has a date attached, and anth.us copy stays at "in development".

**Papyrus.** No product site. The engagement page sells it as the "newsroom for a publication" shape and that card is the only public surface. Promise: a newsroom that watches your beat overnight and hands an editor assignments, reporting packets and drafts to approve. Proof: it runs the anth.us newsroom, and the ANTH board is public, which is unusually strong proof once a reader is shown it. Needs: a platform page, the "how this publication is produced" article (ANTH-6360c2 is already on the board as an idea), and a decision on whether the landing page lives at anth.us or on a product domain.

**Plexus** is not on Ryan's list but is the product every client engagement runs on, and it has the positioning mismatch noted above. One sentence on plexus.anth.us that matches the case study would close it.

## Prioritized work

1. **Product pages for Auritus and Papyrus, and the Chatticus waitlist line.** kanbus-ef31d1 and kanbus-199d7c. Nothing else on the ad-campaign goal can start before these exist. Auritus first; it is live.
2. **Rewrite the About page top half in the house voice.** Keep the tweet section as it is. Cut the integrations list and the parent-company paragraph to one sentence each with a number. Filed as kanbus-095926.
3. **Search ownership on the hub.** Hub FAQ becomes "Can you fine-tune a decision model?", hub meta description leads with "align", hub added to the menu or to the Research page header. Filed as kanbus-173d5e.
4. **Fold the ten solution stubs** into one "Venue Driver integrations" page or drop them from the listing, and tag the three newest research pieces `client-acquisition` with an engage close. Filed as kanbus-2723ef.
5. **Retire the AGENTS.md marketing terminology section** to a short list of provable terms with their proof, pointing at the voice guide. Filed as kanbus-8ad3e2.
6. Resolve the Plexus positioning between anth.us and plexus.anth.us (Ryan's call; the product site is outside this repo).
7. One editing pass per Jev article for the opening-screen and punch-line findings, author's judgment on each.
8. A partner section on the engagement page, once Ryan says which partners he wants.

## Done during this review

- Content PR #19 (anthus-site-content): measurement wording in the Jev series, full-coverage claims removed, hub links from all six Jev articles, Plexus solution page in cumulative framing with the unverifiable "SOC 2 Type II" bullet removed, Venue Driver "since 2007", README voice section stated as the source. kanbus-fb8503, kanbus-9b54c1, kanbus-c409e2.
- Site (this PR): About Key Facts and FAQ without "14+ years" and "two years"; AGENTS.md without "two years"; decision-models hub phrasing; this memo. kanbus-bb78ff, kanbus-f3b48d, kanbus-9b54c1.
- Limatus PR #43: document intent from the first prose paragraph; numeric closers exempt from punch-line cadence. kanbus-9e6b11, LIM-61499a.
- Papyrus `anthus-voice-plain-statements`: profile pattern for "the model knows" and "admits" phrasing. kanbus-c409e2.
- ANTH-134bbc: story idea for Auritus.
