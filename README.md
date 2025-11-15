# Anthus AI Solutions

This is the Gatsby site project for https://anth.us

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

This project uses a Ruby [pre-processor](https://github.com/endymion/plantuml_diagrams/tree/main) for generating PlantUML diagrams.  To use it, first install it:

    $ bundle install

Then download PlantUML:

    $ bundle exec plantuml_diagrams download_jar

Then you can run it:

    $ bundle exec plantuml_diagrams process -i src/blog/diagrams -o ./