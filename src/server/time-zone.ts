/** The cookie the browser writes with its IANA time zone. Stores nothing else. */
export const TIME_ZONE_COOKIE = "tz";

/** A valid IANA zone name, or UTC for anything missing or malformed. */
export function validTimeZone(value: string | undefined): string {
  if (!value) return "UTC";
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone: value }).resolvedOptions()
      .timeZone;
  } catch {
    return "UTC";
  }
}
