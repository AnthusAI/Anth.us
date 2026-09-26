import React from "react"
import { Link } from "gatsby"
import { formatPostDate } from "../utils/format-post-date"
import * as styles from "./platform.module.css"

const ResearchCards = ({ items }) => (
  <ul className={styles.grid}>
    {items.map(({ node }) => (
      <li key={node.id} className={styles.card}>
        <Link
          to={`/blog/${node.frontmatter.slug}`}
          className={styles.cardTitleLink}
        >
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
          <Link to={`/blog/${node.frontmatter.slug}`}>Read more</Link>
        </div>
      </li>
    ))}
  </ul>
)

export default ResearchCards
