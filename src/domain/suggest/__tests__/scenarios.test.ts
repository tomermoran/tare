import { describe, expect, it } from "vitest";
import type { GrindScale } from "../../capabilities";
import { NO_PREP } from "../../prep";
import type { TasteTag } from "../../taste";
import { DOSE_STEP_G, MILK_STEP_ML, TEMPERATURE_STEP_C, YIELD_STEP_G } from "../constants";
import { suggest, type Answers, type Change, type SuggestInput } from "../index";

/*
 * The suggestion scenario suite (TASK-02-03-06-QA1). Plain rules, no LLM:
 * each scenario names its acceptance criterion and passes when the engine
 * picks the expected lever and direction. Values are checked where the
 * story gives an example. All must pass before release.
 */

const HIGHER_COARSER: GrindScale = { type: "stepped", min: 0, max: 30, step: 1, coarser: "higher" };
const LOWER_COARSER: GrindScale = { type: "stepped", min: 0, max: 30, step: 1, coarser: "lower" };
const STEPLESS: GrindScale = { type: "stepless", min: 0, max: 10, step: 0.1, coarser: "higher" };
const UNKNOWN_DIRECTION: GrindScale = { type: "stepped", min: 0, max: 30, step: 1, coarser: "unknown" };
const BASKET = { min: 17, max: 19 };

type Shot = SuggestInput["shot"];
type Setup = SuggestInput["setup"];
type Scenario = {
  name: string;
  ac: number;
  answers?: Partial<Answers>;
  tags?: TasteTag[];
  shot?: Partial<Shot>;
  setup?: Partial<Setup>;
  previous?: SuggestInput["previous"];
  /** Lever and direction (or tool); null for no change. */
  expect: { lever: Change["lever"]; direction?: string; tool?: string } | null;
  /** The example's values, when the story gives them. */
  values?: { from: number | null; to: number | null };
};

const build = (s: Scenario): SuggestInput => ({
  shot: { grind: 15, dose: 18, yield: 36, timeMs: 28_000, brewTempC: 93, prep: NO_PREP, milkMl: null, milkDrink: false, ...s.shot },
  answers: { balance: null, strength: null, body: null, sweetness: null, ...s.answers },
  tags: s.tags ?? [],
  recipe: { timeMs: 28_000 },
  setup: { grind: HIGHER_COARSER, temperature: false, doseRange: BASKET, ...s.setup },
  previous: s.previous ?? null,
  clocks: { roasting: null, opened: null },
});

const BOTH_PREP = { wdt: true, puckScreen: true };

