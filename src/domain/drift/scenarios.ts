import { adjustGrind, type DriftInput } from "./index";
import type { DriftPin, DriftShot } from "./types";

/*
 * The drift scenario suite (STORY-04-02-09, TASK-04-02-09-QA1): situations a
 * household meets, each with the direction and size band the rules should
 * give. Rules and statistics, not AI (DQ-43), so every scenario is exact
 * input. Run by the test (all must pass) and by `npm run evals:drift`, which
 * prints the pass rate against a target that isn't set yet (X-2).
 */

export type Expected = { direction: "finer" | "coarser" | "none"; /** Absolute steps, inclusive. */ steps?: [number, number]; limited?: boolean };
export type Scenario = { name: string; group: string; input: DriftInput; expect: Expected };

const DAY = 86_400_000;
const NOW = new Date("2026-06-15T09:00:00Z");
const ago = (d: number) => new Date(NOW.getTime() - d * DAY);
const NO_PREP = { wdt: false, puckScreen: false };
const WDT = { wdt: true, puckScreen: false };
const STEPPED = { min: 0, max: 30, step: 1, coarser: "higher" as const };
const STEPLESS = { min: 0, max: 50, step: 0.1, coarser: "higher" as const };
const LOWER = { min: 0, max: 30, step: 1, coarser: "lower" as const };
const UNKNOWN = { min: 0, max: 30, step: 1, coarser: null };

const pin = (over: Partial<DriftPin> = {}): DriftPin => ({
  id: `pin-${over.personaId ?? "me"}-${over.setupId ?? "s1"}-${over.batchId ?? "coffee"}`,
  personaId: "me",
  setupId: "s1",
  drinkTypeId: "espresso",
  batchId: null,
  pinnedAt: ago(40),
  removedAt: null,
  grind: 15,
  timeMs: 28_000,
  prep: NO_PREP,
  ...over,
});
let seq = 0;
const shot = (d: number, over: Partial<DriftShot> = {}): DriftShot => ({
  id: `s${String(++seq).padStart(4, "0")}`,
  at: ago(d),
  entryMode: "measured",
  reaction: null,
  personaId: "me",
  setupId: "s1",
  drinkTypeId: "espresso",
  batchId: "bag",
  grind: 15,
  timeMs: 28_000,
  prep: NO_PREP,
  roastDays: Math.round(25 - d),
  openedDays: Math.round(10 - d),
  ...over,
});
const base = (over: Partial<DriftInput>): DriftInput => ({
  now: NOW,
  wheel: STEPPED,
  recipe: { grind: 15 },
  batchId: "bag",
  age: { roastDays: 25, openedDays: 10 },
  periodStart: ago(60),
  shots: [],
  pins: [pin()],
  ...over,
});
/** Shots over the last days at these grinds (newest last) and times. */
const series = (grinds: number[], times: number | number[] = 28_000, over: Partial<DriftShot> = {}) =>
  grinds.map((g, i) => shot(grinds.length - 1 - i, { grind: g, timeMs: Array.isArray(times) ? times[i] : times, ...over }));

