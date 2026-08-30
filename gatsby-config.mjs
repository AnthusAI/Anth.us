/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 *
 * This file is ESM (.mjs) because remark-gfm — and most of the modern
 * remark/unified ecosystem — is published as ESM only.
 */

import path from 'path'
import { fileURLToPath } from 'url'
import remarkGfm from 'remark-gfm'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteContentPath = `${__dirname}/src/site-content`

/**
 * @type {import('gatsby').GatsbyConfig}
 */
export default {
  siteMetadata: {
    title: `Anthus`,
    description: `Anthus builds and operates self-aligning AI systems — custom models, agent harnesses, and evaluation loops with a human in the loop, grounded in 14 years of production operations.`,
    author: `Ryan Porter`,
    siteUrl: `https://anth.us`,
    menuLinks:[
      {
        name:'AI Solutions',
        link:'/ai-solutions'
      },
      {
        name:'Platform',
        link:'/platform'
      },
      {
        name:'About',
        link:'/about'
      },
      {
        name:'Articles',
        link:'/blog'
      },
      {
        name:'Posts',
        link:'/posts'
      },
    ]
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          quality: 70,
          formats: ['auto', 'webp', 'avif'],
          placeholder: 'blurred',
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Anth.us AI Solutions`,
        short_name: `Anth.us`,
        start_url: `/`,
        background_color: `#663399`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`,
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Jersey 10:400`,
          `Geist Mono:400,500`,
          `Montserrat:400,500,600,900`,
        ],
        display: 'block',
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 940,
              linkImagesToOriginal: false,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: siteContentPath,
        ignore: [
          `**/README.md`,
          `**/.git/**`,
          `**/.gitignore`,
          // Posts are listed at /posts/ and served at /blog/{slug}/ via gatsby-node.
          `**/posts/**`,
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: siteContentPath,
        ignore: [`**/README.md`, `**/.git/**`, `**/.gitignore`],
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 940,
            },
          }
        ],
      },
    },
    'gatsby-citation-manager',
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "G-31SC26SDGX", // Google Analytics / GA
        ],
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: true,
        },
      },
    },
  ],
}
