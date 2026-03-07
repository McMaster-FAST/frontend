/**
 * Formats a date or string timestamp according to the user's browser locale.
 * Example Output (US): Mar 03, 2026
 * Example Output (UK): 03 Mar 2026
 */
export function getTimeString(timestamp: Date | string): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;

  // Check if the date is actually valid before calling methods on it
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  // Passing 'undefined' uses the browser's default locale
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
