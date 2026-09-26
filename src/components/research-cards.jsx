import React from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { formatPostDate } from "../utils/format-post-date"
import * as styles from "./platform.module.css"
import * as researchStyles from "./research-cards.module.css"

const repositoryLabel = url =>
  url.replace(/^https?:\/\/(www\.)?github\.com\//, "")

const ResearchCards = ({ items }) => (
  <ul className={styles.grid}>
    {items.map(({ node }) => {
      const articlePath = `/blog/${node.frontmatter.slug}`
      const headlineImage = getImage(node.frontmatter.preview_image)
      return (
        <li key={node.id} className={styles.card}>
          {headlineImage && (
            <Link to={articlePath} className={researchStyles.imageLink}>
              <GatsbyImage
                image={headlineImage}
                alt={node.frontmatter.title}
                className={researchStyles.headlineImage}
              />
            </Link>
          )}
          <Link to={articlePath} className={styles.cardTitleLink}>
            <h3>{node.frontmatter.title}</h3>
          </Link>
          <div className={styles.metaRow}>
            {node.frontmatter.date && (
              <span className={styles.pill}>
                {formatPostDate(node.frontmatter.date)}
              </span>
            )}
          </div>
          <p>{node.frontmatter.excerpt}</p>
          <div className={styles.cardActions}>
            <Link to={articlePath}>Read more</Link>
            {node.frontmatter.repository && (
              <a
                href={node.frontmatter.repository}
                target="_blank"
                rel="noopener noreferrer"
              >
                Code: {repositoryLabel(node.frontmatter.repository)}
              </a>
            )}
          </div>
        </li>
      )
    })}
  </ul>
)

export default ResearchCards
