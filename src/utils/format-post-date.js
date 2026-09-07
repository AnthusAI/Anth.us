/**
 * Format a post frontmatter date for display. SSR- and hydration-safe:
 * - Date-only strings (YYYY-MM-DD) are parsed as local calendar dates, not UTC
 *   midnight (which shifts the day in US timezones and mismatches SSR vs client).
 * - Uses a fixed English pattern instead of toLocaleDateString(undefined),
 *   which varies by browser locale and caused React hydration errors #418/#423/#425.
 * - No date-fns dependency (not in package.json).
 */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function formatPostDate(dateString) {
  if (!dateString) return ""

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString)
  const date = dateOnlyMatch
    ? new Date(+dateOnlyMatch[1], +dateOnlyMatch[2] - 1, +dateOnlyMatch[3])
    : new Date(dateString)

  if (Number.isNaN(date.getTime())) return String(dateString)

  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}
