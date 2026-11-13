"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonClass } from "@/components/ui/Button/Button";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { ShotValues, type ShotValuesData } from "@/components/ui/ShotValues/ShotValues";

export type RecipeRow = {
  id: string;
  /** Drink and setup. */
  title: string;
  values: ShotValuesData;
  /** Milk, puck prep, temperature and pressure, each a quiet line. */
  lines: string[];
  /** When it was pinned. */
  date: string;
  dialInHref: string;
  changeHref: string;
};

/**
 * Recipes for a coffee (STORY-02-01-04), one row per drink and setup, shared
 * by the bag and coffee screens. Opening a row offers to dial in from it or
 * change it (AC 3).
 */
export function RecipeRows({
  rows,
  labels,
}: {
  rows: RecipeRow[];
  labels: { dialIn: string; change: string; close: string };
}) {
  const [open, setOpen] = useState<RecipeRow | null>(null);
  return (
    <>
      <ul className="border-t border-line">
        {rows.map((r) => (
          <li key={r.id}>
            <ListRow
              primary={r.title}
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
          </div>
        )}
      </Sheet>
    </>
  );
}
