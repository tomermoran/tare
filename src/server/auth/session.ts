import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { cache } from "react";
import { adminAuth } from "./firebase-admin";

export const SESSION_COOKIE = "tare_session";
/** Firebase's longest session cookie. The client re-exchanges after it ends. */
export const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

export type Session = { firebaseUid: string };

/**
 * The signed-in Firebase account for this request, or null. Cached per
 * request, so many callers verify the cookie once. Reads cookies, so callers
 * render behind a Suspense boundary.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  // Checking the cookie's expiry reads the clock, which belongs to the request.
  await connection();
  try {
    const decoded = await adminAuth().verifySessionCookie(cookie);
    return { firebaseUid: decoded.uid };
  } catch {
    return null;
  }
});

export class NoSessionError extends Error {
  constructor() {
    super("No session");
  }
}

/** For Server Actions and data reads that need an account. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new NoSessionError();
  return session;
}
