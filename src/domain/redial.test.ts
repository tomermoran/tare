import { describe, expect, it } from "vitest";
import { proposeShift } from "./offset";
import { pinnedBefore, redialState } from "./redial";
import { applyServicing } from "./servicing";

const event = (over: Partial<Parameters<typeof redialState>[0]> = {}) => ({ isGrinder: true, isRecalibration: true, grindShift: null, grindScale: null, ...over });

describe("redialState (TD-7)", () => {
  it("awaits a re-dial with a recipe before a recalibrating grinder event", () => {
    expect(redialState(event(), true)).toBe("awaiting");
  });
  it("has nothing to map with no recipe before", () => {
    expect(redialState(event(), false)).toBe("nothingToMap");
  });
  it("is not a recalibration for a clean, a repair, or a machine or basket event (AC 4)", () => {
    expect(redialState(event({ isRecalibration: false }), true)).toBe("notRecalibration");
    expect(redialState(event({ isGrinder: false }), true)).toBe("notRecalibration");
  });
  it("is confirmed with a shift, and no adjustment with a zero one", () => {
    expect(redialState(event({ grindShift: -3, grindScale: 1 }), true)).toBe("confirmed");
    expect(redialState(event({ grindShift: 0, grindScale: 1 }), true)).toBe("noAdjustment");
    expect(redialState(event({ grindShift: 0, grindScale: 1.1 }), true)).toBe("confirmed");
  });
  it("counts a pin earlier today as before an event logged today (STORY-04-03-01 AC 5)", () => {
    expect(pinnedBefore(new Date("2026-03-01T07:00Z"), new Date("2026-03-01T09:00Z"))).toBe(true);
    expect(pinnedBefore(new Date("2026-03-01T09:00Z"), new Date("2026-03-01T09:00Z"))).toBe(false);
  });
});

describe("applyServicing (TD-5)", () => {
  const ev = (id: string, day: number, grindShift: number | null, grindScale: number | null = 1) => ({ id, at: new Date(Date.UTC(2026, 2, day)), grindShift, grindScale });
  const pinned = new Date(Date.UTC(2026, 2, 5));

  it("applies each confirmed event after the pin in date order (AC 4)", () => {
    const r = applyServicing(15, pinned, [ev("b", 20, 2), ev("a", 10, -3)]);
    expect(r.grind).toBe(14);
    expect(r.steps.map((s) => [s.eventId, s.from, s.to])).toEqual([["a", 15, 12], ["b", 12, 14]]);
  });
  it("ignores events before the pin, unconfirmed ones and zero shifts (AC 3)", () => {
    const r = applyServicing(15, pinned, [ev("old", 1, -3), ev("open", 10, null, null), ev("zero", 12, 0)]);
    expect(r).toEqual({ grind: 15, steps: [] });
  });
  it("slots a back-dated event into its date place (AC 5)", () => {
    const later = applyServicing(10, pinned, [ev("x", 20, 1)]);
    const backDated = applyServicing(10, pinned, [ev("x", 20, 1), ev("y", 8, 0, 2)]);
    expect(later.grind).toBe(11);
    expect(backDated.grind).toBe(21);
  });
});

describe("proposeShift (STORY-04-03-01)", () => {
  const wheel = { step: 0.5, coarser: "higher" as const };
  it("is the new grind minus the old, in words when the direction is known (AC 1, AC 3)", () => {
    expect(proposeShift({ oldGrind: 15, newGrind: 13.5, ageChange: null, wheel })).toEqual({ shift: -1.5, ageTakenOff: null, words: { steps: 3, direction: "finer" } });
  });
  it("takes the ageing change off first and says so (AC 2)", () => {
    expect(proposeShift({ oldGrind: 15, newGrind: 13, ageChange: -0.4, wheel })).toMatchObject({ shift: -1.5, ageTakenOff: -0.5 });
  });
  it("gives no words without a direction, or for a zero shift", () => {
    expect(proposeShift({ oldGrind: 15, newGrind: 17, ageChange: null, wheel: { step: 1, coarser: null } }).words).toBeNull();
    expect(proposeShift({ oldGrind: 15, newGrind: 15, ageChange: null, wheel })).toEqual({ shift: 0, ageTakenOff: null, words: null });
  });
});
