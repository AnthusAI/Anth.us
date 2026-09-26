import React, { useEffect } from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const KEY_FACTS = [
  ["Company name", "Anthus AI Solutions"],
  ["Type", "AI engineering and operations company"],
  ["Founder", "Ryan Porter"],
  ["Website", "https://anth.us"],
  [
    "Core offering",
    "Self-aligning AI systems: custom models, agent harnesses, and evaluation loops with a human in the loop",
  ],
  [
    "Services",
    "LLM fine-tuning, agentic AI, MLOps and LLMOps, serverless architecture, AI-assisted operations",
  ],
  [
    "Track record",
    "Team together for over a decade; production platforms operated for 14+ years; Call Criteria in production with RLHF for two years",
  ],
  ["Platform", "Plexus, an MLOps platform"],
  ["Spinoff", "Anthus Microelectronics (B0rd LED-matrix desk display)"],
  ["Contact", "https://anth.us/ryan"],
]

const FAQ = [
  {
    q: "What does Anthus build?",
    a: "Production AI systems that improve from feedback: fine-tuned classifiers, agent systems, and the evaluation and MLOps infrastructure around them. We also operate what we build.",
  },
  {
    q: "How is Anthus different from a typical AI consultancy?",
    a: "We are operators first. The team has run a revenue-critical platform since 2007, through data center failures and DDoS attacks, before applying the same discipline to AI. We ship systems with human-in-the-loop feedback, not demos.",
  },
  {
    q: "What is human-in-the-loop AI?",
    a: "Experts review and correct the AI's judgments, and those corrections become training signal. In Call Criteria, QA specialists guide the models this way, and the system has improved through reinforcement learning from human feedback (RLHF) for two years.",
  },
  {
    q: "Do you only work with one model provider?",
    a: "No. We treat models as replaceable components and design systems so a model can be swapped without rebuilding the business logic.",
  },
]

