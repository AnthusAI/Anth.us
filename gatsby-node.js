const path = require('path');

// MDX is compiled as a separate webpack entry; without a fixed resolution path,
// gatsby-citation-manager (and sometimes React) can be bundled twice. That yields
// two different CitationsContext objects, so <Citation> in MDX never sees the
// template's <CitationsProvider> during SSG ("Citation must be used within a CitationsProvider").
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        'gatsby-citation-manager': path.resolve(
          __dirname,
          'node_modules/gatsby-citation-manager'
        ),
      },
    },
  });
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

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
            excerpt
            tags
            content_type
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
  `);

  if (contentResult.errors) {
    console.error(contentResult.errors);
    throw new Error("Error querying for blog files.");
  }

  const allNodes = contentResult.data.allMdx.nodes;
  const isPlatformNode = node =>
    node.frontmatter.content_type === 'platform-product' ||
    node.internal.contentFilePath.includes('/platform/');
  const platformNodes = allNodes.filter(isPlatformNode);
  const blogNodes = allNodes.filter(node => !isPlatformNode(node));

  const postTemplate = path.resolve(`./src/templates/blog-post.jsx`);
  blogNodes.forEach(node => {
    console.log(`Creating page: /blog/${node.frontmatter.slug}`);
    createPage({
      path: `blog/` + node.frontmatter.slug,
      component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        id: node.id,
      },
    });
  });

  const platformTemplate = path.resolve(`./src/templates/platform-product.jsx`);
  platformNodes.forEach(node => {
    console.log(`Creating page: /platform/${node.frontmatter.slug}`);
    createPage({
      path: `platform/` + node.frontmatter.slug,
      component: `${platformTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        id: node.id,
        platformPage: node.frontmatter,
      },
    });
  });

  const tagsByName = new Map();
  blogNodes.forEach(node => {
    (node.frontmatter.tags || []).forEach(tag => {
      const current = tagsByName.get(tag) || [];
      current.push(node.id);
      tagsByName.set(tag, current);
    });
  });

  const collectionTemplate = path.resolve(`./src/templates/blog-tag.jsx`);
  tagsByName.forEach((ids, tag) => {
    console.log(`Creating tag collection page: /blog/${tag}`);
    createPage({
      path: `blog/${tag}`,
      component: collectionTemplate,
      context: {
        tag,
        ids,
      },
    });
  });

  const allBlogsTemplate = path.resolve(`./src/templates/blog.jsx`);
  createPage({
    path: `blog/`,
    component: allBlogsTemplate,
    context: {},
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'Mdx') {
    const parent = getNode(node.parent);
    let sourceName = '';
    if (parent.internal.type === 'File') {
      sourceName = parent.sourceInstanceName;
    }

    createNodeField({
      node,
      name: 'sourceName',
      value: sourceName,
    });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Mdx implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      title: String!
      date: Date @dateformat
      display_date: String
      slug: String
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
  `;
  createTypes(typeDefs);
};
