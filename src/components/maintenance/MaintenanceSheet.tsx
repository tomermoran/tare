"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { Input } from "@/components/ui/Input/Input";
import { Notice } from "@/components/ui/Notice/Notice";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { Toggle } from "@/components/ui/Toggle/Toggle";
import { MAINTENANCE_KINDS, type MaintenanceKind } from "@/domain/maintenance";

export type MaintenanceSheetLabels = {
  title: string;
  close: string;
  kind: string;
  kinds: Record<MaintenanceKind, string>;
  date: string;
  dateHint: string;
  note: string;
  noteHint: string;
  save: string;
  saveFailed: string;
  retry: string;
};

export type MaintenanceDraft = { kind: MaintenanceKind | null; day: string; note: string };

/**
 * SH-MAINTENANCE (STORY-04-01-01): what was done, when (today unless an
 * earlier day is chosen) and an optional note. A re-zero today is three
 * taps: add, re-zero, save. Grinders get the recalibration toggle in its
 * slot (STORY-04-01-02). A failed save keeps the sheet open with a retry.
 * Props only.
 */
export function MaintenanceSheet({
  open,
  onClose,
  labels,
  value,
  onChange,
  today,
  recalibration,
  state = "idle",
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  labels: MaintenanceSheetLabels;
  value: MaintenanceDraft;
  onChange: (patch: Partial<MaintenanceDraft>) => void;
  /** Today, YYYY-MM-DD: no later day can be chosen. */
  today: string;
  /** The recalibration Toggle, for grinders only. */
  recalibration?: ReactNode;
  state?: "idle" | "saving" | "failed";
  onSave: () => void;
}) {
  const saving = state === "saving";
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={labels.title}
      closeLabel={labels.close}
      footer={
        <div className="flex flex-col gap-3">
          {state === "failed" && (
            <Notice urgent action={{ label: labels.retry, onClick: onSave }}>
              {labels.saveFailed}
            </Notice>
          )}
          <Button
            variant="primary"
            fullWidth
            disabled={saving || !value.kind || !value.day}
            aria-busy={saving || undefined}
            onClick={onSave}
          >
            {labels.save}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6 pb-2">
        <div className="flex flex-col gap-2">
          <span className="text-label text-ink-secondary">{labels.kind}</span>
          <ChipGroup
            label={labels.kind}
            options={MAINTENANCE_KINDS.map((k) => ({ value: k, label: labels.kinds[k] }))}
            value={value.kind}
            onChange={(kind) => onChange({ kind: kind as MaintenanceKind })}
          />
        </div>
        {recalibration}
        <Input
          type="date"
          label={labels.date}
          hint={labels.dateHint}
          value={value.day}
          max={today}
          onChange={(e) => onChange({ day: e.target.value })}
        />
        <Input label={labels.note} hint={labels.noteHint} value={value.note} maxLength={500} onChange={(e) => onChange({ note: e.target.value })} />
      </div>
    </Sheet>
  );
}

/** The recalibration toggle with its explanation, for the sheet's slot. */
export function RecalibrationToggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <Toggle label={label} checked={checked} onChange={onChange} />
      <p className="text-label text-ink-secondary">{hint}</p>
    </div>
  );
}
