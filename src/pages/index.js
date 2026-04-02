import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

import Layout from "../components/layout"
import Seo from "../components/seo"
import Hero from "../components/hero"
import PlatformCards from "../components/platform-cards"
import * as styles from "../components/index.module.css"

const mission = {
  description: "Deliver <mark>governed AI-native systems</mark> that combine human judgment with automation across <mark>development, operations, evaluation, and communication</mark>. We pair agentic speed with durable procedures, evidence, and production feedback loops."
}

const values = [
  {
    text: "Build Systems, Not Demos",
    description: "The work has to survive production. We optimize for durable workflows, operator visibility, and measurable outcomes, not one-off prototypes."
  },
  {
    text: "Keep Humans in the Loop",
    description: "Human judgment remains part of the system. We design approvals, review steps, and escalation paths as first-class capabilities, not afterthoughts."
  },
  {
    text: "Preserve Evidence and Context",
    description: "Adaptive systems get fragile when their inputs and decisions are opaque. We favor inspectable corpora, durable workflow state, and explicit evaluation artifacts."
  },
  {
    text: "Close the Feedback Loop",
    description: "We treat production learnings as fuel for improvement. RLHF, evals, telemetry, and incident follow-up all feed back into the system."
  },
  {
    text: "Standardize the Runtime",
    description: "Reliable systems need stable shells, procedures, and deployment patterns. Reusable building blocks let us move faster without improvising the hard parts every time."
  },
  {
    text: "Treat Models as Replaceable",
    description: "Models are inputs to a system, not the system itself. We design workflows and products so model choice can change without breaking the business logic."
  },
  {
    text: "Automate the Boring Parts",
    description: "The goal is not novelty. The goal is to move repetitive, high-volume work into reliable automation so humans can spend time on judgment and exceptions."
  },
  {
    text: "Favor Operational Discipline",
    description: "Specs, rollback paths, auditability, and cost-aware architectures still matter in the AI era. The stakes are higher now, not lower."
  }
];

const platformRecipes = [
  {
    title: "Grounded research to video output",
    components: ["Biblicus", "Tactus", "Babulus", "Korporus"],
    description:
      "Use Biblicus to manage the source corpus, Tactus to define the repeatable procedure, Babulus to generate the narrative output, and Korporus to host the resulting service as a coherent application.",
  },
  {
    title: "Production agent service with operational discipline",
    components: ["Tactus", "Plexus", "Korporus", "Caducus"],
    description:
      "Define the agent behavior in Tactus, evaluate and improve it through Plexus, run it inside Korporus, and monitor it through Caducus so the result behaves like a service instead of a demo.",
  },
  {
    title: "Workflow-heavy human and AI collaboration",
    components: ["Kanbus", "Tactus", "Plexus"],
    description:
      "Keep task memory and work orchestration durable in Kanbus, drive execution through Tactus procedures, and feed the resulting evaluation and feedback loops back into Plexus.",
  },
];

// const utmParameters = `?utm_source=anthus&utm_medium=footer`
const contactUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSdWlt4KpwPSBHzg3o8fikHcfrzxo5rCcV-0-zDt815NZ1tcyg/viewform?usp=sf_link"

