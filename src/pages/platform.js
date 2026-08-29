import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import PlatformCards from "../components/platform-cards"
import * as styles from "../components/platform.module.css"

const categoryOrder = [
  "Platform Runtime",
  "Agent Execution",
  "Data and Knowledge",
  "Observability",
  "Media Automation",
]

const stackRecipes = [
  {
    title: "Research-to-output pipeline",
    summary:
      "Biblicus collects and extracts the corpus, Tactus encodes the procedure, Babulus and VideoML generate the outward-facing output, and Korporus provides the place to run it as a service.",
  },
  {
    title: "Governed agent application",
    summary:
      "Tactus defines the durable procedure, Plexus measures and improves it, Kanbus tracks work and operator state, and Caducus helps humans see what is going wrong in production.",
  },
  {
    title: "Platform-native internal tooling",
    summary:
      "Korporus supplies the shared shell while product-specific modules from Plexus, Kanbus, Biblicus, and future tools appear as interoperable applications instead of one-off surfaces.",
  },
]

const PlatformPage = ({ data }) => {
  const items = data.platformProducts.edges
  const grouped = items.reduce((acc, item) => {
    const category = item.node.frontmatter.platform_category || "Platform"
    acc[category] = acc[category] || []
    acc[category].push(item)
    return acc
  }, {})

  const featured = items.filter(({ node }) =>
    ["tactus", "videoml"].includes(node.frontmatter.slug)
  )

  return (
    <Layout>
      <article>
        <section className={styles.hero}>
          <h1>The Anthus Platform</h1>
          <p className={styles.lead}>
            <strong>
              A technology stack that grew out of real delivery work.
            </strong>{" "}
            It is not a speculative architecture diagram. This is the internal
            product line that emerged from building RLHF systems, durable agent
            workflows, retrieval-backed automation, hosted operator
            applications, and programmable media pipelines for real engagements.
            The same enterprise controls that matter in production software also
            matter here: auditability, rollback paths, operator visibility, and
            clear evaluation loops.
          </p>
          <div className={styles.actions}>
            <Link to="/ai-solutions" className="button">
              See the solutions we deliver
            </Link>
            <Link
              to="/blog/cybernetic-development"
              className={styles.secondaryLink}
            >
              Read the cybernetic development thesis
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            How the platform fits together
          </h2>
          <p>
            We think about the platform in layers because complete AI systems
            need more than a model call. Korporus is the host shell. Tactus
            defines the durable procedure. Kanbus keeps workflow memory and
            state. Plexus closes the evaluation loop. Biblicus and Virtuus make
            evidence and structured data portable. Caducus gives operators
            visibility. Babulus and VideoML apply the same discipline to
            narrative and media output.
          </p>
          <p>
            The important marketing point is that these are reusable building
            blocks, not isolated side projects. We combine them differently
            depending on the job: QA and evaluation, internal operator tooling,
            extraction and retrieval workflows, or outward-facing content
            systems.
          </p>
          <div className={styles.mapGrid}>
            <div className={styles.mapColumn}>
              <h3>Runtime and control plane</h3>
              <ul>
                <li>
                  <code>Korporus</code> standardizes the shell and hosting model
                  for platform-powered services.
                </li>
                <li>
                  <code>Plexus</code> manages evaluation, feedback loops, and
                  MLOps.
                </li>
                <li>
                  <code>Kanbus</code> keeps work orchestration and project
                  memory durable.
                </li>
              </ul>
            </div>
            <div className={styles.mapColumn}>
              <h3>Agent execution and data</h3>
              <ul>
                <li>
                  <code>Tactus</code> defines durable, sandboxed agent
                  procedures.
                </li>
                <li>
                  <code>Biblicus</code> turns corpora into extractable,
                  retrievable knowledge.
                </li>
                <li>
                  <code>Virtuus</code> makes structured JSON data queryable on
                  disk.
                </li>
              </ul>
            </div>
            <div className={styles.mapColumn}>
              <h3>Operations and media</h3>
              <ul>
                <li>
                  <code>Caducus</code> surfaces operator-facing health and
                  incident signals.
                </li>
                <li>
                  <code>Babulus</code> and <code>VideoML</code> apply the same
                  code-first approach to content and video.
                </li>
                <li>
                  The result is one stack for systems, workflows, and
                  communication.
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.recipeGrid}>
            {stackRecipes.map(recipe => (
              <div key={recipe.title} className={styles.recipeCard}>
                <h3>{recipe.title}</h3>
                <p>{recipe.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            Featured platform technologies
          </h2>
          <p>
            Tactus and VideoML deserve separate attention because they express
            the broader Anthus point of view: treat complex operational systems
            as code, keep them inspectable, and make agent collaboration
            governable.
          </p>
          <PlatformCards items={featured} />
        </section>

        {categoryOrder
          .filter(category => grouped[category]?.length)
          .map(category => (
            <section key={category} className={styles.section}>
              <h2 className={styles.sectionHeading}>{category}</h2>
              <PlatformCards items={grouped[category]} />
            </section>
          ))}
      </article>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Anthus Platform"
    description="Explore the Anthus Platform: the runtime, orchestration, MLOps, knowledge, observability, and media systems behind our AI-native delivery work."
    image="serverless-ai-software-solutions.png"
  />
)

export const query = graphql`
  query PlatformPageQuery {
    platformProducts: allMdx(
      filter: {
        frontmatter: {
          content_type: { eq: "platform-product" }
          state: { eq: "published" }
        }
      }
      sort: { frontmatter: { platform_order: ASC } }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            slug
            excerpt
            platform_category
            platform_stage
            external_url
            platform_order
          }
        }
      }
    }
  }
`

export default PlatformPage
