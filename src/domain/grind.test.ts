import { describe, expect, it } from "vitest";
import { grindWheelConfig, middleGrind } from "./grind";

describe("grindWheelConfig", () => {
  it("uses a stepped grinder's own steps and range", () => {
    expect(grindWheelConfig({ type: "stepped", min: 1, max: 30, step: 1, coarser: "higher" })).toEqual({
      min: 1,
      max: 30,
      step: 1,
      majorEvery: 5,
      coarser: "higher",
    });
  });

  it("uses a stepless grinder's finest increment", () => {
    expect(grindWheelConfig({ type: "stepless", min: 0, max: 50, step: 0.5, coarser: "lower" })).toMatchObject({
      step: 0.5,
      majorEvery: 2,
      coarser: "lower",
    });
    expect(grindWheelConfig({ type: "stepless", min: 0, max: 10, step: 0.1, coarser: "higher" }).majorEvery).toBe(10);
  });

  it("falls back for anything not sure (DQ-11)", () => {
    expect(grindWheelConfig({ type: "unknown", min: null, max: null, step: null, coarser: "unknown" })).toEqual({
      min: 0,
      max: 100,
      step: 0.1,
      majorEvery: 10,
      coarser: null,
    });
    expect(grindWheelConfig({ type: "stepped", min: null, max: 40, step: null, coarser: "higher" })).toMatchObject({
      min: 0,
      max: 40,
      step: 1,
    });
    expect(grindWheelConfig(null)).toMatchObject({ min: 0, max: 100, step: 0.1, coarser: null });
  });

  it("ignores a range that doesn't make sense", () => {
    expect(grindWheelConfig({ type: "stepless", min: 120, max: null, step: 0.5, coarser: "higher" })).toMatchObject({ min: 0, max: 100 });
  });
});

describe("middleGrind", () => {
  it("lands on a step in the middle of the range", () => {
    expect(middleGrind({ min: 0, max: 50, step: 0.5 })).toBe(25);
    expect(middleGrind({ min: 1, max: 30, step: 1 })).toBe(16);
    expect(middleGrind({ min: 0, max: 100, step: 0.1 })).toBe(50);
    expect(middleGrind({ min: 0, max: 0.9, step: 0.1 })).toBe(0.5);
  });
});
