"use client";

import { useState } from "react";
import { SelectField } from "@/components/ui/SelectField/SelectField";
import { SelectSheet, type SelectOption } from "@/components/ui/SelectSheet/SelectSheet";

export type PersonaSelectLabels = { change: string; title: string; close: string; profileAndPeople: string };

/**
 * Brew's persona label with more than one profile (STORY-05-01-03 AC 2): a
 * quiet select that opens "who is it for?", the main profile first, with a
 * last row to Profile and people, since the label no longer links there.
 */
export function PersonaSelect({
  value,
  options,
  chosenId,
  labels,
  onChoose,
  onProfile,
}: {
  /** The name, or "for {name}" when it isn't the main profile. */
  value: string;
  options: SelectOption[];
  chosenId: string;
  labels: PersonaSelectLabels;
  onChoose: (id: string) => void;
  onProfile: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SelectField look="quiet" value={value} onClick={() => setOpen(true)} hiddenLabel={labels.change} valueClassName="text-label text-ink-secondary" className="py-1.5 text-ink-secondary" />
      <SelectSheet
        open={open}
        onClose={() => setOpen(false)}
        title={labels.title}
        closeLabel={labels.close}
        options={options}
        value={chosenId}
        onChoose={(id) => {
          setOpen(false);
          if (id !== chosenId) onChoose(id);
        }}
        footerRow={{ label: labels.profileAndPeople, icon: "chevron", onClick: onProfile }}
      />
    </>
  );
}
