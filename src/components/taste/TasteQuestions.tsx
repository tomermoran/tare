"use client";

import { Button } from "@/components/ui/Button/Button";
import { JustRightScale, type JustRightLabels } from "@/components/ui/ChipGroup/JustRightScale";
import { TASTE_QUESTIONS, type TasteQuestion } from "@/domain/tastePhrase";

/*
 * The four just-right questions and "all just right" (STORY-01-05-02),
 * shared by SCR-TASTE, SH-OFF and edit mode. Props only. "All just right"
 * sets all four in one tap; each can still be changed (AC 4).
 */

export type TasteAnswerValues = Record<TasteQuestion, number | null>;

export type TasteQuestionsLabels = {
  allJustRight: string;
  rows: Record<TasteQuestion, JustRightLabels>;
};

export function TasteQuestions({
  labels,
  value,
  onChange,
}: {
  labels: TasteQuestionsLabels;
  value: TasteAnswerValues;
  onChange: (patch: Partial<TasteAnswerValues>) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Button
        variant="ghost"
        size="sm"
        className="-ms-4 self-start"
        onClick={() => onChange({ balance: 0, strength: 0, body: 0, sweetness: 0 })}
      >
        {labels.allJustRight}
      </Button>
      {TASTE_QUESTIONS.map((q) => (
        <JustRightScale
          key={q}
          labels={labels.rows[q]}
          oneSided={q === "sweetness"}
          value={value[q]}
          onChange={(v) => onChange({ [q]: v })}
        />
      ))}
    </div>
  );
}
