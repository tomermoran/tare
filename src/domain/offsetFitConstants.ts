/*
 * Starting values for the shift and stretch fit (EPIC-04-04, DQ-43b), for the
 * evals to tune. One file, so a change is one diff.
 */

/** Old grinds closer than this many grinder steps can't tell a stretch from a shift (STORY-04-04-01 AC 4). */
export const TOO_CLOSE_STEPS = 2;
/** A fit whose root-mean-square miss passes this many steps is a guess (AC 3). */
export const UNCERTAIN_STEPS = 1.5;
/** The stretch the wheel allows, in percent either way (STORY-04-04-02 AC 1). */
export const STRETCH_LIMIT_PERCENT = 30;
