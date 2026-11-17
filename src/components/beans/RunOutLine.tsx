"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon/Icon";
import { SkeletonBlock, Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { cx } from "@/lib/cx";
import { RunOutSheet, type RunOutContent, type RunOutSheetLabels } from "./RunOutSheet";

/*
 * The run-out line under On hand (DES-03-05-01): one quiet button, a list
 * row's height, that opens SH-RUNOUT. Calm information in ink, or
 * ink-secondary while Tare is still learning; never the signal colour and
 * never a prompt to buy. Nothing at all while a Beans filter is on, or when
 * there's no content (nothing on hand, no recent use, or the read failed).
 */

export function RunOutLine({
  content,
  filtersActive = false,
  onRetry,
  labels,
}: {
  content: RunOutContent | null;
  /** Any Beans filter on: the figure is for all coffee, so it would mislead (EPIC-03-07). */
  filtersActive?: boolean;
  /** The sheet's retry when the figures couldn't be worked out. */
  onRetry: () => void;
  labels: RunOutSheetLabels;
}) {
  const [open, setOpen] = useState(false);
  // A sheet already open stays, with a retry, if a refresh finds no figures.
  if (filtersActive || (!content && !open)) return null;
  return (
    <>
      {content && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="flex min-h-11 w-full items-center justify-between gap-3 border-b border-line py-2.5 text-start transition-colors hover:bg-surface"
        >
          <span className={cx("text-body", content.learning ? "text-ink-secondary" : "text-ink")}>{content.line}</span>
          <Icon name="chevron" className="text-ink-secondary" />
        </button>
      )}
      <RunOutSheet open={open} onClose={() => setOpen(false)} content={content} onRetry={onRetry} labels={labels} />
    </>
  );
}

/** While Beans loads, the line is one skeleton line. */
export function RunOutLineSkeleton({ label }: { label: string }) {
  return (
    <Skeleton label={label} className="py-3">
      <SkeletonBlock shape="line" className="w-3/5" />
    </Skeleton>
  );
}
