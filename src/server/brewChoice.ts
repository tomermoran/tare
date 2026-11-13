import "server-only";
import { cookies } from "next/headers";
import { BREW_CHOICE_COOKIE, decodeBrewChoice, liveBrewChoice, type BrewChoice } from "@/domain/brewChoice";

/** Brew's choice for the next pull, while it applies. Reading it makes the page dynamic. */
export async function readBrewChoice(now = new Date()): Promise<BrewChoice | null> {
  return liveBrewChoice(decodeBrewChoice((await cookies()).get(BREW_CHOICE_COOKIE)?.value), now);
}
