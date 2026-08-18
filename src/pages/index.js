import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

import Layout from "../components/layout"
import Seo from "../components/seo"
import Hero from "../components/hero"
import * as styles from "../components/index.module.css"

const mission = {
  description: "Deliver <mark>serverless business solutions</mark> using collaboration between human and <mark>artificial intelligence</mark> in every aspect of <mark>development and operations</mark>. We pair agentic speed with governance: specs, guardrails, and production feedback loops."
}

// Trimmed from eight to four. The four dropped ones — Design for Humans, Focus on
// Business Logic, Continuously Improve, Infrastructure as Code — are good engineering
// practice but no longer differentiate anyone in 2026, and eight of them put a lot of
// page between the hero and the first concrete thing.
const values = [
  {
    text: "Prioritize Solutions Over Tools",
    description: "Investing in products and services only delivers business value if you're in the business of products and services.  <mark>We're in the business of solutions</mark>."
  },
  {
    text: "Commodify AI Models",
    description: "Treat AI models as replaceable, not magic black boxes.  In a world with no moats, <a href=\"/blog/a-world-with-no-moats/\">don't invest too much in any given castle.</a>"
  },
  {
    text: "Optimize Resource Usage",
    description: "Balance efficiency with cost-effectiveness.  When intelligence is cheap, the goal shifts from conserving compute to conserving context and cognitive load."
  },
  {
    text: "Collaborate with AI Humanely",
    description: "The most scarce and valuable resource is human time and attention.  Leveraging artificial people allows us to scale that attention without burning out real people."
  }
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
      plexusLogo: file(relativePath: { eq: "plexus-logo.png" }) {
        childImageSharp {
          gatsbyImageData(layout: CONSTRAINED, width: 1200)
        }
      }

      recentArticles: allMdx(
        filter: { frontmatter: { state: { eq: "published" }, tags: { nin: ["solutions", "posts"] } } } 
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

      featuredSolutions: allMdx(
        filter: { 
          frontmatter: { 
            state: { eq: "published" }, 
            tags: { in: ["featured"] }
          }
          internal: { contentFilePath: { regex: "/solutions/" } }
        }
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

    }
  `);

  // Four capability domains, not use cases. Each links to published proof rather than to
  // an /ai-solutions fragment: that page is 2023 copy, and one of the old anchors never
  // resolved anyway (it uses name= rather than id=).
  //
  // The order builds: a model on its own, the harness around it, the measurement that
  // tells you either is working, and the loop that improves it unattended.
  const links = [
    {
      text: "ML Models",
      url: "/blog/domain-specific-turn-detection/",
      image: getImage(data.aiSoftwareFeature.childImageSharp.gatsbyImageData),
      alt: "Custom and fine-tuned machine learning models",
      description:
        "Custom classifiers, fine-tuned models, and <mark>calibrated confidence</mark> that tells you which decisions to trust and which to escalate.  We find the cheapest model that clears your bar, and prove that it clears it.",
    },
    {
      text: "Agent Systems",
      url: "/blog/give-an-agent-a-tool/",
      image: getImage(data.conversationalAIAgent.childImageSharp.gatsbyImageData),
      alt: "Agent systems, tools, and orchestration",
      description:
        "A model is half a system.  The other half is the harness: the tools it can reach, the procedures it follows, the guardrails it runs inside, and the ability to work for hours <mark>without losing the plot</mark>.",
    },
    {
      text: "Evaluation",
      url: "/blog/classification-with-confidence/",
      image: getImage(data.aiEnabledProjects.childImageSharp.gatsbyImageData),
      alt: "Evaluation, scorecards, and measurement",
      description:
        "The part nobody asks for and every working system needs.  Scorecards, rubrics, and thresholds that turn <mark>&ldquo;it seems good&rdquo; into a number you can watch move</mark>.",
    },
    {
      text: "Self-Aligning Automation",
      url: "/blog/call-criteria/",
      image: getImage(data.smartProcessAutomation.childImageSharp.gatsbyImageData),
      alt: "Unattended automation with a human in the loop",
      description:
        "Unattended business process automation with a human in the loop.  Reviewers correct it and say why; the system <mark>turns the explanation into a stated policy</mark> and applies it from then on.",
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
          {/* Kept close to the length of the old headline on purpose. The hero overlay is
              sized for roughly this much text; a longer H1 wraps to four lines and clips off
              the top of the image at mobile widths. */}
          <h1>
            Systems that learn why
          </h1>
          <p>
            Not just what you labeled.  Explanations become policies, and accuracy climbs on its own.
          </p>
          <Link to="/ai-solutions" className="button">Learn More</Link>
          <div className={styles.heroSecondary}>
            <Link to="/blog/cybernetic-development" className={styles.heroSecondaryLink}>
              Read: Cybernetic Development
            </Link>
          </div>
        </div>
      </Hero>

      {/* Dates rather than durations: "two years of continuous operation" was written
          against a March 2024 start and had quietly gone stale. A start date never rots. */}
      <p className={styles.intro}>
        A quarter billion dollars in revenue processed at scale, with nearly 100% uptime.
        Custom classifiers and fine-tuned models in production since 2023.
        A self-aligning RLHF system running continuously since March 2024, SOC&nbsp;2 Type&nbsp;II.
        We don't talk about AI&mdash;we operate it.
      </p>

      <h2>What We Do</h2>

      <ul className={styles.list}>
        {links.map(link => (
          <li key={link.url} className={styles.listItem}>
            <Link
              className={styles.listItemLink}
              to={`${link.url}`}
            >
              <GatsbyImage image={link.image} alt={link.alt} />
              <h3>{link.text}</h3>
            </Link>
            <p className={styles.listItemDescription} dangerouslySetInnerHTML={{ __html: link.description }}></p>
          </li>
        ))}
      </ul>

      <p className={`${styles.intro} ${styles.textCenter}`}>
        Most people arrive asking for one of these.  <mark>Working systems need all four.</mark>
      </p>

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

      <h2 style={{ marginBottom: '1em' }}>Our Mission</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: mission.description }}></p>

      {/* a-world-with-no-moats.mdx links to /#our-values, so this id has to stay put. */}
      <h2 style={{ marginBottom: '1em' }} id="our-values">Our Values</h2>
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

      <section className={styles.plexusFeature}>
        <h2>The Loop That Keeps It Aligned</h2>
        <ul className='blog'>
          <div className='blog-post-preview'>
            <li className="clear-float">
              <Link to="https://plexus.anth.us">
                <GatsbyImage
                  image={getImage(data.plexusLogo.childImageSharp.gatsbyImageData)}
                  alt="Plexus Platform"
                  className="right"
                />
                <h3>Plexus: where the alignment actually happens</h3>
              </Link>
              <p>
                Plexus is our MLOps platform for building and operating classification models and
                agents at production scale.  It runs the feedback loop: reviewers correct the
                system's decisions and record <em>why</em>, and those explanations become stated
                policies the system applies from then on.  Accuracy climbs without an engineer
                rewriting prompts.
              </p>
              <ul className="branded">
                <li>In continuous production since March 2024</li>
                <li>Hundreds of classification models, millions of interactions</li>
                <li>SOC 2 Type II, end-to-end encrypted</li>
                <li>Human corrections and their reasoning drive continuous alignment</li>
              </ul>
              <Link to="https://plexus.anth.us" className="button">Learn More</Link>
            </li>
          </div>
        </ul>
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
                {/* Was a <p> wrapping <div>s, which is invalid nesting and threw a
                    validateDOMNesting warning on every render. */}
                <div>
                  <div>{node.frontmatter.excerpt}</div>
                  <div className={styles.listItemRight}>
                    <div className={styles.listItemDate}>{formatDate(node.frontmatter.date)}</div>
                    <div><i>more...</i></div>
                  </div>
                </div>
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
      description="Anthus builds self-aligning AI systems: custom models, agent harnesses, evaluation loops, and unattended automation with a human in the loop. In production since 2023."
      image="serverless-ai-software-solutions.png"
    />
  )
}

export default IndexPage

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
