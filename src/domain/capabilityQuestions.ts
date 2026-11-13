import type { BasketCapabilities, GrinderCapabilities, MachineCapabilities, PressureControl, TemperatureControl } from "./capabilities";

/*
 * Capability questions in the user's words (STORY-01-06-01 and 05 to 07,
 * SCR-CATALOG-ADD step 4) mapped to capabilities, and back again for
 * answering later. Every question has "not sure", and an unanswered one
 * saves as not sure. The mapping is lossless: a range read back gives the
 * same answer.
 */

/** The basket dose chips, in grams (round-6 addendum). */
export const DOSE_PRESETS = [
  { id: "14-16", min: 14, max: 16 },
  { id: "17-19", min: 17, max: 19 },
  { id: "20-22", min: 20, max: 22 },
] as const;

export type DosePreset = (typeof DOSE_PRESETS)[number]["id"];

export type DoseAnswer =
  | { choice: null }
  | { choice: "notSure" }
  | { choice: DosePreset }
  /** Typed as the user wrote them; empty means not sure. */
  | { choice: "other"; min: string; max: string };

/**
 * A decimal as typed, with either separator; null when empty or not a
 * positive number (or, with `allowZero`, zero: a dial can start at 0).
 */
export function parseDecimal(text: string, { allowZero = false }: { allowZero?: boolean } = {}): number | null {
  const t = text.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(t)) return null;
  const n = Number(t);
  return n > 0 || (allowZero && n === 0) ? n : null;
}

const text = (n: number | null) => (n === null ? "" : String(n));

/** Two typed bounds, low to high; each null when empty. */
function bounds(minText: string, maxText: string): { min: number | null; max: number | null } {
  const min = parseDecimal(minText, { allowZero: true });
  const max = parseDecimal(maxText, { allowZero: true });
  return min !== null && max !== null && min > max ? { min: max, max: min } : { min, max };
}

/** The answer as stored. "Other" needs both numbers, low to high; otherwise not sure. */
export function doseFromAnswer(answer: DoseAnswer): BasketCapabilities["dose"] {
  if (answer.choice === null || answer.choice === "notSure") return null;
  if (answer.choice === "other") {
    const min = parseDecimal(answer.min);
    const max = parseDecimal(answer.max);
    if (min === null || max === null) return null;
    return min <= max ? { min, max } : { min: max, max: min };
  }
  const preset = DOSE_PRESETS.find((p) => p.id === answer.choice)!;
  return { min: preset.min, max: preset.max };
}

/** The answer a stored range reads back as, for answering later. */
export function answerFromDose(dose: BasketCapabilities["dose"]): DoseAnswer {
  if (!dose) return { choice: "notSure" };
  const preset = DOSE_PRESETS.find((p) => p.min === dose.min && p.max === dose.max);
  if (preset) return { choice: preset.id };
  return { choice: "other", min: String(dose.min), max: String(dose.max) };
}

/*
 * The machine's two questions (STORY-01-06-06, SCR-CATALOG-ADD step 4):
 * can you set the brew temperature, and can you set or read the pressure.
 * Follow-ups only for the answer that needs them. "No" for pressure means
 * it can't be read either, so no gauge; a lever, paddle or valve asks about
 * the gauge.
 */

/** Settings counts offered as chips. */
export const SETTING_COUNTS = [2, 3, 4, 5] as const;

type Count = number | "notSure" | null;

export type TemperatureAnswer = {
  choice: "none" | "steps" | "exact" | "notSure" | null;
  count: Count;
  unit: "C" | "F" | "notSure" | null;
  min: string;
  max: string;
};

export type PressureAnswer = {
  choice: "none" | "manual" | "steps" | "exact" | "notSure" | null;
  gauge: "yes" | "no" | "notSure" | null;
  count: Count;
  min: string;
  max: string;
};

export type MachineAnswers = { temperature: TemperatureAnswer; pressure: PressureAnswer };

export const emptyMachineAnswers = (): MachineAnswers => ({
  temperature: { choice: null, count: null, unit: null, min: "", max: "" },
  pressure: { choice: null, gauge: null, count: null, min: "", max: "" },
});

