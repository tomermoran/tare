"use client";

import { Notice } from "@/components/ui/Notice/Notice";
import { Sheet } from "@/components/ui/Sheet/Sheet";

/*
 * SH-RUNOUT (DES-03-05-02): how the run-out line was worked out. The span
 * again, large and thin, with the "around" date; then plain rows for the
 * coffee on hand, the rate, what it rests on and the logged share, and one
 * sentence on what a low share means. While learning, how many finished
 * portions there are so far instead of a figure. Information only: no
 * primary button and no promise of accuracy. Props only; every figure
 * arrives formatted.
 */

export type RunOutRow = { label: string; value: string };

export type RunOutContent = {
  /** What the line on Beans says. */
  line: string;
  /** Still learning: the line is quieter and there's no figure. */
  learning: boolean;
  /** The span, e.g. "5 weeks", with an estimate only. */
  span?: string;
  /** "Around 14 December". */
  by?: string;
  /** While learning: how many finished portions so far. */
  progress?: string;
  rows: RunOutRow[];
  /** What a low logged share means, when it is low. */
  meaning?: string;
};

export type RunOutSheetLabels = { title: string; close: string; loadFailed: string; retry: string };

export function RunOutSheet({
  open,
  onClose,
  content,
  onRetry,
  labels,
}: {
  open: boolean;
  onClose: () => void;
  /** Null when the figures couldn't be worked out: the sheet offers a retry. */
  content: RunOutContent | null;
  onRetry: () => void;
  labels: RunOutSheetLabels;
}) {
  return (
    <Sheet open={open} onClose={onClose} title={labels.title} closeLabel={labels.close}>
      {!content ? (
        <Notice urgent action={{ label: labels.retry, onClick: onRetry }}>
          {labels.loadFailed}
        </Notice>
      ) : (
        <div className="flex flex-col gap-6">
          {content.span && (
            <p className="flex flex-col gap-1">
              {content.by && <span className="text-overline uppercase text-ink-secondary">{content.by}</span>}
              <span className="text-display text-ink">{content.span}</span>
            </p>
          )}
          {content.progress && <p className="text-body text-ink">{content.progress}</p>}
          <dl className="flex flex-col">
            {content.rows.map((r) => (
              <div key={r.label} className="flex items-baseline justify-between gap-4 border-b border-line py-3">
                <dt className="text-label text-ink-secondary">{r.label}</dt>
                <dd className="text-body text-end text-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
          {content.meaning && <p className="text-body text-ink-secondary">{content.meaning}</p>}
        </div>
      )}
    </Sheet>
  );
}

