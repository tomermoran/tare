import type { Db } from "@/db/client";
import type { SetupChoice } from "@/domain/currentSetup";

/**
 * What the mocked database and session modules read: the current test's
 * database and the Firebase uid it's signed in as (null = signed out).
 * Set it in beforeEach; see src/test/mocks/README.md.
 */
export const testContext: {
  db: Db | null;
  firebaseUid: string | null;
  /** The device's current-setup cookie (src/server/setupChoice.ts). */
  setupChoice: SetupChoice | null;
  /** The person chosen on Brew (src/server/personaChoice.ts). */
  personaChoice: string | null;
} = {
  db: null,
  firebaseUid: null,
  setupChoice: null,
  personaChoice: null,
};

export function signInAs(firebaseUid: string | null) {
  testContext.firebaseUid = firebaseUid;
}
