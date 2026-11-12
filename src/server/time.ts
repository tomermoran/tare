import "server-only";
import { cookies } from "next/headers";
import { TIME_ZONE_COOKIE, validTimeZone } from "./time-zone";

/**
 * The device's time zone for local-day calculations (src/domain/localDay.ts).
 * Reads a cookie, so callers render behind a Suspense boundary. Falls back to
 * UTC before the browser has written it or when it isn't a real zone.
 */
export async function getTimeZone(): Promise<string> {
  return validTimeZone((await cookies()).get(TIME_ZONE_COOKIE)?.value);
}
