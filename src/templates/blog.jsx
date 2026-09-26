import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import ResearchCards from "../components/research-cards"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { formatPostDate } from "../utils/format-post-date"

const articlesPagePath = page => (page === 1 ? "/blog/" : `/blog/page/${page}/`)

const ArticlesPageTemplate = ({ data, pageContext }) => {
  const { currentPage, numPages, featuredCount } = pageContext
  const articles = data.publishedArticles.edges
  const featuredArticles = articles.slice(0, featuredCount)
  const gridArticles = articles.slice(featuredCount)

  const prevPage = currentPage > 1 ? currentPage - 1 : null
  const nextPage = currentPage < numPages ? currentPage + 1 : null

  return (
    <Layout key={currentPage}>
      <article>
        <h1>
          {currentPage === 1 ? "Articles" : `Articles, page ${currentPage}`}
        </h1>

        {featuredArticles.length > 0 && (
          <ul className="blog">
            {featuredArticles.map(({ node }) => {
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

        {gridArticles.length > 0 && (
          <>
            {featuredArticles.length > 0 && <h2>Earlier articles</h2>}
            <ResearchCards items={gridArticles} />
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
            aria-label="Articles pagination"
          >
            <div>
              {prevPage ? (
                <Link to={articlesPagePath(prevPage)}>← Previous</Link>
              ) : (
                <span />
              )}
            </div>
            <div>
              Page {currentPage} of {numPages}
            </div>
            <div>
              {nextPage ? (
                <Link to={articlesPagePath(nextPage)}>Next →</Link>
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
  query ArticlesPageQuery($skip: Int!, $limit: Int!) {
    publishedArticles: allMdx(
      filter: {
        frontmatter: {
          state: { eq: "published" }
          tags: { nin: ["solutions", "posts"] }
          content_type: { ne: "platform-product" }
        }
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
      ? `Articles, page ${pageContext.currentPage}`
      : "Articles"
  return (
    <Seo
      title={title}
      description="Long-form articles from Anthus on decision models, agent systems, classifiers in production, and the economics of AI-built software."
      image="serverless-ai-software-solutions.png"
    />
  )
}

export default ArticlesPageTemplate
