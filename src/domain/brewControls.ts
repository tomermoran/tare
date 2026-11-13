import { celsiusToFahrenheit, fahrenheitToCelsius } from "@/lib/units";
import type { MachineCapabilities } from "./capabilities";
import { effectivePressure, effectiveTemperature, FALLBACKS } from "./capabilityFallbacks";

/*
 * Temperature and pressure in the shot log (EPIC-01-04), from the setup
 * machine's capabilities, after DQ-11's fallbacks for "not sure". A tab is
 * shown only when the machine can set (or, for pressure, read) the value.
 * Steps are recorded as the step, never degrees or bar; exact values in
 * °C (shown in °F when the machine does) and bar; a lever with a gauge
 * records the peak it read.
 */

export type BrewTab =
  | { kind: "steps"; count: number }
  | { kind: "wheel"; min: number; max: number; step: number; unit: "celsius" | "fahrenheit" | "bar"; peak?: boolean };

export type BrewTabs = { temperature: BrewTab | null; pressure: BrewTab | null };

/** What a shot stores: at most one of each pair, all optional. */
export type BrewValues = {
  brewTempC: number | null;
  brewTempStep: number | null;
  pressureBar: number | null;
  pressureStep: number | null;
};

export const NO_BREW_VALUES: BrewValues = { brewTempC: null, brewTempStep: null, pressureBar: null, pressureStep: null };

export function brewTabs(machine: MachineCapabilities | null | undefined): BrewTabs {
  if (!machine) return { temperature: null, pressure: null };
  const t = effectiveTemperature(machine.temperature);
  const p = effectivePressure(machine.pressure);
  return {
    temperature:
      t.control === "steps"
        ? { kind: "steps", count: t.count }
        : t.control === "exact"
          ? { kind: "wheel", min: t.min, max: t.max, step: t.step, unit: t.unit === "F" ? "fahrenheit" : "celsius" }
          : null,
    pressure:
      p.control === "steps"
        ? { kind: "steps", count: p.count }
        : p.control === "exact"
          ? { kind: "wheel", min: p.min, max: p.max, step: p.step, unit: "bar" }
          : p.control === "manual" && p.gauge
            ? { kind: "wheel", ...FALLBACKS.pressure, unit: "bar", peak: true }
            : null,
  };
}

/** Why a shot's brew values don't fit its machine; nothing is saved. */
export class InvalidBrewControlsError extends Error {
  constructor(readonly field: "temperature" | "pressure") {
    super(`Invalid ${field}`);
    this.name = "InvalidBrewControlsError";
  }
}

const EPSILON = 1e-6;
const isStep = (v: number, count: number) => Number.isInteger(v) && v >= 1 && v <= count;

/** A wheel's range in stored units (°C or bar). */
function storedRange(tab: Extract<BrewTab, { kind: "wheel" }>) {
  if (tab.unit !== "fahrenheit") return { min: tab.min, max: tab.max };
  const c = (f: number) => ((f - 32) * 5) / 9;
  return { min: c(tab.min), max: c(tab.max) };
}

function checkPair(field: "temperature" | "pressure", tab: BrewTab | null, value: number | null, step: number | null) {
  if (value === null && step === null) return; // Unset is always fine.
  if (value !== null && step !== null) throw new InvalidBrewControlsError(field);
  if (!tab) throw new InvalidBrewControlsError(field);
  if (tab.kind === "steps") {
    if (step === null || !isStep(step, tab.count)) throw new InvalidBrewControlsError(field);
    return;
  }
  if (value === null || !Number.isFinite(value)) throw new InvalidBrewControlsError(field);
  const { min, max } = storedRange(tab);
  if (value < min - EPSILON || value > max + EPSILON) throw new InvalidBrewControlsError(field);
}

/**
 * Checks a shot's temperature and pressure against its machine
 * (TASK-01-04-01-BE1, 01-04-02-BE1): one of each pair, the column the
 * capability uses, steps in 1..n, exact values in range.
 */
export function validateBrewControls(machine: MachineCapabilities | null | undefined, values: BrewValues): void {
  const tabs = brewTabs(machine);
  checkPair("temperature", tabs.temperature, values.brewTempC, values.brewTempStep);
  checkPair("pressure", tabs.pressure, values.pressureBar, values.pressureStep);
}

/** The value a tab starts at when added: the last used one if it fits, else the middle. */
export function addStart(tab: BrewTab, last: number | null): number {
  if (tab.kind === "steps") return last !== null && isStep(last, tab.count) ? last : Math.ceil(tab.count / 2);
  if (last !== null && last >= tab.min && last <= tab.max) return last;
  const steps = Math.round((tab.max - tab.min) / 2 / tab.step);
  return Number((tab.min + steps * tab.step).toFixed(6));
}

/** The two optional dial values, in the tab's own terms: a step, °C or °F, or bar. */
export type BrewDial = { temperature: number | null; pressure: number | null };

const toC = (tab: BrewTab, v: number) => (tab.kind === "wheel" && tab.unit === "fahrenheit" ? fahrenheitToCelsius(v) : v);
const fromC = (tab: Extract<BrewTab, { kind: "wheel" }>, c: number) =>
  tab.unit === "fahrenheit" ? celsiusToFahrenheit(c, tab.step) : c;

/** Dial values to what a shot stores; anything without a tab is dropped. */
export function brewToStored(tabs: BrewTabs, dial: BrewDial): BrewValues {
  const t = tabs.temperature;
  const p = tabs.pressure;
  return {
    brewTempC: t?.kind === "wheel" && dial.temperature !== null ? toC(t, dial.temperature) : null,
    brewTempStep: t?.kind === "steps" ? dial.temperature : null,
    pressureBar: p?.kind === "wheel" ? dial.pressure : null,
    pressureStep: p?.kind === "steps" ? dial.pressure : null,
  };
}

/** Stored values (a recipe's, a shot's) as dial values for these tabs; a mismatch starts unset. */
export function brewToDial(tabs: BrewTabs, stored: BrewValues): BrewDial {
  const t = tabs.temperature;
  const p = tabs.pressure;
  return {
    temperature:
      t?.kind === "steps" ? stored.brewTempStep : t?.kind === "wheel" && stored.brewTempC !== null ? fromC(t, stored.brewTempC) : null,
    pressure: p?.kind === "steps" ? stored.pressureStep : p?.kind === "wheel" ? stored.pressureBar : null,
  };
}
