"use client";

import { Notice } from "@/components/ui/Notice/Notice";
import { ConfirmSheet } from "@/components/ui/Sheet/ConfirmSheet";

export type SwitchSheetLabels = {
  title: string;
  body: string;
  confirm: string;
  cancel: string;
  close: string;
  failed: string;
  retry: string;
};

/**
 * SH-SWITCH (DES-05-03-02): this Google account already has a Tare history.
 * The body says what switching costs: nothing on an empty device, or this
 * device's own history left behind. One explicit confirmation; cancelling
 * changes nothing. A failed switch keeps
 * the sheet with a retry (STORY-05-03-04).
 */
export function SwitchSheet({
  open,
  busy = false,
  failed = false,
  labels,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  busy?: boolean;
  failed?: boolean;
  labels: SwitchSheetLabels;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <ConfirmSheet
      open={open}
      title={labels.title}
      confirmLabel={labels.confirm}
      cancelLabel={labels.cancel}
      closeLabel={labels.close}
      onConfirm={onConfirm}
      onCancel={onCancel}
      busy={busy}
      notice={
        failed && (
          <Notice urgent action={{ label: labels.retry, onClick: onConfirm }}>
            {labels.failed}
          </Notice>
        )
      }
    >
      {labels.body}
    </ConfirmSheet>
  );
}
