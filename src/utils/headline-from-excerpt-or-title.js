export const headlineFromExcerptOrTitle = frontmatter =>
  frontmatter.excerpt?.trim() || frontmatter.title
