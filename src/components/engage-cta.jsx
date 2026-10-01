import React from "react"
import { Link } from "gatsby"
import * as styles from "./engage-cta.module.css"

const EngageCTA = () => {
  return (
    <div className={styles.box}>
      <h2 className={styles.heading}>We do this for clients, at scale</h2>
      <p className={styles.text}>
        Anthus has run this kind of loop in production for years: reviewers
        correct the model and say why, the explanation becomes policy, and the
        system gets more trustworthy month over month across hundreds of
        scorecards and millions of interactions. Bring us the judgment task and
        we'll run it on Plexus with your reviewers in the loop, and hand you a
        scorecard you can inspect after the first month.
      </p>
      <Link to="/engage" className="button">
        See how an engagement works
      </Link>
    </div>
  )
}

export default EngageCTA
