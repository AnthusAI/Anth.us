// Benchmark sites such as the Biased-Decisions leaderboard live in their own repositories and are
// served from anth.us sub-paths. This builds each one at the commit pinned in benchmark-sites.json,
// with its base path and anth.us as its site URL, copies the output into public/, and writes a
// sitemap of its pages. Run after `gatsby build`; set BENCHMARK_SITES_WORK_DIRECTORY to reuse
// checkouts between runs.
import { execFileSync } from "node:child_process"
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"

const SITE_ORIGIN = "https://anth.us"
const REPOSITORY_ROOT = fileURLToPath(new URL("..", import.meta.url))
const PUBLIC_DIRECTORY = join(REPOSITORY_ROOT, "public")
const WORK_DIRECTORY =
  process.env.BENCHMARK_SITES_WORK_DIRECTORY ||
  join(REPOSITORY_ROOT, ".benchmark-sites")
const BENCHMARK_SITES = JSON.parse(
  readFileSync(join(REPOSITORY_ROOT, "benchmark-sites.json"), "utf8"),
)

const run = (command, commandArguments, options = {}) =>
  execFileSync(command, commandArguments, { stdio: "inherit", ...options })

const checkOutPinnedCommit = benchmarkSite => {
  const checkoutDirectory = join(WORK_DIRECTORY, benchmarkSite.name)
  if (!existsSync(join(checkoutDirectory, ".git"))) {
    mkdirSync(checkoutDirectory, { recursive: true })
    run("git", ["init", "--quiet"], { cwd: checkoutDirectory })
    run(
      "git",
      [
        "remote",
        "add",
        "origin",
        `https://github.com/${benchmarkSite.repository}.git`,
      ],
      { cwd: checkoutDirectory },
    )
  }
  run(
    "git",
    ["fetch", "--quiet", "--depth", "1", "origin", benchmarkSite.commit],
    {
      cwd: checkoutDirectory,
      env: { ...process.env, GIT_LFS_SKIP_SMUDGE: "1" },
    },
  )
  run("git", ["checkout", "--quiet", "--force", "FETCH_HEAD"], {
    cwd: checkoutDirectory,
    env: { ...process.env, GIT_LFS_SKIP_SMUDGE: "1" },
  })
  return checkoutDirectory
}

const builtPagePaths = (outputDirectory, robotsDisallowedPaths) => {
  const pagePaths = []
  const walk = directory => {
    for (const entryName of readdirSync(directory)) {
      const entryPath = join(directory, entryName)
      if (statSync(entryPath).isDirectory()) {
        walk(entryPath)
        continue
      }
      if (entryName !== "index.html") continue
      const html = readFileSync(entryPath, "utf8")
      if (/<meta http-equiv="refresh"/i.test(html)) continue
      if (/<meta name="robots" content="[^"]*noindex/i.test(html)) continue
      const pagePath = `/${relative(outputDirectory, directory)
        .split(sep)
        .join("/")}/`
        .replace(/^\/+/, "/")
        .replace(/\/+$/, "/")
      if (
        robotsDisallowedPaths.some(disallowed =>
          pagePath.startsWith(disallowed),
        )
      )
        continue
      pagePaths.push(pagePath)
    }
  }
  walk(outputDirectory)
  return pagePaths.sort()
}

const writeSitemap = (benchmarkSite, outputDirectory, publishedDirectory) => {
  const pageUrls = builtPagePaths(
    outputDirectory,
    benchmarkSite.robotsDisallowedPaths || [],
  ).map(
    pagePath =>
      `${SITE_ORIGIN}${benchmarkSite.publishedPath.replace(/\/$/, "")}${pagePath}`,
  )
  writeFileSync(
    join(publishedDirectory, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pageUrls
      .map(pageUrl => `<url><loc>${pageUrl}</loc></url>`)
      .join("\n")}\n</urlset>\n`,
  )
  return pageUrls.length
}

const SAFE_PUBLISHED_PATH = /^\/[a-z0-9-]+\/$/

for (const benchmarkSite of BENCHMARK_SITES) {
  if (!SAFE_PUBLISHED_PATH.test(benchmarkSite.publishedPath)) {
    throw new Error(
      `${benchmarkSite.name}: publishedPath must look like "/name/", got ${JSON.stringify(benchmarkSite.publishedPath)}`,
    )
  }
  console.log(
    `Building ${benchmarkSite.title} at ${benchmarkSite.repository}@${benchmarkSite.commit.slice(0, 12)} for ${benchmarkSite.publishedPath}`,
  )
  const checkoutDirectory = checkOutPinnedCommit(benchmarkSite)
  const siteDirectory = join(checkoutDirectory, benchmarkSite.siteDirectory)
  const outputDirectory = join(siteDirectory, "dist")
  run("npm", ["ci", "--no-fund", "--no-audit"], { cwd: siteDirectory })
  rmSync(outputDirectory, { recursive: true, force: true })
  run("npm", ["run", "build"], {
    cwd: siteDirectory,
    env: {
      ...process.env,
      BASE_PATH: benchmarkSite.publishedPath,
      SITE_URL: SITE_ORIGIN,
    },
  })
  const publishedDirectory = join(PUBLIC_DIRECTORY, benchmarkSite.publishedPath)
  rmSync(publishedDirectory, { recursive: true, force: true })
  cpSync(outputDirectory, publishedDirectory, { recursive: true })
  const sitemapPageCount = writeSitemap(
    benchmarkSite,
    outputDirectory,
    publishedDirectory,
  )
  console.log(
    `Published ${benchmarkSite.title} to public${benchmarkSite.publishedPath} with ${sitemapPageCount} pages in its sitemap`,
  )
}
