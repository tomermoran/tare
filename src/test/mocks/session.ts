import {
  NoSessionError,
  SESSION_COOKIE,
  SESSION_MAX_AGE_MS,
  type Session,
} from "@/server/auth/session-shared";
import { testContext } from "./context";

// Stands in for @/server/auth/session: the session is whoever the test signed
// in as with signInAs(), with no cookie or Firebase involved.
export { NoSessionError, SESSION_COOKIE, SESSION_MAX_AGE_MS };

export async function getSession(): Promise<Session | null> {
  return testContext.firebaseUid ? { firebaseUid: testContext.firebaseUid } : null;
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new NoSessionError();
  return session;
}
