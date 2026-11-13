import type { BasketCapabilities } from "./capabilities";

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

/** A decimal as typed, with either separator; null when empty or not a positive number. */
export function parseDecimal(text: string): number | null {
  const t = text.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(t)) return null;
  const n = Number(t);
  return n > 0 ? n : null;
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
