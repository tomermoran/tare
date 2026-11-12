import type { Db } from "@/db/client";

/**
 * What the mocked database and session modules read: the current test's
 * database and the Firebase uid it's signed in as (null = signed out).
 * Set it in beforeEach; see src/test/mocks/README.md.
 */
export const testContext: { db: Db | null; firebaseUid: string | null } = {
  db: null,
  firebaseUid: null,
};

export function signInAs(firebaseUid: string | null) {
  testContext.firebaseUid = firebaseUid;
}
