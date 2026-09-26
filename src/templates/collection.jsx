import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import ResearchCards from "../components/research-cards"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { formatPostDate } from "../utils/format-post-date"
import * as styles from "../components/platform.module.css"

const collectionPagePath = (basePath, page) =>
  page === 1 ? `/${basePath}/` : `/${basePath}/page/${page}/`

const CollectionTemplate = ({ data, pageContext }) => {
  const { basePath, title, intro, currentPage, numPages, featuredCount } =
    pageContext
  const items = data.collectionItems.edges
  const featuredItems = items.slice(0, featuredCount)
  const gridItems = items.slice(featuredCount)

  const prevPage = currentPage > 1 ? currentPage - 1 : null
  const nextPage = currentPage < numPages ? currentPage + 1 : null

  return (
    <Layout key={`${basePath}-${currentPage}`}>
      <article>
        <h1>{currentPage === 1 ? title : `${title}, page ${currentPage}`}</h1>
        {intro && currentPage === 1 && <p className={styles.lead}>{intro}</p>}

        {featuredItems.length > 0 && (
          <ul className="blog">
            {featuredItems.map(({ node }) => {
              const previewImage = getImage(node.frontmatter.preview_image)
              return (
                <div className="blog-post-preview" key={node.id}>
                  <li className="clear-float">
                    <Link to={`/blog/` + node.frontmatter.slug}>
                      <GatsbyImage
                        image={previewImage}
                        alt={node.frontmatter.title}
                        className="featured"
                      />
                      <h3>{node.frontmatter.title}</h3>
                    </Link>
                    <div className="date">
                      {formatPostDate(node.frontmatter.date)}
                    </div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: node.frontmatter.excerpt,
                      }}
                    ></p>
                  </li>
                </div>
              )
            })}
          </ul>
        )}

        {gridItems.length > 0 && (
          <>
            {featuredItems.length > 0 && <h2>Earlier</h2>}
            <ResearchCards items={gridItems} />
          </>
        )}

        {numPages > 1 && (
          <nav
            className="clear-float"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1.5rem",
            }}
            aria-label={`${title} pagination`}
          >
            <div>
              {prevPage ? (
                <Link to={collectionPagePath(basePath, prevPage)}>
                  ← Previous
                </Link>
              ) : (
                <span />
              )}
            </div>
            <div>
              Page {currentPage} of {numPages}
            </div>
            <div>
              {nextPage ? (
                <Link to={collectionPagePath(basePath, nextPage)}>Next →</Link>
              ) : (
                <span />
              )}
            </div>
          </nav>
        )}
      </article>
    </Layout>
  )
}

export const pageQuery = graphql`
  query CollectionPageQuery($ids: [String]!) {
    collectionItems: allMdx(
      filter: { id: { in: $ids } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date
            slug
            excerpt
            state
            repository
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
`

export const Head = ({ pageContext }) => {
  const title =
    pageContext.currentPage > 1
      ? `${pageContext.title}, page ${pageContext.currentPage}`
      : pageContext.title
  return (
    <Seo
      title={title}
      description={pageContext.description}
      image="serverless-ai-software-solutions.png"
    />
  )
}

export default CollectionTemplate
