import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import EngageCTA from "../components/engage-cta"
import * as styles from "../components/platform.module.css"

const publishedBenchmarks = [
  {
    name: "Biased-Decisions",
    address: "/biased-decisions/",
    question:
      "Does an AI model's answer change when one personal detail about a person changes?",
    summary:
      "Would AI identify a different job for the same person if “he” became “she”? Would it remove the same online comment after its author said they were gay? Biased-Decisions changes one personal detail in a text, asks the same question again, and ranks models by how often the answer moves.",
    repository: "https://github.com/AnthusAI/Biased-Decisions",
  },
  {
    name: "Hard-Decisions",
    address: "https://hard-decisions.anth.us/",
    question:
      "How far can a decision model follow a chain of reasoning before it starts guessing?",
    summary:
      "On true-or-false questions, every model tested except Jev falls to coin-flip accuracy by five chained inferences: the open decision models Kev, GLiNER2.5-Decide and Laya, GPT-6 Luna used as a one-shot classifier, and GLiDE. Jev still answers 89.3% correctly at that depth.",
  },
]

const BenchmarksPage = () => (
  <Layout>
    <article>
      <section className={styles.hero}>
        <h1>Benchmarks</h1>
        <p className={styles.lead}>
          We publish two public benchmarks for decision models, the fast AI
          models that answer a bounded question with a verdict. Each one shows
          its method, every model's results, and the cases behind them, so you
          can check a model against the decision you're about to hand it.
        </p>
      </section>

      <section className={styles.section}>
        <ul className={styles.grid}>
          {publishedBenchmarks.map(benchmark => (
            <li key={benchmark.name} className={styles.card}>
              <a href={benchmark.address} className={styles.cardTitleLink}>
                <h3>{benchmark.name}</h3>
              </a>
              <p>
                <strong>{benchmark.question}</strong>
              </p>
              <p>{benchmark.summary}</p>
              <div className={styles.cardActions}>
                <a href={benchmark.address}>See the results</a>
                {benchmark.repository && (
                  <a
                    href={benchmark.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Code:{" "}
                    {benchmark.repository.replace("https://github.com/", "")}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p>
          The articles that explain these findings are on the{" "}
          <Link to="/research/">research page</Link>, and the guide to aligning
          a decision model to your own data is{" "}
          <Link to="/decision-models/">here</Link>.
        </p>
      </section>

      <EngageCTA />
    </article>
  </Layout>
)

export const Head = () => (
  <Seo
    title="Decision Model Benchmarks: Biased-Decisions and Hard-Decisions"
    description="Two public benchmarks for decision models: Biased-Decisions measures how often an answer changes when one personal detail changes, and Hard-Decisions measures how accuracy falls as reasoning gets deeper."
    image="serverless-ai-software-solutions.png"
  />
)

export default BenchmarksPage
