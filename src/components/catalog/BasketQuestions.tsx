"use client";

import type { ReactNode } from "react";
import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { Input } from "@/components/ui/Input/Input";
import { DOSE_PRESETS, type DoseAnswer } from "@/domain/capabilityQuestions";

/*
 * The basket's one question (STORY-01-06-01 AC 4, round-6 addendum): how
 * many grams it's made for. Three common ranges, "other" (two decimal
 * fields) and "not sure". Unanswered saves as not sure. Props only: the
 * range labels come formatted from the caller (Intl), never hand-joined.
 */

export type BasketQuestionLabels = {
  question: string;
  /** "14 to 16 g" for each preset, by preset id. */
  presets: Record<(typeof DOSE_PRESETS)[number]["id"], string>;
  other: string;
  notSure: string;
  min: string;
  max: string;
  /** The gram symbol, from Intl. */
  unit: string;
};

export function BasketQuestions({
  labels,
  answer,
  onChange,
}: {
  labels: BasketQuestionLabels;
  answer: DoseAnswer;
  onChange: (answer: DoseAnswer) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-body text-ink">
        {labels.question}
      </p>
      <ChipGroup
        label={labels.question}
        options={[
          ...DOSE_PRESETS.map((p) => ({ value: p.id, label: labels.presets[p.id] })),
          { value: "other", label: labels.other },
          { value: "notSure", label: labels.notSure },
        ]}
        value={answer.choice}
        onChange={(choice) =>
          onChange(
            choice === "other"
              ? { choice: "other", min: answer.choice === "other" ? answer.min : "", max: answer.choice === "other" ? answer.max : "" }
              : ({ choice } as DoseAnswer),
          )
        }
      />
      {answer.choice === "other" && (
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={labels.min}
            inputMode="decimal"
            unit={labels.unit}
            value={answer.min}
            onChange={(e) => onChange({ ...answer, min: e.target.value })}
          />
          <Input
            label={labels.max}
            inputMode="decimal"
            unit={labels.unit}
            value={answer.max}
            onChange={(e) => onChange({ ...answer, max: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}

/** The capabilities section around the questions: why they're asked, and that skipping is fine. */
export function CapabilitySection({
  title,
  why,
  children,
}: {
  title: string;
  why: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby="catalog-cap" className="flex flex-col gap-4 border-t border-line pt-6">
      <div className="flex flex-col gap-1">
        <h2 id="catalog-cap" className="text-h3 text-ink">
          {title}
        </h2>
        <p className="text-label text-ink-secondary">{why}</p>
      </div>
      {children}
    </section>
  );
}
