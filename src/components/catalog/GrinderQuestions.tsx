"use client";

import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { Input } from "@/components/ui/Input/Input";
import type { GrinderAnswers } from "@/domain/capabilityQuestions";

/*
 * The grinder's capability questions (STORY-01-06-07): does the dial click,
 * its lowest and highest numbers, the smallest change (only for a dial
 * that clicks), and which way is coarser. Each choice has "not sure";
 * empty numbers save as not sure. Props only.
 */

export type GrinderQuestionLabels = {
  notSure: string;
  dialQ: string;
  clicks: string;
  smooth: string;
  rangeQ: string;
  lowest: string;
  highest: string;
  rangeHint: string;
  stepQ: string;
  coarserQ: string;
  higher: string;
  lower: string;
};

const NOT_SURE = "notSure";

export function GrinderQuestions({
  labels,
  answers,
  onChange,
}: {
  labels: GrinderQuestionLabels;
  answers: GrinderAnswers;
  onChange: (answers: GrinderAnswers) => void;
}) {
  const set = (patch: Partial<GrinderAnswers>) => onChange({ ...answers, ...patch });
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-body text-ink">{labels.dialQ}</p>
        <ChipGroup
          label={labels.dialQ}
          options={[
            { value: "stepped", label: labels.clicks },
            { value: "stepless", label: labels.smooth },
            { value: NOT_SURE, label: labels.notSure },
          ]}
          value={answers.dial}
          onChange={(v) => set({ dial: v as GrinderAnswers["dial"] })}
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-3 text-body text-ink">{labels.rangeQ}</legend>
        <div className="grid grid-cols-2 gap-4">
          <Input label={labels.lowest} inputMode="decimal" value={answers.min} onChange={(e) => set({ min: e.target.value })} />
          <Input label={labels.highest} inputMode="decimal" value={answers.max} onChange={(e) => set({ max: e.target.value })} />
        </div>
        <p className="text-label text-ink-secondary">{labels.rangeHint}</p>
      </fieldset>

      {answers.dial === "stepped" && (
        <Input label={labels.stepQ} inputMode="decimal" value={answers.step} onChange={(e) => set({ step: e.target.value })} />
      )}

      <div className="flex flex-col gap-3">
        <p className="text-body text-ink">{labels.coarserQ}</p>
        <ChipGroup
          label={labels.coarserQ}
          options={[
            { value: "higher", label: labels.higher },
            { value: "lower", label: labels.lower },
            { value: NOT_SURE, label: labels.notSure },
          ]}
          value={answers.coarser}
          onChange={(v) => set({ coarser: v as GrinderAnswers["coarser"] })}
        />
      </div>
    </div>
  );
}
