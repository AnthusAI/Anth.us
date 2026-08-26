import { GatsbyImage } from "gatsby-plugin-image"
import { graphql, useStaticQuery } from "gatsby"
import React from "react"

const BlogImage = ({ images, name, className, alt }) => {
  const data = useStaticQuery(graphql`
    query {
      sharpImages: allFile(
        filter: { extension: { regex: "/(jpg|jpeg|png|webp|avif)$/" } }
      ) {
        nodes {
          relativePath
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      otherImages: allFile(filter: { extension: { regex: "/(gif|svg)$/" } }) {
        nodes {
          relativePath
          publicURL
        }
      }
    }
  `)

  if (!Array.isArray(images)) {
    console.error("Invalid images prop:", images)
    return null
  }

  // Check sharp-compatible images first
  const sharpNode = data.sharpImages.nodes.find(node =>
    node.relativePath.endsWith(name)
  )

  if (sharpNode) {
    return (
      <GatsbyImage
        className={className}
        image={sharpNode.childImageSharp.gatsbyImageData}
        alt={alt}
        loading="eager"
      />
    )
  }

  // Check other formats (GIF, SVG)
  const otherNode = data.otherImages.nodes.find(node =>
    node.relativePath.endsWith(name)
  )

  if (otherNode) {
    return (
      <img
        src={otherNode.publicURL}
        alt={alt}
        className={className}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    )
  }

  return <p>No image found for: {name}</p>
}

export default BlogImage
