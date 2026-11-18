"use client";

import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Notice } from "@/components/ui/Notice/Notice";
import { NumberWheel } from "@/components/ui/NumberWheel/NumberWheel";
import { Sheet } from "@/components/ui/Sheet/Sheet";

export type OffsetPreviewRow = { label: string; from: string; to: string };

type Action = { label: string; onClick: () => void };

/**
 * SH-OFFSET, "what did the servicing change?" (STORY-04-03-01, 02, 05;
 * DES-04-03-02): the evidence in one line, the shift on a compact wheel in
 * the grinder's own steps with its words when the direction is known, the
 * ageing taken off, and up to three other recipes it changes. Primary and
 * secondary actions differ by mode (confirm or decline after a pin; save or
 * remove from the grinder's screen; pick another coffee with no baseline).
 * A failed save keeps the sheet with a retry. Props only; ink only.
 */
export function OffsetSheet({
  open,
  onClose,
  labels,
  line,
  message,
  wheel,
  words,
  agedNote,
  preview,
  primary,
  secondary,
  saving = false,
  failure,
}: {
  open: boolean;
  onClose: () => void;
  labels: { title: string; close: string; shift: string; preview: string; /** Read out for the arrow: "15 to 12". */ to: string };
  /** The evidence: "your recipe for X was 15 and is now 12", or in edit mode where the shift came from. */
  line?: string;
  /** In place of a shift: no baseline to compare with (STORY-04-03-01 AC 4). */
  message?: string;
  wheel?: { value: number; onChange: (v: number) => void; min: number; max: number; step: number };
  /** "3 steps finer", when the grinder's direction is known. */
  words?: string | null;
  /** "0.5 of that was the beans ageing, taken off first" (AC 2). */
  agedNote?: string | null;
  /** Up to three rows, "and N more", or a line saying there are none. */
  preview?: { rows: OffsetPreviewRow[]; more?: string; none?: string };
  primary: Action;
  secondary?: Action;
  saving?: boolean;
  failure?: { message: string; retryLabel: string; onRetry: () => void };
}) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={labels.title}
      closeLabel={labels.close}
      footer={
        <div className="flex flex-col gap-2">
          {failure && <Notice action={{ label: failure.retryLabel, onClick: failure.onRetry }}>{failure.message}</Notice>}
          <Button variant="primary" fullWidth onClick={primary.onClick} disabled={saving} aria-busy={saving || undefined}>
            {primary.label}
          </Button>
          {secondary && (
            <Button variant="ghost" fullWidth onClick={secondary.onClick} disabled={saving}>
              {secondary.label}
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {line && <p className="text-body text-ink">{line}</p>}
        {message && <p className="text-body text-ink-secondary">{message}</p>}
        {wheel && (
          <div className="flex flex-col gap-1">
            <NumberWheel label={labels.shift} value={wheel.value} onChange={wheel.onChange} min={wheel.min} max={wheel.max} step={wheel.step} />
            {words && <p className="text-body text-ink">{words}</p>}
            {agedNote && <p className="text-label text-ink-secondary">{agedNote}</p>}
          </div>
        )}
        {preview && (
          <section aria-labelledby="offset-preview" className="flex flex-col gap-2">
            <h3 id="offset-preview" className="text-label text-ink-secondary">
              {labels.preview}
            </h3>
            {preview.rows.length ? (
              <ul className="flex flex-col">
                {preview.rows.map((r) => (
                  <li key={r.label} className="flex items-baseline justify-between gap-4 border-b border-line py-2 last:border-b-0">
                    <span className="text-body text-ink">{r.label}</span>
                    <span className="flex shrink-0 items-center gap-1.5 text-body text-ink">
                      {r.from}
                      <Icon name="arrow" label={labels.to} className="text-ink-secondary" />
                      {r.to}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              preview.none && <p className="text-body text-ink-secondary">{preview.none}</p>
            )}
            {preview.more && <p className="text-label text-ink-secondary">{preview.more}</p>}
          </section>
        )}
      </div>
    </Sheet>
  );
}
