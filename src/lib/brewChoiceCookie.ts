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

/** Choosing a drink, coffee or person: kept with what was chosen before. */
export function saveBrewChoice(choice: { drinkId?: string; beanId?: string; personaId?: string }, now = Date.now()) {
  const kept = liveBrewChoice(read(), new Date(now));
  write({
    drinkId: choice.drinkId ?? kept?.drinkId,
    beanId: choice.beanId ?? kept?.beanId,
    personaId: choice.personaId ?? kept?.personaId,
    at: now,
  });
}

/**
 * Choosing who it's for: Brew shows that person's usual drink and coffee, so
 * a drink or coffee picked for someone else is dropped (STORY-05-01-03 AC 3).
 */
export function choosePersona(personaId: string, now = Date.now()) {
  write({ personaId, at: now });
}

/** Brew was just on screen: the 30 minutes count from now. False when it had already lapsed. */
export function touchBrewChoice(now = Date.now()): boolean {
  const choice = read();
  if (!choice) return true;
  if (!liveBrewChoice(choice, new Date(now))) {
    forget();
    return false;
  }
  write({ ...choice, at: now });
  return true;
}

/** A pull: back to the usual drink and coffee, still for the person chosen (STORY-05-01-03 AC 6). */
export function clearBrewChoice(now = Date.now()) {
  const personaId = liveBrewChoice(read(), new Date(now))?.personaId;
  if (personaId) write({ personaId, at: now });
  else forget();
}

/** The lapse: everything goes back, the person too. */
function forget() {
  document.cookie = `${BREW_CHOICE_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
