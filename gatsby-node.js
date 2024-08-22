const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Query for blog files
  const blogResult = await graphql(`
    {
      allMdx(
        sort: { frontmatter: { date: DESC } },
        filter: { fields: { sourceName: { eq: "blog" } } }) {
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
    console.log("blogResult: ", blogResult);
  
  if (blogResult.errors) {
    console.error(blogResult.errors);
    throw new Error("Error querying for blog files.");
  }
  
  // Create blog post pages
  const postTemplate = path.resolve(`./src/templates/blog-post.jsx`)
  const posts = blogResult.data.allMdx.nodes
  posts.forEach(node => {
    console.log(`Creating page: /blog/${node.frontmatter.slug}`);
    createPage({
      path: `blog/` + node.frontmatter.slug,
      component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        id: node.id
      },
    });
  });

  // Query for blog tags
  const blogTagsResult = await graphql(`
    {
      allMdx(filter: { fields: { sourceName: { eq: "blog" } } }) {
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
  
  console.log("blogTagsResult: ", blogTagsResult);
  
  if (blogTagsResult.errors) {
    console.error(blogTagsResult.errors);
    throw new Error("Error querying for blog tags.");
  }
  
  // Create tag-based collection pages for blog
  const collectionTemplate = path.resolve(`./src/templates/blog-tag.jsx`)
  blogTagsResult.data.allMdx.group.forEach(tag => {
    console.log(`Creating tag collection page: /blog/${tag.fieldValue}`);
    createPage({
      path: `blog/${tag.fieldValue}`,
      component: collectionTemplate,
      context: {
        tag: tag.fieldValue,
        ids: tag.edges.map(edge => edge.node.id),
      },
    });
  });

  // Create a page to list all blog posts

  // MYSTERY: 
  const allBlogsTemplate = path.resolve(`./src/templates/blog.jsx`);
  createPage({
    path: `blog/`,
    component: allBlogsTemplate,
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

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Mdx implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      title: String!
      date: Date @dateformat
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