const AboutPage = () => {
  useEffect(() => {
    document.title = "About"
  }, [])

  return (
    <Layout>
      <article>
        <div>
          <h1>About us</h1>
          <p>
            <strong>
              Anthus is an AI engineering company that builds and operates
              self-aligning AI systems — custom models, agent harnesses, and
              evaluation loops with a human in the loop — for teams that need
              them to keep working in production.
            </strong>
          </p>
          <p>
            <img
              src="/assets/images/ryan-porter.png"
              alt="About Anthus"
              className="responsive-float-right-image"
            />
            In 2009, <a href="/ryan">Ryan Porter</a> developed an innovative
            event ticket sales system for a{" "}
            <a href="https://en.wikipedia.org/wiki/Kaleidoscope_World_Tour">
              Tiësto world tour
            </a>
            , sparking a business that generated up to $64 million annually{" "}
            <mark>since 2007.</mark> We came together as a team as the business
            expanded, going from a tiny startup to a department within a large
            multinational corporation,{" "}
            <a href="https://taogroup.com">Tao Group Hospitality</a>. We have
            worked cohesively for more than a decade, safeguarding an impeccable
            record in <mark>reliability and security</mark>.
          </p>
          <p>
            Throughout our journey, we not only integrated various third-party
            platforms—including Salesforce, Marketo, Salesforce Marketing Cloud,
            Mailchimp, and Paytronix into our system but also successfully
            navigated through multiple technological revolutions. From embracing{" "}
            <mark>cloud computing</mark> to harnessing{" "}
            <mark>serverless architectures</mark> and deploying{" "}
            <mark>artificial intelligence</mark> applications, we continuously
            adapted and innovated while maintaining operational excellence and
            security. Even amidst rigorous audits from top-tier firms and
            scrutiny from our parent company, Madison Square Garden
            Entertainment, our innovative approaches to service management
            maturity and risk management consistently earned approval.
          </p>
          <p>
            Our endurance since 2007 is a testament to our commitment and
            capability in preventing business interruptions arising from
            downtime, software malfunctions, security incidents, or data losses.{" "}
            <mark>The hackers never got us</mark>, despite being a{" "}
            <a href="https://twitter.com/RyanAlynPorter/status/890982980721790976">
              prime target
            </a>
            . When a catastrophic failure struck an entire AWS data center, we
            relocated the entire system to a new data center within hours,
            ensuring that ticket scanning at nightclubs proceeded without a
            hitch. We have navigated through massive DDoS attacks, primary
            database server failures, silent failures in third-party systems,
            and everything else you could imagine. We always{" "}
            <mark>kept the revenue flowing</mark>. Then we smoothly handed it
            off to the next team with no business interruption or impairment.
          </p>
          <h2>Our Mission</h2>
          <p
            style={{ textAlign: "center", marginBottom: "20px" }}
            dangerouslySetInnerHTML={{
              __html:
                "Deliver <mark>reliable, secure, and efficient</mark> business solutions using collaboration between human and <mark>artificial intelligence</mark> in every aspect of <mark>development and operations</mark>. We build systems that keep working when nobody is watching.",
            }}
          ></p>

          {/* a-world-with-no-moats.mdx links to /about/#our-values. */}
          <h2 style={{ marginBottom: "1em" }} id="our-values">
            Our Values
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              {
                text: "Prioritize Solutions Over Tools",
                description:
                  "Investing in products and services only delivers business value if you're in the business of products and services.  <mark>We're in the business of solutions</mark>.",
              },
              {
                text: "Focus on Business Logic",
                description:
                  'The only code you should be writing is the business logic that solves real problems.  <a href="/blog/langchain-by-example/">Don\'t waste time reinventing wheels.</a>',
              },
              {
                text: "Continuously Improve",
                description:
                  "Enable rapid, iterative change through CI/CD and DevOps—then let the systems improve themselves. <mark>Self-optimizing classifiers and self-steering agent systems</mark> get better from production feedback without waiting for an engineer to notice.",
              },
              {
                text: "Implement Infrastructure as Code",
                description:
                  "Leverage DevOps to implement Infrastructure as Code, and <mark>MLOps and LLMOps</mark> to do the same for the models. Every part of a production system—including training runs and evaluations—should be created by code so it's reproducible, not clicked together by hand.",
              },
              {
                text: "Commodify AI Models",
                description:
                  'Treat AI models as replaceable, not magic black boxes.  In a world with no moats, <a href="/blog/a-world-with-no-moats/">don\'t invest too much in any given castle.</a>',
              },
              {
                text: "Optimize Resource Usage",
                description:
                  "Balance efficiency with cost-effectiveness.  When intelligence is cheap, the goal shifts from conserving compute to conserving context and cognitive load.",
              },
            ].map((value, index) => (
              <li key={index} style={{ marginBottom: "1em" }}>
                <p style={{ fontWeight: "bold", marginBottom: "0.25em" }}>
                  {value.text}
                </p>
                <p dangerouslySetInnerHTML={{ __html: value.description }}></p>
              </li>
            ))}
          </ul>

          <h2>How We Build Today</h2>
          <p>
            The AI era doesn’t remove the need for operational excellence—it
            raises the stakes. We use a cybernetic approach: clear intent,
            layered safeguards, and production feedback loops that continuously
            harden the system. Read more in{" "}
            <a href="/blog/cybernetic-development">Cybernetic Development</a>.
          </p>

          <h2>Spinoffs</h2>
          <p>
            Running AI agents all day created a problem of its own: the
            bottleneck moved from writing the code to monitoring and steering
            the agents running it. Sitting in front of a terminal all day is not
            the answer. That workflow problem became a hardware venture. We spun
            up <strong>Anthus Microelectronics</strong> to build the desk
            displays that grew out of it — handbuilt microelectronics running a
            custom handbuilt (AI-assisted) OS, real and handmade even where AI
            accelerated the build.
          </p>
          <p>
            The first product is <strong>B0rd</strong>: a standalone LED-matrix
            desk display for glanceable information — launch countdowns, agent
            status, notifications, an idle clock — that you can read from across
            the room instead of a screen you have to sit in front of. Matching
            units even stay in sync without pairing or a hub. See the{" "}
            <Link to="/blog/b0rd">B0rd solution page</Link>, visit{" "}
            <a href="https://b0rd.info">b0rd.info</a> for the product site, or
            browse the{" "}
            <a href="https://www.etsy.com/shop/AnthusMicronics">Etsy shop</a>.
          </p>

          <h2>Who We Work With</h2>
          <ul>
            <li>
              Product and engineering teams putting LLM agents or classifiers
              into production, not just prototypes
            </li>
            <li>
              Operations and QA organizations that need AI to make judgments at
              scale while experts stay in control (the{" "}
              <Link to="/blog/call-criteria/">Call Criteria</Link> pattern)
            </li>
            <li>
              Businesses with revenue-critical systems where downtime, security
              incidents, and silent failures are unacceptable
            </li>
          </ul>

          <h2>Key Facts</h2>
          <dl className="key-facts">
            {KEY_FACTS.map(([term, definition]) => (
              <React.Fragment key={term}>
                <dt>{term}</dt>
                <dd>{definition}</dd>
              </React.Fragment>
            ))}
          </dl>

          <h2>Frequently Asked Questions</h2>
          {FAQ.map(({ q, a }) => (
            <React.Fragment key={q}>
              <h3>{q}</h3>
              <p>{a}</p>
            </React.Fragment>
          ))}

          <p>
            Now, we bring our depth of experience and technical agility to your
            projects. <mark>What can we develop and operate for you?</mark>
          </p>
        </div>
      </article>
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => {
  return (
    <Seo
      title="About Us"
      description="Anthus builds and operates self-aligning AI systems, grounded in production operations since 2007 — the reliability and security behind a multi-million-dollar platform, now applied to AI."
      image="serverless-ai-software-solutions.png"
    >
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Anthus AI Solutions",
          url: "https://anth.us",
          description:
            "Anthus builds and operates self-aligning AI systems with a human in the loop, grounded in production operations since 2007.",
          founder: {
            "@type": "Person",
            name: "Ryan Porter",
            url: "https://anth.us/ryan",
          },
          knowsAbout: [
            "Agentic AI",
            "Reinforcement learning from human feedback",
            "LLM fine-tuning",
            "MLOps",
            "Serverless architecture",
          ],
        })}
      </script>
    </Seo>
  )
}

export default AboutPage
