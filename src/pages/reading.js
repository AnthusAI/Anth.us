import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import ResearchCards from "../components/research-cards"
import * as styles from "../components/platform.module.css"

const ReadingPage = ({ data }) => {
  const items = data.readingEntries.edges

  return (
    <Layout>
      <article>
        <section className={styles.hero}>
          <h1>Reading</h1>
          <p className={styles.lead}>
            Papers and books we keep coming back to, one short piece each: what
            it says, what we checked, and where it changed how we build. New
            entries land as we read them.
          </p>
        </section>

        <section className={styles.section}>
          <ResearchCards items={items} />
        </section>
      </article>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Reading"
    description="Papers and books behind the work at Anthus, one short note each on what they say and what we checked."
    image="serverless-ai-software-solutions.png"
  />
)

export const query = graphql`
  query ReadingPageQuery {
    readingEntries: allMdx(
      filter: {
        frontmatter: { state: { eq: "published" }, tags: { in: ["reading"] } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            slug
            date
            excerpt
            repository
            preview_image {
              childImageSharp {
                gatsbyImageData(
                  layout: CONSTRAINED
                  width: 640
                  aspectRatio: 1.9
                )
              }
            }
          }
        }
      }
    }
  }
`

export default ReadingPage
