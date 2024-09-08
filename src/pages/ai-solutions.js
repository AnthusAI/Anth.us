import { graphql } from 'gatsby';
import React, { useEffect } from 'react';
import Layout from "../components/layout"
import Seo from "../components/seo"
import Solutions from "../components/solutions"

const AISolutionsPage = ({ data }) => {
  useEffect(() => {
    document.title = "AI Solutions";
  }, []);

  const featuredSolutions = data.solutions.edges.filter(({ node }) => !node.frontmatter.tags.includes('integrations'));
  const nonFeaturedIntegrations = data.solutions.edges.filter(({ node }) => !node.frontmatter.tags.includes('featured') && node.frontmatter.tags.includes('integrations'));

  return (
    <Layout>
      <article>
        <div>
          <h1>Solving Problems Using AI</h1>
          <p>
            <img src="/assets/images/ai-software-solutions.png" alt="image-right" className="responsive-float-right-image" />
            <p>You're under pressure to drive business efficiencies through artificial intelligence, and we know how. <mark>We transform businesses by turning ideas into real-world solutions.</mark> Our approach is built on industry best practices and decades of experience.</p>
            <p>We excel at:</p>
            <ul>
              <li>Business process automation with AI/ML</li>
              <li>Leveraging cloud and serverless for efficiency and reliability</li>
              <li>Following industry best practices</li>
              <li>Delivering solutions with high operational maturity</li>
              <li>Ensuring regulatory compliance and auditability</li>
            </ul>
            <p>Our expertise makes your AI aspirations real. We design, implement, and support robust systems that drive efficiency and create new opportunities.</p>
          </p>
          <p>Ready to revolutionize your business? <a href="https://docs.google.com/forms/d/e/1FAIpQLSdWlt4KpwPSBHzg3o8fikHcfrzxo5rCcV-0-zDt815NZ1tcyg/viewform?usp=sf_link">Let's talk about what we can do for you.</a></p>
          <div className="clear"></div>
          <h2>Portfolio</h2>

          <p>Our journey spans decades of solving complex business challenges. Recently, we've focused on AI-driven solutions, leveraging our deep expertise to deliver cutting-edge applications that transform businesses:</p>

          <Solutions
            className="smallImageList"
            solutions={featuredSolutions}
            showPreviewImage={true}
            linkToPage={false}
          />

          <h2>Integrations</h2>

          <Solutions
            solutions={nonFeaturedIntegrations}
            showPreviewImage={false}
            linkToPage={false}
          />

          <h2>Types of solutions</h2>

          <h3 name="smart-process-automation">Smart Process Automation</h3>
          <p>Your team of humans are expensive and you need them to spend their time <mark>driving business value</mark>. Everything about the calculus of what things are worth automating suddenly changed in 2023, and it's time to re-evaluate what menial tasks you can eliminate.</p>
          <p>Privacy laws have changed a lot too, and new changes like the GDPR's "<a href="https://www.dataprotection.ie/en/individuals/know-your-rights/right-erasure-articles-17-19-gdpr">right to be forgotten</a>" has created a lot of work for a lot of companies. If you're a large enough company then you might be obligated to monitor a mailbox for unstructured email requests from humans, services and apps and respond to them within a regulated amount of time. You might need to document everything. Lots of companies have humans reading mailboxes once a day or once a week and manually responding to requests.</p>
          <p><mark>This is what AI is for: Automating menial tasks</mark>. The amazing thing is how far the definition of "menial" has changed.</p>
          <p>It's easy for an AI model to detect a GDPR 'forget me' request in an email and extract the required identifying information. We can build a process out of that. Our system can track the request emails that it detects, respond to the requestor, and notify you so that you can handle them. Or, we can build a process that fully automates deleting people from your data warehouses and data lakes and IT components. Or anything in between. How about a mostly-automated system with a human-in-the-loop approval process?</p>
          <p>We know how to do that. Let's talk.</p>

          <h3 id="conversational-ai-agents">Conversational AI Co-Pilot Agents</h3>
          <p>With a background in crafting bespoke solutions, we excel at <mark>integrating conversational 'co-pilot' AI agents into existing systems</mark>, especially cloud-based systems on AWS. We showcased our expertise in the serverless event ticket sales system we operated for over 14 years. In the final year of this project in 2023, we introduced AI co-pilot technology using the <a href="https://openai.com/product">OpenAI API</a>, Slack, and a serverless application that could directly monitor and report on the AWS CloudWatch metrics and alarms from our system.</p>
          <p>Copilot agents offer 24/7 availability and can save precious minutes during an operations crisis by helping operators to quickly diagnose problems. This constant support equips human operations teams with real-time information when needed, fostering a culture of agile and informed decision-making. Copilots can deliver cost-efficiency by automating routine tasks and reallocating resources towards more strategic, growth-focused activities.</p>
          <p>Ready to elevate your operational efficiency with tailored Conversational AI solutions? We know how to <mark>connect the dots</mark> between the agents and your systems. Contact us to explore how our custom AI co-pilot integration can drive value for your business.</p>

          <h3 id="ai-software-features">Tailored AI Features</h3>
          <p>Artificial intelligence can be <mark>nearly invisible, but crucial</mark>. We faced a challenge recently in generating web restaurant menus because the system that stored the menu data didn't tag it with a language. How do you handle things like right-to-left languages on the web if you don't know what language you're displaying? How can we handle restaurant menus in Arabic?</p>
          <p>Since the language of the restaurant menus was not and could not be tagged, we used AI to infer the language of each menu using <a href="https://aws.amazon.com/rekognition/">Amazon Rekognition</a>. AI made the system possible. It has performed flawlessly in production over time. It's not even fooled by "a la carte" on English menus.</p>

          <h3 id="ai-enabled-projects">AI-Enabled Projects</h3>
          <p>Driving business efficiencies through artificial intelligence doesn't always require running AI models in production. <mark>AI makes hard things easy</mark>, and your business can benefit from bringing new capabilities within reach.</p>

          <h2>The Process</h2>
          <figure>
            <img src="/assets/images/Anthus AI Application Lifecycle.png" alt="AI Application Lifecycle" />
          </figure>
        </div>
      </article>
    </Layout>
  );
};

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => {
  return (
    <Seo
      title="AI Solutions"
      description="Explore efficient AI solutions for business: smart automation, conversational agents, and bespoke AI features, all integrated seamlessly with AWS. Discover how AI drives value and compliance in your operations."
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
            display_date
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

export default AISolutionsPage;