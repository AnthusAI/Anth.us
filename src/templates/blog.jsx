import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from "../components/layout"

console.log("CollectionTemplate");

const CollectionTemplate = ({ data }) => {
  const posts = data.allMdx.edges;

  return (
    <Layout>
      <div>
        <h1>Blog articles</h1>
        <ul>
          {posts.map(({ node }) => (
            <div className='blog-post-preview'>
              <li key={node.id}>
                <Link to={`/blog/` + node.frontmatter.slug}>{node.frontmatter.title}</Link>
              </li>
              <p>{node.frontmatter.date}</p>
            </div>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query CollectionPageQuery {
    allMdx {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            slug
            excerpt
          }
        }
      }
    }
  }
`;

export default CollectionTemplate;
