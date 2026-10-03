import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import EngageCTA from "../components/engage-cta"
import * as styles from "../components/platform.module.css"

const frequentlyAskedQuestions = [
  {
    question: "Can you fine-tune Jev?",
    answer:
      "No. TypeSafe serves the same Jev weights to every account, so there is no fine-tuning endpoint. You get the same effect by changing the questions you ask it and fitting a small decision head over its answers, aligned from reviewer feedback. On 140 labels, one new plain-English question raised accuracy from 77 to 87 percent with the model unchanged.",
    link: "/blog/fine-tuning-jev/",
    linkText:
      "Fine-Tuning Jev: You Can't. Here's What Gets You the Same Effect",
  },
  {
    question: "How do I align Jev to my own data?",
    answer:
      "Start classifying immediately, review the decisions as it makes them, and label the ones a reviewer disagrees with. Those labels refit the decision head and calibrate its confidence, and when disagreements keep coming, they tell you which question to add. That loop is far cheaper than building a labelled dataset before you start.",
    link: "/blog/plexus-classifier-lab/",
    linkText: "Plexus Is a Classifier Lab",
  },
  {
    question: "Can you trust Jev's confidence?",
    answer:
      "Higher really does mean more likely right, but out of the box it ran about 15 points overconfident on 8,801 labelled examples. Calibration against a few hundred of your own labels closes most of that gap, and only then can you set a threshold to auto-accept above and route the rest to a person.",
    link: "/blog/can-you-trust-jev-confidence/",
    linkText: "Can You Trust Jev's Confidence?",
  },
  {
    question:
      "Does a decision model change its verdict on a name or a pronoun?",
    answer:
      "It can. On two thousand real professional bios per job with one pronoun swapped, Jev's verdict moved on 1 to 4 bios in 100 and the open-weights Laya's on 8 to 18, almost always toward the stereotype. Auditing by slice before and after deployment is how you catch it.",
    link: "/blog/one-word-test/",
    linkText: "The One-Word Test",
  },
  {
    question: "Can I own the classifier instead of paying per request forever?",
    answer:
      "Yes. Once the hosted model is aligned, you can distill it into a small model you serve yourself. A 66-million-parameter student trained from an aligned Jev system scored 91.2 percent against the human label, above its teacher's 89.0, at 5 to 15 milliseconds an item, with a per-slice ship gate deciding when it was ready.",
    link: "/blog/distilling-jev-into-a-classifier/",
    linkText: "Distilling an Aligned Jev System into a Classifier You Own",
  },
  {
    question: "Should I use Jev or an open-weights decision model like Laya?",
    answer:
      "The same reviewer loop aligns either one. On the same 140 labels and the same questions, Jev led Laya by 4.7 points alone and 6.8 with the feedback layer, and fully fine-tuning Laya on those labels beat both. Which engine you pick depends on whether you need to own the weights.",
    link: "/blog/jev-vs-laya/",
    linkText: "Jev vs Laya",
  },
]

const DecisionModelsPage = () => (
  <Layout>
    <article>
      <section className={styles.hero}>
        <h1>Aligning Jev and other decision models to your data</h1>
        <p className={styles.lead}>
          A decision model like Jev answers a bounded question with a verdict
          and a confidence, in a fraction of a second, for a fraction of a cent.
          It arrives frozen: you can't fine-tune it, and it doesn't know your
          reviewers' rules. Everything that makes it fit your business lives in
          the loop around it. Each step of that loop has a published measurement
          behind it, and we run the loop on client judgment tasks.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>
          The questions people arrive with
        </h2>
        <dl>
          {frequentlyAskedQuestions.map(item => (
            <React.Fragment key={item.question}>
              <dt>
                <h3>{item.question}</h3>
              </dt>
              <dd>
                <p>
                  {item.answer} <Link to={item.link}>{item.linkText}</Link>.
                </p>
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>The loop, in order</h2>
        <ol>
          <li>
            <strong>Start classifying now.</strong> Put the decision model in
            front of real cases with the questions your reviewers already ask.
          </li>
          <li>
            <strong>Review and label the disagreements.</strong> Reviewers agree
            or disagree with verdicts as they happen, and those calls are all
            the labelling the loop needs.
          </li>
          <li>
            <strong>Calibrate the confidence.</strong> Fit the stated confidence
            to observed accuracy so a threshold means what it says.
          </li>
          <li>
            <strong>Change the questions when refits stall.</strong> Let the
            system read the disagreements and propose one question; a person
            approves it.
          </li>
          <li>
            <strong>Gate every change by slice.</strong> Promote a version only
            when it clears held-out labels on every slice reviewers care about.
          </li>
          <li>
            <strong>Distill when you're ready to own it.</strong> Train a small
            model from the aligned system and ship it behind the same gate.
          </li>
        </ol>
        <p>
          Every step is a published experiment on the{" "}
          <Link to="/research/">research page</Link>, the public leaderboards
          are on the <Link to="/benchmarks/">benchmarks page</Link>, and{" "}
          <Link to="/platform/plexus/">Plexus</Link> is where we run the loop in
          production.
        </p>
      </section>

      <EngageCTA />
    </article>
  </Layout>
)

export const Head = () => (
  <Seo
    title="Aligning Jev and Other Decision Models to Your Data"
    description="You can't fine-tune Jev. Here is how to align a decision model to your own data instead: review its decisions, label the disagreements, calibrate its confidence, change the questions, gate by slice, and distill a classifier you own. Published measurements at every step."
    image="serverless-ai-software-solutions.png"
    structuredData={{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: frequentlyAskedQuestions.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    }}
  />
)

export default DecisionModelsPage
