const fs = require("fs")
const path = require("path")
for (const file of [
  "node_modules/ordered-binary/dist/index.cjs",
  "node_modules/ordered-binary/index.js",
]) {
  const fullPath = path.resolve(__dirname, "..", file)
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, "utf8")
    content = content
      .replace(
        "position += target.utf8Write(key, position, 0xffffffff)",
        "position += target.utf8Write(key, position)"
      )
      .replace(
        "position += target.utf8Write(key, position, 0xffffffff);",
        "position += target.utf8Write(key, position);"
      )
    fs.writeFileSync(fullPath, content)
  }
}

// Gatsby 5 schedules every sharp transformation again for every static build,
// even when the content-addressed derivative is already in public/static. In
// CI, retain those derivatives and skip only work whose exact output exists.
const sharpProcessFile = path.resolve(
  __dirname,
  "..",
  "node_modules/gatsby-plugin-sharp/process-file.js"
)
if (fs.existsSync(sharpProcessFile)) {
  let content = fs.readFileSync(sharpProcessFile, "utf8")
  let changed = false
  const processFileMarker =
    "const processFile = async (file, transforms, options = {}) => {\n"
  const skipAllExistingOutputs = `${processFileMarker}  if (\n    (await Promise.all(\n      transforms.map(({ outputPath }) => _fsExtra.default.pathExists(outputPath))\n    )).every(Boolean)\n  ) {\n    return transforms;\n  }\n`
  const marker = `const {
        outputPath,
        args
      } = transform;
`
  const skipExistingOutput = `${marker}      if (await _fsExtra.default.pathExists(outputPath)) {
        return transform;
      }
`

  if (!content.includes(skipAllExistingOutputs)) {
    if (!content.includes(processFileMarker)) {
      throw new Error("Unable to apply Gatsby Sharp full-output cache patch")
    }
    content = content.replace(processFileMarker, skipAllExistingOutputs)
    changed = true
  }

  if (!content.includes(skipExistingOutput)) {
    if (!content.includes(marker)) {
      throw new Error("Unable to apply Gatsby Sharp output-cache patch")
    }
    content = content.replace(marker, skipExistingOutput)
    changed = true
  }

  if (changed) {
    fs.writeFileSync(sharpProcessFile, content)
  }
}
