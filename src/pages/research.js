import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import ResearchCards from "../components/research-cards"
import * as styles from "../components/platform.module.css"

const ResearchPage = ({ data }) => {
  const items = data.researchArticles.edges

  return (
    <Layout>
      <article>
        <section className={styles.hero}>
          <h1>Research</h1>
          <p className={styles.lead}>
            Jev, Laya and the rest of the field-coverage roster answer millions
            of bounded questions a day, so we run the experiments that check
            what they're actually doing: where their verdicts move on a name or
            a pronoun, how well their confidence tracks reality, and what
            survives when you fine-tune, distill or gate them. Every piece here
            comes with the method and the numbers, not just the headline.
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
    title="Research"
    description="Experiments on how Jev, Laya and other decision models actually behave in production: bias, calibration, fine-tuning and distillation, with the method and the measurements."
    image="serverless-ai-software-solutions.png"
  />
)

export const query = graphql`
  query ResearchPageQuery {
    researchArticles: allMdx(
      filter: {
        frontmatter: { state: { eq: "published" }, tags: { in: ["research"] } }
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

export default ResearchPage
