import { BREW_CHOICE_COOKIE, decodeBrewChoice, encodeBrewChoice, liveBrewChoice, type BrewChoice } from "@/domain/brewChoice";

/*
 * Brew's choice cookie from the browser (STORY-02-02-06). A day's max-age is
 * only a backstop: the 30-minute rule is checked on every read.
 */

const MAX_AGE_S = 60 * 60 * 24;

function read(): BrewChoice | null {
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${BREW_CHOICE_COOKIE}=`))
    ?.slice(BREW_CHOICE_COOKIE.length + 1);
  return decodeBrewChoice(raw);
}

function write(choice: BrewChoice) {
  document.cookie = `${BREW_CHOICE_COOKIE}=${encodeBrewChoice(choice)}; path=/; max-age=${MAX_AGE_S}; samesite=lax`;
}

/** Choosing a drink or coffee: kept with what was chosen before. */
export function saveBrewChoice(choice: { drinkId?: string; beanId?: string }, now = Date.now()) {
  const kept = liveBrewChoice(read(), new Date(now));
  write({ drinkId: choice.drinkId ?? kept?.drinkId, beanId: choice.beanId ?? kept?.beanId, at: now });
}

/** Brew was just on screen: the 30 minutes count from now. False when it had already lapsed. */
export function touchBrewChoice(now = Date.now()): boolean {
  const choice = read();
  if (!choice) return true;
  if (!liveBrewChoice(choice, new Date(now))) {
    clearBrewChoice();
    return false;
  }
  write({ ...choice, at: now });
  return true;
}

/** A pull, or the lapse: back to the usual drink and coffee. */
export function clearBrewChoice() {
  document.cookie = `${BREW_CHOICE_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
