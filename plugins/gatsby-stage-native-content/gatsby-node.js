const path = require("path")
const { stageNativeContent } = require("./native-content.cjs")

exports.onPreBootstrap = ({ reporter }, options) => {
  const sourceDir = path.resolve(options.sourceDir)
  const outputDir = path.resolve(options.outputDir)
  stageNativeContent({ sourceDir, outputDir, projectRoot: process.cwd() })
  reporter.info(`Staged native site content from ${sourceDir}`)
}
