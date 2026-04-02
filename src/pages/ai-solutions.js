import { graphql } from 'gatsby';
import React, { useEffect } from 'react';
import Layout from "../components/layout"
import Seo from "../components/seo"
import Solutions from "../components/solutions"
import PlatformCards from "../components/platform-cards"
import { Link } from 'gatsby';

const contactUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSdWlt4KpwPSBHzg3o8fikHcfrzxo5rCcV-0-zDt815NZ1tcyg/viewform?usp=sf_link"

const solutionBlueprints = [
  {
    title: "Agentic internal tool or operator console",
    stack: "Korporus + Tactus + Plexus + Caducus",
    description:
      "Use Korporus as the host shell, Tactus for durable procedures, Plexus for evaluation and feedback loops, and Caducus for operator-facing health signals.",
  },
  {
    title: "Evidence-grounded research and extraction workflow",
    stack: "Biblicus + Tactus + Plexus",
    description:
      "Use Biblicus to manage the corpus, Tactus to encode the repeatable extraction procedure, and Plexus to benchmark quality and keep the workflow improving.",
  },
  {
    title: "Content, demo, or video automation pipeline",
    stack: "Biblicus + Babulus + VideoML + Korporus",
    description:
      "Ground the source material in Biblicus, generate the output through Babulus and VideoML, and expose the workflow as a service inside Korporus when it needs a stable home.",
  },
  {
    title: "Workflow-heavy delivery system with humans in the loop",
    stack: "Kanbus + Tactus + Plexus + Korporus",
    description:
      "Track work and state in Kanbus, execute the procedure in Tactus, manage evaluation through Plexus, and wrap the result in Korporus when it becomes a broader application surface.",
  },
];

