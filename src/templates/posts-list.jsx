import * as React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"

const PostsListTemplate = ({ data, pageContext }) => {
  const { currentPage, numPages } = pageContext
  const posts = data.recentPosts.edges

  const prevPage = currentPage > 1 ? currentPage - 1 : null
  const nextPage = currentPage < numPages ? currentPage + 1 : null

  const pagePath = page =>
    page === 1 ? "/posts/" : `/posts/${page}/`

  return (
    <Layout key={currentPage}>
      <h1>Recent Posts</h1>
      <ul className={styles.postsList}>
        {posts.map(({ node }) => (
          <li key={node.id} className={styles.postsListItem}>
            <div className={styles.postsListItemContent}>
              <Link
                className={styles.postsListItemLink}
                to={`/blog/${node.frontmatter.slug}`}
              >
                <div>
                  <div>{node.frontmatter.excerpt}</div>
                  <div className={styles.listItemRight}>
                    <div className={styles.listItemDate}>
                      {formatDate(node.frontmatter.date)}
                    </div>
                    <div>
                      <i>more...</i>
                    </div>
                  </div>
                </div>
                <GatsbyImage
                  image={getImage(node.frontmatter.preview_image)}
                  alt={node.frontmatter.excerpt}
                />
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {numPages > 1 && (
        <nav
          className="clear-float"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1.5rem",
          }}
          aria-label="Posts pagination"
        >
          <div>
            {prevPage ? (
              <a href={pagePath(prevPage)}>← Previous</a>
            ) : (
              <span />
            )}
          </div>
          <div>
            Page {currentPage} of {numPages}
          </div>
          <div>
            {nextPage ? (
              <a href={pagePath(nextPage)}>Next →</a>
            ) : (
              <span />
            )}
          </div>
        </nav>
      )}
    </Layout>
  )
}

export const pageQuery = graphql`
  query PostsListQuery($skip: Int!, $limit: Int!) {
    recentPosts: allMdx(
      filter: {
        frontmatter: { state: { eq: "published" }, tags: { in: ["posts"] } }
      }
      sort: { frontmatter: { date: DESC } }
      skip: $skip
      limit: $limit
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
`

export const Head = ({ pageContext }) => {
  const title =
    pageContext.currentPage > 1
      ? `Posts — Page ${pageContext.currentPage}`
      : "Posts"

  return (
    <Seo
      title={title}
      description="Short posts on AI, software, and operations—focused on practical lessons and reliable systems."
      image="serverless-ai-software-solutions.png"
    />
  )
}

export default PostsListTemplate

const formatDate = dateString => {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
