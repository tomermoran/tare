import { describe, expect, it } from "vitest";
import { notSureCapabilities } from "./capabilities";
import { doseBound, effectiveCapabilities, effectiveGrind, effectivePressure, effectiveTemperature, FALLBACKS, hasUnknowns } from "./capabilityFallbacks";
import { grindWheelConfig } from "./grind";

describe("DQ-11 fallbacks (STORY-01-06-08)", () => {
  it("gives no temperature tab when its control isn't known", () => {
    expect(effectiveTemperature({ control: "unknown" })).toEqual({ control: "none" });
  });

  it("offers five settings when the count isn't known", () => {
    expect(effectiveTemperature({ control: "steps", count: null })).toEqual({ control: "steps", count: 5 });
    expect(effectivePressure({ control: "steps", count: null })).toEqual({ control: "steps", count: 5 });
    expect(effectiveTemperature({ control: "steps", count: 3 })).toEqual({ control: "steps", count: 3 });
  });

  it("uses °C, 80 to 100 in halves, for an exact temperature it doesn't know", () => {
    expect(effectiveTemperature({ control: "exact", unit: null, min: null, max: null, step: null })).toEqual({
      control: "exact", unit: "C", min: 80, max: 100, step: 0.5,
    });
    expect(effectiveTemperature({ control: "exact", unit: "F", min: null, max: null, step: null })).toMatchObject(FALLBACKS.temperature.F);
    expect(effectiveTemperature({ control: "exact", unit: "C", min: 90, max: null, step: 1 })).toMatchObject({ min: 90, max: 100, step: 1 });
    expect(effectiveTemperature({ control: "exact", unit: "C", min: 101, max: null, step: null })).toMatchObject({ min: 80, max: 100 });
  });

  it("gives no pressure tab for unknown control or an unsure gauge", () => {
    expect(effectivePressure({ control: "unknown" })).toEqual({ control: "none", gauge: false });
    expect(effectivePressure({ control: "manual", gauge: null })).toEqual({ control: "manual", gauge: false });
    expect(effectivePressure({ control: "manual", gauge: true })).toEqual({ control: "manual", gauge: true });
  });

  it("uses 0 to 12 bar in halves for an exact pressure it doesn't know", () => {
    expect(effectivePressure({ control: "exact", min: null, max: null, step: null })).toEqual({ control: "exact", min: 0, max: 12, step: 0.5 });
  });

  it("treats an unknown grinder as smooth, 0 to 100, with no direction", () => {
    expect(effectiveGrind(notSureCapabilities("grinder").grind)).toEqual({ type: "stepless", min: 0, max: 100, step: 0.1, coarser: null });
    expect(effectiveGrind({ type: "stepped", min: null, max: null, step: null, coarser: "lower" })).toEqual({
      type: "stepped", min: 0, max: 100, step: 1, coarser: "lower",
    });
    expect(grindWheelConfig(null)).toMatchObject({ min: 0, max: 100, step: 0.1, coarser: null });
  });

  it("gives a fully unknown machine no tabs", () => {
    expect(effectiveCapabilities(notSureCapabilities("machine"))).toEqual({
      temperature: { control: "none" },
      pressure: { control: "none", gauge: false },
    });
    expect(effectiveCapabilities(null)).toEqual(effectiveCapabilities(notSureCapabilities("machine")));
  });

  it("gives no dose bound for an unknown basket range (AC 5)", () => {
    expect(doseBound(notSureCapabilities("basket"))).toBeNull();
    expect(doseBound(null)).toBeNull();
    expect(doseBound({ dose: { min: 17, max: 19 } })).toEqual({ min: 17, max: 19 });
  });

  it("knows when any part is not sure (AC 6)", () => {
    expect(hasUnknowns({ machine: notSureCapabilities("machine") })).toBe(true);
    expect(hasUnknowns({ basket: notSureCapabilities("basket") })).toBe(true);
    expect(hasUnknowns({ grinder: { type: "stepped", min: 0, max: 40, step: null, coarser: "higher" } })).toBe(true);
    expect(
      hasUnknowns({
        machine: { temperature: { control: "none" }, pressure: { control: "none", gauge: false } },
        grinder: { type: "stepless", min: 0, max: 10, step: null, coarser: "higher" },
        basket: { dose: { min: 17, max: 19 } },
      }),
    ).toBe(false);
  });
});
