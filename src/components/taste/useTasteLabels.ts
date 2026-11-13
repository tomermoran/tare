"use client";

import { useTranslations } from "next-intl";
import { TASTE_TAGS, type TasteTag } from "@/domain/taste";
import type { TasteQuestion } from "@/domain/tastePhrase";
import type { TasteQuestionsLabels } from "./TasteQuestions";

const STEPS = { "-2": "muchLess", "-1": "less", "0": "right", "1": "more", "2": "muchMore" } as const;

/**
 * The words for the just-right rows and the tags. A milk drink's strength
 * reads "lost in the milk" to "overpowering" (STORY-01-05-02 AC 2).
 */
export function useTasteLabels(milkDrink: boolean): {
  questions: TasteQuestionsLabels;
  observed: string;
  tags: Record<TasteTag, string>;
} {
  const t = useTranslations("taste");
  const row = (q: TasteQuestion) => {
    const words = q === "strength" && milkDrink ? "strengthMilk" : q;
    const points = q === "sweetness" ? (["-2", "-1", "0"] as const) : (["-2", "-1", "0", "1", "2"] as const);
    return {
      label: t(`question.${q}`),
      justRight: t("justRight"),
      start: t(`ends.${words}.start`),
      end: q === "sweetness" ? undefined : t(`ends.${words as Exclude<typeof words, "sweetness">}.end`),
      names: Object.fromEntries(points.map((p) => [p, t(`${words}.${STEPS[p]}` as never)])),
    };
  };
  return {
    questions: {
      allJustRight: t("allJustRight"),
      rows: { balance: row("balance"), strength: row("strength"), body: row("body"), sweetness: row("sweetness") },
    },
    observed: t("observed"),
    tags: Object.fromEntries(TASTE_TAGS.map((tag) => [tag, t(`tags.${tag}`)])) as Record<TasteTag, string>,
  };
}
