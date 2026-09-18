#!/usr/bin/env node

const fs = require("node:fs")
const path = require("node:path")

const publicDir = path.resolve(process.argv[2] || "public")
const styleTag = /(<style\b[^>]*data-identity=["']gatsby-global-css["'][^>]*>)([\s\S]*?)(<\/style>)/gi
let htmlFiles = 0
let normalizedStyles = 0
const failures = []

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      visit(filename)
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles += 1
      const original = fs.readFileSync(filename, "utf8")
      let foundStyle = false
      const normalized = original.replace(styleTag, (_match, open, css, close) => {
        foundStyle = true
        if (css.startsWith("\uFEFF")) {
          normalizedStyles += 1
          css = css.slice(1)
        }
        if (css.startsWith("\uFEFF")) {
          failures.push(`${filename}: embedded global CSS still starts with a BOM`)
        }
        return `${open}${css}${close}`
      })
      if (foundStyle && normalized !== original) {
        fs.writeFileSync(filename, normalized)
      }
    }
  }
}

if (!fs.existsSync(publicDir)) {
  throw new Error(`Gatsby output directory is missing: ${publicDir}`)
}

visit(publicDir)

if (htmlFiles === 0 || normalizedStyles === 0) {
  failures.push(`Expected BOM-prefixed global CSS in generated HTML; found ${normalizedStyles} normalized styles across ${htmlFiles} HTML files`)
}

if (failures.length > 0) {
  throw new Error(failures.join("\n"))
}

console.log(`Normalized the embedded global stylesheet on ${normalizedStyles} pages (${htmlFiles} HTML files checked).`)
