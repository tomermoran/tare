"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { Notice } from "@/components/ui/Notice/Notice";
import { NumberWheel } from "@/components/ui/NumberWheel/NumberWheel";
import { ConfirmSheet } from "@/components/ui/Sheet/ConfirmSheet";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { Toggle } from "@/components/ui/Toggle/Toggle";
import { MILK_RANGE } from "@/domain/milk";
import { LIST_NAME_MAX } from "@/domain/listName";

export type DrinkSheetLabels = {
  editTitle: string;
  addTitle: string;
  close: string;
  name: string;
  resetName: string;
  nameRequired: string;
  nameTaken: string;
  usualMilk: string;
  hasMilk: string;
  hasMilkLine: string;
  noMilkLine: string;
  hasMilkFixed: string;
  hasMilkHint: string;
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

/** The drink being edited, as shown; absent when adding. */
export type SheetDrink = {
  /** The name it shows now. */
  name: string;
  /** A starter's translated name, when it has been renamed (offers "use the original name"). */
  originalName: string | null;
  hasMilk: boolean;
  typicalMilkMl: number | null;
  hidden: boolean;
  /** False for the last shown drink (STORY-02-05-02 AC 5). */
  canHide: boolean;
};

export type DrinkSheetValues = {
  /** null: back to the translated name. */
  name: string | null;
  hasMilk: boolean;
  typicalMilkMl: number | null;
  hidden: boolean;
};

export type DrinkSheetError = "nameRequired" | "nameTaken" | "saveFailed" | null;

const NEW_MILK_ML = 120;

/**
 * SH-DRINK (DES-02-05-01). Edit: the name (with "use the original name" on
 * a renamed starter), the usual milk for a milk drink, whether it has milk
 * as a plain line, and show in my lists (disabled with its reason on the
 * last shown drink). Add: the same sheet empty, with the milk choice made
 * once. One primary; closing with changes asks first. A refused or failed
 * save keeps everything typed. Props only.
 */
export function DrinkSheet({
  open,
  drink,
  labels,
  busy = false,
  error = null,
  onSave,
  onClose,
}: {
  open: boolean;
  /** Absent: add mode. */
  drink?: SheetDrink;
  labels: DrinkSheetLabels;
  busy?: boolean;
  error?: DrinkSheetError;
  onSave: (values: DrinkSheetValues) => void;
  onClose: () => void;
}) {
  const adding = !drink;
  const [name, setName] = useState(drink?.name ?? "");
  const [reset, setReset] = useState(false);
  const [hasMilk, setHasMilk] = useState(drink?.hasMilk ?? false);
  const [milkMl, setMilkMl] = useState(drink?.typicalMilkMl ?? NEW_MILK_ML);
  const [shown, setShown] = useState(!(drink?.hidden ?? false));
  const [confirming, setConfirming] = useState(false);

  const dirty = adding
    ? name.trim() !== "" || hasMilk
    : reset || name !== drink.name || shown === drink.hidden || (drink.hasMilk && milkMl !== drink.typicalMilkMl);
  const close = () => (dirty && !busy ? setConfirming(true) : onClose());
  const save = () =>
    onSave({
      name: reset ? null : name,
      hasMilk,
      typicalMilkMl: hasMilk ? milkMl : null,
      hidden: !shown,
    });

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
            {drink?.originalName && !reset && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setName(drink.originalName!);
                  setReset(true);
                }}
              >
                {labels.resetName}
              </Button>
            )}
          </div>

          {adding ? (
            <Toggle label={labels.hasMilk} checked={hasMilk} onChange={setHasMilk} hint={`${labels.hasMilkFixed} ${labels.hasMilkHint}`} />
          ) : (
            <p className="text-body text-ink-secondary">{drink.hasMilk ? labels.hasMilkLine : labels.noMilkLine}</p>
          )}

          {hasMilk && (
            <NumberWheel label={labels.usualMilk} value={milkMl} onChange={setMilkMl} {...MILK_RANGE} majorEvery={5} unit="milliliter" />
          )}

          {!adding && (
            <Toggle
              label={labels.show}
              checked={shown}
              onChange={setShown}
              disabled={shown && !drink.canHide}
              hint={shown && !drink.canHide ? labels.keepOne : undefined}
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
