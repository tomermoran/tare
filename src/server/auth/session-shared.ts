// Session pieces with no server dependencies, shared by session.ts and the
// test double in src/test/mocks/session.ts.

export type Session = { firebaseUid: string };

export const SESSION_COOKIE = "tare_session";
/** Firebase's longest session cookie. The client re-exchanges after it ends. */
export const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

/** Thrown when an action or read needs a signed-in account and has none. */
export class NoSessionError extends Error {
  constructor() {
    super("No session");
    // Matched by name in runAction, which client code can import.
    this.name = "NoSessionError";
  }
}
