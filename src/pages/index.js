import * as React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { StaticImage } from 'gatsby-plugin-image'
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

import Layout from "../components/layout"
import Seo from "../components/seo"
import Hero from "../components/hero"
import * as styles from "../components/index.module.css"

const mission = {
  description: "Amplify human potential through generative AI, focusing on efficiency and creative solutions."
}

const values = [
  {
    text: "Prioritize Solutions Over Tools",
    description: "Emphasize practical, effective solutions."
  },
  {
    text: "Design for Users",
    description: "Create solutions that prioritize user experiences."
  },
  {
    text: "Focus on Business Logic",
    description: "Do minimal engineering that matters instead of reinventing wheels."
  },
  {
    text: "Continuously Improve",
    description: "Enable iterative change through agile software development."
  },
  {
    text: "Collaborate with AI Humanely",
    description: "Engage AI with understanding and partnership."
  },
  {
    text: "Implement Infrastructure as Code",
    description: "Establish repeatable, efficient infrastructure processes."
  },
  {
    text: "Commodify AI Models",
    description: "Treat AI models as replaceable, not magic black boxes."
  },
  {
    text: "Optimize Resource Usage",
    description: "Balance efficiency with cost-effectiveness."
  }
];

const utmParameters = `?utm_source=anthus&utm_medium=footer`

const IndexPage = () => {

  const data = useStaticQuery(graphql`
    query {
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
      conversationalAIAgent: file(relativePath: { eq: "conversational-ai-agent.png" }) {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }

    }
  `);

  const links = [
    {
      text: "Smart Process Automation",
      url: "/ai-solutions/#smart-process-automation",
      image: getImage(data.smartProcessAutomation.childImageSharp.gatsbyImageData),
      description:
        "<mark>Delegate routine tasks</mark> to intelligent systems, freeing your team for higher-impact initiatives.",
    },
    {
      text: "Conversational AI Agents",
      url: "/ai-solutions/#conversational-ai-agents",
      image: getImage(data.conversationalAIAgent.childImageSharp.gatsbyImageData),
      description:
        "Elevate your efficiency by integrating a conversational AI co-pilot, enabling <mark>dialogues with your business operations</mark>.",
    },
    {
      text: "AI-powered software features.",
      url: "https://www.gatsbyjs.com/plugins",
      image: getImage(data.aiSoftwareFeature.childImageSharp.gatsbyImageData),
      description:
        "Infuse <mark>AI-driven capabilities</mark> into your cloud-based apps, mobile applications, or existing systems.",
    },
    {
      text: "Severless software solutions.",
      url: "https://www.gatsbyjs.com/cloud",
      image: "../images/smart-process-automation.png",
      description:
        "Not all AI-enabled solutions use AI at runtime.  We have a long and proven history of building <mark>serverless architectures that  deliver business value.</mark>",
    },
  ]

  return (
  <Layout
    hero={
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
      }
    >

      <p className={styles.intro}>
        Anthus represents a legacy of reliable innovation.
        Our team excels in both developing and operating efficient, high-availability systems.
        Our track record stands for itself, demonstrating enduring solutions with business value.
        Partner with us for a journey marked by excellence and dependability.
      </p>

      <h2>Our Mission</h2>
      <p>{mission.description}</p>

      <h2>Our Values</h2>
      <ul className={`${styles.list} ${styles.tight}`}>
        {values.map(value => (
          <li className={styles.listItem}>
            <p className={styles.listItemTitle}>{value.text}</p>
            <p className={styles.listItemDescription}>
              {value.description}
            </p>
          </li>
        ))}
      </ul>

      <h2>Our Capabilities</h2>

      <ul className={styles.list}>
        {links.map(link => (
          <li key={link.url} className={styles.listItem}>
            <GatsbyImage image={link.image} alt="Smart Process Automation" />
            <a
              className={styles.listItemLink}
              href={`${link.url}${utmParameters}`}
            >
              {link.text}
            </a>
            <p className={styles.listItemDescription} dangerouslySetInnerHTML={{ __html: link.description }}></p>
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
export const Head = () => <Seo title="Home" />

export default IndexPage
