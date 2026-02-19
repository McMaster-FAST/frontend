const CANADA_LOCALE = 'en-CA';
export function getTimeString(timestamp: Date): string {
  return timestamp.toLocaleDateString(CANADA_LOCALE, {year: "numeric", month: "short", day: "2-digit"});
}