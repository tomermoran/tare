/*
 * Every number the grind drift rules use (TD-3, DQ-32 revised, DQ-43). They
 * are starting values, tuned by the scenario suite: a change here fails the
 * constants snapshot until the scenarios are run again (STORY-04-02-09 AC 2).
 */

/** The recent-shots window, in days (STORY-04-02-04 AC 1). */
export const WINDOW_DAYS = 3;
/** Fewer shots than this, even reaching back, and nothing is shown (AC 2). */
export const MIN_SHOTS = 3;
/** At most this many, the newest (AC 1, AC 5). */
export const MAX_SHOTS = 10;
/** Weights halve every this many days: today counts about twice a 3-day-old shot (AC 3). */
export const HALF_LIFE_DAYS = 3;

/** The since-opening clock's term, as a share of its fitted effect (DQ-31: smaller than roasting's). */
export const OPENED_WEIGHT = 0.25;
/** A bag running this much faster or slower than its recipe is one grinder step (STORY-04-02-02). */
export const BAG_FRACTION_PER_STEP = 0.1;
/** The bag's own shots needed before its character counts. */
export const BAG_MIN_SHOTS = 2;

/** The cap: the larger of this many steps and this share of the grinder's range (STORY-04-02-01 AC 5). */
export const CAP_MIN_STEPS = 2;
export const CAP_RANGE_FRACTION = 0.06;

/** Any grinder event starts a new period, a clean included (DQ-47); the evals may flip it. */
export const CLEAN_STARTS_PERIOD = true;
/** Pool only within the same basket: the evals' fallback if single and double baskets diverge (DQ-32). */
export const POOL_WITHIN_BASKET = false;
