import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import Layout from '../components/layout';
import { MDXProvider } from "@mdx-js/react"
import Markdown from 'markdown-to-jsx';
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Seo from "../components/seo"
import BlogImage from '../components/blog-image';
import { CitationsProvider, Citation, CitationsList } from 'gatsby-citation-manager';

const BlogPostTemplate = ({ data, children }) => {

  if (!data || !data.mdx) {
    return <div>No data found for this post!</div>;
  }

  const post = data.mdx;

  const image = getImage(data.mdx.frontmatter.preview_image)

  const images = post.frontmatter.images.map((image, index) => {
    return getImage(image)
  })
  console.log('Images in BlogPostTemplate:', images);

  const shortcodes = { 
    Link, 
    BlogImage: ({ index, className, alt }) => (
      <BlogImage images={post.frontmatter.images} index={index} className={className} alt={alt} />
    )
  }

  return (
    <CitationsProvider>
      <Layout>
        <article>
          <div className='heading'>
            <h1>{post.frontmatter.title}</h1>
            <div className='date'>{post.frontmatter.date}</div>
            <div className='authors'>
              <div className='byline'>by</div>
              <ul className='authors'>
                {post.frontmatter.authors.map((author) => (
                  <li key={author.author}>
                    <div className="author">
                      <Markdown>
                        {author.author}
                      </Markdown>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <MDXProvider components={shortcodes}>
            {children}
          </MDXProvider>
        </article>
      </Layout>
    </CitationsProvider>
  );
};

export const Head = ({ location, params, data, pageContext }) => {
  const post = data.mdx;
  
  const siteUrl = data.site.siteMetadata.siteUrl;
  const imageUrl = `${siteUrl}${post.frontmatter.preview_image.childImageSharp.gatsbyImageData.images.fallback.src}`;

  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.excerpt}
      image={imageUrl}
    />
  )
} 


export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        title
        excerpt
        date(formatString: "MMMM DD, YYYY")
        authors {
          author
        }
        preview_image {
          childImageSharp {
            gatsbyImageData
          }
        }
        images {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
  }
`;

export default BlogPostTemplate;
