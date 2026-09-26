import React from "react"
import { Link } from "gatsby"
import * as styles from "./engage-cta.module.css"

// Boxed call-to-action for the end of client-acquisition articles.
// Wired into blog-post.jsx, gated on the `client-acquisition` tag.
const EngageCTA = () => {
  return (
    <div className={styles.box}>
      <p className={styles.text}>
        We run this method as an engagement — your data, your reviewers, a fixed
        first month.
      </p>
      <Link to="/engage" className="button">
        See how an engagement works
      </Link>
    </div>
  )
}

export default EngageCTA
