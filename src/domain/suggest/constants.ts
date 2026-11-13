/*
 * The suggestion engine's numbers, in one place (EPIC-02-03). The step sizes
 * are the Head of Product's starting values (answer 1, SQ-19). The freshness
 * thresholds are DQ-24, confirmed by the Head of Product; tests refer to
 * these names, not the numbers.
 */

/** Grind steps for "a bit" (±1) and "much" (±2) off. */
export const GRIND_STEPS = { 1: 1, 2: 2 } as const;
export const YIELD_STEP_G = 2;
export const DOSE_STEP_G = 0.5;
export const TEMPERATURE_STEP_C = 1;
export const MILK_STEP_ML = 30;

/** Under this many days since roast or packing: very fresh, may channel. */
export const VERY_FRESH_DAYS = 5;
/** Over this many days since roast or packing: likely past its peak. */
export const PAST_PEAK_ROASTED_DAYS = 35;
/** Over this many days open: likely past its peak. */
export const PAST_PEAK_OPEN_DAYS = 21;

/**
 * How far from the recipe's time a shot must run to count as fast or slow
 * in a reason. Time is a diagnostic only, never a lever or a warning (DQ-09).
 */
export const TIME_TOLERANCE_MS = 3_000;