const countOf = (c: Count) => (typeof c === "number" ? c : null);
const countAnswer = (n: number | null): Count => (n === null ? "notSure" : n);

export function temperatureFromAnswer(a: TemperatureAnswer): TemperatureControl {
  switch (a.choice) {
    case "none":
      return { control: "none" };
    case "steps":
      return { control: "steps", count: countOf(a.count) };
    case "exact":
      return { control: "exact", unit: a.unit === "C" || a.unit === "F" ? a.unit : null, ...bounds(a.min, a.max), step: null };
    default:
      return { control: "unknown" };
  }
}

export function pressureFromAnswer(a: PressureAnswer): PressureControl {
  switch (a.choice) {
    case "none":
      return { control: "none", gauge: false };
    case "manual":
      return { control: "manual", gauge: a.gauge === "yes" ? true : a.gauge === "no" ? false : null };
    case "steps":
      return { control: "steps", count: countOf(a.count) };
    case "exact":
      return { control: "exact", ...bounds(a.min, a.max), step: null };
    default:
      return { control: "unknown" };
  }
}

export function machineFromAnswers(a: MachineAnswers): MachineCapabilities {
  return { temperature: temperatureFromAnswer(a.temperature), pressure: pressureFromAnswer(a.pressure) };
}

/** The answers stored capabilities read back as, for answering later. */
export function answersFromMachine(c: MachineCapabilities): MachineAnswers {
  const answers = emptyMachineAnswers();
  const t = c.temperature;
  if (t.control === "unknown") answers.temperature.choice = "notSure";
  else if (t.control === "none") answers.temperature.choice = "none";
  else if (t.control === "steps") Object.assign(answers.temperature, { choice: "steps", count: countAnswer(t.count) });
  else Object.assign(answers.temperature, { choice: "exact", unit: t.unit ?? "notSure", min: text(t.min), max: text(t.max) });

  const p = c.pressure;
  if (p.control === "unknown") answers.pressure.choice = "notSure";
  // A gauge without control isn't a question the user is asked; it only
  // comes from seeded rows, which are never edited.
  else if (p.control === "none") answers.pressure.choice = "none";
  else if (p.control === "manual") {
    Object.assign(answers.pressure, { choice: "manual", gauge: p.gauge === null ? "notSure" : p.gauge ? "yes" : "no" });
  } else if (p.control === "steps") Object.assign(answers.pressure, { choice: "steps", count: countAnswer(p.count) });
  else if (p.control === "exact") Object.assign(answers.pressure, { choice: "exact", min: text(p.min), max: text(p.max) });
  return answers;
}

/*
 * The grinder's questions (STORY-01-06-07): does the dial click, its lowest
 * and highest numbers, the smallest change (clicks only), and which way is
 * coarser.
 */

export type GrinderAnswers = {
  dial: "stepped" | "stepless" | "notSure" | null;
  min: string;
  max: string;
  step: string;
  coarser: "higher" | "lower" | "notSure" | null;
};

export const emptyGrinderAnswers = (): GrinderAnswers => ({ dial: null, min: "", max: "", step: "", coarser: null });

export function grinderFromAnswers(a: GrinderAnswers): GrinderCapabilities {
  return {
    grind: {
      type: a.dial === "stepped" || a.dial === "stepless" ? a.dial : "unknown",
      ...bounds(a.min, a.max),
      step: a.dial === "stepped" ? parseDecimal(a.step) : null,
      coarser: a.coarser === "higher" || a.coarser === "lower" ? a.coarser : "unknown",
    },
  };
}

export function answersFromGrinder({ grind }: GrinderCapabilities): GrinderAnswers {
  return {
    dial: grind.type === "unknown" ? "notSure" : grind.type,
    min: text(grind.min),
    max: text(grind.max),
    step: grind.type === "stepped" ? text(grind.step) : "",
    coarser: grind.coarser === "unknown" ? "notSure" : grind.coarser,
  };
}
