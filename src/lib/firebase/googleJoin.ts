import {
  getRedirectResult,
  GoogleAuthProvider,
  linkWithPopup,
  linkWithRedirect,
  signInWithCredential,
  signInWithPopup,
  signInWithRedirect,
  type User,
} from "firebase/auth";
import { firebaseAuth } from "./client";
import { prefersRedirect, resultOf } from "./google";

/*
 * Signing in with Google to join a household (STORY-05-02-02, TD-11). This
 * module loads only once the person chooses to continue, so opening an
 * invitation creates nothing. A browser already using Tare anonymously
 * links Google to that account; when the Google account already has its
 * own, this signs in as it instead. Either way the server decides next
 * whether the account can join. Nothing from the Google profile is read.
 */

export type JoinSignIn = { kind: "signedIn" } | { kind: "cancelled" } | { kind: "failed" } | { kind: "redirecting" };

function provider() {
  const p = new GoogleAuthProvider();
  // Let the person pick an account, e.g. a different one after "you already use Tare".
  p.setCustomParameters({ prompt: "select_account" });
  return p;
}

/** Swaps the signed-in user's token for the session cookie. */
async function exchange(user: User): Promise<void> {
  const res = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: await user.getIdToken() }),
  });
  if (!res.ok) throw new Error(`Session exchange failed: ${res.status}`);
}

/** After a link refused because the Google account has its own history: sign in as it. */
async function fromError(error: unknown): Promise<JoinSignIn | User> {
  const r = resultOf(error);
  if (r.kind === "accountTaken") return (await signInWithCredential(firebaseAuth(), r.credential)).user;
  return r.kind === "cancelled" ? r : { kind: "failed" };
}

const isUser = (x: JoinSignIn | User): x is User => !("kind" in x);

export async function signInForJoining(options: { redirect?: boolean } = {}): Promise<JoinSignIn> {
  try {
    const auth = firebaseAuth();
    await auth.authStateReady();
    const redirect = options.redirect ?? prefersRedirect();
    const current = auth.currentUser;
    let user: User;
    if (current?.isAnonymous) {
      if (redirect) {
        await linkWithRedirect(current, provider());
        return { kind: "redirecting" };
      }
      try {
        user = (await linkWithPopup(current, provider())).user;
      } catch (error) {
        const next = await fromError(error);
        if (!isUser(next)) return next;
        user = next;
      }
    } else {
      if (redirect) {
        await signInWithRedirect(auth, provider());
        return { kind: "redirecting" };
      }
      user = (await signInWithPopup(auth, provider())).user;
    }
    await exchange(user);
    return { kind: "signedIn" };
  } catch (error) {
    return resultOf(error).kind === "cancelled" ? { kind: "cancelled" } : { kind: "failed" };
  }
}

/** On return from Google's redirect: the sign-in's result, or null when there was none. */
export async function completeJoinRedirect(): Promise<JoinSignIn | null> {
  try {
    const auth = firebaseAuth();
    await auth.authStateReady();
    let user: User | null;
    try {
      user = (await getRedirectResult(auth))?.user ?? null;
    } catch (error) {
      const next = await fromError(error);
      if (!isUser(next)) return next;
      user = next;
    }
    if (!user) return null;
    await exchange(user);
    return { kind: "signedIn" };
  } catch {
    return { kind: "failed" };
  }
}
