import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from "../components/layout"
import Seo from '../components/seo'
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const CollectionTemplate = ({ data }) => {
  const publishedPosts = data.publishedPosts.edges;
  const draftPosts = data.draftPosts.edges;

  return (
    <Layout>
      <article>
        <div>
          <h1>Blog articles</h1>
          <ul className='blog'>
            {publishedPosts.map(({ node }) => {
              const previewImage = getImage(node.frontmatter.preview_image);
              return (
                <div className='blog-post-preview' key={node.id}>
                  <li className="clear-float">
                    <Link to={`/blog/` + node.frontmatter.slug}>
                      <GatsbyImage image={previewImage} alt={node.frontmatter.title} className="right" />
                      <h3>{node.frontmatter.title}</h3>
                    </Link>
                    <div className='date'>{node.frontmatter.date}</div>
                    <p>{node.frontmatter.excerpt}</p>
                  </li>
                </div>
              );
            })}
          </ul>

          <h2>Draft articles</h2>
          <ul className='blog'>
            {draftPosts.map(({ node }) => {
              const previewImage = getImage(node.frontmatter.preview_image);
              return (
                <div className='blog-post-preview' key={node.id}>
                  <li className="clear-float">
                    <Link to={`/blog/` + node.frontmatter.slug}>
                      <GatsbyImage image={previewImage} alt={node.frontmatter.title} className="right" />
                      <h3>{node.frontmatter.title}</h3>
                    </Link>
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
    publishedPosts: allMdx(
      filter: { frontmatter: { state: { eq: "published" } } }
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
            state
            preview_image {
              childImageSharp {
                gatsbyImageData(layout: CONSTRAINED)
              }
            }
          }
        }
      }
    }
    draftPosts: allMdx(
      filter: { frontmatter: { state: { eq: "draft" } } }
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
            state
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

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => {
  return (
    <Seo
      title="Home"
      description="Depend on proven experts with a history of operational excellence for reliable serverless AI solutions on AWS."description="Depend on proven experts With a history of powering a multi-million dollar ticketing system and seamless integrations across platforms for reliable serverless AI solutions on AWS. "
      image="serverless-ai-software-solutions.png"
    />
  )
}

export default CollectionTemplate;
