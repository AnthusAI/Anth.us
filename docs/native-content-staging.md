# Native content staging status

The `src/site-content` repository is the canonical Anth.us article source. It
uses the native authoring constructs `::image{}`, `[@citation-key]`, and
`::citations{}`. Gatsby does not parse those constructs directly.

`plugins/gatsby-stage-native-content/` creates an ignored staging view for
Gatsby. It leaves canonical files untouched, symlinks assets rather than
duplicating them, and converts only those three constructs to the existing
`BlogImage`, `Citation`, and `CitationsList` component contract.

The converter is deliberately fail-closed: unsupported directives, image
attributes Gatsby cannot represent, malformed attributes, and missing citation
keys stop the build with a named error. It preserves front-matter values and
embeds a safely serialized copy of the citation mapping for the existing
citation component. In the staged copy only, CSL citation flow maps are
normalized to block YAML because Gatsby MDX otherwise parses `date-parts` as a
JavaScript expression.

## Verification status

- Fixture suite: `npm run test:native-content` (image, citation, bibliography,
  front matter, code-fence preservation, unknown-directive failure, and asset
  symlink staging).
- Corpus preflight: convert every source MD/MDX file without writing canonical
  content. This must pass before a Gatsby build.
- Full Gatsby build: **not yet run**. Do not claim the approved responsibility
  article is published or live until it succeeds and the production ship gate
  has been completed.

## Capacity gate

The native asset corpus is roughly 313 MiB. Gatsby image processing can create
multiple responsive derivatives, so run the full build only with at least 2
GiB free disk space. This is a safety floor, not a prediction of final output
size; it prevents a build from exhausting the shared volume.
