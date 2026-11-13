/**
 * What a catalog model can control, stored as JSON on canonical_hardware
 * (S-08). Each kind has its own keys: a machine's temperature and pressure,
 * a grinder's grind scale, a basket's dose range.
 *
 * "Not sure" exists only for household-added models: an unknown control, a
 * null gauge, null counts, units, bounds and steps, and an unknown grind type
 * or direction. Seeded rows never use it (pass `allowNotSure: false`).
 */

export type HardwareKind = "machine" | "grinder" | "basket";

type Num = number | null;

export type TemperatureControl =
  | { control: "none" }
  | { control: "steps"; count: Num }
  | { control: "exact"; unit: "C" | "F" | null; min: Num; max: Num; step: Num }
  | { control: "unknown" };

export type PressureControl =
  | { control: "none" | "manual"; gauge: boolean | null }
  | { control: "steps"; count: Num }
  | { control: "exact"; min: Num; max: Num; step: Num } // bar
  | { control: "unknown" };

export type GrindScale = {
  type: "stepped" | "stepless" | "unknown";
  min: Num;
  max: Num;
  step: Num;
  /** Which way the dial goes coarser, so "grind finer" points the right way. */
  coarser: "higher" | "lower" | "unknown";
};

export type MachineCapabilities = {
  temperature: TemperatureControl;
  pressure: PressureControl;
};
export type GrinderCapabilities = { grind: GrindScale };
/** Grams the basket is made for; it bounds dose suggestions. Null: not sure. */
export type BasketCapabilities = { dose: { min: number; max: number } | null };

export type Capabilities<K extends HardwareKind = HardwareKind> =
  K extends "machine"
    ? MachineCapabilities
    : K extends "grinder"
      ? GrinderCapabilities
      : BasketCapabilities;

type Options = { allowNotSure?: boolean };

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isPositive = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v > 0;

const isNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

function hasOnly(o: Record<string, unknown>, keys: string[]) {
  return Object.keys(o).every((k) => keys.includes(k));
}

/** A number where one is known, or null when "not sure" is allowed. */
function numberOrNotSure(v: unknown, notSure: boolean, positive = false) {
  if (v === null) return notSure;
  return positive ? isPositive(v) : isNumber(v);
}

function rangeOk(min: unknown, max: unknown) {
  return !isNumber(min) || !isNumber(max) || min <= max;
}

function isTemperature(v: unknown, notSure: boolean): v is TemperatureControl {
  if (!isObject(v)) return false;
  switch (v.control) {
    case "none":
      return hasOnly(v, ["control"]);
    case "steps":
      return (
        hasOnly(v, ["control", "count"]) &&
        (v.count === null
          ? notSure
          : Number.isInteger(v.count) && (v.count as number) >= 2)
      );
    case "exact":
      return (
        hasOnly(v, ["control", "unit", "min", "max", "step"]) &&
        (v.unit === "C" || v.unit === "F" || (v.unit === null && notSure)) &&
        numberOrNotSure(v.min, notSure) &&
        numberOrNotSure(v.max, notSure) &&
        numberOrNotSure(v.step, notSure, true) &&
        rangeOk(v.min, v.max)
      );
    case "unknown":
      return notSure && hasOnly(v, ["control"]);
    default:
      return false;
  }
}

function isPressure(v: unknown, notSure: boolean): v is PressureControl {
  if (!isObject(v)) return false;
  switch (v.control) {
    case "none":
    case "manual":
      return (
        hasOnly(v, ["control", "gauge"]) &&
        (typeof v.gauge === "boolean" || (v.gauge === null && notSure))
      );
    case "steps":
      return (
        hasOnly(v, ["control", "count"]) &&
        (v.count === null
          ? notSure
          : Number.isInteger(v.count) && (v.count as number) >= 2)
      );
    case "exact":
      return (
        hasOnly(v, ["control", "min", "max", "step"]) &&
        numberOrNotSure(v.min, notSure) &&
        numberOrNotSure(v.max, notSure) &&
        numberOrNotSure(v.step, notSure, true) &&
        rangeOk(v.min, v.max)
      );
    case "unknown":
      return notSure && hasOnly(v, ["control"]);
    default:
      return false;
  }
}

function isGrind(v: unknown, notSure: boolean): v is GrindScale {
  if (!isObject(v) || !hasOnly(v, ["type", "min", "max", "step", "coarser"])) {
    return false;
  }
  const typeOk =
    v.type === "stepped" ||
    v.type === "stepless" ||
    (v.type === "unknown" && notSure);
  const coarserOk =
    v.coarser === "higher" ||
    v.coarser === "lower" ||
    (v.coarser === "unknown" && notSure);
  return (
    typeOk &&
    coarserOk &&
    numberOrNotSure(v.min, notSure) &&
    numberOrNotSure(v.max, notSure) &&
    numberOrNotSure(v.step, notSure, true) &&
    rangeOk(v.min, v.max)
  );
}

function isDose(v: unknown): v is NonNullable<BasketCapabilities["dose"]> {
  return (
    isObject(v) &&
    hasOnly(v, ["min", "max"]) &&
    isPositive(v.min) &&
    isPositive(v.max) &&
    v.min <= v.max
  );
}

/**
 * Checks capabilities JSON against its kind. Returns the typed value, or null
 * when it's malformed or carries another kind's keys (a dose range on a
 * grinder, say).
 */
export function parseCapabilities<K extends HardwareKind>(
  kind: K,
  value: unknown,
  { allowNotSure = true }: Options = {},
): Capabilities<K> | null {
  if (!isObject(value)) return null;
  let ok: boolean;
  switch (kind) {
    case "machine":
      ok =
        hasOnly(value, ["temperature", "pressure"]) &&
        isTemperature(value.temperature, allowNotSure) &&
        isPressure(value.pressure, allowNotSure);
      break;
    case "grinder":
      ok = hasOnly(value, ["grind"]) && isGrind(value.grind, allowNotSure);
      break;
    case "basket":
      ok = hasOnly(value, ["dose"]) && (isDose(value.dose) || (value.dose === null && allowNotSure));
      break;
    default:
      ok = false;
  }
  return ok ? (value as Capabilities<K>) : null;
}

/** Every answer "not sure": what a household-added model starts as (AC 4). */
export function notSureCapabilities<K extends HardwareKind>(kind: K): Capabilities<K> {
  const all: { [k in HardwareKind]: Capabilities<k> } = {
    machine: { temperature: { control: "unknown" }, pressure: { control: "unknown" } },
    grinder: { grind: { type: "unknown", min: null, max: null, step: null, coarser: "unknown" } },
    basket: { dose: null },
  };
  return all[kind] as Capabilities<K>;
}
