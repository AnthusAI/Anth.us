import React from 'react';
import { Link } from 'gatsby';
import * as styles from './platform.module.css';

const PlatformCards = ({ items, showExternalLink = true }) => (
  <ul className={styles.grid}>
    {items.map(({ node }) => (
      <li key={node.id} className={styles.card}>
        <Link to={`/platform/${node.frontmatter.slug}`} className={styles.cardTitleLink}>
          <h3>{node.frontmatter.title}</h3>
        </Link>
        <div className={styles.metaRow}>
          {node.frontmatter.platform_category && (
            <span className={styles.pill}>{node.frontmatter.platform_category}</span>
          )}
          {node.frontmatter.platform_stage && (
            <span className={styles.pill}>{node.frontmatter.platform_stage}</span>
          )}
        </div>
        <p>{node.frontmatter.excerpt}</p>
        <div className={styles.cardActions}>
          <Link to={`/platform/${node.frontmatter.slug}`}>Read more</Link>
          {showExternalLink && node.frontmatter.external_url && (
            <a href={node.frontmatter.external_url}>Visit site</a>
          )}
        </div>
      </li>
    ))}
  </ul>
);

export default PlatformCards;
