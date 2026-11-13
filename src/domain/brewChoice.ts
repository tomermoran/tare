/*
 * A drink or coffee chosen on Brew for the next pull only (STORY-02-02-06,
 * DQ-17). Never a setting: it lives in a cookie on this device, a pull
 * clears it, and it lapses after 30 minutes away from Brew (AC 6). `at` is
 * when Brew was last on screen with it.
 */

export const BREW_CHOICE_COOKIE = "brewChoice";
/** AC 6: an unpulled change resets after this long away from Brew. */
export const BREW_CHOICE_RESET_MS = 30 * 60 * 1000;

export type BrewChoice = { drinkId?: string; beanId?: string; at: number };

export function encodeBrewChoice(choice: BrewChoice): string {
  return encodeURIComponent(JSON.stringify(choice));
}

export function decodeBrewChoice(value: string | undefined): BrewChoice | null {
  if (!value) return null;
  try {
    const raw = JSON.parse(decodeURIComponent(value)) as Record<string, unknown>;
    const id = (v: unknown) => (typeof v === "string" && v.length > 0 && v.length <= 200 ? v : undefined);
    if (typeof raw?.at !== "number" || !Number.isFinite(raw.at)) return null;
    return { drinkId: id(raw.drinkId), beanId: id(raw.beanId), at: raw.at };
  } catch {
    return null;
  }
}

/** The choice while it still applies; null once 30 minutes have passed away from Brew. */
export function liveBrewChoice(choice: BrewChoice | null, now: Date): BrewChoice | null {
  if (!choice) return null;
  return now.getTime() - choice.at <= BREW_CHOICE_RESET_MS ? choice : null;
}
