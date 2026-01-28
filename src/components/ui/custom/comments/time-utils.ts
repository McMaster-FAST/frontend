export function getTimeString(timestamp: Date): string {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  // Less than 1 day ago, show only the time
  if (Date.now() - timestamp.getTime() < ONE_DAY) {
    return timestamp.toLocaleTimeString(undefined, {hour: "numeric", minute: "numeric"});
  } 
  // Less than a week ago, show the weekday and time
  if (Date.now() - timestamp.getTime() < 7 * ONE_DAY) {
    return timestamp.toLocaleDateString(undefined, { weekday: "short", hour: "numeric", minute: "numeric" });
  } 
  // Anything more than a week but less than 11 months ago, show month and day
  if (Date.now() - timestamp.getTime() < (365 - 31) * ONE_DAY) {
    return timestamp.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  // More than 11 months ago, show full date
  return timestamp.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}