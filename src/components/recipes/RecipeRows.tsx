"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonClass } from "@/components/ui/Button/Button";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { Notice } from "@/components/ui/Notice/Notice";
import { ConfirmSheet } from "@/components/ui/Sheet/ConfirmSheet";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { ShotValues, type ShotValuesData } from "@/components/ui/ShotValues/ShotValues";

export type RecipeRow = {
  id: string;
  /** Drink and setup. */
  title: string;
  /** "Hidden", when the drink is hidden: the row stays, quieter (STORY-02-05-08 AC 1). */
  hidden?: string;
  values: ShotValuesData;
  /** Milk, puck prep, temperature and pressure, each a quiet line. */
  lines: string[];
  /** When it was pinned. */
  date: string;
  dialInHref: string;
  changeHref: string;
  /** A bag's own recipe: its sheet offers to use the coffee's recipe again (STORY-02-04-04). */
  removable?: boolean;
  /** Which recipe it is, for removing it. */
  setupId?: string;
  drinkTypeId?: string;
  /** Shown quieter, e.g. the coffee's recipe under a bag's own (STORY-02-04-03). */
  quiet?: boolean;
};

/** "Use the coffee's recipe for this bag", asked once (STORY-02-04-04 AC 1, AC 3, AC 4). */
export type RemoveLabels = { action: string; title: string; body: string; confirm: string; cancel: string; failed: string; retry: string };

/**
 * Recipes for a coffee (STORY-02-01-04), one row per drink and setup, shared
 * by the bag and coffee screens. Opening a row offers to dial in from it or
 * change it (AC 3).
 */
export function RecipeRows({
  rows,
  labels,
  remove,
}: {
  rows: RecipeRow[];
  labels: { dialIn: string; change: string; close: string };
  /** For removable rows: resolves true once removed. */
  remove?: { labels: RemoveLabels; onRemove: (row: RecipeRow) => Promise<boolean> };
}) {
  const [open, setOpen] = useState<RecipeRow | null>(null);
  const [confirming, setConfirming] = useState<{ row: RecipeRow; busy: boolean; failed: boolean } | null>(null);
  const confirm = async () => {
    if (!confirming || !remove) return;
    setConfirming({ ...confirming, busy: true, failed: false });
    if (await remove.onRemove(confirming.row)) setConfirming(null);
    else setConfirming({ ...confirming, busy: false, failed: true });
  };
  return (
    <>
      <ul className="border-t border-line">
        {rows.map((r) => (
          <li key={r.id}>
            <ListRow
              primary={
                r.hidden ? (
                  <span className="flex flex-col text-ink-secondary">
                    <span className="text-overline uppercase">{r.hidden}</span>
                    <span>{r.title}</span>
                  </span>
                ) : r.quiet ? (
                  <span className="text-ink-secondary">{r.title}</span>
                ) : (
                  r.title
                )
              }
              secondary={r.date}
              end={<ShotValues values={r.values} size="compact" />}
              footer={
                r.lines.length > 0 &&
                r.lines.map((line) => (
                  <span key={line} className="text-label text-ink-secondary">
                    {line}
                  </span>
                ))
              }
              onClick={() => setOpen(r)}
            />
          </li>
        ))}
      </ul>
      <Sheet open={open !== null} onClose={() => setOpen(null)} title={open?.title ?? ""} closeLabel={labels.close}>
        {open && (
          <div className="grid gap-2">
            <Link href={open.dialInHref} className={buttonClass({ variant: "primary", fullWidth: true })}>
              {labels.dialIn}
            </Link>
            <Link href={open.changeHref} className={buttonClass({ variant: "ghost", fullWidth: true })}>
              {labels.change}
            </Link>
            {open.removable && remove && (
              <Button
                variant="ghost"
                fullWidth
                onClick={() => {
                  setConfirming({ row: open, busy: false, failed: false });
                  setOpen(null);
                }}
              >
                {remove.labels.action}
              </Button>
            )}
          </div>
        )}
      </Sheet>
      {remove && (
        <ConfirmSheet
          open={confirming !== null}
          title={remove.labels.title}
          confirmLabel={remove.labels.confirm}
          cancelLabel={remove.labels.cancel}
          closeLabel={labels.close}
          busy={confirming?.busy}
          notice={
            confirming?.failed && (
              <Notice urgent action={{ label: remove.labels.retry, onClick: () => void confirm() }}>
                {remove.labels.failed}
              </Notice>
            )
          }
          onConfirm={() => void confirm()}
          onCancel={() => setConfirming(null)}
        >
          {remove.labels.body}
        </ConfirmSheet>
      )}
    </>
  );
}
