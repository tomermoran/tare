"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { Notice } from "@/components/ui/Notice/Notice";
import { ConfirmSheet } from "@/components/ui/Sheet/ConfirmSheet";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { LIST_NAME_MAX } from "@/domain/listName";

/*
 * SH-PERSON (DES-05-01-02): add or rename a profile with just a name (a
 * nickname works). Edit offers a quiet remove only while the profile has
 * no shots and no recipes, asked once; otherwise a line says why it stays.
 * The main profile has no remove. A failed save keeps the name. Props only.
 */

export type PersonSheetLabels = {
  addTitle: string;
  editTitle: string;
  close: string;
  name: string;
  nameHint: string;
  nameRequired: string;
  nameTaken: string;
  save: string;
  saveFailed: string;
  remove: string;
  removeTitle: string;
  removeBody: string;
  removeConfirm: string;
  cancel: string;
};

/** The profile being edited; absent when adding. */
export type SheetPerson = {
  name: string;
  /** Set when it can't be removed: why it stays (the main one has none, and no remove). */
  cantRemove?: string;
  removable: boolean;
};

export type PersonSheetError = "nameRequired" | "nameTaken" | "saveFailed" | null;

export function PersonSheet({
  open,
  person,
  labels,
  busy = false,
  error = null,
  removeFailed = false,
  onSave,
  onRemove,
  onClose,
}: {
  open: boolean;
  person?: SheetPerson;
  labels: PersonSheetLabels;
  busy?: boolean;
  error?: PersonSheetError;
  removeFailed?: boolean;
  onSave: (name: string) => void;
  onRemove?: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(person?.name ?? "");
  const [confirming, setConfirming] = useState(false);
  const nameError = error === "nameRequired" ? labels.nameRequired : error === "nameTaken" ? labels.nameTaken : undefined;

  return (
    <>
      <Sheet
        open={open && !confirming}
        onClose={onClose}
        title={person ? labels.editTitle : labels.addTitle}
        closeLabel={labels.close}
        footer={
          <Button variant="primary" fullWidth onClick={() => onSave(name)} disabled={busy} aria-busy={busy || undefined}>
            {labels.save}
          </Button>
        }
      >
        <div className="flex flex-col gap-6">
          <Input
            label={labels.name}
            hint={labels.nameHint}
            value={name}
            maxLength={LIST_NAME_MAX}
            autoComplete="off"
            error={nameError}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              // One field: Enter saves, as a form would.
              if (e.key === "Enter" && !busy) onSave(name);
            }}
          />
          {error === "saveFailed" && <Notice urgent>{labels.saveFailed}</Notice>}
          {person?.removable && onRemove && (
            <Button variant="ghost" className="self-start" onClick={() => setConfirming(true)}>
              {labels.remove}
            </Button>
          )}
          {person?.cantRemove && <p className="text-label text-ink-secondary">{person.cantRemove}</p>}
        </div>
      </Sheet>
      <ConfirmSheet
        open={open && confirming}
        title={labels.removeTitle}
        confirmLabel={labels.removeConfirm}
        cancelLabel={labels.cancel}
        closeLabel={labels.close}
        busy={busy}
        notice={removeFailed ? <Notice urgent>{labels.saveFailed}</Notice> : undefined}
        onConfirm={() => onRemove?.()}
        onCancel={() => setConfirming(false)}
      >
        {labels.removeBody}
      </ConfirmSheet>
    </>
  );
}
