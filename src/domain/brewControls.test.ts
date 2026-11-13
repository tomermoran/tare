import { describe, expect, it } from "vitest";
import { celsiusToFahrenheit, fahrenheitToCelsius } from "@/lib/units";
import { notSureCapabilities, type MachineCapabilities } from "./capabilities";
import { addStart, brewTabs, brewToDial, brewToStored, InvalidBrewControlsError, NO_BREW_VALUES, validateBrewControls } from "./brewControls";

const machine = (temperature: MachineCapabilities["temperature"], pressure: MachineCapabilities["pressure"]): MachineCapabilities => ({ temperature, pressure });
const fixed = machine({ control: "none" }, { control: "none", gauge: false });
const steps = machine({ control: "steps", count: 3 }, { control: "steps", count: 4 });
const exactC = machine({ control: "exact", unit: "C", min: 86, max: 96, step: 0.5 }, { control: "exact", min: 0, max: 12, step: 0.5 });
const exactF = machine({ control: "exact", unit: "F", min: 186, max: 205, step: 1 }, { control: "none", gauge: false });
const lever = (gauge: boolean | null) => machine({ control: "none" }, { control: "manual", gauge });

describe("brewTabs", () => {
  it("shows no tabs for fixed temperature and pressure (AC 1)", () => {
    expect(brewTabs(fixed)).toEqual({ temperature: null, pressure: null });
    expect(brewTabs(null)).toEqual({ temperature: null, pressure: null });
  });

  it("offers steps as steps and exact values as a wheel (AC 3, AC 4)", () => {
    expect(brewTabs(steps)).toEqual({ temperature: { kind: "steps", count: 3 }, pressure: { kind: "steps", count: 4 } });
    expect(brewTabs(exactC)).toEqual({
      temperature: { kind: "wheel", min: 86, max: 96, step: 0.5, unit: "celsius" },
      pressure: { kind: "wheel", min: 0, max: 12, step: 0.5, unit: "bar" },
    });
    expect(brewTabs(exactF).temperature).toEqual({ kind: "wheel", min: 186, max: 205, step: 1, unit: "fahrenheit" });
  });

  it("asks for peak pressure only on a lever with a gauge (STORY-01-04-02 AC 1, AC 5)", () => {
    expect(brewTabs(lever(true)).pressure).toMatchObject({ kind: "wheel", unit: "bar", peak: true });
    expect(brewTabs(lever(false)).pressure).toBeNull();
    expect(brewTabs(lever(null)).pressure).toBeNull();
  });

  it("follows DQ-11 for a machine that's not sure", () => {
    expect(brewTabs(notSureCapabilities("machine"))).toEqual({ temperature: null, pressure: null });
    expect(brewTabs(machine({ control: "steps", count: null }, { control: "exact", min: null, max: null, step: null }))).toEqual({
      temperature: { kind: "steps", count: 5 },
      pressure: { kind: "wheel", min: 0, max: 12, step: 0.5, unit: "bar" },
    });
  });
});

describe("validateBrewControls", () => {
  const ok = (m: MachineCapabilities, v: Partial<typeof NO_BREW_VALUES>) => () => validateBrewControls(m, { ...NO_BREW_VALUES, ...v });
  const bad = (m: MachineCapabilities, v: Partial<typeof NO_BREW_VALUES>) => expect(ok(m, v)).toThrow(InvalidBrewControlsError);

  it("allows unset on any machine", () => {
    for (const m of [fixed, steps, exactC, exactF, lever(true)]) expect(ok(m, {})).not.toThrow();
  });

  it("accepts a step in 1..n and an exact value in range", () => {
    expect(ok(steps, { brewTempStep: 3, pressureStep: 1 })).not.toThrow();
    expect(ok(exactC, { brewTempC: 93.5, pressureBar: 9 })).not.toThrow();
    expect(ok(exactF, { brewTempC: fahrenheitToCelsius(205) })).not.toThrow();
    expect(ok(lever(true), { pressureBar: 8.5 })).not.toThrow();
  });

  it("rejects a step on an exact machine, a number on a stepped one, and both columns", () => {
    bad(exactC, { brewTempStep: 2 });
    bad(steps, { brewTempC: 93 });
    bad(exactC, { brewTempC: 93, brewTempStep: 1 });
    bad(steps, { pressureBar: 9 });
  });

  it("rejects out of range values and steps", () => {
    bad(exactC, { brewTempC: 99 });
    bad(exactC, { pressureBar: 13 });
    bad(steps, { brewTempStep: 4 });
    bad(steps, { pressureStep: 0 });
    bad(steps, { pressureStep: 1.5 });
    bad(exactF, { brewTempC: fahrenheitToCelsius(206) });
  });

  it("rejects a value for a control the machine doesn't have", () => {
    bad(fixed, { brewTempC: 93 });
    bad(lever(false), { pressureBar: 9 });
  });
});

describe("Fahrenheit is display only (AC 5, risk R-08)", () => {
  it("round-trips every whole °F from 180 to 212", () => {
    for (let f = 180; f <= 212; f++) expect(celsiusToFahrenheit(fahrenheitToCelsius(f), 1)).toBe(f);
  });

  it("snaps to the machine's step", () => {
    expect(celsiusToFahrenheit(93, 1)).toBe(199);
    expect(celsiusToFahrenheit(93, 0.5)).toBe(199.5);
  });
});

describe("addStart", () => {
  it("starts at the last used value when it fits, else the middle", () => {
    expect(addStart({ kind: "steps", count: 3 }, 3)).toBe(3);
    expect(addStart({ kind: "steps", count: 3 }, null)).toBe(2);
    expect(addStart({ kind: "wheel", min: 86, max: 96, step: 0.5, unit: "celsius" }, 93)).toBe(93);
    expect(addStart({ kind: "wheel", min: 86, max: 96, step: 0.5, unit: "celsius" }, 120)).toBe(91);
  });
});

describe("dial and stored values", () => {
  it("stores steps as steps and °F as °C (AC 3, AC 5)", () => {
    expect(brewToStored(brewTabs(steps), { temperature: 2, pressure: 4 })).toEqual({ ...NO_BREW_VALUES, brewTempStep: 2, pressureStep: 4 });
    expect(brewToStored(brewTabs(exactF), { temperature: 200, pressure: null })).toEqual({ ...NO_BREW_VALUES, brewTempC: fahrenheitToCelsius(200) });
    expect(brewToStored(brewTabs(fixed), { temperature: 93, pressure: 9 })).toEqual(NO_BREW_VALUES);
  });

  it("reads stored values back for prefilled modes, unset when they don't fit (AC 6)", () => {
    expect(brewToDial(brewTabs(exactF), { ...NO_BREW_VALUES, brewTempC: fahrenheitToCelsius(200) })).toEqual({ temperature: 200, pressure: null });
    expect(brewToDial(brewTabs(exactC), { ...NO_BREW_VALUES, brewTempC: 93, pressureBar: 9 })).toEqual({ temperature: 93, pressure: 9 });
    expect(brewToDial(brewTabs(steps), { ...NO_BREW_VALUES, brewTempC: 93 })).toEqual({ temperature: null, pressure: null });
  });
});
