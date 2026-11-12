import { describe, expect, it } from "vitest";
import { parseCapabilities } from "./capabilities";

const bambino = {
  temperature: { control: "none" },
  pressure: { control: "none", gauge: false },
};
const nicheZero = {
  grind: { type: "stepless", min: 0, max: 50, step: 0.5, coarser: "higher" },
};
const doubleBasket = { dose: { min: 16, max: 18 } };

describe("parseCapabilities", () => {
  it.each([
    ["machine", bambino],
    ["machine", { temperature: { control: "steps", count: 3 }, pressure: { control: "manual", gauge: true } }],
    ["machine", { temperature: { control: "exact", unit: "C", min: 85, max: 96, step: 1 }, pressure: { control: "exact", min: 3, max: 12, step: 0.5 } }],
    ["machine", { temperature: { control: "exact", unit: "F", min: 190, max: 205, step: 1 }, pressure: { control: "steps", count: 2 } }],
    ["grinder", nicheZero],
    ["grinder", { grind: { type: "stepped", min: 1, max: 30, step: 1, coarser: "lower" } }],
    ["basket", doubleBasket],
  ] as const)("accepts a known %s shape", (kind, value) => {
    expect(parseCapabilities(kind, value, { allowNotSure: false })).toEqual(value);
  });

  it.each([
    ["machine", { temperature: { control: "unknown" }, pressure: { control: "manual", gauge: null } }],
    ["machine", { temperature: { control: "exact", unit: null, min: null, max: null, step: null }, pressure: { control: "steps", count: null } }],
    ["grinder", { grind: { type: "unknown", min: null, max: null, step: null, coarser: "unknown" } }],
  ] as const)("accepts a 'not sure' %s shape for household additions", (kind, value) => {
    expect(parseCapabilities(kind, value)).toEqual(value);
    expect(parseCapabilities(kind, value, { allowNotSure: false })).toBeNull();
  });

  it.each([
    ["a dose range on a grinder", "grinder", { ...nicheZero, ...doubleBasket }],
    ["a grind scale on a basket", "basket", { ...doubleBasket, ...nicheZero }],
    ["temperature on a grinder", "grinder", { ...nicheZero, temperature: { control: "none" } }],
    ["a machine without pressure", "machine", { temperature: { control: "none" } }],
    ["an unknown control", "machine", { ...bambino, temperature: { control: "dial" } }],
    ["a step of zero", "grinder", { grind: { ...nicheZero.grind, step: 0 } }],
    ["min above max", "grinder", { grind: { ...nicheZero.grind, min: 50, max: 0 } }],
    ["a dose range upside down", "basket", { dose: { min: 18, max: 16 } }],
    ["a dose without bounds", "basket", { dose: { min: null, max: null } }],
    ["a one-step dial", "machine", { ...bambino, temperature: { control: "steps", count: 1 } }],
    ["a string number", "basket", { dose: { min: "16", max: 18 } }],
    ["an extra key", "machine", { ...bambino, temperature: { control: "none", count: 2 } }],
    ["not an object", "basket", "16-18"],
    ["null", "machine", null],
  ] as const)("rejects %s", (_label, kind, value) => {
    expect(parseCapabilities(kind, value)).toBeNull();
  });
});