const AISolutionsPage = ({ data }) => {
  useEffect(() => {
    document.title = "AI Solutions";
  }, []);

  const featuredSolutions = data.solutions.edges.filter(({ node }) => 
    node.frontmatter.tags.includes('featured') && !node.frontmatter.tags.includes('integrations')
  );
  const nonFeaturedSolutions = data.solutions.edges.filter(({ node }) => 
    !node.frontmatter.tags.includes('featured') && !node.frontmatter.tags.includes('integrations')
  );
  const integrations = data.solutions.edges.filter(({ node }) => 
    node.frontmatter.tags.includes('integrations')
  );
  const platformProducts = data.platformProducts.edges;

  return (
    <Layout>
      <article>
        <div>
          <h1>Solving Problems Using AI</h1>
          <img
            src="/assets/images/ai-software-solutions.png"
            alt="AI software solutions"
            className="responsive-float-right-image"
          />
          <p>
            You're under pressure to turn AI into something measurable, governable, and actually useful. We know how to
            do that because we have already done it in production: RLHF-driven QA systems, corpus-backed automation
            pipelines, operator copilots, and hosted agent applications with clear control loops.
          </p>
          <p>
            That capability did not appear out of nowhere. It comes from years of operating business-critical systems
            with strong expectations around uptime, auditability, change management, and service maturity.
          </p>
          <p>Today, our delivery work most often looks like:</p>
          <ul>
            <li>Production RLHF and evaluation systems for high-stakes workflows</li>
            <li>Evidence-grounded automation built from corpus and retrieval pipelines</li>
            <li>Operator-facing agent applications with durable workflow state</li>
            <li>Programmable content and video systems for demos, explainers, and publishing</li>
            <li>Cloud-native delivery with strong operational maturity, auditability, and rollback paths</li>
          </ul>
          <p>
            We still do bespoke systems work, but the pattern is clearer now. The same platform pieces keep showing up
            in successful engagements, which lets us move faster without pretending every project starts from zero.
          </p>

          <h2>Our Approach: Cybernetic Development</h2>
          <p>
            We don’t just build AI features—we build the governors that make them safe to operate: clear
            specifications, layered verification, staged releases, and feedback loops that incorporate production
            learnings.
          </p>
          <ul>
            <li>Specs first: define behavior before implementation.</li>
            <li>Defense in depth: sandboxed tools, CI gates, staged rollouts, and fast rollback.</li>
            <li>Operational feedback: telemetry and incident-driven regressions that tighten the loop over time.</li>
            <li>Simplify and delete: reduce degrees of freedom to eliminate entire classes of failure.</li>
          </ul>
          <p>
            Learn more in our article on{" "}
            <Link to="/blog/cybernetic-development">Cybernetic Development</Link>, or{" "}
            <a href={contactUrl}>contact us</a> to talk through your goals and constraints.
          </p>

          <p>
            If you are trying to turn an AI idea into a system that can actually be operated,{" "}
            <a href={contactUrl}>let&apos;s talk through the workflow, risk profile, and proof points you need.</a>
          </p>
          <div className="clear"></div>
          <h2>The Anthus Platform</h2>

          <p>
            Solve complex business problems with AI and ML using a proven, reusable technology stack. These interoperable building blocks give our solutions a stronger operational foundation: durable procedures, MLOps control loops,
            workload orchestration, knowledge systems, observability, and programmable media workflows.
          </p>

          <PlatformCards items={platformProducts} />

          <p>
            Start with <Link to="/platform">the platform overview</Link> if you want the product-map view, then come
            back here for the client-facing solutions and case studies.
          </p>

          <h2>How solution language maps to the platform</h2>
          <p>
            Buyers usually describe the job to be done, not the internal stack. That is the right level to start from.
            Under the hood, though, the same platform building blocks tend to reappear in different combinations.
          </p>
          <ul>
            {solutionBlueprints.map(item => (
              <li key={item.title}>
                <strong>{item.title}:</strong> <code>{item.stack}</code>. {item.description}
              </li>
            ))}
          </ul>
          <p>
            This is why the Anthus Platform matters: these are not isolated products. They are interchangeable parts we
            combine into complete services with clearer specs, better monitoring, and stronger long-term maintainability.
          </p>

          <h2>Featured Solutions</h2>

          <p>These examples are not speculative positioning. They are concrete projects that show how we package evaluation, workflow, knowledge, monitoring, and delivery into working systems.</p>

          <Solutions
            className="smallImageList"
            solutions={featuredSolutions}
            showPreviewImage={true}
            linkToPage={false}
          />

          <h2>Portfolio</h2>

          <p>
            Our portfolio spans long-running operational systems, governed AI delivery work, and the platform
            components that emerged from those environments:
          </p>

          <Solutions
            className="smallImageList"
            solutions={nonFeaturedSolutions}
            showPreviewImage={true}
            linkToPage={false}
          />

          <h2>Integrations</h2>

          <Solutions
            solutions={integrations}
            showPreviewImage={false}
            linkToPage={false}
          />

          <h2>Types of solutions</h2>

          <h3 name="smart-process-automation">Smart Process Automation</h3>
          <p>We use this label for high-volume workflows where the real challenge is not just classification, but building a durable end-to-end process around it. That usually means corpus inputs, explicit procedures, review gates, notifications, and a place for the system to live once it is running.</p>
          <p>A concrete example is regulated or policy-heavy intake work: detect a request in unstructured communications, extract the required facts, route it correctly, preserve the evidence, and keep humans in the loop where judgment still matters.</p>
          <p>That kind of solution often combines <code>Biblicus</code> for evidence and retrieval, <code>Tactus</code> for the durable procedure, and <code>Korporus</code> or <code>Caducus</code> when operators need a stable interface and visibility into what is happening.</p>

          <h3 id="conversational-ai-agents">Conversational AI Co-Pilot Agents</h3>
          <p>We no longer think of copilots as chat widgets bolted onto an application. The more interesting problem is giving operators a governed place to supervise long-running work, inspect evidence, escalate decisions, and keep the agent tied to the real state of the business.</p>
          <p>That can look like a support copilot, an operations assistant, or an internal console for reviewing agent work. The common pattern is a hosted shell in <code>Korporus</code>, a durable procedure in <code>Tactus</code>, and evaluation plus feedback loops in <code>Plexus</code>.</p>
          <p>This is how conversational interfaces become actual operator tools instead of demos.</p>

          <h3 id="ai-software-features">Tailored AI Features</h3>
          <p>Some of the highest-value AI work is nearly invisible to the end user. It is the classification, extraction, retrieval, summarization, or language-aware behavior that unlocks a product capability the underlying system could not reliably deliver on its own.</p>
          <p>We have used that pattern in production for things like language inference, information extraction, and decision support. The important point is not that AI appears on the screen. The important point is that the product becomes more capable while remaining testable and operable.</p>

          <h3 id="ai-enabled-projects">AI-Enabled Projects</h3>
          <p>Some of our best work uses AI in the development and workflow layer rather than at runtime. AI makes hard systems easier to specify, evaluate, and evolve, even when the production architecture itself is mostly deterministic.</p>
          <p>That is part of the Anthus point of view: use AI where it creates leverage, but keep the surrounding system durable, observable, and understandable.</p>

          <h2>The Process</h2>
          <p>
            The lifecycle below centers on <a href="https://plexus.anth.us">Plexus</a>, but in practice the broader
            Anthus Platform supplies the runtime, workflow, knowledge, and monitoring layers around it.
          </p>
          <figure>
            <Link to="https://plexus.anth.us">
              <img src="/assets/images/Anthus AI Application Lifecycle.png" alt="AI Application Lifecycle" />
            </Link>
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
      description="Explore Anthus AI solutions and the platform patterns behind them: durable procedures, MLOps, workflow state, corpus systems, monitoring, and programmable media."
      image="serverless-ai-software-solutions.png"
    />
  )
}

export const query = graphql`
  query {
    solutions: allMdx(
      filter: { frontmatter: { tags: { in: ["solutions"] } } }
      sort: { frontmatter: { date: DESC } }
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
    platformProducts: allMdx(
      filter: {
        frontmatter: { content_type: { eq: "platform-product" }, state: { eq: "published" } }
      }
      sort: { frontmatter: { platform_order: ASC } }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            slug
            excerpt
            platform_category
            platform_stage
            external_url
          }
        }
      }
    }
  }
`;

export default AISolutionsPage;
