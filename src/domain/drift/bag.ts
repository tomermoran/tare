import { BAG_FRACTION_PER_STEP, BAG_MIN_SHOTS } from "./constants";

/*
 * This bag's character (STORY-04-02-02): the weighted mean of each of its
 * shots' time against its own recipe's time, a relative signal ("about 10 %
 * fast"), turned into grinder units for the recipe being shown: fast means
 * finer. Only the bag's own shots count, so a new bag starts with none (AC 2).
 * Null without enough shots, or when the grinder's direction isn't known,
 * since a nudge the wrong way is worse than none.
 */

export type BagPoint = { timeMs: number; recipeTimeMs: number; weight: number };

/** The relative signal: -0.1 is 10 % fast. Null with too few shots. */
export function bagSignal(points: readonly BagPoint[]): number | null {
  const usable = points.filter((p) => p.recipeTimeMs > 0);
  if (usable.length < BAG_MIN_SHOTS) return null;
  const sw = usable.reduce((s, p) => s + p.weight, 0);
  return usable.reduce((s, p) => s + p.weight * (p.timeMs / p.recipeTimeMs - 1), 0) / sw;
}

/** The nudge in the recipe's grinder units, coarser positive on a "higher is coarser" grinder. */
export function bagTerm(signal: number | null, wheel: { step: number; coarser: "higher" | "lower" | null }): number | null {
  if (signal === null || wheel.coarser === null) return null;
  // Slow shots want coarser, fast ones finer, one step per BAG_FRACTION_PER_STEP.
  const coarserSteps = signal / BAG_FRACTION_PER_STEP;
  return coarserSteps * wheel.step * (wheel.coarser === "higher" ? 1 : -1);
}