const IndexPage = () => {

  const data = useStaticQuery(graphql`
    query {
      heroImage: file(relativePath: { eq: "serverless-ai-software-solutions.png" }) {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
      heroImageWide: file(relativePath: { eq: "serverless-ai-software-solutions-wide.png" }) {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
      smartProcessAutomation: file(relativePath: { eq: "smart-process-automation.png" }) {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
      aiSoftwareFeature: file(relativePath: { eq: "ai-software-feature.png" }) {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
      conversationalAIAgent: file(relativePath: { eq: "ai-agent.png" }) {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
      aiEnabledProjects: file(relativePath: { eq: "ai-enabled-projects.png" }) {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
      recentArticles: allMdx(
        filter: { frontmatter: { state: { eq: "published" }, tags: { nin: ["solutions", "posts"] }, content_type: { ne: "platform-product" } } } 
        sort: { frontmatter: { date: DESC } }
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

      recentPosts: allMdx(
        filter: { frontmatter: { state: { eq: "published" }, tags: { in: ["posts"] } } } 
        sort: { frontmatter: { date: DESC } }
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

      featuredSolutions: allMdx(
        filter: { 
          frontmatter: { 
            state: { eq: "published" }, 
            tags: { in: ["featured"] }
          }
          internal: { contentFilePath: { regex: "/solutions/" } }
        }
        sort: { frontmatter: { date: DESC } }
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
              display_date
              preview_image {
                childImageSharp {
                  gatsbyImageData(layout: CONSTRAINED)
                }
              }
            }
          }
        }
      }

      featuredPlatform: allMdx(
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
            }
          }
        }
      }

    }
  `);

  const links = [
    {
      text: "RLHF and evaluation systems",
      url: "/blog/call-criteria",
      image: getImage(data.smartProcessAutomation.childImageSharp.gatsbyImageData),
      alt: "Workflow automation illustration",
      description:
        "Build <mark>production-scale feedback loops</mark> for scorecards, classifiers, and agent workflows using systems like <code>Plexus</code>, with human review kept in the loop instead of bolted on after the fact.",
    },
    {
      text: "Operator copilots and agent workspaces",
      url: "/ai-solutions#conversational-ai-agents",
      image: getImage(data.aiSoftwareFeature.childImageSharp.gatsbyImageData),
      alt: "AI software feature illustration",
      description:
        "Give teams a place to <mark>run, supervise, and escalate</mark> long-running AI work with combinations like <code>Korporus</code>, <code>Tactus</code>, and <code>Caducus</code>.",
    },
    {
      text: "Evidence-grounded automation pipelines",
      url: "/ai-solutions#smart-process-automation",
      image: getImage(data.aiEnabledProjects.childImageSharp.gatsbyImageData),
      alt: "AI enabled project illustration",
      description:
        "Turn messy documents, inboxes, and internal knowledge into <mark>reliable business workflows</mark> with corpora, retrieval, and durable procedures built on <code>Biblicus</code> and <code>Tactus</code>.",
    },
    {
      text: "Programmable content and video systems",
      url: "/platform",
      image: getImage(data.conversationalAIAgent.childImageSharp.gatsbyImageData),
      alt: "Conversational AI agent illustration",
      description:
        "Automate demos, explainers, and publishing workflows with <mark>code-driven media pipelines</mark> using <code>Babulus</code> and <code>VideoML</code>, not one-off manual production.",
    },
  ]

  return (
    <Layout>

      <Hero>
        <GatsbyImage
          image={getImage(data.heroImage)}
          alt="Anthus"
          className="hero-image hero-image-default"
        />
        <GatsbyImage
          image={getImage(data.heroImageWide)}
          alt="Anthus"
          className="hero-image hero-image-wide"
        />
        <div className="hero-overlay">
          <h1>
            Build AI systems that can survive production
          </h1>
          <p>
            Anthus designs and operates governed AI-native services: durable procedures, evaluation loops, operator
            workspaces, evidence-backed automation, and programmable media pipelines.
          </p>
          <Link to="/ai-solutions" className="button">See solution patterns</Link>
          <div className={styles.heroSecondary}>
            <Link to="/blog/cybernetic-development" className={styles.heroSecondaryLink}>
              Read: Cybernetic Development
            </Link>
          </div>
        </div>
      </Hero>

      <p className={styles.intro} id="our-values">
        Over the last two years, we have built production RLHF systems, agentic QA workflows, corpus-driven
        automation pipelines, operator-facing AI applications, and code-first media systems. We have processed a
        quarter billion dollars in revenue at scale with nearly 100% uptime, and we use that operational discipline to
        make AI systems governable instead of fragile.
      </p>

      <p className={styles.intro}>
        The philosophy behind Anthus has not changed. The same instincts that matter in compliance, ITSM, SDLC, and
        mission-critical operations turn out to matter just as much in AI. What is different now is that we have
        concrete products, systems, and client outcomes that demonstrate that point directly.
      </p>

      <h2 style={{ marginBottom: '1em' }}>Our Mission</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: mission.description }}></p>

      <h2 style={{ marginBottom: '1em' }}>Principles Validated in Production</h2>
      <p className={styles.intro}>
        These are not abstract preferences. They are the operating principles behind the systems we have already built
        with the Anthus Platform and in client delivery work.
      </p>
      <ul className={`${styles.list} ${styles.tight}`}>
        {values.map((value, index) => (
          <li key={index} className={styles.listItem}>
            <p className={styles.listItemTitle}>{value.text}</p>
            <p className={styles.listItemDescription}
            dangerouslySetInnerHTML={{ __html: value.description }}>
            </p>
          </li>
        ))}
      </ul>

      <section className={styles.approachSection}>
        <h2 className={styles.approachHeading}>Our Approach: Cybernetic Development</h2>
        <div className={styles.approachContent}>
          <div>
            <p>
              AI is an engine for generating code. The differentiator is the governor: the constraints,
              feedback loops, and judgment that keep systems reliable in production.
            </p>
            <p>
              Modern failures increasingly look less like isolated “bugs” and more like operational,
              multi-system breakdowns. Great unit tests help—but they don’t cover every emergent scenario.
              So we build layered defenses and close the loop with real-world feedback.
            </p>
            <ul>
              <li>Specs first: define behavior before implementation.</li>
              <li>Defense in depth: sandboxed tools, CI gates, staged rollouts, and fast rollback.</li>
              <li>Operational feedback: telemetry and incident-driven regressions that tighten the loop over time.</li>
              <li>Simplify and delete: reduce degrees of freedom to eliminate entire classes of failure.</li>
            </ul>
            <div className={styles.approachActions}>
              <a href={contactUrl} className="button">Contact us</a>
              <Link to="/blog/cybernetic-development" className={styles.approachSecondaryCta}>
                Read Cybernetic Development
              </Link>
            </div>
          </div>
        </div>
      </section>

      <h2>Our Capabilities</h2>

      <ul className={styles.list}>
        {links.map(link => (
          <li key={link.url} className={styles.listItem}>
            <Link
              className={styles.listItemLink}
              to={`${link.url}`}
            >
              <GatsbyImage image={link.image} alt="Smart Process Automation" />
              <h3>{link.text}</h3>
            </Link>
            <p className={styles.listItemDescription} dangerouslySetInnerHTML={{ __html: link.description }}></p>
          </li>
        ))}
      </ul>

      <section className={styles.plexusFeature}>
        <span className={styles.eyebrow}>PART OF</span>
        <h2 className={styles.platformHeader}>The Anthus Platform</h2>
        <p>
          Solve complex business problems with AI and ML using a proven, reusable technology stack. We provide interoperable building blocks: <code>Korporus</code> hosts the application surface, <code>Tactus</code>
          defines durable procedures, <code>Kanbus</code> coordinates workflow state, <code>Plexus</code> governs
          evaluation and MLOps, <code>Biblicus</code> and <code>Virtuus</code> ground systems in inspectable data,
          <code>Caducus</code> adds operational visibility, and <code>Babulus</code> extends the same code-first
          philosophy into content and video output.
        </p>
        <PlatformCards items={data.featuredPlatform.edges} />
        <div className={styles.platformRecipeGrid}>
          {platformRecipes.map(recipe => (
            <div key={recipe.title} className={styles.platformRecipeCard}>
              <h3>{recipe.title}</h3>
              <p className={styles.platformRecipeMeta}>{recipe.components.join(" + ")}</p>
              <p>{recipe.description}</p>
            </div>
          ))}
        </div>
        <div className={styles.approachActions}>
          <Link to="/platform" className="button">Explore the platform</Link>
          <Link to="/ai-solutions" className={styles.approachSecondaryCta}>
            See solution patterns
          </Link>
        </div>
      </section>

      <h2>Featured Solutions</h2>
      <ul className='blog'>
        {data.featuredSolutions.edges.map(({ node }) => {
          const previewImage = getImage(node.frontmatter.preview_image);
          return (
            <div className='blog-post-preview' key={node.id}>
              <li className="clear-float">
                <Link to={`/blog/${node.frontmatter.slug}`}>
                  <GatsbyImage image={previewImage} alt={node.frontmatter.title} className="right" />
                  <h3>{node.frontmatter.title}</h3>
                </Link>
                <div className='date'>{node.frontmatter.display_date || node.frontmatter.date}</div>
                <div dangerouslySetInnerHTML={{ __html: node.frontmatter.excerpt }}></div>
              </li>
            </div>
          );
        })}
      </ul>
      <div className="clear-float">View all our <Link to="/ai-solutions">Solutions</Link>.</div>

      <h2>Recent Articles</h2>
      <ul className='blog'>
        {data.recentArticles.edges.map(({ node }) => {
          const previewImage = getImage(node.frontmatter.preview_image);
          return (
            <div className='blog-post-preview' key={node.id}>
              <li className="clear-float">
                <Link to={`/blog/` + node.frontmatter.slug}>
                  <GatsbyImage image={previewImage} alt={node.frontmatter.title} className="right" />
                  <h3>{node.frontmatter.title}</h3>
                </Link>
                <div className='date'>{node.frontmatter.date}</div>
                <div dangerouslySetInnerHTML={{ __html: node.frontmatter.excerpt }}></div>
              </li>
            </div>
          );
        })}
      </ul>
      <div className="clear-float">Please see our <Link to="/blog">Articles</Link> for more.</div>

      <h2>Recent Posts</h2>
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
      description="Anthus builds governed AI-native systems with durable procedures, evaluation loops, operator workspaces, retrieval pipelines, and programmable media."
      image="serverless-ai-software-solutions.png"
    />
  )
}

export default IndexPage

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
