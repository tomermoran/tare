import { HALF_LIFE_DAYS, MAX_SHOTS, MIN_SHOTS, WINDOW_DAYS } from "./constants";

/*
 * The recent-shots window (STORY-04-02-04): shots from the last 3 days; with
 * fewer than 3, reach back until 3 but never past the period start (the
 * caller passes only the period's shots); at most 10, the newest. Weights
 * halve every 3 days of age. Ties go by ID, so the same shots always give
 * the same order and weights (AC 4).
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export type Weighted<T> = T & { weight: number };
export type Window<T> = { shots: Weighted<T>[]; reachedBack: Date | null };

export const newestFirst = <T extends { at: Date; id: string }>(a: T, b: T) => b.at.getTime() - a.at.getTime() || (b.id < a.id ? -1 : b.id > a.id ? 1 : 0);

/** Null with fewer than 3 shots even reaching back. */
export function pickWindow<T extends { at: Date; id: string }>(shots: readonly T[], now: Date): Window<T> | null {
  const sorted = shots.filter((s) => s.at.getTime() <= now.getTime()).sort(newestFirst);
  const since = now.getTime() - WINDOW_DAYS * DAY_MS;
  let chosen = sorted.filter((s) => s.at.getTime() >= since);
  let reachedBack: Date | null = null;
  if (chosen.length < MIN_SHOTS) {
    chosen = sorted.slice(0, MIN_SHOTS);
    if (chosen.length < MIN_SHOTS) return null;
    reachedBack = chosen[chosen.length - 1].at;
  }
  chosen = chosen.slice(0, MAX_SHOTS);
  return {
    shots: chosen.map((s) => ({ ...s, weight: 0.5 ** ((now.getTime() - s.at.getTime()) / DAY_MS / HALF_LIFE_DAYS) })),
    reachedBack,
  };
}
