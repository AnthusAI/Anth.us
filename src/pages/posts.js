import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { StaticImage } from 'gatsby-plugin-image'
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

import Layout from "../components/layout"
import Seo from "../components/seo"
import Hero from "../components/hero"
import * as styles from "../components/index.module.css"

const PostsPage = () => {

  const data = useStaticQuery(graphql`
    query {

      recentPosts: allMdx(
        filter: { frontmatter: { state: { eq: "published" }, tags: { in: ["posts"] } } } 
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 4
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              date
              slug
              excerpt
              tags
              state
              preview_image {
                childImageSharp {
                  gatsbyImageData
                }
              }
            }
          }
        }
      }
    }
  `);

  return (
    <Layout>
      <h1>Recent Posts</h1>
      <ul className={styles.postsList}>
        {data.recentPosts.edges.map(({ node }) => (
          <li key={node.id} className={styles.postsListItem}>
            <div className={styles.postsListItemContent}>
              <Link
                className={styles.postsListItemLink}
                to={`/blog/${node.frontmatter.slug}`}
              >
                <p>
                  <div>{node.frontmatter.excerpt}</div>
                  <div className={styles.listItemRight}>
                    <div className={styles.listItemDate}>{formatDate(node.frontmatter.date)}</div>
                    <div><i>more...</i></div>
                  </div>
                </p>
                <GatsbyImage image={getImage(node.frontmatter.preview_image)} alt={node.frontmatter.excerpt} />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Layout>
  )
};

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => {
  return (
    <Seo
      title="Home"
      description="Depend on proven experts with a history of operational excellence for reliable serverless AI solutions on AWS."
      image="serverless-ai-software-solutions.png"
    />
  )
}

export default PostsPage

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}