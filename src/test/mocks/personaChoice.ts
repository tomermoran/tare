import { testContext } from "./context";

// Stands in for @/server/personaChoice: the person chosen on Brew lives in
// testContext. Reset it in beforeEach.

export async function readPersonaChoice(): Promise<string | null> {
  return testContext.personaChoice;
}
