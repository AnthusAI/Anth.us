const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Query for article files
  const articleResult = await graphql(`
    {
      allMdx(
        sort: { frontmatter: { date: DESC } },
        filter: { fields: { sourceName: { eq: "article" } } }) {
        nodes {
          id
          frontmatter {
            slug
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);
    console.log("articleResult: ", articleResult);
  
  if (articleResult.errors) {
    console.error(articleResult.errors);
    throw new Error("Error querying for article files.");
  }
  
  // Create article post pages
  const postTemplate = path.resolve(`./src/templates/article-post.jsx`)
  const posts = articleResult.data.allMdx.nodes
  posts.forEach(node => {
    console.log(`Creating page: /article/${node.frontmatter.slug}`);
    createPage({
      path: `article/` + node.frontmatter.slug,
      component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        id: node.id
      },
    });
  });

  // Query for article tags
  const articleTagsResult = await graphql(`
    {
      allMdx(filter: { fields: { sourceName: { eq: "article" } } }) {
        group(field: frontmatter___tags) {
          fieldValue
          edges {
            node {
              id
              frontmatter {
                slug
              }
            }
          }
        }
      }
    }
  `);
  
  console.log("articleTagsResult: ", articleTagsResult);
  
  if (articleTagsResult.errors) {
    console.error(articleTagsResult.errors);
    throw new Error("Error querying for article tags.");
  }
  
  // Create tag-based collection pages for article
  const collectionTemplate = path.resolve(`./src/templates/article-tag.jsx`)
  articleTagsResult.data.allMdx.group.forEach(tag => {
    console.log(`Creating tag collection page: /article/${tag.fieldValue}`);
    createPage({
      path: `article/${tag.fieldValue}`,
      component: collectionTemplate,
      context: {
        tag: tag.fieldValue,
        ids: tag.edges.map(edge => edge.node.id),
      },
    });
  });

  // Create a page to list all article posts

  // MYSTERY: 
  const allarticlesTemplate = path.resolve(`./src/templates/articles.jsx`);
  createPage({
    path: `articles/`,
    component: allarticlesTemplate,
    context: {
      // You can pass additional context if needed
    },
  });

};

// Add metadata to nodes to identify their source.
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

exports.createPages = ({ actions }) => {
  const { createRedirect } = actions

  // Redirect /blog to /articles
  createRedirect({
    fromPath: '/blog',
    toPath: '/articles',
    isPermanent: true,
  })

  // Redirect /blog/ to /articles/
  createRedirect({
    fromPath: '/blog/',
    toPath: '/articles/',
    isPermanent: true,
  })

  // Redirect /blog/* to /articles/*
  createRedirect({
    fromPath: '/blog/*',
    toPath: '/articles/:splat',
    isPermanent: true,
  })
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
      excerpt: String
      state: String
      authors: [Author]
      assistants: [Assistant]
      preview_image: File @fileByRelativePath
      images: [File] @fileByRelativePath
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