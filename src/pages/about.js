import React, { useEffect } from 'react';
import Layout from "../components/layout"
import Seo from "../components/seo"

const AboutPage = () => {
  useEffect(() => {
    document.title = "About";
  }, []);

  return (
    <Layout>
      <article>
        <div>
          <h1>About us</h1>
          <p>
            <img src="/assets/images/ryan-porter.png" alt="About Anthus" className="responsive-float-right-image" />
            In 2009, <a href="/ryan">Ryan Porter</a> developed an event ticket sales system for
            a <a href="https://en.wikipedia.org/wiki/Kaleidoscope_World_Tour">Tiësto world tour</a>, 
            sparking a business that generated up to $64 million annually
            for <mark>over fourteen years.</mark> We came together as a team as the business expanded, 
            going from a tiny startup to a department within
            a large multinational corporation, <a href="https://taogroup.com">Tao Group Hospitality</a>.
            We have worked cohesively for 
            more than a decade, safeguarding an impeccable record in <mark>reliability and security</mark>.
          </p>
          <p>
            Throughout that journey, we integrated third-party platforms including Salesforce, Marketo, Salesforce
            Marketing Cloud, Mailchimp, and Paytronix while navigating multiple technological shifts without giving up
            operational rigor. Cloud infrastructure, serverless architectures, auditability, and disciplined service
            management were not side concerns for us. They were already part of how we built and operated systems under
            real business pressure.
          </p>
          <p>
            Our endurance over more than fourteen years is a testament to our commitment and capability in preventing business interruptions arising from downtime, software malfunctions, security incidents, or data losses.  <mark>The hackers never got us</mark>, despite being a <a href="https://twitter.com/RyanAlynPorter/status/890982980721790976">prime target</a>.  When a catastrophic failure struck an entire AWS data center, we relocated the entire system to a new data center within hours, ensuring that ticket scanning at nightclubs proceeded without a hitch.  We have navigated through massive DDoS attacks, primary database server failures, silent failures in third-party systems, and everything else you could imagine.  We always <mark>kept the revenue flowing</mark>.  Then we smoothly handed it off to the next team with no business interruption or impairment.
          </p>
          <h2>What That Experience Produces Now</h2>
          <p>
            Over the last two years, we have applied that same operating discipline to AI/ML delivery. We have built
            production RLHF systems for call-center QA, durable agent procedures and operator-facing application shells,
            corpus-driven retrieval and extraction workflows, and code-first media pipelines for demos and explainers.
          </p>
          <p>
            That work is increasingly embodied in the <a href="/platform">Anthus Platform</a>: <a href="https://plexus.anth.us">Plexus</a> for
            evaluation and MLOps, <a href="/platform/tactus">Tactus</a> for durable procedures, <a href="/platform/biblicus">Biblicus</a> for
            corpus and retrieval workflows, <a href="/platform/korporus">Korporus</a> for hosted application shells, and
            <a href="/platform/babulus"> Babulus</a> plus <a href="/platform/videoml">VideoML</a> for programmable content and video.
          </p>
          <p>
            The same habits that matter in enterprise software engineering now show up in Anthus as governed AI systems:
            compliance-friendly workflows, observable services, clear approval paths, and strong rollback and evaluation
            discipline.
          </p>
          <h2>How We Build Today</h2>
          <p>
            The AI era doesn’t remove the need for operational excellence—it raises the stakes. We use a cybernetic
            approach: clear intent, layered safeguards, and production feedback loops that continuously harden the
            system. Read more in <a href="/blog/cybernetic-development">Cybernetic Development</a>.
          </p>
          <p>
            Now, we bring those concrete systems and that same operational maturity to client work. <mark>What can we
            develop and operate for you?</mark>
          </p>
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
      title="About Us"
      description="Anthus combines long-running operational experience with concrete AI delivery work: RLHF systems, durable agent workflows, retrieval pipelines, hosted operator apps, and programmable media."
      image="serverless-ai-software-solutions.png"
    />
  )
}

export default AboutPage;
