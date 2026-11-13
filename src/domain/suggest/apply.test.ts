import { describe, expect, it } from "vitest";
import { NO_PREP } from "../prep";
import { applyChange, type StartValues } from "./apply";

const start: StartValues = {
  grind: 15,
  dose: 18,
  yield: 36,
  timeMs: 28_000,
  brew: { brewTempC: 93, brewTempStep: null, pressureBar: null, pressureStep: null },
  prep: NO_PREP,
  milkMl: 150,
};

describe("applyChange", () => {
  it("leaves the values alone with no change", () => {
    expect(applyChange(start, null)).toBe(start);
  });

  it.each([
    [{ lever: "grind", direction: "finer", steps: 2, from: 15, to: 13 }, { grind: 13 }],
    [{ lever: "yield", direction: "less", from: 36, to: 34 }, { yield: 34 }],
    [{ lever: "dose", direction: "more", from: 18, to: 18.5 }, { dose: 18.5 }],
    [{ lever: "milk", direction: "less", from: 150, to: 120 }, { milkMl: 120 }],
    [{ lever: "prep", tool: "wdt" }, { prep: { wdt: true, puckScreen: false } }],
    [{ lever: "prep", tool: "puckScreen" }, { prep: { wdt: false, puckScreen: true } }],
    [{ lever: "temperature", direction: "more", from: 93, to: 94 }, { brew: { ...start.brew, brewTempC: 94 } }],
  ] as const)("applies %o", (change, expected) => {
    expect(applyChange(start, change)).toEqual({ ...start, ...expected });
  });

  it("changes nothing for a change without numbers", () => {
    expect(applyChange(start, { lever: "grind", direction: "finer", steps: 2, from: null, to: null })).toEqual(start);
    expect(applyChange(start, { lever: "temperature", direction: "more", from: null, to: null })).toEqual(start);
    expect(applyChange(start, { lever: "prep", tool: "checkDistribution" })).toEqual(start);
  });

  it("moves temperature from the starting value when the change came from another shot", () => {
    expect(applyChange({ ...start, brew: { ...start.brew, brewTempC: 92 } }, { lever: "temperature", direction: "less", from: 93, to: 91 }).brew.brewTempC).toBe(90);
  });
});
