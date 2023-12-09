import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { StaticImage } from 'gatsby-plugin-image'
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

import Layout from "../components/layout"
import Seo from "../components/seo"
import Hero from "../components/hero"
import * as styles from "../components/index.module.css"

const mission = {
  description: "Deliver <mark>serverless business solutions</mark> using collaboration between human and <mark>artificial intelligence</mark> in every aspect of <mark>development and operations</mark>."
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
    description: "The only code you should be writing is the business logic that solves real problems.  Don't waste time reinventing wheels."
  },
  {
    text: "Continuously Improve",
    description: "Enable rapid, iterative change through agile software development.  Mitigate the risk of change by making lots of small, verifiable changes."
  },
  {
    text: "Collaborate with AI Humanely",
    description: "<a href=\"/blog/people-skills-are-vital-for-leveraging-artificial-people/\">People skills are vital for leveraging artificial people.</a>  You can get a lot more out of AI tools if you know how to collaborate with people."
  },
  {
    text: "Implement Infrastructure as Code",
    description: "Every aspect of a production system should be created and configured by code so that it's reprooducible, not manually."
  },
  {
    text: "Commodify AI Models",
    description: "Treat AI models as replaceable, not magic black boxes.  In a world with no moats, <a href=\"/blog/a-world-with-no-moats/\">don't invest too much in any given castle.</a>"
  },
  {
    text: "Optimize Resource Usage",
    description: "Balance efficiency with cost-effectiveness so that your idea will be sustainable and so that it can scale."
  }
];

// const utmParameters = `?utm_source=anthus&utm_medium=footer`

const IndexPage = () => {

  const data = useStaticQuery(graphql`
    query {
      heroImage: file(relativePath: { eq: "serverless-ai-software-solutions.png" }) {
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

      recentPosts: allMdx(
        filter: { frontmatter: { state: { eq: "published" } } }
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
    }
  `);

  const links = [
    {
      text: "Smart Process Automation",
      url: "/ai-solutions#smart-process-automation",
      image: getImage(data.smartProcessAutomation.childImageSharp.gatsbyImageData),
      description:
        "<mark>Delegate routine tasks</mark> to intelligent systems, freeing your team for higher-impact initiatives.",
    },
    {
      text: "AI-powered software features.",
      url: "/ai-solutions#ai-software-features",
      image: getImage(data.aiSoftwareFeature.childImageSharp.gatsbyImageData),
      description:
        "Infuse AI-driven capabilities into your cloud-based apps, mobile applications, or existing systems.",
    },
    {
      text: "Serverless software solutions.",
      url: "/ai-solutions#ai-enabled-projects",
      image: getImage(data.aiEnabledProjects.childImageSharp.gatsbyImageData),
      description:
        "Not all AI-enabled solutions use AI at runtime.  We have a <a href=\"/ai-solutions\">long and <mark>proven history</mark></a> of building serverless architectures that deliver business value.",
    },
    {
      text: "Conversational AI Agents",
      url: "/ai-solutions#conversational-ai-agents",
      image: getImage(data.conversationalAIAgent.childImageSharp.gatsbyImageData),
      description:
        "Elevate your efficiency by integrating a conversational AI co-pilot, enabling <mark>dialogues with your business operations</mark>.",
    },
  ]

  return (
    <Layout>

      <Hero>
        <StaticImage
          className="hero-image"
          src="../images/serverless-ai-software-solutions.png"
          alt="Anthus"
          layout="fullWidth"
          placeholder="BLURRED"
        />
        <div className="hero-overlay">
          <h1>
            Depend on proven experts
          </h1>
          <p>
            We make it easy to leverage the power of AI to solve your business problems.
          </p>
          <Link to="/ai-solutions" className="button">Learn More</Link>
        </div>
      </Hero>

      <p className={styles.intro} id="our-values">
        Anthus represents a legacy of reliable innovation.
        Our team excels in both developing and operating efficient, high-availability systems.
        Our track record stands for itself, demonstrating enduring solutions with business value.
        Partner with us for a journey marked by excellence and dependability.
      </p>

      <h2 style={{ marginBottom: '1em' }}>Our Mission</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: mission.description }}></p>

      <h2 style={{ marginBottom: '1em' }}>Our Values</h2>
      <ul className={`${styles.list} ${styles.tight}`}>
        {values.map(value => (
          <li className={styles.listItem}>
            <p className={styles.listItemTitle}>{value.text}</p>
            <p className={styles.listItemDescription}
            dangerouslySetInnerHTML={{ __html: value.description }}>
            </p>
          </li>
        ))}
      </ul>

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

      <h2>Recent Articles</h2>
      <ul className='blog'>
        {data.recentPosts.edges.map(({ node }) => {
          const previewImage = getImage(node.frontmatter.preview_image);
          return (
            <div className='blog-post-preview' key={node.id}>
              <li className="clear-float">
                <Link to={`/blog/` + node.frontmatter.slug}>
                  <GatsbyImage image={previewImage} alt={node.frontmatter.title} className="right" />
                  <h3>{node.frontmatter.title}</h3>
                </Link>
                <div className='date'>{node.frontmatter.date}</div>
                <p>{node.frontmatter.excerpt}</p>
              </li>
            </div>
          );
        })}
      </ul>

      <div className="clear-float">Please see our <Link to="/blog">Blog</Link> for more.</div>

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
      description="Depend on proven experts with a history of operational excellence for reliable serverless AI solutions on AWS."
      image="serverless-ai-software-solutions.png"
    />
  )
}

export default IndexPage
