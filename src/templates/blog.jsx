import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from "../components/layout"
import Seo from '../components/seo'
import { GatsbyImage, getImage } from "gatsby-plugin-image";

console.log("CollectionTemplate");

const CollectionTemplate = ({ data }) => {
  const posts = data.allMdx.edges;

  return (
    <Layout>
      <Seo title='Blog' />
      <article>
        <div>
          <h1>Blog articles</h1>
          <ul className='blog'>
            {posts.map(({ node }) => {
              const previewImage = getImage(node.frontmatter.preview_image);
              return (
                <div className='blog-post-preview' key={node.id}>
                  <li>
                    <Link to={`/blog/` + node.frontmatter.slug}><h2>{node.frontmatter.title}</h2></Link>
                    <GatsbyImage image={previewImage} alt={node.frontmatter.title} />
                    <div className='date'>{node.frontmatter.date}</div>
                    <p>{node.frontmatter.excerpt}</p>
                  </li>
                </div>
              );
            })}
          </ul>
        </div>
      </article>
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
            preview_image {
              childImageSharp {
                gatsbyImageData(layout: CONSTRAINED)
              }
            }
          }
        }
      }
    }
  }
`;

export default CollectionTemplate;
