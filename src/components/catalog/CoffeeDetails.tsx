"use client";

import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { Input } from "@/components/ui/Input/Input";
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

/** The optional roast level (S-09's fixed list, or not sure) and tasting notes. */
export function CoffeeDetails({
  labels,
  roast,
  onRoastChange,
  notes,
  onNotesChange,
}: {
  labels: CoffeeDetailsLabels;
  roast: string | null;
  onRoastChange: (value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
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
