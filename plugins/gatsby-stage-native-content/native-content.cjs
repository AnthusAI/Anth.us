const fs = require("fs")
const path = require("path")
const yaml = require("js-yaml")

class NativeContentError extends Error {
  constructor(message, filePath) {
    super(filePath ? `${filePath}: ${message}` : message)
    this.name = "NativeContentError"
  }
}

const IMAGE_DIRECTIVE = /^[ \t]*::image\{([\s\S]*?)\}[ \t]*$/gm
const CITATIONS_DIRECTIVE = /^[ \t]*::citations(?:\{([^}]*)\})?[ \t]*$/gm
const CITATION_REFERENCE = /\[@([^\]\n]+)\]/g
const UNKNOWN_DIRECTIVE = /^[ \t]*::([A-Za-z][\w-]*)/m
const ATTRIBUTE = /([A-Za-z_][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s}]+))/g
const FENCE = /^(\s*)(`{3,}|~{3,})/

function splitFrontMatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { frontMatter: "", body: text, prefix: "" }
  return {
    frontMatter: match[1],
    body: text.slice(match[0].length),
    prefix: match[0],
  }
}

function parseAttributes(raw, label, filePath) {
  const attributes = {}
  let cursor = 0
  let match
  ATTRIBUTE.lastIndex = 0
  while ((match = ATTRIBUTE.exec(raw))) {
    if (raw.slice(cursor, match.index).trim()) {
      throw new NativeContentError(`Malformed ${label} attributes`, filePath)
    }
    attributes[match[1]] = match[2] ?? match[3] ?? match[4] ?? ""
    cursor = ATTRIBUTE.lastIndex
  }
  if (raw.slice(cursor).trim()) {
    throw new NativeContentError(`Malformed ${label} attributes`, filePath)
  }
  return attributes
}

function maskCode(text) {
  const parked = []
  const park = value => {
    parked.push(value)
    return `\u0000NATIVE_CONTENT_CODE_${parked.length - 1}\u0000`
  }
  const lines = text.split(/(?<=\n)/)
  const output = []
  let fence = null
  let fenced = []
  for (const line of lines) {
    if (!fence) {
      const match = line.match(FENCE)
      if (match) {
        fence = match[2][0].repeat(match[2].length)
        fenced = [line]
      } else {
        output.push(line)
      }
    } else {
      fenced.push(line)
      if (line.trimStart().startsWith(fence)) {
        output.push(park(fenced.join("")))
        fence = null
        fenced = []
      }
    }
  }
  if (fence) output.push(park(fenced.join("")))
  const masked = output.join("").replace(/(?<!`)(`+)(?!`)([\s\S]*?)(?<!`)\1(?!`)/g, match => park(match))
  return {
    text: masked,
    restore: value =>
      value.replace(/\u0000NATIVE_CONTENT_CODE_(\d+)\u0000/g, (_, index) => parked[Number(index)]),
  }
}

function jsonExpression(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}

function importPath(fromFile, targetFile) {
  let relative = path.relative(path.dirname(fromFile), targetFile).replace(/\\/g, "/")
  if (!relative.startsWith(".")) relative = `./${relative}`
  return relative
}

function normalizeCitationFrontMatter(frontMatter, citations, filePath) {
  const block = /^citations:\r?\n(?:(?:[ \t].*|\r?\n)*)/m
  if (!block.test(frontMatter)) {
    throw new NativeContentError("Could not locate the front-matter citations block", filePath)
  }
  // MDX's front-matter parser treats CSL flow maps such as
  // `{date-parts: [[2024, 12, 1]]}` as an expression. Re-emitting only the
  // citations block keeps all front-matter values while using block YAML.
  const normalized = yaml.safeDump({ citations }, { lineWidth: -1, noRefs: true }).trimEnd()
  return frontMatter.replace(block, normalized)
}

