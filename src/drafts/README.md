# Unfinished drafts, parked out of the build

Files here are **not** sourced by Gatsby (`gatsby-config.mjs` sources `src/blog`
only), so they produce no page and no URL.

They were moved here because `state: draft` does not prevent publication —
`createPages` in `gatsby-node.js` builds a page for every MDX under `src/blog`,
and `state` only controls whether a post appears in the home page listings.
These four were publicly reachable while still being notes or placeholder text.

To resume work on one, move it back:

```bash
git mv src/drafts/<slug>.mdx src/blog/<slug>.mdx
```

Blog posts under `src/blog` with `state` other than `published` now render
`<meta name="robots" content="noindex, nofollow">`, so an unfinished draft has a
shareable review URL that search engines will not index. That is the right home
for a draft that is presentable. This directory is for ones that are not.
