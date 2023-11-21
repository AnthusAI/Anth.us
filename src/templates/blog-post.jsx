import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
// import Seo from '../components/seo'
import { MDXProvider } from "@mdx-js/react"
import Markdown from 'markdown-to-jsx';

const BlogPostTemplate = ({ data, children }) => {
  console.log("Data:", data);
  console.log("Children:", children);

  if (!data || !data.mdx) {
    return <div>No data found for this post!</div>;
  }

  const post = data.mdx;

  const shortcodes = { Link }

  return (
    <Layout>
      {/* <Seo title={post.frontmatter.title} /> */}
      <article>
        <div className='heading'>
          <h1>{post.frontmatter.title}</h1>
          <div className='date'>{post.frontmatter.date}</div>
          <div className='authors'>
            <div className='byline'>by</div>
            <ul className='authors'>
              {post.frontmatter.authors.map((author) => (
                <li key={author.author}>
                  <div class="author">
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
  );
};

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        authors {
          author
        }
      }
    }
  }
`;

export default BlogPostTemplate;
