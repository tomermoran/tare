import { daysBetween, localDayKey } from "./localDay";
import type { PortionDates } from "./portionState";

/*
 * Freezer time (EPIC-03-03). A portion freezes and thaws once at most, so
 * its freezer time is one stretch: from frozen_at to thawed_at, or to now
 * while it's still in the freezer.
 */

type FreezeDates = Pick<PortionDates, "frozenAt" | "thawedAt">;

/** Ground from a portion that was in the freezer when the shot was pulled (STORY-03-03-03). */
export function isFromFrozen(shotAt: Date, p: FreezeDates): boolean {
  if (!p.frozenAt || p.frozenAt > shotAt) return false;
  const thawed = p.thawedAt && p.thawedAt >= p.frozenAt ? p.thawedAt : null;
  return !thawed || shotAt < thawed;
}

/**
 * Whole days in the freezer, counted in local days so a clock goes up once
 * a day whatever the time of day or a DST change (STORY-03-03-02). Frozen
 * and thawed on the same day is none.
 */
export function frozenDays(p: FreezeDates, now: Date, timeZone: string): number {
  if (!p.frozenAt) return 0;
  const end = p.thawedAt && p.thawedAt >= p.frozenAt ? p.thawedAt : now;
  return Math.max(0, daysBetween(localDayKey(p.frozenAt, timeZone), localDayKey(end, timeZone)));
}
