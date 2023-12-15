import { graphql } from 'gatsby';
import * as React from "react"
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Layout from "../components/layout"
import Seo from "../components/seo"
import Solutions from "../components/solutions"
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

          <div className="experience">
            <div className="title">Anthus AI Solutions</div>
            <div className="subtitle">Lead AI Solutions Architect</div>
            <div className="info">
              <div className="date-range">January 2024 - Present</div>
              <div className="location">Miami Beach, FL</div>
            </div>
            <p className="description">
              Our team has been working together for over a decade, and we have been working on AI solutions for years now.  The Anthus name is the only new thing, as we fully focus on the intersection of software solutions and artificial intelligence.
            </p>
          </div>

          <div className="experience">
            <div className="title">Tao Group Hospitality</div>
            <div className="subtitle">Vice President of Marketing Technology</div>
            <div className="info">
              <div className="date-range">August 2021 - January 2024</div>
              <div className="location">New York, NY (remote from Miami Beach, FL)</div>
            </div>
            <p className="description">
              Formerly with Hakkasan Group, Angel Management Group, and Venue Driver in an evolving role with the same venture.
            </p>
            <ul>
              <li><strong>Pioneering Technical Strategy:</strong> Developed and operated a critical ticketing system evolving over <mark>14 years</mark> into a comprehensive platform encompassing reservation, guest list, and artist booking management, pivotal for business operations across various stakeholder domains.</li>
              <li><strong>Seamless Transition and Growth:</strong> Managed the system's seamless transition through corporate acquisitions, maintaining operational excellence and high availability, processing as much as <mark>$64 million in revenue per month</mark> with <mark>no major incidents.</mark></li>
              <li><strong>DevOps and Agile Leadership:</strong> Championed a DevOps culture, promoting rapid iteration, continuous improvement, and agile methodologies, aligning closely with business needs and fostering a responsive, collaborative IT environment.</li>
              <li><strong>Longevity and Adaptation:</strong> Adapted the platform through shifting market conditions and technological paradigms, from early-stage monolithic structures to a modern serverless distributed architecture, passing AWS Well-Architected audits by multinational corporations.</li>
            </ul>
          </div>

          <div className="experience">
            <div className="title">Hakkasan Group</div>
            <div className="subtitle">Vice President of Technology</div>
            <div className="info">
              <div className="date-range">February 2014 - August 2021</div>
              <div className="location">Las Vegas, NV (remote from Miami Beach, FL)</div>
            </div>
            <p className="description">
              Formerly with Angel Management Group, and Venue Driver in an evolving role with the same venture.
            </p>
            <ul>
              <li><strong>Scalable System Leadership:</strong> Continued advancement of a high-revenue ticketing system, emphasizing scalable, fault-tolerant infrastructure on AWS, embodying the Well-Architected Framework principles.</li>
              <li><strong>Data Integration Initiative:</strong> Initiated and delivered a successful <mark>enterprise data warehouse</mark> project, integrating diverse data systems to support analytics, Salesforce CRM, Marketo and Salesforce Marketing Cloud for marketing operations.</li>
            </ul>
          </div>

          <div className="experience">
            <div className="title">Angel Management Group</div>
            <div className="subtitle">Executive Director of Technology</div>
            <div className="info">
              <div className="date-range">October 2013 - February 2014</div>
              <div className="location">Las Vegas, NV (remote from Miami Beach, FL)</div>
            </div>
            <p className="description">
              Formerly with Venue Driver in an evolving role with the same venture.
            </p>
            <ul>
              <li><strong>Strategic Technology Expansion:</strong> Continuation and expansion of existing role after Angel Management Group acquired Venue Driver.</li>
            </ul>
          </div>

          <div className="experience">
            <div className="title">Venue Driver</div>
            <div className="subtitle">CTO</div>
            <div className="info">
              <div className="date-range">2007 - October 2013</div>
              <div className="location">Miami Beach, FL</div>
            </div>
            <p className="description">
              <strong>Startup Technology Foundation:</strong> Built and managed all technology infrastructure for a hospitality-focused technology startup, evolving the company into a major event ticketing provider processing substantial monthly revenue.
            </p>
            <ul>
              <li><strong>Leadership and Technical Training:</strong> Directed all aspects of technology including software development, web operations, technical hiring, and training programs, laying the foundation for eventual acquisition and growth.</li>
            </ul>
          </div>

          <div className="experience">
            <div className="title">CoolJunkie, LLC</div>
            <div className="subtitle">TechJunkie</div>
            <div className="info">
              <div className="date-range">2002 - 2005</div>
              <div className="location">Miami Beach, FL</div>
            </div>
            <p className="description">
              Entered into a joint venture with Nick McCabe to develop a nightlife production and media company in Miami Beach, FL.  The successful CoolJunkie.com website with its interactive forums was a pillar of the Miami Beach nightlife scene for years in the days before social media.  The company also produced events like the BBC Radio One Miami party during the Winter Music Conference, and events from artists like Pete Tong, Cedric Gervais and many others.
            </p>
          </div>

          <div className="experience">
            <div className="title">Endymion Corporation</div>
            <div className="subtitle">President</div>
            <div className="info">
              <div className="date-range">1997 - Present</div>
              <div className="location">Miami Beach, FL</div>
            </div>
            <p className="description">
              Started a small software product company after graduating, based around a web mail application that was popular in the early days of the web, in the days of WebTV and AOL.  Developed, licensed and supported a PERL-based web mail application that was used by thousands of users, and a Java-based enterprise web mail product.
            </p>
          </div>

          <div className="experience">
            <div className="title">University of Florida</div>
            <div className="subtitle">BS, Computer Science</div>
            <div className="info">
              <div className="date-range">1992 - 1997</div>
            </div>
            <p className="description">
              Worked as an undergraduate research assistant for Dr. Gerhard X. Ritter and Dr. Mark S. Schmalz helping with their innovative work on <mark>computer vision</mark> using the Image Algebra framework. With funding from the US Department of Defense. One project's goal was the <mark>automated detection</mark> of land mines using multi-spectral imagery.  An early predecessor of today's visual segmentation models.  The project was incredibly successful despite relying on 2D convolution algorithms, without the benefit of modern visual AI models.  My main job was C++ development.
            </p>
            <p className="description">
              A related computer vision project aimed at detecting water mines by removing distortion in images from the surface of the ocean. 
            </p>
            <p className="description">
              Also worked on other research projects, including work by Dr. Panos Livadas on automated code analysis and refactoring tools that foreshadowed LLM-based coding tools like GitHub Copilot.
            </p>
            <p className="description">
              Also worked as an undergraduate teaching assistant for a class based on the classic Lisp textbook, The Structure and Interpretation of Computer Programs.
            </p>
          </div>

          <h2>Portfolio</h2>

          <Solutions
            className="smallImageList"
            solutions={featuredSolutions}
            showPreviewImage={true}
            linkToPage={false}
          />
          
          <Solutions
            solutions={nonFeaturedSolutions}
            showPreviewImage={false}
            linkToPage={false}
          />
          
          <h2>Integrations</h2>
          
          <Solutions
            solutions={nonFeaturedIntegrations}
            showPreviewImage={false}
            linkToPage={false}
          />

        </div>
      </article>
    </Layout>
  )
};

export const Head = () => {
  return (
    <Seo
      title="Ryan Porter"
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
