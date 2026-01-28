const CANADA_LOCALE = 'en-CA';
export function getTimeString(timestamp: Date): string {
  return timestamp.toLocaleDateString(CANADA_LOCALE, {year: "2-digit", month: "2-digit", day: "2-digit"});
}