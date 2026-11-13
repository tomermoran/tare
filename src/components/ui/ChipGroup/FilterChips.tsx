"use client";

import { cx } from "@/lib/cx";
import { Icon } from "../Icon/Icon";

export type FilterChip = {
  id: string;
  /** What the chip shows: the value ("Latte"), or "Any drink" when off. */
  text: string;
  /** The chip's accessible name, with its value ("Drink: Latte"). */
  name: string;
  /** Set when the filter is on: the remove control's accessible name. */
  remove?: string;
};

/**
 * The filter variant of ChipGroup (NC-04): one row of chips that scrolls
 * sideways. Each shows its value and opens a choice; an active one is
 * filled and carries its own remove control. With any filter on, a ghost
 * "All" chip leads the row and clears them all (STORY-02-06-04 AC 2, AC 5).
 */
export function FilterChips({
  label,
  chips,
  all,
  onOpen,
  onRemove,
  onClearAll,
  className,
}: {
  /** Accessible name for the row. */
  label: string;
  chips: FilterChip[];
  /** "All": shown only while a filter is on. */
  all: string;
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  className?: string;
}) {
  const anyOn = chips.some((c) => c.remove);
  const pill = "inline-flex min-h-10 shrink-0 items-center rounded-full border text-label transition-colors";
  return (
    <div role="group" aria-label={label} className={cx("-mx-4 flex gap-2 overflow-x-auto px-4 pb-1", className)}>
      {anyOn && (
        <button type="button" onClick={onClearAll} className={cx(pill, "border-transparent px-4 text-ink hover:bg-surface")}>
          {all}
        </button>
      )}
      {chips.map((c) =>
        c.remove ? (
          <span key={c.id} className={cx(pill, "border-ink bg-ink text-on-action")}>
            <button type="button" aria-label={c.name} onClick={() => onOpen(c.id)} className="min-h-10 rounded-s-full ps-4 pe-1">
              {c.text}
            </button>
            <button
              type="button"
              aria-label={c.remove}
              onClick={() => onRemove(c.id)}
              className="flex min-h-10 min-w-10 items-center justify-center rounded-e-full pe-1"
            >
              <Icon name="close" size={16} />
            </button>
          </span>
        ) : (
          <button
            key={c.id}
            type="button"
            aria-label={c.name}
            onClick={() => onOpen(c.id)}
            className={cx(pill, "border-line-strong px-4 text-ink hover:bg-surface")}
          >
            {c.text}
          </button>
        ),
      )}
    </div>
  );
}
