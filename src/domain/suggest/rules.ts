import { effectiveGrind } from "../capabilityFallbacks";
import { PREP_TAGS } from "../taste";
import { DOSE_STEP_G, GRIND_STEPS, MILK_STEP_ML, TEMPERATURE_STEP_C, YIELD_STEP_G } from "./constants";
import type { Change, SuggestInput } from "./types";

/*
 * The levers (STORY-02-03-06, S-02). Each rule looks at one kind of sign and
 * gives one change, or null to let the next lever be considered. "A bit" is
 * one step and "much" two. The order lives in `LEVERS`, in index.ts.
 */

export type Rule = (input: SuggestInput) => Change | null;

const round = (n: number) => Number(n.toFixed(6));
/** 1 for "a bit", 2 for "much". */
const size = (answer: number) => (Math.abs(answer) >= 2 ? 2 : 1);

/**
 * Channelling signs (AC 1): WDT if it wasn't used, then a puck screen; with
 * both used, check distribution and tamping, and no grind change, since
 * grind won't fix uneven extraction.
 */
export const prepRule: Rule = ({ tags, shot }) => {
  if (!tags.some((t) => PREP_TAGS.has(t))) return null;
  if (!shot.prep.wdt) return { lever: "prep", tool: "wdt" };
  if (!shot.prep.puckScreen) return { lever: "prep", tool: "puckScreen" };
  return { lever: "prep", tool: "checkDistribution" };
};

/** Where the grind would go for this balance, or null at the end of its range. */
function grindMove(input: SuggestInput): Change | null {
  const balance = input.answers.balance;
  if (!balance) return null;
  const direction = balance < 0 ? "finer" : "coarser";
  const scale = effectiveGrind(input.setup.grind);
  // Direction not known: words only, no dial numbers (AC 6).
  if (!input.setup.grind || input.setup.grind.type === "unknown" || !scale.coarser) {
    return { lever: "grind", direction, steps: GRIND_STEPS[size(balance)], from: null, to: null };
  }
  const up = (direction === "coarser") === (scale.coarser === "higher");
  const from = input.shot.grind;
  const to = round(Math.min(scale.max, Math.max(scale.min, from + (up ? 1 : -1) * GRIND_STEPS[size(balance)] * scale.step)));
  return to === from ? null : { lever: "grind", direction, steps: Math.round(Math.abs(to - from) / scale.step), from, to };
}

/**
 * The last grind change, in this grind period, moved the same way and the
 * balance is still off the same way: grind didn't help.
 */
function grindDidntHelp(input: SuggestInput): boolean {
  const { previous, answers, shot } = input;
  const balance = answers.balance;
  if (!previous?.balance || !balance || Math.sign(previous.balance) !== Math.sign(balance)) return false;
  const move = grindMove({ ...input, shot: { ...shot, grind: previous.grind } });
  if (move?.lever !== "grind" || move.to === null || move.from === null) return false;
  return Math.sign(shot.grind - previous.grind) === Math.sign(move.to - move.from);
}

/**
 * Balance off and no channelling signs (AC 2): grind, in the grinder's own
 * direction and steps, clamped to its range. At the end of its range, or
 * when the last change didn't help and the machine can set temperature, it
 * leaves the balance to temperature.
 */
export const grindRule: Rule = (input) => {
  if (input.setup.temperature && grindDidntHelp(input)) return null;
  return grindMove(input);
};

/** The dose step within the basket's range, or null at its limit or with an unknown range (AC 4, AC 6). */
function doseMove(input: SuggestInput, direction: "more" | "less", steps: number): Change | null {
  const range = input.setup.doseRange;
  if (!range) return null;
  const from = input.shot.dose;
  const to = round(Math.min(range.max, Math.max(range.min, from + (direction === "more" ? 1 : -1) * steps * DOSE_STEP_G)));
  return to === from ? null : { lever: "dose", direction, from, to };
}

/**
 * Strength off (AC 3): yield, shorter when weak and longer when strong. A
 * milk drink's strength is how it holds up in the milk: dose first, within
 * the basket's range, then the milk amount.
 */
export const strengthRule: Rule = (input) => {
  const strength = input.answers.strength;
  if (!strength) return null;
  const steps = size(strength);
  const weak = strength < 0;
  if (input.shot.milkDrink) {
    const dose = doseMove(input, weak ? "more" : "less", steps);
    if (dose) return dose;
    const from = input.shot.milkMl;
    if (from === null) return null;
    const to = Math.max(0, from + (weak ? -1 : 1) * steps * MILK_STEP_ML);
    return to === from ? null : { lever: "milk", direction: weak ? "less" : "more", from, to };
  }
  const from = input.shot.yield;
  const to = round(Math.max(0, from + (weak ? -1 : 1) * steps * YIELD_STEP_G));
  return to === from ? null : { lever: "yield", direction: weak ? "less" : "more", from, to };
};

/** Body off (AC 4): dose, only within the basket's range; thin wants more. */
export const bodyRule: Rule = (input) => {
  const body = input.answers.body;
  if (!body) return null;
  return doseMove(input, body < 0 ? "more" : "less", size(body));
};

/**
 * Balance still off when grind can't fix it (AC 5): at the end of its range,
 * or the last grind change didn't help. Only on a machine that can set
 * temperature; hotter for sour, cooler for bitter.
 */
export const temperatureRule: Rule = (input) => {
  const balance = input.answers.balance;
  if (!balance || !input.setup.temperature) return null;
  if (grindMove(input) && !grindDidntHelp(input)) return null;
  const direction = balance < 0 ? "more" : "less";
  const from = input.shot.brewTempC;
  const to = from === null ? null : round(from + (direction === "more" ? 1 : -1) * size(balance) * TEMPERATURE_STEP_C);
  return { lever: "temperature", direction, from, to };
};
