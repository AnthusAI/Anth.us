import { graphql } from 'gatsby';
import * as React from "react"
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"
import { format, isValid } from 'date-fns';

const RyansPage = ({ data }) => {
  const featuredSolutions = data.solutions.edges.filter(({ node }) => node.frontmatter.tags.includes('featured'));
  const nonFeaturedSolutions = data.solutions.edges.filter(({ node }) => !node.frontmatter.tags.includes('featured') && !node.frontmatter.tags.includes('integrations'));
  const nonFeaturedIntegrations = data.solutions.edges.filter(({ node }) => !node.frontmatter.tags.includes('featured') && node.frontmatter.tags.includes('integrations'));

  return (
    <Layout>
      <article>
        <div className="resume">
          <h1>Ryan Porter</h1>
          <p>
            Accomplished <mark>technology Leader and architectural innovator</mark> with a proven history of developing and operating mission-critical, high-availability systems that deliver business value.  Focused on delivering exciting AI applications through serverless cloud architectures.
          </p>

          <div className="job-entry">
            <div className="company-name">Tao Group Hospitality</div>
            <div className="job-title">Vice President of Marketing Technology</div>
            <div className="date-range">August 2021 - Present</div>
            <div className="location">New York, NY (remote from Miami Beach, FL)</div>
            <p className="description">
              Formerly with Hakkasan Group, Angel Management Group, and Venue Driver in an evolving role with the same venture.
            </p>
            <ul>
              <li><strong>Pioneering Technical Strategy:</strong> Developed and operated a critical ticketing system evolving over <mark>14 years</mark> into a comprehensive platform encompassing reservation, guest list, and artist booking management, pivotal for business operations across various stakeholder domains.</li>
              <li><strong>Seamless Transition and Growth:</strong> Managed the system's seamless transition through corporate acquisitions, maintaining operational excellence and high availability, processing as much as $64 million in revenue per month with <mark>no major incidents.</mark></li>
              <li><strong>DevOps and Agile Leadership:</strong> Championed a DevOps culture, promoting rapid iteration, continuous improvement, and agile methodologies, aligning closely with business needs and fostering a responsive, collaborative IT environment.</li>
              <li><strong>Longevity and Adaptation:</strong> Adapted the platform through shifting market conditions and technological paradigms, from early-stage monolithic structures to a modern serverless distributed architecture, passing AWS Well-Architected audits by multinational corporations.</li>
            </ul>
          </div>

          <div className="job-entry">
            <div className="company-name">Hakkasan Group</div>
            <div className="job-title">Vice President of Technology</div>
            <div className="date-range">February 2014 - August 2021</div>
            <div className="location">Las Vegas, NV (remote from Miami Beach, FL)</div>
            <p className="description">
              Formerly with Angel Management Group, and Venue Driver in an evolving role with the same venture.
            </p>
            <ul>
              <li><strong>Scalable System Leadership:</strong> Continued advancement of a high-revenue ticketing system, emphasizing scalable, fault-tolerant infrastructure on AWS, embodying the Well-Architected Framework principles.</li>
              <li><strong>Data Integration Initiative:</strong> Initiated and delivered a successful <mark>enterprise data warehouse</mark> project, integrating diverse data systems to support analytics, Salesforce CRM, Marketo and Salesforce Marketing Cloud for marketing operations.</li>
            </ul>
          </div>

          <div className="job-entry">
            <div className="company-name">Angel Management Group</div>
            <div className="job-title">Executive Director of Technology</div>
            <div className="date-range">October 2013 - February 2014</div>
            <div className="location">Las Vegas, NV (remote from Miami Beach, FL)</div>
            <p className="description">
              Formerly with Venue Driver in an evolving role with the same venture.
            </p>
            <ul>
              <li><strong>Strategic Technology Expansion:</strong> Continuation and expansion of existing role after Angel Management Group acquired Venue Driver.</li>
            </ul>
          </div>

          <div className="job-entry">
            <div className="company-name">Venue Driver</div>
            <div className="job-title">CTO</div>
            <div className="date-range">2007 - October 2013</div>
            <div className="location">Miami Beach, FL</div>
            <p className="description">
              <strong>Startup Technology Foundation:</strong> Built and managed all technology infrastructure for a hospitality-focused technology startup, evolving the company into a major event ticketing provider processing substantial monthly revenue.
            </p>
            <ul>
              <li><strong>Leadership and Technical Training:</strong> Directed all aspects of technology including software development, web operations, technical hiring, and training programs, laying the foundation for eventual acquisition and growth.</li>
            </ul>
          </div>

          <h2>Portfolio</h2>

          <ul className={`${styles.list} smallImageList`}>
              {featuredSolutions.map(({ node }) => {
                console.log("Date: ", node.frontmatter.date);
                const image = getImage(node.frontmatter.preview_image);
                const date = new Date(node.frontmatter.date);
                const formattedDate = isValid(date) ? format(date, 'MMMM dd, yyyy') : 'Invalid date';
                return (
                  <li key={node.id} className={styles.listItem}>
                    <GatsbyImage image={image} alt={node.frontmatter.title} />
                    <a className={styles.listItemLink} href={`/blog/${node.frontmatter.slug}`}>
                      <h3>{node.frontmatter.title}</h3>
                    </a>
                    <p className={`${styles.listItemDescription} date`}>{new Date(node.frontmatter.date).toLocaleString('en-US', { year: 'numeric', month: 'long' })}</p>
                    <p className={styles.listItemDescription} dangerouslySetInnerHTML={{ __html: node.frontmatter.excerpt }}></p>
                  </li>
                );
              })}
            </ul>

            <ul className={styles.list}>
              {nonFeaturedSolutions.map(({ node }) => {
                console.log("Date: ", node.frontmatter.date);
                const image = getImage(node.frontmatter.preview_image);
                const date = new Date(node.frontmatter.date);
                const formattedDate = isValid(date) ? format(date, 'MMMM dd, yyyy') : 'Invalid date';
                return (
                  <li key={node.id} className={styles.listItem}>
                    {/* <GatsbyImage image={image} alt={node.frontmatter.title} /> */}
                    <a className={styles.listItemLink} href={`/blog/${node.frontmatter.slug}`}>
                      <h3>{node.frontmatter.title}</h3>
                    </a>
                    <p className={`${styles.listItemDescription} date`}>{new Date(node.frontmatter.date).toLocaleString('en-US', { year: 'numeric', month: 'long' })}</p>
                    <p className={styles.listItemDescription} dangerouslySetInnerHTML={{ __html: node.frontmatter.excerpt }}></p>
                  </li>
                );
              })}
            </ul>

            <h2>Integrations</h2>

            <ul className={styles.list}>
              {nonFeaturedIntegrations.map(({ node }) => {
                console.log("Date: ", node.frontmatter.date);
                const image = getImage(node.frontmatter.preview_image);
                const date = new Date(node.frontmatter.date);
                const formattedDate = isValid(date) ? format(date, 'MMMM dd, yyyy') : 'Invalid date';
                return (
                  <li key={node.id} className={styles.listItem}>
                    {/* <GatsbyImage image={image} alt={node.frontmatter.title} /> */}
                    <a className={styles.listItemLink} href={`/blog/${node.frontmatter.slug}`}>
                      <h3>{node.frontmatter.title}</h3>
                    </a>
                    <p className={`${styles.listItemDescription} date`}>{new Date(node.frontmatter.date).toLocaleString('en-US', { year: 'numeric', month: 'long' })}</p>
                    <p className={styles.listItemDescription} dangerouslySetInnerHTML={{ __html: node.frontmatter.excerpt }}></p>
                  </li>
                );
              })}
            </ul>

        </div>
      </article>
    </Layout>
  )
};

export const Head = () => {
  return (
    <Seo
      title="Ryan Alyn Porter"
      description=""
      image="serverless-ai-software-solutions.png"
    />
  )
}

export const query = graphql`
  query {
    solutions: allMdx(
      filter: { frontmatter: { tags: { in: ["solutions"] } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date
            slug
            excerpt
            state
            preview_image {
              childImageSharp {
                gatsbyImageData(layout: CONSTRAINED)
              }
            }
            tags
          }
        }
      }
    }
  }
`;

export default RyansPage
