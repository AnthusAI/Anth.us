import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./engage.module.css"
import { contactUrl } from "../components/contact-url"

const EngagePage = () => {
  return (
    <Layout>
      <article>
        <section className={styles.hero}>
          <h1>How an engagement works</h1>
          <p className={styles.lead}>
            An engagement means Anthus runs the system for you. Your experts
            stay in the loop, reviewing the cases that matter and shaping what
            the system learns. When the engagement ends, you own what comes out
            of it — the model, the pipeline, the board, the record.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Three ways to start</h2>
          <div className={styles.offerGrid}>
            <div className={styles.offerCard}>
              <h3>Classifier lab on Plexus</h3>
              <p>
                We take a high-volume judgment call your team already makes — a
                score, a flag, a routing decision — and turn it into a
                classifier with confidence gating: the model handles the clear
                cases and routes the rest to your reviewers. We've run this
                pattern for a call-center QA operation across years of
                production, hundreds of models, and millions of interactions,
                with expert feedback compounding into a data flywheel the whole
                time. You get that architecture, sized to your judgment task.
              </p>
            </div>
            <div className={styles.offerCard}>
              <h3>Factory-run software project</h3>
              <p>
                We build your software the way we build our own: work tracked as
                Kanbus issues in the repository, agents doing the
                implementation, and a human approval trail on every merge.
                Anthus runs its own projects this way, including this site — the
                commits are public, so you can see the process instead of taking
                it on faith.
              </p>
            </div>
            <div className={styles.offerCard}>
              <h3>Newsroom for a publication</h3>
              <p>
                We stand up Papyrus as your editorial pipeline: stories move
                through Kanbus-governed stages from pitch to draft to published,
                with a human editor approving each move. Anth.us itself is
                produced this way — every article you read here came through
                that pipeline, running the same way for you.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>What a first month produces</h2>
          <ul className={styles.firstMonthList}>
            <li>
              <strong>A pilot with fixed scope.</strong> One judgment task, one
              project, or one publication track, scoped before we start.
            </li>
            <li>
              <strong>A scorecard or a board you can inspect.</strong> The same
              record we use internally: accuracy by slice, issues moving through
              Kanbus, or stories moving through the editorial pipeline.
            </li>
            <li>
              <strong>A decision point.</strong> At the end of the month you
              have real evidence to decide whether to extend, expand, or stop.
            </li>
          </ul>
        </section>

        <section className={styles.ctaSection}>
          <p>
            Tell us the judgment task, the project, or the publication you want
            running, and we'll scope the first month.
          </p>
          <a href={contactUrl} className="button">
            Start an engagement
          </a>
        </section>
      </article>
    </Layout>
  )
}

export const Head = () => {
  return (
    <Seo
      title="Engage Anthus"
      description="What an Anthus engagement looks like: a classifier lab on Plexus, a factory-run software project, or a Kanbus-governed newsroom on Papyrus — each with a fixed first month and a record you can inspect."
    />
  )
}

export default EngagePage
