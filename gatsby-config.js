/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Anthus`,
    description: `Depend on veteran DevOps experts for your bespoke AI workloads.`,
    author: `Ryan Alyn Porter`,
    siteUrl: `https://gatsbystarterdefaultsource.gatsbyjs.io/`,
    menuLinks:[
      {
        name:'AI Solutions',
        link:'/ai-solutions'
      },
      {
        name:'About',
        link:'/about'
      },
      {
        name:'Blog',
        link:'/blog'
      }
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
    `gatsby-plugin-sharp`,
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
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Cinzel:600,900`,
          `Montserrat`,
        ],
        display: 'block',
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        // Your options here (if any)
      },
    },
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/src/blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/src/blog`,
      },
    },
    `gatsby-transformer-remark`
    
  ],
}
