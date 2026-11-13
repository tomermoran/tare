import { frozenDays } from "./frozen";
import { daysBetween, localDayKey } from "./localDay";
import { portionState, type PortionDates } from "./portionState";

/*
 * The opened clock (STORY-03-03-04): how long a portion has been open to the
 * air, in local days (0 is opened today), less the days it spent in the
 * freezer after opening (STORY-03-03-02 AC 2). In the freezer it's paused;
 * never opened, there's no clock. A finished portion's clock stops on the
 * day it was finished. Calculated, never stored.
 */

export type OpenedClock = { kind: "open"; days: number } | { kind: "paused" } | { kind: "notOpened" };

export function openedClock(p: PortionDates, now: Date, timeZone: string): OpenedClock {
  const state = portionState(p);
  if (state === "frozen") return { kind: "paused" };
  if (!p.openedAt) return { kind: "notOpened" };
  const end = p.finishedAt ?? now;
  // Freezer time only counts against the clock once it was open.
  const frozen = p.frozenAt && p.frozenAt >= p.openedAt ? frozenDays(p, end, timeZone) : 0;
  const days = daysBetween(localDayKey(p.openedAt, timeZone), localDayKey(end, timeZone)) - frozen;
  return { kind: "open", days: Math.max(0, days) };
}
