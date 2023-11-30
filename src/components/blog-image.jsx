import { GatsbyImage } from 'gatsby-plugin-image';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

const BlogImage = ({ images, index, className, alt }) => {
  const data = useStaticQuery(graphql`
    query {
      allFile {
        nodes {
          relativePath
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
    node => node.relativePath === images[index].replace(/^\.\//, '')
  );
  const imageData = imageNode ? imageNode.childImageSharp.gatsbyImageData : null;

  return imageData ? (
    <GatsbyImage className={className} image={imageData} alt={alt} />
  ) : (
    <p>No image data found.</p>
  );
};

export default BlogImage;