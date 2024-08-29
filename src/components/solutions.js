import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import React, { useEffect } from 'react';
import * as styles from "../components/index.module.css"
import { Link } from "gatsby";
import { format, isValid } from 'date-fns';

// Define the new component
const Solutions = ({ solutions, showPreviewImage, linkToPage, className }) => (
  <ul className={`${styles.list} ${className}`}>
    {solutions.map(({ node }) => {
      const image = getImage(node.frontmatter.preview_image);
      const date = new Date(node.frontmatter.date);
      const formattedDate = isValid(date) 
        ? format(date, 'MMMM dd, yyyy') 
        : node.frontmatter.date;
      
      const displayDate = node.frontmatter.display_date || formattedDate;

      return (
        <li key={node.id} className={styles.listItem}>
          {showPreviewImage && <GatsbyImage image={image} alt={node.frontmatter.title} />}
          {linkToPage ? 
            <Link className={styles.listItemLink} to={`/blog/${node.frontmatter.slug}`}>
              <h3>{node.frontmatter.title}</h3>
            </Link> :
            <h3>{node.frontmatter.title}</h3>
          }
          <p className={`${styles.listItemDescription} date`}>{displayDate}</p>
          <p className={styles.listItemDescription} dangerouslySetInnerHTML={{ __html: node.frontmatter.excerpt }}></p>
        </li>
      );
    })}
  </ul>
)

export default Solutions
