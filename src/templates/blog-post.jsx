import React from 'react';
import { graphql } from 'gatsby';
import Layout from "../components/layout"
import Seo from "../components/seo"
import { MDXProvider } from "@mdx-js/react"
import Markdown from 'markdown-to-jsx';
import BlogImage from '../components/blog-image';
import { CitationsProvider, Citation, CitationsList } from 'gatsby-citation-manager';
import MDXCode from "../components/MDXCode";

// Define the shortcodes object
const shortcodes = { BlogImage, Citation, CitationsList, MDXCode };

const BlogPostTemplate = ({ data, children }) => {
  const post = data.mdx;
  const siteUrl = data.site.siteMetadata.siteUrl;
  
  // Safely access the image URL or set to null if it doesn't exist
  const imageUrl = post.frontmatter.preview_image
    && post.frontmatter.preview_image.childImageSharp
    && post.frontmatter.preview_image.childImageSharp.gatsbyImageData
    && post.frontmatter.preview_image.childImageSharp.gatsbyImageData.images
    && post.frontmatter.preview_image.childImageSharp.gatsbyImageData.images.fallback
    && post.frontmatter.preview_image.childImageSharp.gatsbyImageData.images.fallback.src
    ? `${siteUrl}${post.frontmatter.preview_image.childImageSharp.gatsbyImageData.images.fallback.src}`
    : null;

  const cleanExcerpt = removeHTMLTags(post.frontmatter.excerpt);

  return (
    <CitationsProvider>
      <Layout>
        <article>
          {post.frontmatter.state !== 'published' && (
            <div className="draft-overlay">
              <h1 className="draft-overlay-text">DRAFT</h1>
            </div>
          )}
          <div className='heading'>
            <h1>{post.frontmatter.title}</h1>
            <div className='date'>{formatDate(post.frontmatter.date)}</div>
            {post.frontmatter.authors && post.frontmatter.authors.length > 0 && (
              <div className='authors'>
                <span className='byline'>by </span>
                {post.frontmatter.authors.map((authorObj, index, array) => (
                  <React.Fragment key={index}>
                    <span className="author">
                      <Markdown>
                        {authorObj.author}
                      </Markdown>
                    </span>
                    {index < array.length - 2 && ', '}
                    {index === array.length - 2 && (array.length > 2 ? ', and ' : ' and ')}
                  </React.Fragment>
                ))}
              </div>
            )}
            {post.frontmatter.assistants && post.frontmatter.assistants.length > 0 && (
              <div className='assistants'>
                <span className='byline'>with assistance from </span>
                {post.frontmatter.assistants.map((assistantObj, index, array) => (
                  <React.Fragment key={index}>
                    <span className="assistant">
                      <Markdown>
                        {assistantObj.assistant}
                      </Markdown>
                    </span>
                    {index < array.length - 2 && ', '}
                    {index === array.length - 2 && (array.length > 2 ? ', and ' : ' and ')}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
          <MDXProvider components={shortcodes}>
            {children}
          </MDXProvider>
        </article>
      </Layout>
    </CitationsProvider>
  );
};

const removeHTMLTags = (str) => {
  if (str === null || str === '') return false;
  else str = str.toString();
  return str.replace(/<[^>]*>/g, '');
};

export const Head = ({ data }) => {
  const post = data.mdx;
  const siteUrl = data.site.siteMetadata.siteUrl;
  
  // Safely access the image URL or set to null if it doesn't exist
  const imageUrl = post.frontmatter.preview_image
    && post.frontmatter.preview_image.childImageSharp
    && post.frontmatter.preview_image.childImageSharp.gatsbyImageData
    && post.frontmatter.preview_image.childImageSharp.gatsbyImageData.images
    && post.frontmatter.preview_image.childImageSharp.gatsbyImageData.images.fallback
    && post.frontmatter.preview_image.childImageSharp.gatsbyImageData.images.fallback.src
    ? `${siteUrl}${post.frontmatter.preview_image.childImageSharp.gatsbyImageData.images.fallback.src}`
    : null;

  const cleanExcerpt = removeHTMLTags(post.frontmatter.excerpt);

  return (
    <Seo
      title={post.frontmatter.title}
      description={cleanExcerpt}
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
        state
        date
        authors {
          author
        }
        assistants {
          assistant
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

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}