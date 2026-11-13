/*
 * Just-right answers as short phrases (STORY-02-06-03 AC 2): each question is
 * stored as -2..2 with 0 "just right"; the message keys name the step, so
 * every language words them itself. Unanswered questions give nothing.
 */

export const TASTE_QUESTIONS = ["balance", "strength", "body", "sweetness"] as const;
export type TasteQuestion = (typeof TASTE_QUESTIONS)[number];

const STEPS = { "-2": "muchLess", "-1": "less", "0": "right", "1": "more", "2": "muchMore" } as const;
type Step = (typeof STEPS)[keyof typeof STEPS];

export type TastePhraseKey =
  | `taste.${Exclude<TasteQuestion, "sweetness">}.${Step}`
  | `taste.sweetness.${Exclude<Step, "more" | "muchMore">}`;

/** The message keys for the answered questions, in question order. */
export function tastePhraseKeys(answers: Record<TasteQuestion, number | null>): TastePhraseKey[] {
  const keys: TastePhraseKey[] = [];
  for (const q of TASTE_QUESTIONS) {
    const v = answers[q];
    if (v === null || !Number.isInteger(v) || v < -2 || v > 2) continue;
    // Sweetness only goes from "not sweet at all" to "just right".
    if (q === "sweetness" && v > 0) continue;
    keys.push(`taste.${q}.${STEPS[String(v) as keyof typeof STEPS]}` as TastePhraseKey);
  }
  return keys;
}
