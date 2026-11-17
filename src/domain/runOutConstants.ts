/*
 * The run-out estimate's thresholds (EPIC-03-05). Starting values, kept in
 * one place so they can be tuned without touching the rules.
 */

/** Finished portions needed before Tare gives a rate (DQ-39). */
export const FINISHED_NEEDED = 3;

/** No brewing for this long and the rate would be a guess, so there's no line. */
export const STALE_DAYS = 30;

/** The shortest stretch a rate rests on, so a few fast portions don't make it wild. */
export const MIN_SPAN_DAYS = 7;

/** Spans below this many days are given in days. */
export const DAYS_UNTIL = 14;

/** Spans up to this many weeks are given in weeks, then months. */
export const WEEKS_UP_TO = 26;

/** Spans past this many months are "more than 6 months". */
export const MONTHS_UP_TO = 6;

/** Below this logged share the sheet says the household drinks more than it logs. */
export const LOW_SHARE = 0.8;
