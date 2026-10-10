const assert = require("assert/strict")
const fs = require("fs")
const os = require("os")
const path = require("path")
const test = require("node:test")
const { convertNativeContent, NativeContentError, stageNativeContent } = require("../plugins/gatsby-stage-native-content/native-content.cjs")

const fixtures = path.join(__dirname, "fixtures", "native-content")
const projectRoot = path.resolve(__dirname, "..")

test("converts native image, citation, and bibliography without changing front matter or prose", () => {
  const inputFile = path.join(projectRoot, "src", "site-content", "fixture.mdx")
  const text = fs.readFileSync(path.join(fixtures, "representative.mdx"), "utf8")
  const output = convertNativeContent({ text, inputFile, projectRoot })
  assert.match(output, /title: "Native content fixture"/)
  assert.match(output, /Source <title>/)
  assert.match(output, /date-parts:\n\s+- - 2026\n\s+- 10\n\s+- 10/)
  assert.doesNotMatch(output, /issued: \{date-parts:/)
  assert.match(output, /The original prose stays here\./)
  assert.match(output, /import BlogImage from "\.\.\/components\/blog-image"/)
  assert.match(output, /import \{ Citation, CitationsList \} from "gatsby-citation-manager"/)
  assert.match(output, /gatsby-citation-manager"\nexport const __nativeCitations[\s\S]*\n\n<BlogImage/)
  assert.match(output, /<BlogImage images=\{props\.pageContext\.frontmatter\.images\} name=\{"chart\.png"\} className=\{"full"\} alt=\{"A chart about \\u0026 benefits"\} \/>/)
  assert.match(output, /<Citation data=\{__nativeCitations\["source-2026"\]\} \/>/)
  assert.match(output, /<CitationsList citationFormat=\{"apa"\} \/>/)
  assert.match(output, /::image\{src="not-an-image\.png"\}/)
  assert.match(output, /```md\n::image\{src="not-an-image\.png"\}/)
})

test("fails loudly for unsupported native directives", () => {
  const text = fs.readFileSync(path.join(fixtures, "unsupported.mdx"), "utf8")
  assert.throws(
    () => convertNativeContent({ text, inputFile: "unsupported.mdx", projectRoot }),
    error => error instanceof NativeContentError && /Unsupported native directive ::callout/.test(error.message)
  )
})

test("stages transformed markdown and symlinks non-markdown assets", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "native-content-test-"))
  const source = path.join(root, "source")
  const output = path.join(root, "staged")
  fs.mkdirSync(path.join(source, "images"), { recursive: true })
  fs.copyFileSync(path.join(fixtures, "representative.mdx"), path.join(source, "article.mdx"))
  fs.writeFileSync(path.join(source, "images", "chart.png"), "fixture")
  stageNativeContent({ sourceDir: source, outputDir: output, projectRoot })
  assert.match(fs.readFileSync(path.join(output, "article.mdx"), "utf8"), /<BlogImage/)
  assert.equal(fs.lstatSync(path.join(output, "images", "chart.png")).isSymbolicLink(), true)
  fs.rmSync(root, { recursive: true, force: true })
})
