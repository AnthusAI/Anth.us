import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { MDXProvider } from "@mdx-js/react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import BlogImage from "../components/blog-image"
import AudioNative from "../components/AudioNative"
import MDXCode from "../components/MDXCode"
import {
  CitationsProvider,
  Citation,
  CitationsList,
} from "gatsby-citation-manager"
import * as styles from "../components/platform.module.css"

const shortcodes = { BlogImage, Citation, CitationsList, MDXCode, AudioNative }

const platformRelationships = {
  plexus: {
    fits: "Plexus is the MLOps and evaluation spine of the platform. It helps the other building blocks behave like governable production systems instead of isolated demos.",
    links: [
      { label: "Works with Tactus procedures", to: "/platform/tactus" },
      {
        label: "Turns Biblicus feedback into evaluation inputs",
        to: "/platform/biblicus",
      },
      {
        label: "Runs inside broader Korporus surfaces",
        to: "/platform/korporus",
      },
    ],
    recipe:
      "Example: pair Plexus with Tactus for durable procedures, Biblicus for evidence-backed inputs, and Caducus for operator monitoring.",
  },
  tactus: {
    fits: "Tactus is the procedural core. It gives the rest of the platform a durable way to describe tool-using agent behavior.",
    links: [
      { label: "Evaluated through Plexus", to: "/platform/plexus" },
      { label: "Grounded by Biblicus corpora", to: "/platform/biblicus" },
      { label: "Hosted inside Korporus", to: "/platform/korporus" },
    ],
    recipe:
      "Example: use Tactus to encode a repeatable research workflow, Biblicus for the corpus, and Plexus for regression checks before deployment.",
  },
  kanbus: {
    fits: "Kanbus supplies durable workflow memory so humans and agents can coordinate real delivery work instead of operating in a stateless loop.",
    links: [
      { label: "Pairs with Tactus for execution", to: "/platform/tactus" },
      { label: "Feeds work cadence into Plexus", to: "/platform/plexus" },
      {
        label: "Appears in Korporus as an operator surface",
        to: "/platform/korporus",
      },
    ],
    recipe:
      "Example: combine Kanbus, Tactus, and Plexus to manage backlogs, execute procedures, and continuously improve the resulting system.",
  },
  korporus: {
    fits: "Korporus is the standard container for platform-powered applications. It is where multiple Anthus components can show up together as one service.",
    links: [
      { label: "Hosts Plexus-powered applications", to: "/platform/plexus" },
      { label: "Hosts Tactus-driven workflows", to: "/platform/tactus" },
      {
        label: "Benefits from Caducus operator visibility",
        to: "/platform/caducus",
      },
    ],
    recipe:
      "Example: use Korporus as the shell around a Tactus workflow, a Plexus control plane, and a Babulus authoring surface for a complete internal platform app.",
  },
  biblicus: {
    fits: "Biblicus is the evidence layer. It gives other Anthus components something inspectable and rebuildable to reason over.",
    links: [
      { label: "Grounds Tactus procedures", to: "/platform/tactus" },
      { label: "Feeds signals into Plexus", to: "/platform/plexus" },
      { label: "Supplies source material to Babulus", to: "/platform/babulus" },
    ],
    recipe:
      "Example: use Biblicus to manage a document corpus, Tactus to extract and transform it, and Babulus to publish a derived narrative or video output.",
  },
  virtuus: {
    fits: "Virtuus keeps structured data portable for the rest of the platform, especially when a heavyweight service database is the wrong fit.",
    links: [
      { label: "Supports Caducus storage", to: "/platform/caducus" },
      { label: "Supports Tactus worker data", to: "/platform/tactus" },
      { label: "Complements Biblicus corpora", to: "/platform/biblicus" },
    ],
    recipe:
      "Example: pair Virtuus with Tactus and Caducus when you need portable, file-backed state for isolated workers and operational analysis.",
  },
  caducus: {
    fits: "Caducus is the operator-visibility layer. It helps Anthus services stay understandable after deployment.",
    links: [
      { label: "Monitors Korporus-hosted services", to: "/platform/korporus" },
      { label: "Supports Plexus-governed systems", to: "/platform/plexus" },
      { label: "Uses Virtuus-backed local data", to: "/platform/virtuus" },
    ],
    recipe:
      "Example: add Caducus to a Korporus and Plexus deployment when humans need to triage incidents and understand evolving agent behavior.",
  },
  babulus: {
    fits: "Babulus is the content and video authoring layer for the platform. It applies the same code-reviewable discipline to outward-facing media.",
    links: [
      { label: "Built on VideoML", to: "/platform/videoml" },
      {
        label: "Can use Biblicus as a source corpus",
        to: "/platform/biblicus",
      },
      { label: "Can run inside Korporus surfaces", to: "/platform/korporus" },
    ],
    recipe:
      "Example: combine Biblicus, Babulus, VideoML, and Korporus to turn a living research corpus into repeatable product demos or explainers.",
  },
  videoml: {
    fits: "VideoML is the rendering substrate underneath Anthus media automation. It lets higher-level products treat video as a reproducible pipeline.",
    links: [
      { label: "Powers Babulus authoring workflows", to: "/platform/babulus" },
      {
        label: "Can package Biblicus-derived narratives",
        to: "/platform/biblicus",
      },
      { label: "Can be surfaced through Korporus", to: "/platform/korporus" },
    ],
    recipe:
      "Example: use VideoML and Babulus to turn a Biblicus-backed content workflow into automated demos, tutorials, and launch assets.",
  },
}

