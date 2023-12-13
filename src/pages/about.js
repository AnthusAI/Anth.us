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
            In 2009, <a href="/ryan">Ryan Porter</a> developed an innovative event ticket sales system for
            a <a href="https://en.wikipedia.org/wiki/Kaleidoscope_World_Tour">Tiësto world tour</a>, 
            sparking a business that generated up to $64 million annually
            for <mark>over fourteen years.</mark> We came together as a team as the business expanded, 
            going from a tiny startup to a department within
            a large multinational corporation, <a href="https://taogroup.com">Tao Group Hospitality</a>.
            We have worked cohesively for 
            more than a decade, safeguarding an impeccable record in <mark>reliability and security</mark>.
          </p>
          <p>
            Throughout our journey, we not only integrated various third-party platforms—including Salesforce, Marketo, Salesforce Marketing Cloud, Mailchimp, and Paytronix into our system but also successfully navigated through multiple technological revolutions. From embracing <mark>cloud computing</mark> to harnessing <mark>serverless architectures</mark> and deploying <mark>artificial intelligence</mark> applications, we continuously adapted and innovated while maintaining operational excellence and security. Even amidst rigorous audits from top-tier firms and scrutiny from our parent company, Madison Square Garden Entertainment, our innovative approaches to service management maturity and risk management consistently earned approval.
          </p>
          <p>
            Our endurance over more than fourteen years is a testament to our commitment and capability in preventing business interruptions arising from downtime, software malfunctions, security incidents, or data losses.  <mark>The hackers never got us</mark>, despite being a <a href="https://twitter.com/RyanAlynPorter/status/890982980721790976">prime target</a>.  When a catastrophic failure struck an entire AWS data center, we relocated the entire system to a new data center within hours, ensuring that ticket scanning at nightclubs proceeded without a hitch.  We have navigated through massive DDoS attacks, primary database server failures, silent failures in third-party systems, and everything else you could imagine.  We always <mark>kept the revenue flowing</mark>.  Then we smoothly handed it off to the next team with no business interruption or impairment.
          </p>
          <p>
            Now, we bring our depth of experience and technical agility to your projects. <mark>What can we develop and operate for you?</mark>
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
      description="With a history of powering a multi-million dollar ticketing system and seamless integrations across platforms like Salesforce and Mailchimp, we bring unparalleled expertise in serverless architectures and AI to your projects."
      image="serverless-ai-software-solutions.png"
    />
  )
}

export default AboutPage;