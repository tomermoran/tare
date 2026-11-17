"use client";

import type { ReactNode } from "react";
import { Button } from "../Button/Button";
import { Sheet } from "./Sheet";

/**
 * SH-CONFIRM: asks once before something is lost, e.g. leaving a form with
 * changes. The confirming action is the one primary button; cancelling, the
 * close button, Escape and the scrim all keep things as they were.
 */
export function ConfirmSheet({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel,
  closeLabel,
  onConfirm,
  onCancel,
  busy = false,
  notice,
}: {
  open: boolean;
  title: string;
  /** One sentence saying what happens. */
  children: string;
  confirmLabel: string;
  cancelLabel: string;
  closeLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** The confirm is under way: its button is busy and can't be pressed again. */
  busy?: boolean;
  /** E.g. a failure with a retry; the sheet stays open. */
  notice?: ReactNode;
}) {
  return (
    <Sheet
      open={open}
      onClose={onCancel}
      title={title}
      closeLabel={closeLabel}
      footer={
        <>
          <Button variant="primary" fullWidth onClick={onConfirm} disabled={busy} aria-busy={busy || undefined}>
            {confirmLabel}
          </Button>
          <Button variant="ghost" fullWidth onClick={onCancel}>
            {cancelLabel}
          </Button>
        </>
      }
    >
      <p className="text-ink-secondary">{children}</p>
      {notice && <div className="mt-4">{notice}</div>}
    </Sheet>
  );
}
