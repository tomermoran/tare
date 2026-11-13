"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useMemo } from "react";
import { suggest, type Answers, type SuggestInput } from "@/domain/suggest";
import type { TasteTag } from "@/domain/taste";
import { suggestionWords, type SuggestionWords } from "@/lib/suggestionWords";

export type SuggestContextInput = Omit<SuggestInput, "answers" | "tags">;

/**
 * The suggestion, worked out on the device on every answer or tag change
 * (STORY-02-03-05 AC 6), in words for SuggestionCard. Null with nothing to
 * say. Nothing is fetched or stored.
 */
export function useLiveSuggestion(context: SuggestContextInput | undefined, answers: Answers, tags: TasteTag[]): SuggestionWords | null {
  const t = useTranslations();
  const format = useFormatter();
  const { balance, strength, body, sweetness } = answers;
  return useMemo(() => {
    if (!context) return null;
    const s = suggest({ ...context, answers: { balance, strength, body, sweetness }, tags });
    return suggestionWords(s, { milkDrink: context.shot.milkDrink, clocks: context.clocks }, t, format);
  }, [context, balance, strength, body, sweetness, tags, t, format]);
}
