/*
 * Puck prep on a shot (STORY-01-03-06): whether WDT and a puck screen were
 * used. Prep is never part of the setup. A log from a recipe starts with the
 * recipe's ticks; a blank log with the last shot's on this setup, or both
 * off. Changing the setup re-applies the rule only to ticks not yet touched.
 */

export type Prep = { wdt: boolean; puckScreen: boolean };
export type PrepKey = keyof Prep;

export const NO_PREP: Prep = { wdt: false, puckScreen: false };

export function prepStart({ recipe, lastShotOnSetup }: { recipe?: Prep | null; lastShotOnSetup?: Prep | null }): Prep {
  return { ...(recipe ?? lastShotOnSetup ?? NO_PREP) };
}

/** After a setup change (AC 4): untouched ticks follow the new setup's start, touched ones stay. */
export function prepAfterSetupChange(current: Prep, touched: ReadonlySet<PrepKey>, nextStart: Prep): Prep {
  return {
    wdt: touched.has("wdt") ? current.wdt : nextStart.wdt,
    puckScreen: touched.has("puckScreen") ? current.puckScreen : nextStart.puckScreen,
  };
}
