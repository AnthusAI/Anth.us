import { graphql } from "gatsby"
import React, { useEffect } from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Solutions from "../components/solutions"
import ResearchCards from "../components/research-cards"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Link } from "gatsby"

const AISolutionsPage = ({ data }) => {
  useEffect(() => {
    document.title = "AI Solutions"
  }, [])

  const hasTag = (node, tag) => (node.frontmatter.tags || []).includes(tag)
  const engagements = data.solutions.edges.filter(
    ({ node }) => hasTag(node, "engagement") && !hasTag(node, "integrations")
  )
  const projectSolutions = data.solutions.edges.filter(
    ({ node }) => !hasTag(node, "engagement") && !hasTag(node, "integrations")
  )
  const projectsAndExamples = [
    ...projectSolutions,
    ...data.projectArticles.edges,
  ].sort(
    ({ node: a }, { node: b }) =>
      new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
  )
  const integrations = data.solutions.edges.filter(({ node }) =>
    hasTag(node, "integrations")
  )

  return (
    <Layout>
      <article>
        <div>
          <h1>Solving Problems Using AI</h1>
          <img
            src="/assets/images/ai-software-solutions.png"
            alt="AI software solutions"
            className="responsive-float-right-image"
          />
          <p>
            You're under pressure to deliver AI that works in production, not
            just in a demo. Anthus builds and operates self-aligning AI systems:
            custom models, agent harnesses, and evaluation loops with a human in
            the loop, grounded in production operations since 2007. The proof is
            years of production RLHF for a call-center QA operation, a data
            flywheel learning from expert feedback across hundreds of scorecards
            and millions of interactions.
          </p>
          <h2>What We Build</h2>
          <ul>
            <li>
              <strong>Knowledge Bases</strong> — ontologies and taxonomies that
              learn from your data instead of going stale.{" "}
              <a href="https://github.com/AnthusAI/Biblicus">See Biblicus</a>.
            </li>
            <li>
              <strong>Self-Aligning Automation</strong> — systems that improve
              from production feedback, with a human in the loop.{" "}
              <Link to="/blog/call-criteria/">
                See the Call Criteria case study
              </Link>
              .
            </li>
            <li>
              <strong>Agent Systems</strong> — durable, governed agent
              procedures with sandboxed tools and rollback.{" "}
              <Link to="/blog/give-an-agent-a-tool/">See the approach</Link>.
            </li>
            <li>
              <strong>Machine Learning and Decision Models</strong> — custom
              models, fine-tuned classifiers, and hosted decision models like
              Jev, aligned to your business.{" "}
              <Link to="/blog/domain-specific-turn-detection/">
                See the work
              </Link>
              .
            </li>
          </ul>

          <h2>Engagements</h2>

          <p>
            Long-running client work with a business outcome behind it: the
            systems we built, ran, and kept improving in production.
          </p>

          <ul className="blog">
            {engagements.map(({ node }) => {
              const previewImage = getImage(node.frontmatter.preview_image)
              return (
                <div className="blog-post-preview" key={node.id}>
                  <li className="clear-float">
                    <Link to={`/blog/` + node.frontmatter.slug}>
                      {previewImage && (
                        <GatsbyImage
                          image={previewImage}
                          alt={node.frontmatter.title}
                          className="featured"
                        />
                      )}
                      <h3>{node.frontmatter.title}</h3>
                    </Link>
                    <div className="date">
                      {node.frontmatter.display_date || node.frontmatter.date}
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: node.frontmatter.excerpt,
                      }}
                    ></div>
                  </li>
                </div>
              )
            })}
          </ul>

          <h2>How we work</h2>
          <p>
            Everything we ship runs under specs, tests, staged rollout, and a
            person who can say no. We call that cybernetic development: the
            governors that make an AI system safe to operate, from clear
            specifications and layered verification to staged releases and
            feedback loops that carry production learnings back into the system.
          </p>
          <ul>
            <li>Specs first: define behavior before implementation.</li>
            <li>
              Defense in depth: sandboxed tools, CI gates, staged rollouts, and
              fast rollback.
            </li>
            <li>
              Operational feedback: telemetry and incident-driven regressions
              that tighten the loop over time.
            </li>
            <li>
              Simplify and delete: reduce degrees of freedom to eliminate entire
              classes of failure.
            </li>
          </ul>
          <p>
            Read{" "}
            <Link to="/blog/cybernetic-development">
              how we govern AI-built systems
            </Link>
            , or see <Link to="/engage">how an engagement works</Link>.
          </p>
          <div className="clear"></div>
          <h2>Projects and examples</h2>

          <p>
            Smaller builds, spinoffs, and worked examples with the code
            published. The articles do the talking here.
          </p>

          <ResearchCards items={projectsAndExamples} />

          <h2>Integrations</h2>

          <Solutions
            solutions={integrations}
            showPreviewImage={false}
            linkToPage={false}
          />

          <h2>The Process</h2>
          <figure>
            <Link to="https://plexus.anth.us">
              <img
                src="/assets/images/Anthus AI Application Lifecycle.png"
                alt="AI Application Lifecycle"
              />
            </Link>
          </figure>
        </div>
      </article>
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => {
  return (
    <Seo
      title="AI Solutions"
      description="Anthus builds and operates self-aligning AI systems — custom models, agent harnesses, and evaluation loops with a human in the loop, grounded in production operations since 2007."
      image="serverless-ai-software-solutions.png"
    />
  )
}

export const query = graphql`
  query {
    solutions: allMdx(
      filter: { frontmatter: { tags: { in: ["solutions"] } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date
            display_date
            slug
            excerpt
            state
            repository
            preview_image {
              childImageSharp {
                gatsbyImageData(layout: CONSTRAINED)
              }
            }
            tags
          }
        }
      }
    }
    projectArticles: allMdx(
      filter: {
        frontmatter: { state: { eq: "published" }, tags: { in: ["project"] } }
      }
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
            tags
          }
        }
      }
    }
  }
`

export default AISolutionsPage
