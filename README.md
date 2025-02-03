# Anthus AI Solutions

This is the Gatsby site project for https://anth.us

## Documentation

We maintain comprehensive documentation for content creation and management in the `docs` directory:

- `docs/content-guide.xml`: Guide for creating articles, posts, and pages
- More documentation will be added as needed

The documentation uses a combination of XML for structure and Markdown for content formatting, making it both machine-readable and human-friendly.

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