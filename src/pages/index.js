import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

import Layout from "../components/layout"
import Seo from "../components/seo"
import Hero from "../components/hero"
import PlatformCards from "../components/platform-cards"
import * as styles from "../components/index.module.css"

const mission = {
  description: "Deliver <mark>reliable, secure, and efficient</mark> business solutions using collaboration between human and <mark>artificial intelligence</mark> in every aspect of <mark>development and operations</mark>. We build systems that keep working when nobody is watching."
}

const values = [
  {
    text: "Prioritize Solutions Over Tools",
    description: "Investing in products and services only delivers business value if you're in the business of products and services.  <mark>We're in the business of solutions</mark>."
  },
  {
    text: "Design for Humans",
    description: "Computers exist to help humans accomplish things.  Not the other way around.  Make it easy for the human, not the computer."
  },
  {
    text: "Focus on Business Logic",
    description: "The only code you should be writing is the business logic that solves real problems.  <a href=\"/blog/langchain-by-example/\">Don't waste time reinventing wheels.</a>"
  },
  {
    text: "Continuously Improve",
    description: "Enable rapid, iterative change through CI/CD and DevOps—then let the systems improve themselves. <mark>Self-optimizing classifiers and self-steering agent systems</mark> get better from production feedback without waiting for an engineer to notice."
  },
  {
    text: "Collaborate with AI Humanely",
    description: "The most scarce and valuable resource is human time and attention.  Leveraging artificial people allows us to scale that attention without burning out real people."
  },
  {
    text: "Implement Infrastructure as Code",
    description: "Leverage DevOps to implement Infrastructure as Code, and <mark>MLOps and LLMOps</mark> to do the same for the models. Every part of a production system—including training runs and evaluations—should be created by code so it's reproducible, not clicked together by hand."
  },
  {
    text: "Commodify AI Models",
    description: "Treat AI models as replaceable, not magic black boxes.  In a world with no moats, <a href=\"/blog/a-world-with-no-moats/\">don't invest too much in any given castle.</a>"
  },
  {
    text: "Optimize Resource Usage",
    description: "Balance efficiency with cost-effectiveness.  When intelligence is cheap, the goal shifts from conserving compute to conserving context and cognitive load."
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

      b0rdSolution: allMdx(
        filter: {
          frontmatter: {
            slug: { eq: "b0rd" }
            state: { eq: "published" }
          }
        }
        limit: 1
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              slug
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
  // Ordered by what leads: self-aligning automation first, then the knowledge
  // base it reasons over, then the harness around the model, then the models
  // themselves. Each links to published proof.
  const links = [
    {
      text: "Knowledge Bases",
      url: "https://github.com/AnthusAI/Biblicus",
      image: getImage(data.smartProcessAutomation.childImageSharp.gatsbyImageData),
      alt: "Knowledge bases with learned ontologies and taxonomies",
      description:
        "Your agents are only as good as what they can look up.  We build knowledge bases with <mark>ontologies and taxonomies that learn from your data</mark>, refining their own structure instead of going stale the week after someone hand-built them.",
    },
    {
      text: "Self-Aligning Automation",
      url: "/blog/call-criteria/",
      image: getImage(data.aiEnabledProjects.childImageSharp.gatsbyImageData),
      alt: "Unattended automation with a human in the loop",
      description:
        "Unattended business process automation with a human in the loop.  Reviewers correct it and say why; the system <mark>turns the explanation into a stated policy</mark> and applies it from then on.",
    },
    {
      text: "Agent Systems",
      url: "/blog/give-an-agent-a-tool/",
      image: getImage(data.conversationalAIAgent.childImageSharp.gatsbyImageData),
      alt: "Agent systems, tools, and orchestration",
      description:
        "A model is half a system.  The other half is the harness: the tools it can reach, the procedures it follows, the limits it runs inside, and the ability to work for hours <mark>without losing the plot</mark>.",
    },
    {
      text: "Machine Learning",
      url: "/blog/domain-specific-turn-detection/",
      image: getImage(data.aiSoftwareFeature.childImageSharp.gatsbyImageData),
      alt: "Custom and fine-tuned machine learning models",
      description:
        "Custom classifiers, fine-tuned models, and <mark>calibrated confidence</mark> that tells you which decisions to trust and which to escalate.  We find the cheapest model that clears your bar, prove that it clears it, and run it in production on AWS—training, serving, and evaluation included.",
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
            Depend on proven experts
          </h1>
          <p>
            We solve your business problems with AI, then run it in production—where it gets more accurate.
          </p>
          <Link to="/ai-solutions" className="button">Learn More</Link>
        </div>
      </Hero>

      {/* Dates rather than durations: "two years of continuous operation" was written
          against a March 2024 start and had quietly gone stale. A start date never rots. */}
      <p className={styles.intro}>
        <mark>A quarter billion dollars</mark> in revenue processed at scale, at nearly 100% uptime.{" "}
        <mark>180 billion tokens</mark> of production LLM workload.
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
        Clients usually arrive asking about one of these.  <mark>The work rarely stays in one box.</mark>
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

      {data.b0rdSolution.edges.length > 0 && (
        <section className={styles.plexusFeature}>
          <span className={styles.eyebrow}>SPINOFF</span>
          <h2 className={styles.platformHeader}>B0rd — desk displays for agent monitoring</h2>
          <ul className="blog">
            <div className="blog-post-preview">
              <li className="clear-float">
                <Link to="/blog/b0rd">
                  <GatsbyImage
                    image={getImage(data.b0rdSolution.edges[0].node.frontmatter.preview_image)}
                    alt="B0rd LED matrix desk display"
                    className="right"
                  />
                  <h3>Glanceable signal when agents run all day</h3>
                </Link>
                <p>
                  <strong>Anthus Microelectronics</strong> grew out of the same workflow problem: when coding agents
                  run for hours, the bottleneck moves to monitoring and steering them. B0rd is a standalone LED-matrix
                  desk display — launch countdowns, agent status, notifications, an idle clock — readable from across
                  the room. Handbuilt hardware running a handbuilt (AI-assisted) OS. Matching units stay in sync
                  without pairing or a hub.
                </p>
                <ul className="branded">
                  <li>Standalone appliance — browser setup, no app store</li>
                  <li>Glanceable cues for long-running agent sessions</li>
                  <li>In sync by design across matching units</li>
                </ul>
                <Link to="/blog/b0rd" className="button">Read the B0rd story</Link>
                <a href="https://b0rd.info" className={styles.approachSecondaryCta} style={{ marginLeft: "1rem" }}>
                  b0rd.info
                </a>
                <a
                  href="https://www.etsy.com/shop/AnthusMicronics"
                  className={styles.approachSecondaryCta}
                  style={{ marginLeft: "1rem" }}
                >
                  Etsy shop
                </a>
              </li>
            </div>
          </ul>
        </section>
      )}

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
