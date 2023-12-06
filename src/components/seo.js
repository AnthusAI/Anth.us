/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { getImage } from "gatsby-plugin-image"

function Seo({ description, title, children, image, imageURL }) {

  const { site, allFile } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
        allFile(filter: { sourceInstanceName: { eq: "images" } }) {
          edges {
            node {
              relativePath
              childImageSharp {
                gatsbyImageData(layout: FULL_WIDTH)
              }
            }
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title

  // If imageURL is not provided, find the image that matches the `image` prop
  if (!imageURL && image) {
    console.log(`Looking for image: ${image}`)

    const imageNode = allFile.edges.find(
      edge => edge.node.relativePath === image
    )

    if (imageNode) {
      console.log(`Found image: ${imageNode.node.relativePath}`)

      // Get the GatsbyImage data
      const seoImage = getImage(imageNode.node.childImageSharp)

      // Set imageURL to the src of the GatsbyImage
      if (seoImage) {
        imageURL = seoImage.images.fallback.src
      }
    } else {
      console.log(`Image not found: ${image}`)
    }
  }
  console.log("imageURL: ", imageURL)

  return (
    <>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="description" content={metaDescription} />
      <meta name="image" content={imageURL} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={site.siteMetadata?.author || ``} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageURL} />
      {children}
    </>
  )
}

export default Seo
