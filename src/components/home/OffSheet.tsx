"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Notice } from "@/components/ui/Notice/Notice";
import { Sheet } from "@/components/ui/Sheet/Sheet";

export type OffSheetLabels = {
  title: string;
  close: string;
  skip: string;
  saveFailed: string;
  retry: string;
};

/**
 * SH-OFF (STORY-02-03-04): what was off about a one-tap shot, right after
 * "off". The tasting screen's just-right rows and tags, never a rating, the
 * channelling warning under the tags and the live suggestion below. One
 * primary: "dial in with this change" with a suggestion, else "fix it";
 * "skip" opens the fix from the recipe only. Props only.
 */
export function OffSheet({
  open,
  onClose,
  labels,
  questions,
  tags,
  warning,
  suggestion,
  primary,
  onSkip,
  state = "idle",
  onRetry,
}: {
  open: boolean;
  /** Close saves too, like every other way out (AC 2). */
  onClose: () => void;
  labels: OffSheetLabels;
  questions: ReactNode;
  tags: ReactNode;
  warning?: ReactNode;
  /** A SuggestionCard, or nothing when there's nothing to say. */
  suggestion?: ReactNode;
  primary: { label: string; onClick: () => void };
  onSkip: () => void;
  state?: "idle" | "saving" | "failed";
  onRetry: () => void;
}) {
  const saving = state === "saving";
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={labels.title}
      closeLabel={labels.close}
      footer={
        <div className="flex flex-col gap-3">
          {state === "failed" && (
            <Notice urgent action={{ label: labels.retry, onClick: onRetry }}>
              {labels.saveFailed}
            </Notice>
          )}
          {suggestion}
          <Button variant="primary" fullWidth disabled={saving} aria-busy={saving || undefined} onClick={primary.onClick}>
            {primary.label}
          </Button>
          {/* Skip still opens the fix when the save failed (AC 6). */}
          <Button variant="ghost" fullWidth disabled={saving} onClick={onSkip}>
            {labels.skip}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-8 pb-2">
        {questions}
        <div className="flex flex-col gap-3">
          {tags}
          {warning}
        </div>
      </div>
    </Sheet>
  );
}
