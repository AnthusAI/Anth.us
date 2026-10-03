const path = require("path")

// MDX is compiled as a separate webpack entry; without a fixed resolution path,
// gatsby-citation-manager (and sometimes React) can be bundled twice. That yields
// two different CitationsContext objects, so <Citation> in MDX never sees the
// template's <CitationsProvider> during SSG ("Citation must be used within a CitationsProvider").
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        react: path.resolve(__dirname, "node_modules/react"),
        "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
        "gatsby-citation-manager": path.resolve(
          __dirname,
          "node_modules/gatsby-citation-manager"
        ),
      },
    },
  })
}

const legacyCollectionPageRedirects = []
const blogPageSlugsCreatedThisBuild = new Set()

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  const contentResult = await graphql(`
    {
      allMdx(
        sort: { frontmatter: { date: DESC } }
        filter: { fields: { sourceName: { eq: "blog" } } }
      ) {
        nodes {
          id
          frontmatter {
            title
            slug
            redirect_from
            excerpt
            tags
            content_type
            state
            date
            platform_category
            platform_stage
            external_url
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `)

  if (contentResult.errors) {
    console.error(contentResult.errors)
    throw new Error("Error querying for blog files.")
  }

  const allNodes = contentResult.data.allMdx.nodes
  const isPlatformNode = node =>
    node.frontmatter.content_type === "platform-product" ||
    node.internal.contentFilePath.includes("/platform/")
  const platformNodes = allNodes.filter(isPlatformNode)
  const blogNodes = allNodes.filter(node => !isPlatformNode(node))

  const postTemplate = path.resolve(`./src/templates/blog-post.jsx`)
  blogNodes.forEach(node => {
    console.log(`Creating page: /blog/${node.frontmatter.slug}`)
    blogPageSlugsCreatedThisBuild.add(node.frontmatter.slug)
    createPage({
      path: `blog/` + node.frontmatter.slug,
      component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        id: node.id,
      },
    })
    ;(node.frontmatter.redirect_from || []).forEach(legacySlug => {
      createRedirect({
        fromPath: `/blog/${legacySlug}`,
        toPath: `/blog/${node.frontmatter.slug}`,
        isPermanent: true,
        redirectInBrowser: true,
      })
    })
  })

  const platformTemplate = path.resolve(`./src/templates/platform-product.jsx`)
  platformNodes.forEach(node => {
    console.log(`Creating page: /platform/${node.frontmatter.slug}`)
    createPage({
      path: `platform/` + node.frontmatter.slug,
      component: `${platformTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        id: node.id,
        platformPage: node.frontmatter,
      },
    })
  })

  const tagsByName = new Map()
  blogNodes.forEach(node => {
    ;(node.frontmatter.tags || []).forEach(tag => {
      const current = tagsByName.get(tag) || []
      current.push(node.id)
      tagsByName.set(tag, current)
    })
  })

  const collectionTemplate = path.resolve(`./src/templates/blog-tag.jsx`)
  tagsByName.forEach((ids, tag) => {
    console.log(`Creating tag collection page: /blog/${tag}`)
    blogPageSlugsCreatedThisBuild.add(tag)
    createPage({
      path: `blog/${tag}`,
      component: collectionTemplate,
      context: {
        tag,
        ids,
      },
    })
  })

  const listingTemplate = path.resolve(`./src/templates/collection.jsx`)
  const FEATURED_ON_FIRST_PAGE = 4
  const GRID_PER_PAGE = 8
  const publishedNodes = allNodes.filter(
    node => node.frontmatter.state === "published" && !isPlatformNode(node)
  )
  const hasTag = (node, tag) => (node.frontmatter.tags || []).includes(tag)

  const collections = [
    {
      basePath: "blog",
      title: "Articles",
      description:
        "Long-form articles from Anthus on decision models, agent systems, classifiers in production, and the economics of AI-built software.",
      intro: null,
      legacyPagePaths: false,
      nodes: publishedNodes.filter(
        node => !hasTag(node, "solutions") && !hasTag(node, "posts")
      ),
    },
    {
      basePath: "research",
      title: "Research",
      description:
        "Experiments on how Jev, Laya and other decision models actually behave in production: bias, calibration, fine-tuning and distillation, with the method and the measurements.",
      intro:
        "Jev, Laya and the rest of the field-coverage roster answer millions of bounded questions a day, so we run the experiments that check what they're actually doing: where their verdicts move on a name or a pronoun, how well their confidence tracks reality, and what survives when you fine-tune, distill or gate them. Every piece here comes with the method and the numbers, not just the headline. If you're here to align Jev or another decision model to your own data, start with the guide at /decision-models/.",
      legacyPagePaths: false,
      nodes: publishedNodes.filter(node => hasTag(node, "research")),
    },
    {
      basePath: "reading",
      title: "Reading List",
      description:
        "Papers and books behind the work at Anthus, one short note each on what they say and what we checked.",
      intro: null,
      legacyPagePaths: false,
      nodes: publishedNodes.filter(node => hasTag(node, "reading")),
    },
    {
      basePath: "posts",
      title: "Posts",
      description:
        "Short posts from Anthus on what shipped, what we read, and what changed in AI this week.",
      intro: null,
      legacyPagePaths: true,
      showsExcerptAsHeadline: true,
      nodes: publishedNodes.filter(node => hasTag(node, "posts")),
    },
  ]

  collections.forEach(collection => {
    const firstPageCount = FEATURED_ON_FIRST_PAGE + GRID_PER_PAGE
    const remaining = Math.max(0, collection.nodes.length - firstPageCount)
    const numPages = 1 + Math.ceil(remaining / GRID_PER_PAGE)
    Array.from({ length: numPages }).forEach((_, index) => {
      const currentPage = index + 1
      const pagePath =
        currentPage === 1
          ? `${collection.basePath}/`
          : `${collection.basePath}/page/${currentPage}/`
      const start =
        currentPage === 1
          ? 0
          : firstPageCount + (currentPage - 2) * GRID_PER_PAGE
      const count = currentPage === 1 ? firstPageCount : GRID_PER_PAGE
      const ids = collection.nodes.slice(start, start + count).map(n => n.id)
      console.log(`Creating collection page: /${pagePath}`)
      createPage({
        path: pagePath,
        component: listingTemplate,
        context: {
          ids,
          basePath: collection.basePath,
          title: collection.title,
          description: collection.description,
          intro: collection.intro,
          showsExcerptAsHeadline: Boolean(collection.showsExcerptAsHeadline),
          featuredCount: currentPage === 1 ? FEATURED_ON_FIRST_PAGE : 0,
          numPages,
          currentPage,
        },
      })
      if (collection.legacyPagePaths && currentPage > 1) {
        legacyCollectionPageRedirects.push({
          fromPath: `${collection.basePath}/${currentPage}`,
          toPath: `/${pagePath}`,
          title: `${collection.title}, page ${currentPage}`,
        })
      }
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  if (node.internal.type === "Mdx") {
    const parent = getNode(node.parent)
    let sourceName = ""
    if (parent.internal.type === "File") {
      sourceName = parent.sourceInstanceName
    }

    createNodeField({
      node,
      name: "sourceName",
      value: sourceName,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Mdx implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      title: String!
      date: Date @dateformat
      display_date: String
      slug: String
      redirect_from: [String]
      excerpt: String
      tags: [String]
      state: String
      authors: [Author]
      assistants: [Assistant]
      preview_image: File @fileByRelativePath
      images: [File] @fileByRelativePath
      content_type: String
      platform_category: String
      platform_order: Int
      platform_stage: String
      external_url: String
    }
    type Author {
      author: String
    }
    type Assistant {
      assistant: String
    }
  `
  createTypes(typeDefs)
}

exports.onPostBuild = async () => {
  const fs = require("fs")
  const contentRepositoryRedirectPagesDirectory = path.join(
    "src",
    "site-content",
    "redirects"
  )
  if (fs.existsSync(contentRepositoryRedirectPagesDirectory)) {
    fs.readdirSync(contentRepositoryRedirectPagesDirectory).forEach(
      redirectSlug => {
        if (blogPageSlugsCreatedThisBuild.has(redirectSlug)) {
          console.warn(
            `Skipping content redirect /blog/${redirectSlug}/: a page with that path was built`
          )
          return
        }
        fs.cpSync(
          path.join(contentRepositoryRedirectPagesDirectory, redirectSlug),
          path.join("public", "blog", redirectSlug),
          { recursive: true, force: true }
        )
      }
    )
  }
  legacyCollectionPageRedirects.forEach(({ fromPath, toPath, title }) => {
    const directory = path.join("public", fromPath)
    fs.mkdirSync(directory, { recursive: true })
    fs.writeFileSync(
      path.join(directory, "index.html"),
      `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Moved to ${title}</title>
<link rel="canonical" href="https://anth.us${toPath}">
<meta http-equiv="refresh" content="0;url=${toPath}">
</head>
<body>
<p>This page moved to <a href="${toPath}">anth.us${toPath}</a>.</p>
</body>
</html>
`
    )
  })
}
