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

  console.log('Images in BlogImage:', images);

  if (!Array.isArray(images)) {
    console.error('Invalid images prop:', images);
    return null;
  }

  console.log("data.allFile.nodes:", data.allFile.nodes)
  console.log("images[index]:", images[index])
  const imageNode = data.allFile.nodes.find(
    node => node.relativePath === images[index].replace(/^\.\//, '')
  );
  console.log('imageNode:', imageNode);
  const imageData = imageNode ? imageNode.childImageSharp.gatsbyImageData : null;
  console.log('imageData:', imageData);

  return imageData ? (
    <GatsbyImage className={className} image={imageData} alt={alt} />
  ) : (
    <p>No image data found.</p>
  );
};

export default BlogImage;