const PlatformProductTemplate = ({ pageContext, children }) => {
  const data = useStaticQuery(graphql`
    query PlatformProductTemplateQuery {
      allMdx(
        filter: {
          frontmatter: {
            content_type: { eq: "platform-product" }
            state: { eq: "published" }
          }
        }
      ) {
        nodes {
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
  `)

  const product = data.allMdx.nodes.find(node => node.id === pageContext?.id)
    ?.frontmatter ||
    pageContext?.platformPage || {
      title: "Anthus Platform",
      excerpt: "Anthus platform product details.",
    }
  const relationship = platformRelationships[product.slug]

  return (
    <CitationsProvider>
      <Layout>
        <article>
          <Link to="/platform" className={styles.productBackLink}>
            Back to Anthus Platform
          </Link>
          <div className="heading">
            <span className={styles.eyebrow}>PART OF</span>
            <h2 className={styles.platformHeader}>The Anthus Platform</h2>
            <h1>{product.title}</h1>
            <div className={styles.metaRow}>
              {product.platform_category && (
                <span className={styles.pill}>{product.platform_category}</span>
              )}
              {product.platform_stage && (
                <span className={styles.pill}>{product.platform_stage}</span>
              )}
            </div>
            <p className={styles.lead}>{product.excerpt}</p>
            <div className={styles.actions}>
              {product.external_url && (
                <a href={product.external_url} className="button">
                  Visit external site
                </a>
              )}
              <Link to="/ai-solutions" className={styles.secondaryLink}>
                See how it fits our solutions work
              </Link>
            </div>
          </div>

          <MDXProvider components={shortcodes}>{children}</MDXProvider>

          {relationship && (
            <section className={styles.section}>
              <h2 className={styles.sectionHeading}>
                Where this fits in the Anthus Platform
              </h2>
              <p>{relationship.fits}</p>
              <ul className={styles.featureList}>
                {relationship.links.map(link => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
              <div className={styles.recipeCard}>
                <h3>Common combination</h3>
                <p>{relationship.recipe}</p>
              </div>
            </section>
          )}
        </article>
      </Layout>
    </CitationsProvider>
  )
}

const removeHTMLTags = str => {
  if (str === null || str === "") return ""
  return str.toString().replace(/<[^>]*>/g, "")
}

export const Head = ({ pageContext }) => {
  const product = pageContext?.platformPage || {
    title: "Anthus Platform",
    excerpt: "Anthus platform product details.",
  }
  return (
    <Seo
      title={product.title}
      description={removeHTMLTags(product.excerpt)}
      image="serverless-ai-software-solutions.png"
    />
  )
}

export default PlatformProductTemplate
