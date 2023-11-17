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
                <Link to={`/blog/` + node.frontmatter.slug}><h3>{node.frontmatter.title}</h3></Link>
                <div className='date'>{node.frontmatter.date}</div>
                <p>{node.frontmatter.excerpt}</p>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query CollectionPageQuery {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
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