export const scenarios: Scenario[] = [
  // An ageing bag: the household grinds finer as it ages.
  { group: "ageing", name: "ageing bag, steady finer", input: base({ shots: series([15, 14.5, 14, 13.5, 13]) }), expect: { direction: "finer", steps: [2, 3] } },
  { group: "ageing", name: "ageing bag, stepless", input: base({ wheel: STEPLESS, shots: series([15, 14.8, 14.6, 14.4]) }), expect: { direction: "finer", steps: [6, 12] } },
  { group: "ageing", name: "ageing bag, lower is coarser", input: base({ wheel: LOWER, shots: series([15, 15.5, 16, 16.5, 17]) }), expect: { direction: "finer", steps: [2, 3] } },
  { group: "ageing", name: "one age only: no line", input: base({ shots: series([14, 14, 14], 28_000, { roastDays: 20 }) }), expect: { direction: "none" } },
  { group: "ageing", name: "unknown age: no age term", input: base({ age: { roastDays: null, openedDays: null }, shots: series([15, 14, 13]) }), expect: { direction: "none" } },
  { group: "ageing", name: "fresh bag, on recipe", input: base({ shots: series([15, 15, 15, 15]) }), expect: { direction: "none" } },
  // A fast or slow bag.
  { group: "bag", name: "fast bag, about 12 % fast", input: base({ shots: series([15, 15, 15], [24_600, 24_800, 24_500]) }), expect: { direction: "finer", steps: [1, 1] } },
  { group: "bag", name: "slow bag, about 15 % slow", input: base({ shots: series([15, 15, 15], [32_000, 32_400, 32_200]) }), expect: { direction: "coarser", steps: [1, 2] } },
  { group: "bag", name: "bag a little fast: under a step", input: base({ shots: series([15, 15, 15], [27_000, 27_200, 26_900]) }), expect: { direction: "none" } },
  { group: "bag", name: "new bag of the same coffee: none of the old bag's character", input: base({ batchId: "new", shots: series([15, 15, 15], 24_000) }), expect: { direction: "none" } },
  { group: "bag", name: "fast bag, unknown direction: no nudge", input: base({ wheel: UNKNOWN, shots: series([15, 15, 15], 24_000) }), expect: { direction: "none" } },
  { group: "bag", name: "very fast bag is limited", input: base({ shots: series([15, 15, 15], 14_000) }), expect: { direction: "finer", steps: [2, 2], limited: true } },
  // A busy multi-person household on one grinder.
  {
    group: "household",
    name: "two people, one fast bag",
    input: base({
      pins: [pin(), pin({ personaId: "guest", grind: 16, timeMs: 30_000 })],
      shots: [shot(0.1, { timeMs: 24_500 }), shot(0.5, { personaId: "guest", grind: 16, timeMs: 26_000 }), shot(1, { timeMs: 24_600 }), shot(1.5, { personaId: "guest", grind: 16, timeMs: 26_200 })],
    }),
    expect: { direction: "finer", steps: [1, 1] },
  },
  {
    group: "household",
    name: "busy day: 20 shots, still the newest 10",
    input: base({ shots: Array.from({ length: 20 }, (_, i) => shot(i * 0.1, { timeMs: 24_500 })) }),
    expect: { direction: "finer", steps: [1, 1] },
  },
  {
    group: "household",
    name: "second setup with the grinder pools in",
    input: base({ pins: [pin(), pin({ setupId: "s2", grind: 14 })], shots: [shot(0.2, { timeMs: 24_400 }), shot(1, { setupId: "s2", grind: 14, timeMs: 24_500 }), shot(2, { timeMs: 24_600 })] }),
    expect: { direction: "finer", steps: [1, 1] },
  },
  {
    group: "household",
    name: "another persona's pin never judges my shot",
    input: base({ pins: [pin({ personaId: "guest" })], shots: series([15, 15, 15], 24_000) }),
    expect: { direction: "none" },
  },
  // Mixed puck prep.
  { group: "prep", name: "prep differs from the recipe: left out", input: base({ shots: series([15, 15, 15], 24_000, { prep: WDT }) }), expect: { direction: "none" } },
  {
    group: "prep",
    name: "mixed prep, enough matching",
    input: base({ shots: [...series([15, 15, 15], 24_400), shot(0.3, { prep: WDT, timeMs: 35_000 })] }),
    expect: { direction: "finer", steps: [1, 1] },
  },
  { group: "prep", name: "only one-tap shots: nothing moves", input: base({ shots: series([15, 15, 15], 24_000, { entryMode: "one-tap" }) }), expect: { direction: "none" } },
  // A low-volume household.
  { group: "low volume", name: "two shots in a fortnight", input: base({ shots: [shot(3, { timeMs: 24_000 }), shot(10, { timeMs: 24_000 })] }), expect: { direction: "none" } },
  {
    group: "low volume",
    name: "reaches back a week to 3 shots",
    input: base({ shots: [shot(1, { timeMs: 24_400 }), shot(5, { timeMs: 24_500 }), shot(8, { timeMs: 24_600 })] }),
    expect: { direction: "finer", steps: [1, 1] },
  },
  // A fresh period after servicing: the reader passes only the period's shots.
  { group: "servicing", name: "new period, two shots: no drift", input: base({ periodStart: ago(1.5), shots: [shot(0.2, { timeMs: 24_000 }), shot(1, { timeMs: 24_000 })] }), expect: { direction: "none" } },
  {
    group: "servicing",
    name: "new period, three shots since",
    input: base({ periodStart: ago(2.5), shots: [shot(0.2, { timeMs: 24_400 }), shot(1, { timeMs: 24_500 }), shot(2, { timeMs: 24_600 })] }),
    expect: { direction: "finer", steps: [1, 1] },
  },
  // Single and double baskets on one grinder, each judged against its own recipe.
  {
    group: "baskets",
    name: "single and double baskets, each against its own recipe",
    input: base({
      pins: [pin(), pin({ setupId: "single", grind: 12, timeMs: 25_000 })],
      shots: [shot(0.2, { timeMs: 28_000 }), shot(0.6, { setupId: "single", grind: 12, timeMs: 25_000 }), shot(1, { timeMs: 28_200 }), shot(1.4, { setupId: "single", grind: 12, timeMs: 25_100 })],
    }),
    expect: { direction: "none" },
  },
  {
    group: "baskets",
    name: "double running slow while the single is on time",
    input: base({
      pins: [pin(), pin({ setupId: "single", grind: 12, timeMs: 25_000 })],
      shots: [shot(0.2, { timeMs: 33_000 }), shot(0.6, { setupId: "single", grind: 12, timeMs: 25_000 }), shot(1, { timeMs: 33_200 }), shot(1.4, { setupId: "single", grind: 12, timeMs: 25_000 })],
    }),
    expect: { direction: "coarser", steps: [1, 1] },
  },
];

export type ScenarioResult = { scenario: Scenario; pass: boolean; got: string };

export function runScenario(s: Scenario): ScenarioResult {
  const out = adjustGrind(s.input);
  if (out.kind === "none") return { scenario: s, pass: s.expect.direction === "none", got: `none (${out.reason})` };
  const a = out.adjustment;
  const step = s.input.wheel.step;
  const steps = Math.round(Math.abs(a.shown - a.recipeGrind) / step);
  const higher = a.shown > a.recipeGrind;
  const direction = s.input.wheel.coarser === "lower" ? (higher ? "finer" : "coarser") : higher ? "coarser" : "finer";
  const inBand = !s.expect.steps || (steps >= s.expect.steps[0] && steps <= s.expect.steps[1]);
  const limitedOk = s.expect.limited === undefined || s.expect.limited === a.limited;
  return { scenario: s, pass: direction === s.expect.direction && inBand && limitedOk, got: `${direction} ${steps} step(s)${a.limited ? ", limited" : ""}` };
}
