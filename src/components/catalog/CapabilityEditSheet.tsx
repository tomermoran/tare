"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Notice } from "@/components/ui/Notice/Notice";
import { Sheet } from "@/components/ui/Sheet/Sheet";

/*
 * Answering later (STORY-01-06-09, SCR-UNIT): the same capability questions
 * as when adding the model, prefilled, in a sheet with Save. Only for a
 * model the household added and that isn't verified yet. Props only; the
 * questions come in as children.
 */

export type CapabilityEditLabels = {
  open: string;
  hint: string;
  title: string;
  why: string;
  save: string;
  close: string;
  saveFailed: string;
};

export function CapabilityEditSheet({
  labels,
  open,
  onOpen,
  onClose,
  onSave,
  state = "idle",
  children,
}: {
  labels: CapabilityEditLabels;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSave: () => void;
  state?: "idle" | "saving" | "failed";
  children: ReactNode;
}) {
  const saving = state === "saving";
  return (
    <div className="flex flex-col gap-2">
      <p className="text-label text-ink-secondary">{labels.hint}</p>
      <Button variant="secondary" size="sm" onClick={onOpen} aria-haspopup="dialog" className="self-start">
        {labels.open}
      </Button>
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
        <div className="flex flex-col gap-6">
          <p className="text-label text-ink-secondary">{labels.why}</p>
          {children}
          {state === "failed" && (
            <Notice size="inline" urgent>
              {labels.saveFailed}
            </Notice>
          )}
        </div>
      </Sheet>
    </div>
  );
}
