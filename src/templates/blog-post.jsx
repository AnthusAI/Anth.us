import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
import { MDXProvider } from "@mdx-js/react"

const BlogPostTemplate = ({ data, children }) => {
  console.log("Data:", data);
  console.log("Children:", children);

  if (!data || !data.mdx) {
    return <div>No data found for this post!</div>;
  }

  const post = data.mdx;

  const shortcodes = { Link }

  return (
    <Layout>
      <article>
        <h1>{post.frontmatter.title}</h1>
        <p>{post.frontmatter.date}</p>
        <MDXProvider components={shortcodes}>
          {children}
        </MDXProvider>
      </article>
    </Layout>
  );
};

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;

export default BlogPostTemplate;
