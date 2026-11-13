import type { GrindScale } from "./capabilities";

/*
 * The grind wheel for a setup's grinder (STORY-01-03-02 AC 3, AC 4). A
 * stepped grinder snaps to its steps; a stepless one moves by its finest
 * increment. Anything "not sure" falls back as DQ-11 says: smooth, 0 to 100,
 * step 0.1 (step 1 for clicks), and no finer or coarser captions, because a
 * wrong caption is worse than none.
 */

export type GrindWheel = {
  min: number;
  max: number;
  step: number;
  /** A labelled tick every N steps, so labels land on whole numbers. */
  majorEvery: number;
  /** Which way is coarser; null when it isn't known. */
  coarser: "higher" | "lower" | null;
};

/** DQ-11's fallbacks for a grinder whose scale isn't known. */
export const GRIND_FALLBACK = { min: 0, max: 100, smoothStep: 0.1, clickStep: 1 } as const;

const majorFor = (step: number) => (step >= 1 ? 5 : Math.max(1, Math.round(1 / step)));

export function grindWheelConfig(scale: GrindScale | null | undefined): GrindWheel {
  const step = scale?.step ?? (scale?.type === "stepped" ? GRIND_FALLBACK.clickStep : GRIND_FALLBACK.smoothStep);
  let min = scale?.min ?? GRIND_FALLBACK.min;
  let max = scale?.max ?? GRIND_FALLBACK.max;
  if (min >= max) [min, max] = [GRIND_FALLBACK.min, GRIND_FALLBACK.max];
  const coarser = scale?.coarser === "higher" || scale?.coarser === "lower" ? scale.coarser : null;
  return { min, max, step, majorEvery: majorFor(step), coarser };
}

/** The middle of the wheel's range, on a step (DQ-07's starting grind). */
export function middleGrind(wheel: Pick<GrindWheel, "min" | "max" | "step">): number {
  const steps = Math.round((wheel.max - wheel.min) / 2 / wheel.step);
  return Number((wheel.min + steps * wheel.step).toFixed(6));
}
