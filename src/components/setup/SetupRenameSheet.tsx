"use client";

import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { Notice } from "@/components/ui/Notice/Notice";
import { Sheet } from "@/components/ui/Sheet/Sheet";

/*
 * Naming a setup (STORY-01-02-09 AC 5): one field and Save. The name is a
 * label, not a part, so saving never changes the setup itself; an empty
 * name goes back to showing it by its parts (the placeholder). Props only.
 */

export type SetupRenameLabels = {
  title: string;
  name: string;
  nameHint: string;
  save: string;
  close: string;
  saveFailed: string;
};

export function SetupRenameSheet({
  open,
  labels,
  value,
  placeholder,
  state = "idle",
  onChange,
  onSave,
  onClose,
}: {
  open: boolean;
  labels: SetupRenameLabels;
  value: string;
  /** The parts name, shown while the field is empty. */
  placeholder: string;
  state?: "idle" | "saving" | "failed";
  onChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const saving = state === "saving";
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={labels.title}
      closeLabel={labels.close}
      footer={
        <Button variant="primary" fullWidth onClick={onSave} disabled={saving} aria-busy={saving || undefined}>
          {labels.save}
        </Button>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!saving) onSave();
        }}
      >
        <Input
          label={labels.name}
          hint={labels.nameHint}
          value={value}
          maxLength={60}
          placeholder={placeholder}
          // The one thing to do here; showModal() focuses it.
          autoFocus
          onChange={(e) => onChange(e.target.value)}
        />
        {state === "failed" && (
          <Notice size="inline" urgent>
            {labels.saveFailed}
          </Notice>
        )}
      </form>
    </Sheet>
  );
}
