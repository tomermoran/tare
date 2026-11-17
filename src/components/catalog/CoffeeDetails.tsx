"use client";

import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { Input } from "@/components/ui/Input/Input";
import { SelectField } from "@/components/ui/SelectField/SelectField";
import { ROAST_LEVELS, type RoastLevel } from "@/domain/roast";

/** The roast chip that leaves the level empty. */
export const NOT_SURE = "notSure";

export type CoffeeDetailsLabels = {
  roastLevel: string;
  levels: Record<RoastLevel, string>;
  notSure: string;
  notes: string;
  notesHint: string;
};

/** The optional roast level (S-09's fixed list, or not sure), origin and tasting notes. */
export function CoffeeDetails({
  labels,
  roast,
  onRoastChange,
  notes,
  onNotesChange,
  origin,
}: {
  labels: CoffeeDetailsLabels;
  roast: string | null;
  onRoastChange: (value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  /** The optional origin field (STORY-03-07-04); left out when the list of origins can't be built (AC 4). */
  origin?: { label: string; value: string; onClick: () => void };
}) {
  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="text-label text-ink-secondary">{labels.roastLevel}</p>
        <ChipGroup
          label={labels.roastLevel}
          options={[...ROAST_LEVELS.map((l) => ({ value: l, label: labels.levels[l] })), { value: NOT_SURE, label: labels.notSure }]}
          value={roast}
          onChange={onRoastChange}
        />
      </div>
      {origin && <SelectField label={origin.label} value={origin.value} onClick={origin.onClick} />}
      <Input
        label={labels.notes}
        hint={labels.notesHint}
        value={notes}
        maxLength={200}
        autoComplete="off"
        onChange={(e) => onNotesChange(e.target.value)}
      />
    </>
  );
}
