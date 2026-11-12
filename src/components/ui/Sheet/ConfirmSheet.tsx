"use client";

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
}) {
  return (
    <Sheet
      open={open}
      onClose={onCancel}
      title={title}
      closeLabel={closeLabel}
      footer={
        <>
          <Button variant="primary" fullWidth onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="ghost" fullWidth onClick={onCancel}>
            {cancelLabel}
          </Button>
        </>
      }
    >
      <p className="text-ink-secondary">{children}</p>
    </Sheet>
  );
}
