import { GatsbyImage } from 'gatsby-plugin-image';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

const BlogImage = ({ images, name, className, alt }) => {
  const data = useStaticQuery(graphql`
    query {
      allFile {
        nodes {
          relativePath
          publicURL
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
  `);

  if (!Array.isArray(images)) {
    console.error('Invalid images prop:', images);
    return null;
  }

  const imageNode = data.allFile.nodes.find(
    node => node.relativePath.endsWith(name)
  );
  
  if (!imageNode) {
    return <p>No image found for: {name}</p>;
  }

  // If it's a GIF or other non-sharp format, use regular img tag with publicURL
  if (!imageNode.childImageSharp) {
    return (
      <img 
        src={imageNode.publicURL} 
        alt={alt} 
        className={className}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    );
  }

  // Otherwise use GatsbyImage for optimized images
  return (
    <GatsbyImage 
      className={className} 
      image={imageNode.childImageSharp.gatsbyImageData} 
      alt={alt}
      loading="eager"
    />
  );
};

export default BlogImage;