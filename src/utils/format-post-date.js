import { format, isValid, parseISO } from "date-fns"

/**
 * Format a post frontmatter date for display. SSR- and hydration-safe:
 * - Date-only strings (YYYY-MM-DD) are parsed as local calendar dates, not UTC
 *   midnight (which shifts the day in US timezones and mismatches SSR vs client).
 * - Uses date-fns with a fixed pattern instead of toLocaleDateString(undefined),
 *   which varies by browser locale and caused React hydration errors #418/#423/#425.
 */
export function formatPostDate(dateString) {
  if (!dateString) return ""

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString)
  const date = dateOnlyMatch
    ? new Date(+dateOnlyMatch[1], +dateOnlyMatch[2] - 1, +dateOnlyMatch[3])
    : parseISO(dateString)

  return isValid(date) ? format(date, "MMMM d, yyyy") : String(dateString)
}
