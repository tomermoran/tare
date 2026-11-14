/**
 * When a coffee was last had, relative to today (STORY-03-06-01 AC 2):
 * "today", "yesterday", "3 days ago", "3 weeks ago", "2 months ago". `days`
 * is whole calendar days in the device's zone; the words come from Intl.
 */
export function lastHadLabel(days: number, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (days < 7) return rtf.format(-days, "day");
  if (days < 30) return rtf.format(-Math.floor(days / 7), "week");
  if (days < 365) return rtf.format(-Math.floor(days / 30), "month");
  return rtf.format(-Math.floor(days / 365), "year");
}
