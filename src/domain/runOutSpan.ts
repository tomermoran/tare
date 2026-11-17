import { DAYS_UNTIL, MONTHS_UP_TO, WEEKS_UP_TO } from "./runOutConstants";

/*
 * How long what's on hand lasts at the household's rate (STORY-03-05-02):
 * days under two weeks, weeks up to 26, then months, and "more than 6
 * months" past that. The line never gives a date; the sheet says "around"
 * one. The frozen share is the part of the span the freezer covers, in the
 * same unit.
 */

const DAY = 86_400_000;
/** An average month, for turning days into months. */
const MONTH_DAYS = 365.25 / 12;

export type SpanUnit = "day" | "week" | "month";

export type RunOutSpan =
  | { kind: "span"; unit: SpanUnit; value: number; frozen: number; until: Date }
  | { kind: "long"; months: number; until: Date };

export function inUnit(days: number): { unit: SpanUnit; value: number } | null {
  const d = Math.round(days);
  if (d < DAYS_UNTIL) return { unit: "day", value: Math.max(1, d) };
  const weeks = Math.round(days / 7);
  if (weeks <= WEEKS_UP_TO) return { unit: "week", value: weeks };
  const months = Math.round(days / MONTH_DAYS);
  if (months <= MONTHS_UP_TO) return { unit: "month", value: months };
  return null;
}

const perUnit: Record<SpanUnit, number> = { day: 1, week: 7, month: MONTH_DAYS };

export function runOutSpan({ grams, frozenGrams, weeklyGrams, now }: { grams: number; frozenGrams: number; weeklyGrams: number; now: Date }): RunOutSpan {
  const days = (grams / weeklyGrams) * 7;
  const until = new Date(now.getTime() + Math.round(days) * DAY);
  const span = inUnit(days);
  if (!span) return { kind: "long", months: MONTHS_UP_TO, until };
  const frozenDays = (frozenGrams / weeklyGrams) * 7;
  // Never more of the span in the freezer than the span itself.
  const frozen = Math.min(span.value, Math.round(frozenDays / perUnit[span.unit]));
  return { kind: "span", ...span, frozen, until };
}