function convertNativeContent({ text, inputFile, outputFile = inputFile, projectRoot }) {
  const { frontMatter, body, prefix } = splitFrontMatter(text)
  const masked = maskCode(body)
  let converted = masked.text
  let hasImage = false
  let hasCitation = false
  let hasBibliography = false
  let citations = {}
  let stagedFrontMatter = frontMatter

  converted = converted.replace(IMAGE_DIRECTIVE, (_, rawAttributes) => {
    const attributes = parseAttributes(rawAttributes, "::image", inputFile)
    const allowed = new Set(["src", "alt", "layout", "caption", "credit", "sizes", "loading"])
    const unknown = Object.keys(attributes).filter(key => !allowed.has(key))
    if (unknown.length) {
      throw new NativeContentError(`::image has unsupported attribute(s): ${unknown.join(", ")}`, inputFile)
    }
    if (!attributes.src) throw new NativeContentError("::image requires src", inputFile)
    if (attributes.caption || attributes.credit || attributes.sizes || attributes.loading) {
      throw new NativeContentError(
        "::image attributes caption, credit, sizes, and loading require the Papyrus renderer and cannot be represented by Gatsby BlogImage",
        inputFile
      )
    }
    hasImage = true
    const properties = [
      "images={props.pageContext.frontmatter.images}",
      `name={${jsonExpression(path.basename(attributes.src))}}`,
      `alt={${jsonExpression(attributes.alt || "")}}`,
    ]
    if (attributes.layout) properties.splice(2, 0, `className={${jsonExpression(attributes.layout)}}`)
    return `<BlogImage ${properties.join(" ")} />`
  })

  if (CITATION_REFERENCE.test(converted) || CITATIONS_DIRECTIVE.test(converted)) {
    try {
      const parsed = yaml.safeLoad(frontMatter) || {}
      citations = parsed.citations || {}
    } catch (error) {
      throw new NativeContentError(`Invalid YAML front matter: ${error.message}`, inputFile)
    }
    if (!citations || typeof citations !== "object" || Array.isArray(citations)) {
      throw new NativeContentError("Native citations require a front-matter citations mapping", inputFile)
    }
  }
  CITATION_REFERENCE.lastIndex = 0
  converted = converted.replace(CITATION_REFERENCE, (_, sourceKeys) => {
    const keys = sourceKeys.split(";").map(key => key.trim().replace(/^@/, "")).filter(Boolean)
    if (!keys.length) throw new NativeContentError("Empty citation reference", inputFile)
    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(citations, key)) {
        throw new NativeContentError(`Citation key ${JSON.stringify(key)} is absent from front matter`, inputFile)
      }
    }
    hasCitation = true
    return keys.map(key => `<Citation data={__nativeCitations[${jsonExpression(key)}]} />`).join("")
  })
  CITATIONS_DIRECTIVE.lastIndex = 0
  converted = converted.replace(CITATIONS_DIRECTIVE, (_, rawAttributes = "") => {
    const attributes = parseAttributes(rawAttributes, "::citations", inputFile)
    const unknown = Object.keys(attributes).filter(key => key !== "format")
    if (unknown.length) throw new NativeContentError(`::citations has unsupported attribute(s): ${unknown.join(", ")}`, inputFile)
    hasBibliography = true
    const format = attributes.format || "apa"
    return `<CitationsList citationFormat={${jsonExpression(format)}} />`
  })
  const unsupported = converted.match(UNKNOWN_DIRECTIVE)
  if (unsupported) throw new NativeContentError(`Unsupported native directive ::${unsupported[1]}`, inputFile)
  converted = masked.restore(converted)

  if (!hasImage && !hasCitation && !hasBibliography) return text
  if (Object.keys(citations).length) {
    stagedFrontMatter = normalizeCitationFrontMatter(frontMatter, citations, inputFile)
  }
  const imports = []
  if (hasImage && !/import\s+BlogImage\s+from\s+/.test(text)) {
    imports.push(`import BlogImage from ${jsonExpression(importPath(outputFile, path.join(projectRoot, "src", "components", "blog-image")))}`)
  }
  if ((hasCitation || hasBibliography) && !/from\s+["']gatsby-citation-manager["']/.test(text)) {
    imports.push(`import { Citation, CitationsList } from "gatsby-citation-manager"`)
  }
  const declarations = hasCitation ? `export const __nativeCitations = ${jsonExpression(citations)}` : ""
  const stagedPrefix = prefix ? `---\n${stagedFrontMatter}\n---\n` : ""
  const modulePreamble = [...imports, declarations].filter(Boolean).join("\n")
  return `${stagedPrefix}${modulePreamble}\n\n${converted}`
}

function stageNativeContent({ sourceDir, outputDir, projectRoot }) {
  const source = path.resolve(sourceDir)
  const output = path.resolve(outputDir)
  if (source === output || output === path.parse(output).root) throw new Error("Refusing unsafe native-content staging path")
  fs.rmSync(output, { recursive: true, force: true })
  fs.mkdirSync(output, { recursive: true })
  const copyDirectory = relativeDir => {
    const sourceDirectory = path.join(source, relativeDir)
    const outputDirectory = path.join(output, relativeDir)
    fs.mkdirSync(outputDirectory, { recursive: true })
    for (const entry of fs.readdirSync(sourceDirectory, { withFileTypes: true })) {
      if (entry.name === ".git") continue
      const relativePath = path.join(relativeDir, entry.name)
      const sourcePath = path.join(source, relativePath)
      const outputPath = path.join(output, relativePath)
      if (entry.isDirectory()) {
        copyDirectory(relativePath)
      } else if (entry.isFile() && /\.mdx?$/i.test(entry.name)) {
        const text = fs.readFileSync(sourcePath, "utf8")
        fs.writeFileSync(outputPath, convertNativeContent({ text, inputFile: sourcePath, outputFile: outputPath, projectRoot }), "utf8")
      } else if (entry.isFile() || entry.isSymbolicLink()) {
        fs.symlinkSync(sourcePath, outputPath)
      }
    }
  }
  copyDirectory("")
}

module.exports = { NativeContentError, convertNativeContent, stageNativeContent }
