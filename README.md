# Anthus AI Solutions

This the Gatsby site project for https://anth.us

## Diagrams

This project uses a Ruby [pre-processor](https://github.com/endymion/plantuml_diagrams/tree/main) for generating PlantUML diagrams.  To use it, first install it:

    $ bundle install

Then download PlantUML:

    $ bundle exec plantuml_diagrams download_jar

Then you can run it:

    $ bundle exec plantuml_diagrams process -i src/blog/diagrams -o ./