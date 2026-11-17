import "server-only";
import { unstable_rethrow } from "next/navigation";
import { readBrewChoice } from "./brewChoice";

/**
 * The person chosen on Brew on this device (STORY-05-01-03), while the
 * choice applies. Outside a request (a test, a script) there's no cookie,
 * so it's no choice: the main persona.
 */
export async function readPersonaChoice(now = new Date()): Promise<string | null> {
  try {
    return (await readBrewChoice(now))?.personaId ?? null;
  } catch (e) {
    unstable_rethrow(e);
    return null;
  }
}
