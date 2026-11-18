import type { GrindWheel } from "../grind";
import { ageTerm } from "./age";
import { bagSignal, bagTerm } from "./bag";
import { CAP_MIN_STEPS, CAP_RANGE_FRACTION, WINDOW_DAYS } from "./constants";
import { eligible } from "./eligible";
import type { DriftPin, DriftShot } from "./types";
import { pickWindow } from "./window";

/*
 * The grind adjustment (TD-3, STORY-04-02-06): the recipe's grind, then the
 * age term, then the bag term, clamped to the cap and the grinder's range,
 * rounded to its step. The same input always gives the same output. The
 * trail is a row per step that moved it, adding up to the grind shown; the
 * evidence is data only, never a person's name (STORY-04-02-07 AC 6).
 */

export type DriftInput = {
  now: Date;
  /** The recipe's grinder. */
  wheel: Pick<GrindWheel, "min" | "max" | "step" | "coarser">;
  /** The recipe being shown, its grind with servicing applied. */
  recipe: { grind: number };
  /** The bag in use; null when none is open. */
  batchId: string | null;
  /** The portion in use's clocks now. */
  age: { roastDays: number | null; openedDays: number | null };
  /** The current grind period's start; null with no grinder event yet. */
  periodStart: Date | null;
  /** The household's shots of this coffee on setups with this grinder, in the period. */
  shots: readonly DriftShot[];
  /** The household's pins for this coffee, every persona. */
  pins: readonly DriftPin[];
};

export type TrailRow = { kind: "aged" | "bag" | "limit"; delta: number };

export type DriftEvidence = {
  /** Measured shots the result rests on. */
  measured: number;
  windowDays: number;
  /** When fewer than 3 were in the window: the oldest shot reached back to. */
  reachedBackTo: Date | null;
  /** Reached back to the start of the grind period. */
  sinceServicing: boolean;
  leftOutPrep: number;
  leftOutNoRecipe: number;
  /** One-tap shots in the same time, not counted as measurements. */
  oneTap: number;
  /** Distinct profiles among the shots used; only a count. */
  people: number;
  /** Shots from more than one setup with this grinder. */
  acrossSetups: boolean;
};

export type GrindAdjustment = {
  shown: number;
  recipeGrind: number;
  rows: TrailRow[];
  limited: boolean;
  evidence: DriftEvidence;
  /** The grinder's step and direction, for formatting and the finer or coarser words. */
  wheel: { step: number; coarser: "higher" | "lower" | null };
};

export type DriftOutcome =
  | { kind: "applied" | "limited"; adjustment: GrindAdjustment }
  | { kind: "none"; reason: "tooFew" | "subStep" | "noSignal" };

const EPS = 1e-9;
const tidy = (n: number) => Number(n.toFixed(6));
const roundTo = (n: number, step: number) => tidy(Math.round(n / step) * step);

export function adjustGrind(input: DriftInput): DriftOutcome {
  const { now, wheel } = input;
  const judged = eligible(input.shots, input.pins);
  const window = pickWindow(judged.kept, now);
  if (!window) return { kind: "none", reason: "tooFew" };

  const w = window.shots;
  const age = ageTerm(
    w.map((s) => ({ roastDays: s.roastDays, openedDays: s.openedDays, delta: s.grind - s.recipe.grind, weight: s.weight })),
    input.age,
  );
  const bag = bagTerm(
    bagSignal(w.filter((s) => s.batchId === input.batchId).map((s) => ({ timeMs: s.timeMs, recipeTimeMs: s.recipe.timeMs, weight: s.weight }))),
    wheel,
  );

  const rows: TrailRow[] = [];
  if (age !== null && roundTo(age, wheel.step) !== 0) rows.push({ kind: "aged", delta: roundTo(age, wheel.step) });
  if (bag !== null && roundTo(bag, wheel.step) !== 0) rows.push({ kind: "bag", delta: roundTo(bag, wheel.step) });
  if (!rows.length) return { kind: "none", reason: age === null && bag === null ? "noSignal" : "subStep" };

  const recipeGrind = input.recipe.grind;
  const wanted = tidy(recipeGrind + rows.reduce((s, r) => s + r.delta, 0));
  const cap = Math.max(CAP_MIN_STEPS * wheel.step, CAP_RANGE_FRACTION * (wheel.max - wheel.min));
  const capped = Math.min(recipeGrind + cap, Math.max(recipeGrind - cap, wanted));
  const inRange = Math.min(wheel.max, Math.max(wheel.min, capped));
  // On the grinder's own steps, counted from its lowest setting.
  const shown = tidy(wheel.min + Math.round((inRange - wheel.min) / wheel.step) * wheel.step);
  const limited = Math.abs(shown - wanted) > EPS;
  if (limited) rows.push({ kind: "limit", delta: tidy(shown - wanted) });
  if (Math.abs(shown - recipeGrind) < wheel.step - EPS) return { kind: "none", reason: "subStep" };

  // The evidence covers the same time as the window.
  const from = w[w.length - 1].at.getTime();
  const inSpan = (s: DriftShot) => s.at.getTime() >= from && s.at.getTime() <= now.getTime();
  const oldestInPeriod = judged.kept.reduce((m, s) => Math.min(m, s.at.getTime()), Infinity);
  const evidence: DriftEvidence = {
    measured: w.length,
    windowDays: WINDOW_DAYS,
    reachedBackTo: window.reachedBack,
    sinceServicing: window.reachedBack !== null && input.periodStart !== null && from === oldestInPeriod,
    leftOutPrep: judged.leftOutPrep.filter(inSpan).length,
    leftOutNoRecipe: judged.leftOutNoRecipe.filter(inSpan).length,
    oneTap: judged.oneTap.filter(inSpan).length,
    people: new Set(w.map((s) => s.personaId)).size,
    acrossSetups: new Set(w.map((s) => s.setupId)).size > 1,
  };
  const adjustment = { shown, recipeGrind, rows, limited, evidence, wheel: { step: wheel.step, coarser: wheel.coarser } };
  return { kind: limited ? "limited" : "applied", adjustment };
}

export type { DriftPin, DriftShot } from "./types";
