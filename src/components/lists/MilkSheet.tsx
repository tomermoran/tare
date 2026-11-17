"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { Input } from "@/components/ui/Input/Input";
import { Notice } from "@/components/ui/Notice/Notice";
import { ConfirmSheet } from "@/components/ui/Sheet/ConfirmSheet";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { Toggle } from "@/components/ui/Toggle/Toggle";
import { LIST_NAME_MAX } from "@/domain/listName";

export type MilkSheetKind = "dairy" | "plant";

export type MilkSheetLabels = {
  editTitle: string;
  addTitle: string;
  close: string;
  name: string;
  resetName: string;
  nameRequired: string;
  nameTaken: string;
  kind: string;
  dairy: string;
  plant: string;
  kindFixed: string;
  kindRequired: string;
  show: string;
  keepOne: string;
  save: string;
  saveFailed: string;
  retry: string;
  discardTitle: string;
  discardBody: string;
  discard: string;
  keepEditing: string;
};

/** The milk being edited, as shown; absent when adding. */
export type SheetMilk = {
  name: string;
  /** A starter's translated name, when it has been renamed. */
  originalName: string | null;
  kind: MilkSheetKind;
  hidden: boolean;
  /** False for the last shown milk. */
  canHide: boolean;
};

export type MilkSheetValues = { name: string | null; kind: MilkSheetKind; hidden: boolean };

export type MilkSheetError = "nameRequired" | "nameTaken" | "saveFailed" | null;

/**
 * SH-MILK (DES-02-05-02), the drink sheet's twin. Edit: the name (with "use
 * the original name" on a renamed starter), the kind as a plain line, and
 * show in my lists (disabled with its reason on the last shown milk). Add:
 * the name and a dairy-or-plant choice, made once and required. No delete:
 * hiding is how a milk goes. Props only.
 */
export function MilkSheet({
  open,
  milk,
  labels,
  busy = false,
  error = null,
  onSave,
  onClose,
}: {
  open: boolean;
  /** Absent: add mode. */
  milk?: SheetMilk;
  labels: MilkSheetLabels;
  busy?: boolean;
  error?: MilkSheetError;
  onSave: (values: MilkSheetValues) => void;
  onClose: () => void;
}) {
  const adding = !milk;
  const [name, setName] = useState(milk?.name ?? "");
  const [reset, setReset] = useState(false);
  const [kind, setKind] = useState<MilkSheetKind | null>(milk?.kind ?? null);
  const [kindMissing, setKindMissing] = useState(false);
  const [shown, setShown] = useState(!(milk?.hidden ?? false));
  const [confirming, setConfirming] = useState(false);

  const dirty = adding ? name.trim() !== "" || kind !== null : reset || name !== milk.name || shown === milk.hidden;
  const close = () => (dirty && !busy ? setConfirming(true) : onClose());
  const save = () => {
    if (!kind) return setKindMissing(true);
    onSave({ name: reset ? null : name, kind, hidden: !shown });
  };

  const nameError = error === "nameRequired" ? labels.nameRequired : error === "nameTaken" ? labels.nameTaken : undefined;
  return (
    <>
      <Sheet
        open={open && !confirming}
        onClose={close}
        title={adding ? labels.addTitle : labels.editTitle}
        closeLabel={labels.close}
        footer={
          <Button variant="primary" fullWidth onClick={save} disabled={busy} aria-busy={busy || undefined}>
            {labels.save}
          </Button>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start gap-2">
            <Input
              label={labels.name}
              value={name}
              maxLength={LIST_NAME_MAX}
              error={nameError}
              className="w-full"
              onChange={(e) => {
                setName(e.target.value);
                setReset(false);
              }}
            />
            {milk?.originalName && !reset && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setName(milk.originalName!);
                  setReset(true);
                }}
              >
                {labels.resetName}
              </Button>
            )}
          </div>

          {adding ? (
            <div className="flex flex-col gap-2">
              <ChipGroup
                label={labels.kind}
                value={kind}
                onChange={(v) => {
                  setKind(v as MilkSheetKind);
                  setKindMissing(false);
                }}
                options={[
                  { value: "dairy", label: labels.dairy },
                  { value: "plant", label: labels.plant },
                ]}
              />
              <p className="text-label text-ink-secondary" aria-live="polite">{kindMissing ? labels.kindRequired : labels.kindFixed}</p>
            </div>
          ) : (
            <p className="text-body text-ink-secondary">{milk.kind === "plant" ? labels.plant : labels.dairy}</p>
          )}

          {!adding && (
            <Toggle
              label={labels.show}
              checked={shown}
              onChange={setShown}
              disabled={shown && !milk.canHide}
              hint={shown && !milk.canHide ? labels.keepOne : undefined}
            />
          )}

          {error === "saveFailed" && (
            <Notice urgent action={{ label: labels.retry, onClick: save }}>
              {labels.saveFailed}
            </Notice>
          )}
        </div>
      </Sheet>
      <ConfirmSheet
        open={open && confirming}
        title={labels.discardTitle}
        confirmLabel={labels.discard}
        cancelLabel={labels.keepEditing}
        closeLabel={labels.close}
        onConfirm={() => {
          setConfirming(false);
          onClose();
        }}
        onCancel={() => setConfirming(false)}
      >
        {labels.discardBody}
      </ConfirmSheet>
    </>
  );
}
