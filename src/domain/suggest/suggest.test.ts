import { describe, expect, it } from "vitest";
import { NO_PREP } from "../prep";
import { PAST_PEAK_OPEN_DAYS, PAST_PEAK_ROASTED_DAYS, TIME_TOLERANCE_MS, VERY_FRESH_DAYS } from "./constants";
import { freshness } from "./freshness";
import { suggest, type SuggestInput } from "./index";
import { reasonParts, signals } from "./reason";

const input = (over: Partial<SuggestInput> = {}): SuggestInput => ({
  shot: { grind: 15, dose: 18, yield: 36, timeMs: 28_000, brewTempC: null, prep: NO_PREP, milkMl: null, milkDrink: false },
  answers: { balance: null, strength: null, body: null, sweetness: null },
  tags: [],
  recipe: { timeMs: 28_000 },
  setup: { grind: null, temperature: false, doseRange: null },
  clocks: { roasting: null, opened: null },
  ...over,
});
const roasted = (days: number) => ({ kind: "roasted" as const, days, frozenDays: 0 });

describe("suggest", () => {
  it("suggests nothing when only rated (AC 3)", () => {
    expect(suggest(input())).toEqual({ change: null, reason: [], freshness: null });
  });

  it("suggests nothing when every answer is just right (AC 3)", () => {
    expect(suggest(input({ answers: { balance: 0, strength: 0, body: 0, sweetness: 0 } })).change).toBeNull();
  });

  it("returns freshness alone, never as a change (AC 4)", () => {
    const s = suggest(input({ clocks: { roasting: roasted(VERY_FRESH_DAYS - 1), opened: null } }));
    expect(s).toEqual({ change: null, reason: [], freshness: "veryFresh" });
  });

  it("returns freshness beside an answer without making it the change (AC 4)", () => {
    const s = suggest(input({ answers: { balance: -1, strength: null, body: null, sweetness: null }, clocks: { roasting: roasted(PAST_PEAK_ROASTED_DAYS + 1), opened: null } }));
    expect(s.freshness).toBe("pastPeakRoasted");
    expect(s.change?.lever).not.toBe("freshness");
  });
});

describe("signals and reasons", () => {
  const sour = { balance: -2, strength: 0, body: null, sweetness: null };

  it("lists answers off just right, then tags", () => {
    expect(signals({ answers: sour, tags: ["channelling", "sourAndBitter"] })).toEqual([
      { kind: "answer", question: "balance", value: -2 },
      { kind: "tag", tag: "sourAndBitter" },
      { kind: "tag", tag: "channelling" },
    ]);
  });

  it("adds how the shot ran against its recipe, as a diagnostic", () => {
    const fast = input({ answers: sour, shot: { ...input().shot, timeMs: 28_000 - TIME_TOLERANCE_MS - 1 } });
    expect(reasonParts(fast).at(-1)).toEqual({ kind: "time", ran: "fast" });
    const close = input({ answers: sour, shot: { ...input().shot, timeMs: 28_000 + TIME_TOLERANCE_MS } });
    expect(reasonParts(close).some((p) => p.kind === "time")).toBe(false);
  });

  it("never gives time alone, or without a recipe", () => {
    expect(reasonParts(input({ shot: { ...input().shot, timeMs: 15_000 } }))).toEqual([]);
    expect(reasonParts(input({ answers: sour, recipe: null, shot: { ...input().shot, timeMs: 15_000 } })).some((p) => p.kind === "time")).toBe(false);
  });
});

describe("freshness", () => {
  it.each([
    ["very fresh", { roasting: roasted(VERY_FRESH_DAYS - 1), opened: null }, "veryFresh"],
    ["at the very fresh edge", { roasting: roasted(VERY_FRESH_DAYS), opened: null }, null],
    ["packed recently", { roasting: { kind: "packed" as const, days: 0, frozenDays: 0 }, opened: null }, "veryFresh"],
    ["past its peak since roast", { roasting: roasted(PAST_PEAK_ROASTED_DAYS + 1), opened: null }, "pastPeakRoasted"],
    ["at the roast edge", { roasting: roasted(PAST_PEAK_ROASTED_DAYS), opened: null }, null],
    ["open too long", { roasting: roasted(10), opened: { kind: "open" as const, days: PAST_PEAK_OPEN_DAYS + 1 } }, "pastPeakOpen"],
    ["paused in the freezer", { roasting: roasted(10), opened: { kind: "paused" as const } }, null],
    ["a best-before date only", { roasting: { kind: "bestBefore" as const, daysLeft: -100, frozenDays: 0 }, opened: null }, null],
    ["no clocks", { roasting: null, opened: null }, null],
  ] as const)("%s", (_label, clocks, expected) => {
    expect(freshness(clocks)).toBe(expected);
  });
});