const scenarios: Scenario[] = [
  // AC 1: channelling signs put puck prep first.
  { name: "channelling seen, no prep: WDT", ac: 1, tags: ["channelling"], expect: { lever: "prep", tool: "wdt" } },
  { name: "sour and bitter at once, no prep: WDT", ac: 1, tags: ["sourAndBitter"], expect: { lever: "prep", tool: "wdt" } },
  { name: "dry finish, WDT used: puck screen", ac: 1, tags: ["dryFinish"], shot: { prep: { wdt: true, puckScreen: false } }, expect: { lever: "prep", tool: "puckScreen" } },
  { name: "channelling with both used: check distribution", ac: 1, tags: ["channelling"], shot: { prep: BOTH_PREP }, expect: { lever: "prep", tool: "checkDistribution" } },
  { name: "channelling beats a sour balance: prep, not grind", ac: 1, tags: ["channelling"], answers: { balance: -2 }, expect: { lever: "prep", tool: "wdt" } },
  { name: "both used and sour: still no grind change", ac: 1, tags: ["sourAndBitter"], answers: { balance: -1 }, shot: { prep: BOTH_PREP }, expect: { lever: "prep", tool: "checkDistribution" } },
  { name: "puck screen used, WDT not: WDT first", ac: 1, tags: ["channelling"], shot: { prep: { wdt: false, puckScreen: true } }, expect: { lever: "prep", tool: "wdt" } },
  { name: "flat is not a channelling sign: no prep", ac: 1, tags: ["flat"], expect: null },

  // AC 2: balance off, no channelling signs: grind in the grinder's own direction and steps.
  { name: "much too sour at 15, higher is coarser: 2 finer, to 13", ac: 2, answers: { balance: -2 }, expect: { lever: "grind", direction: "finer" }, values: { from: 15, to: 13 } },
  { name: "a bit too bitter at 15: 1 coarser, to 16", ac: 2, answers: { balance: 1 }, expect: { lever: "grind", direction: "coarser" }, values: { from: 15, to: 16 } },
  { name: "a bit sour, lower is coarser: finer is up", ac: 2, answers: { balance: -1 }, setup: { grind: LOWER_COARSER }, expect: { lever: "grind", direction: "finer" }, values: { from: 15, to: 16 } },
  { name: "much too bitter, lower is coarser: 2 down", ac: 2, answers: { balance: 2 }, setup: { grind: LOWER_COARSER }, expect: { lever: "grind", direction: "coarser" }, values: { from: 15, to: 13 } },
  { name: "stepless grinder moves by its own step", ac: 2, answers: { balance: -1 }, shot: { grind: 4.5 }, setup: { grind: STEPLESS }, expect: { lever: "grind", direction: "finer" }, values: { from: 4.5, to: 4.4 } },
  { name: "much too sour one step from the end: clamped", ac: 2, answers: { balance: -2 }, shot: { grind: 1 }, expect: { lever: "grind", direction: "finer" }, values: { from: 1, to: 0 } },
  { name: "sour and ran fast: grind, with time only in the reason", ac: 2, answers: { balance: -1 }, shot: { timeMs: 20_000 }, expect: { lever: "grind", direction: "finer" } },
  { name: "balance beats strength", ac: 2, answers: { balance: -1, strength: -1 }, expect: { lever: "grind", direction: "finer" } },
  { name: "balance beats body", ac: 2, answers: { balance: 1, body: -1 }, expect: { lever: "grind", direction: "coarser" } },

  // AC 3: strength off with balance just right or unanswered: yield; milk drinks: dose, then milk.
  { name: "a bit too weak at 36 g: stop at 34 g", ac: 3, answers: { strength: -1 }, expect: { lever: "yield", direction: "less" }, values: { from: 36, to: 36 - YIELD_STEP_G } },
  { name: "much too strong at 36 g: 40 g", ac: 3, answers: { strength: 2 }, expect: { lever: "yield", direction: "more" }, values: { from: 36, to: 36 + 2 * YIELD_STEP_G } },
  { name: "weak with balance just right: yield", ac: 3, answers: { balance: 0, strength: -1 }, expect: { lever: "yield", direction: "less" } },
  { name: "lost in the milk: dose first", ac: 3, answers: { strength: -2 }, shot: { milkDrink: true, milkMl: 150 }, expect: { lever: "dose", direction: "more" }, values: { from: 18, to: 19 } },
  { name: "lost in the milk at the basket's top: about 30 ml less milk", ac: 3, answers: { strength: -1 }, shot: { milkDrink: true, milkMl: 150, dose: 19 }, expect: { lever: "milk", direction: "less" }, values: { from: 150, to: 150 - MILK_STEP_ML } },
  { name: "lost in the milk with an unknown basket: less milk", ac: 3, answers: { strength: -1 }, shot: { milkDrink: true, milkMl: 150 }, setup: { doseRange: null }, expect: { lever: "milk", direction: "less" } },
  { name: "overpowering: less dose", ac: 3, answers: { strength: 1 }, shot: { milkDrink: true, milkMl: 150 }, expect: { lever: "dose", direction: "less" }, values: { from: 18, to: 18 - DOSE_STEP_G } },
  { name: "overpowering at the basket's bottom: more milk", ac: 3, answers: { strength: 2 }, shot: { milkDrink: true, milkMl: 150, dose: 17 }, expect: { lever: "milk", direction: "more" }, values: { from: 150, to: 150 + 2 * MILK_STEP_ML } },
  { name: "milk drink never moves yield", ac: 3, answers: { strength: -1 }, shot: { milkDrink: true, milkMl: null, dose: 19 }, expect: null },
  { name: "strength beats body", ac: 3, answers: { strength: -1, body: -1 }, expect: { lever: "yield", direction: "less" } },

  // AC 4: body off: dose, only within the basket's range.
  { name: "a bit too thin at 18 g in 17-19 g: 18.5 g", ac: 4, answers: { body: -1 }, expect: { lever: "dose", direction: "more" }, values: { from: 18, to: 18.5 } },
  { name: "a bit too heavy at 18 g: 17.5 g", ac: 4, answers: { body: 1 }, expect: { lever: "dose", direction: "less" }, values: { from: 18, to: 17.5 } },
  { name: "much too thin at 18 g: 19 g", ac: 4, answers: { body: -2 }, expect: { lever: "dose", direction: "more" }, values: { from: 18, to: 19 } },
  { name: "much too thin at 18.5 g: clamped to 19 g", ac: 4, answers: { body: -2 }, shot: { dose: 18.5 }, expect: { lever: "dose", direction: "more" }, values: { from: 18.5, to: 19 } },
  { name: "thin at 19 g: dose skipped, nothing next", ac: 4, answers: { body: -1 }, shot: { dose: 19 }, expect: null },
  { name: "thin at 19 g with sour at the grind limit: next lever, temperature", ac: 4, answers: { body: -1, balance: -1 }, shot: { dose: 19, grind: 0 }, setup: { temperature: true }, expect: { lever: "temperature", direction: "more" } },
  { name: "heavy at 17 g: dose skipped", ac: 4, answers: { body: 1 }, shot: { dose: 17 }, expect: null },

  // AC 5: balance still off with grind at its limit: temperature, only where it can be set.
  { name: "sour at the finest grind: 1 °C hotter", ac: 5, answers: { balance: -1 }, shot: { grind: 0 }, setup: { temperature: true }, expect: { lever: "temperature", direction: "more" }, values: { from: 93, to: 93 + TEMPERATURE_STEP_C } },
  { name: "much too bitter at the coarsest: 2 °C cooler", ac: 5, answers: { balance: 2 }, shot: { grind: 30 }, setup: { temperature: true }, expect: { lever: "temperature", direction: "less" }, values: { from: 93, to: 93 - 2 * TEMPERATURE_STEP_C } },
  { name: "sour at the limit, temperature not settable: nothing", ac: 5, answers: { balance: -1 }, shot: { grind: 0 }, expect: null },
  { name: "sour at the limit, no temperature: strength next", ac: 5, answers: { balance: -1, strength: -1 }, shot: { grind: 0 }, expect: { lever: "yield", direction: "less" } },
  { name: "sour at the limit, no recorded temperature: hotter, no degrees", ac: 5, answers: { balance: -1 }, shot: { grind: 0, brewTempC: null }, setup: { temperature: true }, expect: { lever: "temperature", direction: "more" }, values: { from: null, to: null } },
  { name: "sour away from the limit on a settable machine: still grind", ac: 5, answers: { balance: -1 }, setup: { temperature: true }, expect: { lever: "grind", direction: "finer" } },
  { name: "grind went finer this period and still sour: temperature", ac: 5, answers: { balance: -1 }, shot: { grind: 13 }, previous: { grind: 15, balance: -2 }, setup: { temperature: true }, expect: { lever: "temperature", direction: "more" } },
  { name: "grind went finer and now bitter: grind back coarser", ac: 5, answers: { balance: 1 }, shot: { grind: 13 }, previous: { grind: 15, balance: -2 }, setup: { temperature: true }, expect: { lever: "grind", direction: "coarser" } },
  { name: "after a recalibration (no previous in the period): grind again", ac: 5, answers: { balance: -1 }, shot: { grind: 13 }, previous: null, setup: { temperature: true }, expect: { lever: "grind", direction: "finer" } },
  { name: "grind didn't help but temperature can't be set: grind again", ac: 5, answers: { balance: -1 }, shot: { grind: 13 }, previous: { grind: 15, balance: -1 }, expect: { lever: "grind", direction: "finer" } },
  { name: "grind unchanged since the last shot: grind", ac: 5, answers: { balance: -1 }, previous: { grind: 15, balance: -1 }, setup: { temperature: true }, expect: { lever: "grind", direction: "finer" } },

  // AC 6: "not sure" direction or dose range.
  { name: "unknown direction, sour: finer, no numbers", ac: 6, answers: { balance: -2 }, setup: { grind: UNKNOWN_DIRECTION }, expect: { lever: "grind", direction: "finer" }, values: { from: null, to: null } },
  { name: "unknown grinder scale, bitter: coarser, no numbers", ac: 6, answers: { balance: 1 }, setup: { grind: null }, expect: { lever: "grind", direction: "coarser" }, values: { from: null, to: null } },
  { name: "unknown scale type: words only", ac: 6, answers: { balance: -1 }, setup: { grind: { type: "unknown", min: 0, max: 30, step: 1, coarser: "higher" } }, expect: { lever: "grind", direction: "finer" }, values: { from: null, to: null } },
  { name: "unknown basket range, thin: dose never suggested", ac: 6, answers: { body: -1 }, setup: { doseRange: null }, expect: null },
  { name: "unknown basket range, thin and weak: yield, not dose", ac: 6, answers: { body: -1, strength: -1 }, setup: { doseRange: null }, expect: { lever: "yield", direction: "less" } },
  { name: "unknown basket range, thin, sour at the limit: temperature", ac: 6, answers: { body: -2, balance: -1 }, shot: { grind: 0 }, setup: { doseRange: null, temperature: true }, expect: { lever: "temperature", direction: "more" } },

  // No change.
  { name: "only rated", ac: 3, expect: null },
  { name: "all just right", ac: 3, answers: { balance: 0, strength: 0, body: 0, sweetness: 0 }, expect: null },
  { name: "not sweet enough alone: no lever", ac: 3, answers: { sweetness: -1 }, expect: null },
  { name: "little crema alone: freshness hint, no lever", ac: 3, tags: ["littleCrema"], expect: null },
];

describe("suggestion scenarios", () => {
  it("has at least 40 scenarios, and two per acceptance criterion", () => {
    expect(scenarios.length).toBeGreaterThanOrEqual(40);
    for (const ac of [1, 2, 3, 4, 5, 6]) expect(scenarios.filter((s) => s.ac === ac).length).toBeGreaterThanOrEqual(2);
  });

  it.each(scenarios.map((s) => [`AC ${s.ac}: ${s.name}`, s] as const))("%s", (_name, s) => {
    const { change } = suggest(build(s));
    if (!s.expect) {
      expect(change).toBeNull();
      return;
    }
    expect(change).toMatchObject(s.expect);
    if (s.values) expect(change).toMatchObject(s.values);
  });
});
