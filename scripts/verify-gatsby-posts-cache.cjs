#!/usr/bin/env node

const fs = require("node:fs")
const path = require("node:path")

const publicDir = path.resolve(process.argv[2] || "public")
const staticQueryDir = path.join(publicDir, "page-data", "sq", "d")
const homepagePath = path.join(publicDir, "index.html")

const reactEscape = value =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

const normalizeWhitespace = value => value.replace(/\s+/g, " ").trim()

if (!fs.existsSync(homepagePath) || !fs.existsSync(staticQueryDir)) {
  throw new Error(`Gatsby output is missing homepage or static-query data under ${publicDir}`)
}

const recentPosts = []
for (const filename of fs.readdirSync(staticQueryDir)) {
  if (!filename.endsWith(".json")) continue
  const query = JSON.parse(fs.readFileSync(path.join(staticQueryDir, filename), "utf8"))
  if (Array.isArray(query.data?.recentPosts?.edges)) {
    recentPosts.push(...query.data.recentPosts.edges)
  }
}

if (recentPosts.length === 0) {
  throw new Error("Gatsby static-query data has no recentPosts edges")
}

const homepage = normalizeWhitespace(fs.readFileSync(homepagePath, "utf8"))
const mismatches = []
for (const { node } of recentPosts) {
  const { slug, excerpt = "" } = node.frontmatter
  if (!homepage.includes(`href="/blog/${reactEscape(slug)}/"`)) {
    mismatches.push(`${slug}: homepage HTML is missing the post link`)
  }
  if (excerpt && !homepage.includes(normalizeWhitespace(reactEscape(excerpt)))) {
    mismatches.push(`${slug}: homepage HTML and static-query excerpt disagree`)
  }
}

if (mismatches.length > 0) {
  throw new Error(`Gatsby cached output is inconsistent:\n- ${mismatches.join("\n- ")}`)
}

console.log(`Verified ${recentPosts.length} recent posts match homepage HTML and static-query data.`)
