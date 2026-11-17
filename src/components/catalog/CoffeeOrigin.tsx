"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { originChoices } from "@/domain/origin";
import { OriginSheet, type OriginSheetLabels } from "./OriginSheet";

/*
 * Setting a coffee's origin from its screen (STORY-03-07-05 AC 2): a quiet
 * button that opens the origin choice and saves it. Only offered for a
 * coffee the household added that is still unverified. Props only: the
 * save comes from the caller.
 */

export function CoffeeOrigin({
  origin,
  onSave,
  labels,
}: {
  origin: string | null;
  /** Saves the choice; false when it failed. */
  onSave: (origin: string | null) => Promise<boolean>;
  labels: OriginSheetLabels & { set: string; change: string; saveFailed: string };
}) {
  const locale = useLocale();
  const [countries] = useState(() => originChoices(locale));
  const [open, setOpen] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  // The list can't be built without the runtime's country names: nothing to offer.
  if (!countries.length) return null;

  const choose = async (next: string | null) => {
    setBusy(true);
    setFailed(false);
    const ok = await onSave(next);
    setBusy(false);
    if (ok) setOpen(null);
    else setFailed(true);
  };

  return (
    <>
      <Button variant="ghost" size="sm" className="self-start" onClick={() => setOpen(Date.now())}>
        {origin ? labels.change : labels.set}
      </Button>
      {open !== null && (
        <OriginSheet
          key={open}
          open
          onClose={() => setOpen(null)}
          value={origin}
          countries={countries}
          onChoose={(o) => void choose(o)}
          busy={busy}
          error={failed ? labels.saveFailed : undefined}
          labels={labels}
        />
      )}
    </>
  );
}
