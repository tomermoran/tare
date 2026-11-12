"use client";

import { useEffect } from "react";
import { TIME_ZONE_COOKIE } from "@/server/time-zone";

/**
 * Tells the server the device's time zone, so "today" is the user's local
 * day. Writes the zone name to a cookie when it's missing or has changed
 * (travel). Renders nothing.
 */
export function TimeZoneCookie() {
  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const current = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${TIME_ZONE_COOKIE}=`))
      ?.split("=")[1];
    if (zone && decodeURIComponent(current ?? "") !== zone) {
      document.cookie = `${TIME_ZONE_COOKIE}=${encodeURIComponent(zone)}; path=/; max-age=31536000; samesite=lax`;
    }
  }, []);
  return null;
}
