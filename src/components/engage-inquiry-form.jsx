import React, { useRef, useState } from "react"
import * as styles from "./engage-inquiry-form.module.css"
import { contactUrl } from "./contact-url"

const prospectusIntakeUrl = process.env.GATSBY_PROSPECTUS_INTAKE_URL
const privacyNoticeVersion = "contact-v1"
const campaignParameterNames = ["utm_source", "utm_medium", "utm_campaign"]

const newSubmissionId = () => crypto.randomUUID()

const campaignFromPageAddress = () => {
  const parameters = new URLSearchParams(window.location.search)
  const campaign = {}
  for (const name of campaignParameterNames) {
    const value = parameters.get(name)
    if (value && /^[\w .-]{1,120}$/.test(value)) campaign[name] = value
  }
  return campaign
}

const EngageInquiryForm = () => {
  const [sending, setSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [receivedReceipt, setReceivedReceipt] = useState("")
  const pendingSubmission = useRef(null)

  if (!prospectusIntakeUrl) {
    return (
      <a href={contactUrl} className="button">
        Start an engagement
      </a>
    )
  }

  const sendInquiry = async event => {
    event.preventDefault()
    if (sending) return
    setSending(true)
    setErrorMessage("")
    const fields = new FormData(event.currentTarget)
    const inquiryFields = JSON.stringify({
      name: String(fields.get("name") ?? ""),
      email: String(fields.get("email") ?? ""),
      company: String(fields.get("company") ?? ""),
      message: String(fields.get("message") ?? ""),
      website: String(fields.get("website") ?? ""),
      notice_version: privacyNoticeVersion,
      marketing_opt_in: false,
      page_path: "/engage",
      campaign: campaignFromPageAddress(),
    })
    if (
      !pendingSubmission.current ||
      pendingSubmission.current.inquiryFields !== inquiryFields
    ) {
      pendingSubmission.current = {
        submissionId: newSubmissionId(),
        inquiryFields,
      }
    }
    try {
      const response = await fetch(prospectusIntakeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          ...JSON.parse(inquiryFields),
          submission_id: pendingSubmission.current.submissionId,
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          result.message ??
            "We couldn't confirm your note. Send it again without changing anything."
        )
      }
      setReceivedReceipt(
        result.receipt ?? pendingSubmission.current.submissionId
      )
      pendingSubmission.current = null
    } catch (failure) {
      setErrorMessage(
        failure instanceof TypeError
          ? "We couldn't reach our inbox. Check your connection and send it again."
          : failure.message
      )
    } finally {
      setSending(false)
    }
  }

  if (receivedReceipt) {
    return (
      <div role="status" aria-live="polite" className={styles.receipt}>
        <h3>Thanks, we have your note.</h3>
        <p>
          We'll reply by email to scope the first month with you. Nothing is
          booked yet, and we won't add you to a mailing list.
        </p>
        <p className={styles.receiptNumber}>Receipt {receivedReceipt}</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={sendInquiry}>
      {errorMessage && (
        <p role="alert" className={styles.error}>
          {errorMessage}
        </p>
      )}
      <label>
        Name
        <input name="name" required maxLength={150} autoComplete="name" />
      </label>
      <label>
        Email
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
        />
      </label>
      <label>
        Company <span className={styles.optional}>optional</span>
        <input name="company" maxLength={150} autoComplete="organization" />
      </label>
      <label>
        What's the problem?
        <textarea name="message" required maxLength={3000} rows={5} />
      </label>
      <div className={styles.honeypot} aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className={styles.privacyNotice}>
        We use these details only to reply to you about this inquiry and to keep
        a record of our conversation. We don't sell them or add you to a mailing
        list, and we keep them until you ask us to delete them.
      </p>
      <button type="submit" className={styles.sendButton} disabled={sending}>
        {sending ? "Sending…" : "Start an engagement"}
      </button>
    </form>
  )
}

export default EngageInquiryForm
