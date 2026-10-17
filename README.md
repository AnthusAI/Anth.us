> **SUPERSEDED — this Gatsby repository does not serve anth.us.**
> Current website source: [AnthusAI/Anth.us-Papyrus](https://github.com/AnthusAI/Anth.us-Papyrus/tree/main).
> Start with its production `main` branch and AGENTS.md. The public site uses
> Papyrus/Markus S3 projection behind CloudFront `E3UMOOJRMY7FK7`; CMS/backend
> deployment is Amplify `d7s858igkyct5` in account `712236451410`, `us-east-1`.
> Gatsby Amplify `d1ffh6ny5rvtl` is historical and has no anth.us custom domain.
> A successful Gatsby build does not update the public website. Do current
> website fixes, including engagement intake, in Anth.us-Papyrus.
> Keep this repository and its cloud apps for recovery; do not change DNS or
> delete infrastructure. The sections below describe historical Gatsby workflows.

# Anthus AI Solutions

This repository is the source for https://anth.us.

## Quick Start

```bash
npm install              # Install dependencies
npm start               # Start development server (http://localhost:8000)
```

## Documentation

We maintain comprehensive documentation for both humans and AI agents:

- **`AGENTS.md`**: Complete guide for AI coding agents working on this project (setup, structure, content creation, guidelines)
- **`docs/content-guide.xml`**: Detailed guide for creating articles, posts, and pages

The documentation uses formats optimized for both human readability and machine processing.

## Content Types

Our site features two main types of blog content:

- **Articles**: Long-form, comprehensive content with citations and illustrations, located in `src/blog/*.mdx`. These are well-researched pieces that dive deep into topics about AI, technology, and solutions.
- **Posts**: Short, time-sensitive updates similar to social media posts, located in `src/blog/posts/*.mdx`. These are meant for frequent, concise updates that can be shared directly on social platforms.

## Diagrams

This project uses a Ruby [pre-processor](https://github.com/endymion/plantuml_diagrams/tree/main) for generating PlantUML diagrams. To use it, first install it:

    $ bundle install

Then download PlantUML:

    $ bundle exec plantuml_diagrams download_jar

Then you can run it:

    $ bundle exec plantuml_diagrams process -i src/blog/diagrams -o ./

---

Built by [Anthus AI Solutions](https://anth.us). We run this class of system in production.
<!-- inspect test -->
<!-- inspect test -->
<!-- inspect test -->
<!-- inspect test -->
<!-- inspected-by test Mon Aug 31 13:01:34 EDT 2026 -->
<!-- bypass test -->
