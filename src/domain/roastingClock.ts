import { frozenDays } from "./frozen";
import { daysBetween, localDayKey } from "./localDay";
import type { PortionDates } from "./portionState";

/*
 * The roasting clock (STORY-03-03-01): how old the coffee is, from whatever
 * date the bag shows, less its days in the freezer (STORY-03-03-02). The
 * roast date wins, then the packing date; with only a best-before date
 * there's no age, only the time left, as Tare never assumes a gap between
 * roasting and best-before. Calculated, never stored.
 */

export type RoastingClock =
  | { kind: "roasted"; days: number; frozenDays: number }
  | { kind: "packed"; days: number; frozenDays: number }
  /** Negative once it has passed; freezer days are added back. */
  | { kind: "bestBefore"; daysLeft: number; frozenDays: number }
  | { kind: "unknown" };

export type BagDates = { roastDate: Date | null; packedAt: Date | null; bestBefore: Date | null };

/**
 * A portion's roasting clock; without a portion, the bag's own, with no
 * freezer time taken off. Days are local calendar days, so the clock goes
 * up by one each day (AC 5) and a DST change never skips or repeats one.
 */
export function roastingClock(
  bag: BagDates,
  portion: Pick<PortionDates, "frozenAt" | "thawedAt"> | null,
  now: Date,
  timeZone: string,
): RoastingClock {
  const today = localDayKey(now, timeZone);
  const frozen = portion ? frozenDays(portion, now, timeZone) : 0;
  const age = (from: Date) => Math.max(0, daysBetween(localDayKey(from, timeZone), today) - frozen);
  if (bag.roastDate) return { kind: "roasted", days: age(bag.roastDate), frozenDays: frozen };
  if (bag.packedAt) return { kind: "packed", days: age(bag.packedAt), frozenDays: frozen };
  if (bag.bestBefore) {
    return { kind: "bestBefore", daysLeft: daysBetween(today, localDayKey(bag.bestBefore, timeZone)) + frozen, frozenDays: frozen };
  }
  return { kind: "unknown" };
}
