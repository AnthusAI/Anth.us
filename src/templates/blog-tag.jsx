import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from "../components/layout"

console.log("CollectionTemplate");

const CollectionTemplate = ({ data, pageContext }) => {
  const { tag } = pageContext;
  const posts = data.allMdx.edges;

  console.log("posts: ", posts);

  return (
    <Layout>
      <div>
        <h1>Articles tagged with: {tag}</h1>
        <ul>
          {posts.map(({ node }) => (
            <li key={node.id}>
              <Link to={`/blog/` + node.frontmatter.slug}>{node.frontmatter.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query CollectionPageQuery($ids: [String]!) {
    allMdx(filter: { id: { in: $ids } }) {
      edges {
        node {
          id
          frontmatter {
            title
            slug
            excerpt
          }
        }
      }
    }
  }
`;

export default CollectionTemplate;
