# The Anthus site story

One paragraph, in the shape the writing-effective-stories skill asks for: situation, tension, choice, result, meaning. Every page on the site takes its job from this. When a page can't say which sentence of this paragraph it serves, the page is decoration.

## The story

For sixteen years we ran a revenue-critical platform for Las Vegas nightlife, from an on-premises reservation system in 2007 through a data-center failure we relocated around in hours to a serverless system that processed a quarter of a billion dollars at nearly full uptime. Then the work changed under us. We started using AI to write code and to make decisions at volume, and within a year the bottleneck moved from writing the code to knowing whether what the agents did was right. The instruments we'd relied on, reading the diff and sitting in the standup, stopped scaling the day we had more agents than people. We chose to build the instruments instead of trusting the output: a scorecard system where reviewers correct a model's verdicts and their explanations become policy, a project record that lives in the repository so every agent decision is in the pull request, and a newsroom that runs the same way. We ran them on our own work first, in public, on hundreds of scorecards and millions of interactions for a call-center QA operation and on the boards behind this site. Some of it worked the first time. Some of it we measured and dropped, like a fallback that sent the model's uncertain cases to a bigger, costlier model and got worse answers back. What we learned is that delegating the work is easy and observing it is the whole job. A pile of agents becomes a factory when a human reviewer can reject any change, and has a record in front of them showing what changed and whether it helped. Bring us the judgment task or the project, even if you can't yet say what you need, and you get the same record we run on ourselves.

## Which sentence each page serves

| Page or surface | Sentence | Story job |
| --- | --- | --- |
| Homepage hero and proof line | Sixteen years, a quarter billion, nearly full uptime | Who I am |
| How we work | The bottleneck moved; the instruments stopped scaling; a reviewer who can reject any change | I know what you're thinking |
| Solutions engagements | We ran them on our own work first, in public, at scale | Values in action |
| Research and the Jev series | Some of it worked; some of it we measured and dropped, like the fallback | Teaching |
| Kanbus observability series | The instruments stopped scaling the day we had more agents than people | Why I'm here |
| Engagement page | Bring us the judgment task; you get the same record | Vision |
| Platform page | The instruments we built | Supporting detail, not a story |
| Reading list | What we read while working it out | Supporting detail |

## Rules the paragraph implies

- Every number in it is on the site already and traces to a page. Nothing on any page may outrun it.
- The client behind the call-center figures is not named in the paragraph and need not be named anywhere up front. The figures carry the claim.
- The one admitted failure stays. It is the most persuasive sentence in the paragraph, and the skill says so: credibility beats a neat ending.
- The vision is stated as what the reader gets, in the reader's terms. Not what we sell.
- The hero keeps its one job. It does not try to tell the whole paragraph.

## Open questions for Ryan

1. Is "sixteen years" the right count from 2007, or should the paragraph use the year and let the reader do the arithmetic, as the site now does?
2. Is the data-center relocation the moment to open on, or is there a sharper one from the last two years?
3. Should the newsroom sentence stay in the core paragraph, or move to the Papyrus page's own version?
