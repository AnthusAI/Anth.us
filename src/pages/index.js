import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from 'gatsby-plugin-image'

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

const links = [
  {
    text: "Tutorial",
    url: "https://www.gatsbyjs.com/docs/tutorial",
    description:
      "A great place to get started if you're new to web development. Designed to guide you through setting up your first Gatsby site.",
  },
  {
    text: "Examples",
    url: "https://github.com/gatsbyjs/gatsby/tree/master/examples",
    description:
      "A collection of websites ranging from very basic to complex/complete that illustrate how to accomplish specific tasks within your Gatsby sites.",
  },
  {
    text: "Plugin Library",
    url: "https://www.gatsbyjs.com/plugins",
    description:
      "Learn how to add functionality and customize your Gatsby site or app with thousands of plugins built by our amazing developer community.",
  },
  {
    text: "Build and Host",
    url: "https://www.gatsbyjs.com/cloud",
    description:
      "Now you’re ready to show the world! Give your Gatsby site superpowers: Build and host on Gatsby Cloud. Get started for free!",
  },
]

const utmParameters = `?utm_source=anthus&utm_medium=footer`

const IndexPage = () => (
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

    <ul className={styles.list}>
      {links.map(link => (
        <li key={link.url} className={styles.listItem}>
          <a
            className={styles.listItemLink}
            href={`${link.url}${utmParameters}`}
          >
            {link.text} ↗
          </a>
          <p className={styles.listItemDescription}>{link.description}</p>
        </li>
      ))}
    </ul>
  </Layout>
)

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export default IndexPage
