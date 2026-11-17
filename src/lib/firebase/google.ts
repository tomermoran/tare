import {
  getRedirectResult,
  GoogleAuthProvider,
  linkWithPopup,
  linkWithRedirect,
  signInWithCredential,
  type AuthCredential,
} from "firebase/auth";
import { ensureSignedIn, firebaseAuth } from "./client";

/*
 * Linking this browser's account to Google (EPIC-05-03, TD-11). A link keeps
 * the Firebase uid, so no data moves and the session stays as it is. Nothing
 * from the Google profile is read or kept. When the Google account already
 * has a Tare history, its credential comes back so the caller can offer the
 * switch (STORY-05-03-04); nothing is ever merged.
 */

export type LinkResult =
  | { kind: "linked" }
  /** The person closed Google's window: no message (STORY-05-03-01 AC 3). */
  | { kind: "cancelled" }
  /** Failed or offline: nothing changed (AC 4). */
  | { kind: "failed" }
  | { kind: "accountTaken"; credential: AuthCredential }
  /** The page is leaving for Google; the result comes on return. */
  | { kind: "redirecting" };

const CANCELLED = new Set(["auth/popup-closed-by-user", "auth/cancelled-popup-request", "auth/user-cancelled"]);

function provider() {
  // Only sign-in; no extra scopes, so Google shares nothing beyond the basics Firebase needs.
  return new GoogleAuthProvider();
}

function codeOf(error: unknown): string {
  return typeof error === "object" && error && "code" in error && typeof error.code === "string" ? error.code : "";
}

/** Maps a Firebase error to a result. */
export function resultOf(error: unknown): LinkResult {
  const code = codeOf(error);
  if (code === "auth/provider-already-linked") return { kind: "linked" };
  if (CANCELLED.has(code)) return { kind: "cancelled" };
  if (code === "auth/credential-already-in-use") {
    const credential = GoogleAuthProvider.credentialFromError(error as Parameters<typeof GoogleAuthProvider.credentialFromError>[0]);
    if (credential) return { kind: "accountTaken", credential };
  }
  return { kind: "failed" };
}

/**
 * iOS Safari is unreliable with pop-ups, so it redirects instead. Every
 * browser on iOS is Safari underneath, and an iPad can report itself as a Mac.
 */
export function prefersRedirect(nav: Pick<Navigator, "userAgent" | "maxTouchPoints"> = navigator): boolean {
  return /iPhone|iPad|iPod/.test(nav.userAgent) || (/Macintosh/.test(nav.userAgent) && nav.maxTouchPoints > 1);
}

/** Links this browser's account to a Google account (STORY-05-03-01). */
export async function linkGoogle(options: { redirect?: boolean } = {}): Promise<LinkResult> {
  try {
    const user = await ensureSignedIn();
    if (options.redirect ?? prefersRedirect()) {
      await linkWithRedirect(user, provider());
      return { kind: "redirecting" };
    }
    await linkWithPopup(user, provider());
    return { kind: "linked" };
  } catch (error) {
    return resultOf(error);
  }
}

/** On return from a redirect link: its result, or null when there was none. */
export async function completeLinkRedirect(): Promise<LinkResult | null> {
  try {
    const auth = firebaseAuth();
    await auth.authStateReady();
    return (await getRedirectResult(auth)) ? { kind: "linked" } : null;
  } catch (error) {
    return resultOf(error);
  }
}

/**
 * Switches this browser to the history the credential belongs to
 * (STORY-05-03-04 AC 1): signs in as that account, then swaps its token for
 * the session cookie, which finds the existing household. The empty
 * anonymous account is left as it was. Throws on failure, with nothing
 * changed on the server.
 */
export async function switchToHistory(credential: AuthCredential): Promise<void> {
  const { user } = await signInWithCredential(firebaseAuth(), credential);
  const res = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: await user.getIdToken() }),
  });
  if (!res.ok) throw new Error(`Session exchange failed: ${res.status}`);
}
