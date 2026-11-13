import { localMinuteOfDay } from "./localDay";
import type { PantryGroup } from "./onHandGroups";

/*
 * Brew's defaults (STORY-02-02-01): which drink and which coffee to show.
 * Pure, with the clock and time zone passed in. Calculated on every visit,
 * never saved (DQ-17).
 */

/** DQ-02: a drink counts for "this time of day" within this many minutes either side. */
export const DRINK_WINDOW_MINUTES = 90;
/** DQ-02: over this many past days. */
export const DRINK_LOOKBACK_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTES_PER_DAY = 24 * 60;

export type DrinkShot = { drinkTypeId: string; at: Date };

/** The wall-clock distance between two times of day, across midnight too. */
function minutesApart(a: number, b: number): number {
  const d = Math.abs(a - b);
  return Math.min(d, MINUTES_PER_DAY - d);
}

/**
 * DQ-02 (AC 3): the persona's most recent drink with a shot within 90
 * minutes either side of now on any of the last 14 days; else the most
 * recent drink at all; else the first visible drink. Only visible drinks
 * count. Times are wall-clock, so a daylight-saving change doesn't shift
 * them.
 */
export function pickDrink({
  shots,
  drinkIds,
  now,
  timeZone,
}: {
  /** The persona's shots, any order. */
  shots: readonly DrinkShot[];
  /** Visible drinks, in list order. */
  drinkIds: readonly string[];
  now: Date;
  timeZone: string;
}): string | null {
  const visible = new Set(drinkIds);
  const newest = shots.filter((s) => visible.has(s.drinkTypeId) && s.at <= now).sort((a, b) => b.at.getTime() - a.at.getTime());
  const nowMinute = localMinuteOfDay(now, timeZone);
  const since = now.getTime() - DRINK_LOOKBACK_DAYS * DAY_MS;
  const atThisTime = newest.find(
    (s) => s.at.getTime() >= since && minutesApart(localMinuteOfDay(s.at, timeZone), nowMinute) <= DRINK_WINDOW_MINUTES,
  );
  return atThisTime?.drinkTypeId ?? newest[0]?.drinkTypeId ?? drinkIds[0] ?? null;
}

/** An unfinished portion, already in the pantry order (open, unopened, frozen). */
export type CoffeePortion = { id: string; beanId: string; group: PantryGroup };

export type CoffeeChoice =
  /** `portionId` is the portion in use: never a frozen one while another is left. */
  | { kind: "coffee"; beanId: string; portionId: string }
  /** The last pull's coffee has nothing left (AC 6). */
  | { kind: "finished"; beanId: string }
  | { kind: "none" };

/**
 * The portion a coffee is on: its first in the pantry order that isn't
 * frozen, else its first frozen one (pulling then asks which bag).
 */
export function portionOf(beanId: string, portions: readonly CoffeePortion[]): CoffeePortion | null {
  const mine = portions.filter((p) => p.beanId === beanId);
  return mine.find((p) => p.group !== "frozen") ?? mine[0] ?? null;
}

/**
 * Which coffee Brew shows (DQ-03, AC 4 and AC 5): the last pull's coffee
 * for this persona and drink while it has an unfinished portion; then the
 * earliest-opened open portion whose coffee has a recipe for this drink on
 * this setup; then the earliest-opened open portion; then the newest
 * unopened one that isn't frozen; then a frozen one. "Open" excludes frozen,
 * so a portion opened and then frozen never wins by itself. When the last
 * pull's coffee has nothing left, that's the finished state (AC 6).
 */
export function pickCoffee({
  portions,
  lastBeanId,
  hasRecipe,
}: {
  /** Unfinished portions in the pantry order. */
  portions: readonly CoffeePortion[];
  /** The coffee of the persona's last pull of this drink. */
  lastBeanId: string | null;
  /** Whether a coffee has a recipe for this persona and drink on this setup. */
  hasRecipe: (beanId: string) => boolean;
}): CoffeeChoice {
  const choose = (p: CoffeePortion | null | undefined): CoffeeChoice | null =>
    p ? { kind: "coffee", beanId: p.beanId, portionId: portionOf(p.beanId, portions)!.id } : null;
  if (lastBeanId) {
    const last = portionOf(lastBeanId, portions);
    return last ? choose(last)! : { kind: "finished", beanId: lastBeanId };
  }
  const open = portions.filter((p) => p.group === "open");
  return (
    choose(open.find((p) => hasRecipe(p.beanId))) ??
    choose(open[0]) ??
    choose(portions.find((p) => p.group === "unopened")) ??
    choose(portions[0]) ?? { kind: "none" }
  );
}
