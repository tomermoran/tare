"use client";

import { Button } from "@/components/ui/Button/Button";
import { Notice } from "@/components/ui/Notice/Notice";
import { Sheet } from "@/components/ui/Sheet/Sheet";

/*
 * SH-LEAVE (DES-05-02-05, STORY-05-02-07): asked once, with a plain
 * statement of what happens in short lines, and who becomes owner when
 * the only owner leaves. A failure keeps the sheet with a retry; when no
 * one else is left there is nothing to confirm. Ink only. Props only.
 */

export type LeaveLabels = {
  title: string;
  close: string;
  lines: string[];
  ownerNote: string;
  confirm: string;
  cancel: string;
  failed: string;
  retry: string;
  alone: string;
};

export function LeaveSheet({
  open,
  labels,
  onlyOwner = false,
  alone = false,
  busy = false,
  failed = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  labels: LeaveLabels;
  onlyOwner?: boolean;
  /** By the time of confirming, no other login is left. */
  alone?: boolean;
  busy?: boolean;
  failed?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Sheet
      open={open}
      onClose={onCancel}
      title={labels.title}
      closeLabel={labels.close}
      footer={
        <div className="flex flex-col gap-2">
          {!alone && (
            <Button variant="primary" fullWidth onClick={onConfirm} disabled={busy} aria-busy={busy || undefined}>
              {labels.confirm}
            </Button>
          )}
          <Button variant="ghost" fullWidth onClick={onCancel} disabled={busy}>
            {labels.cancel}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {alone ? (
          <Notice>{labels.alone}</Notice>
        ) : (
          <>
            <ul className="flex list-disc flex-col gap-2 ps-5 text-body text-ink">
              {labels.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
              {onlyOwner && <li>{labels.ownerNote}</li>}
            </ul>
            {failed && (
              <Notice urgent action={{ label: labels.retry, onClick: onConfirm }}>
                {labels.failed}
              </Notice>
            )}
          </>
        )}
      </div>
    </Sheet>
  );
}
