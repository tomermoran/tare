"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "../Icon/Icon";
import { ListRow } from "../ListRow/ListRow";

export type ReorderItem = {
  id: string;
  /** The name, as shown and as announced. */
  name: string;
  primary: ReactNode;
  secondary?: ReactNode;
  /** Quieter, e.g. a hidden drink. */
  quiet?: boolean;
  onClick?: () => void;
};

export type ReorderLabels = {
  moveUp: (name: string) => string;
  moveDown: (name: string) => string;
  /** "Latte, 2 of 9" (STORY-02-05-04 AC 2). */
  moved: (name: string, position: number, count: number) => string;
};

/**
 * ReorderList (NC-17, DES-02-05-03): ListRows that open on tap, or, in
 * reorder mode, move-up and move-down buttons in place of the tap target.
 * No dragging: the buttons work with a keyboard and a screen reader. The
 * first row has no "up" and the last no "down" (disabled, not removed, so
 * the rows line up); focus stays on the button just used, following its row;
 * a polite live region says the new place.
 */
export function ReorderList({
  items,
  reordering,
  onMove,
  labels,
  announcement,
}: {
  items: ReorderItem[];
  reordering: boolean;
  /** Move the item to the index; the list re-renders in the new order. */
  onMove: (id: string, toIndex: number) => void;
  labels: ReorderLabels;
  /** What the live region says; the caller sets it after each move (or a failure). */
  announcement: string;
}) {
  // After a move, focus the same button on the row's new place.
  const focus = useRef<{ id: string; dir: "up" | "down" } | null>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  useEffect(() => {
    const f = focus.current;
    if (!f) return;
    const index = items.findIndex((i) => i.id === f.id);
    // At the edge the same direction is disabled, so use the other one.
    const dir = f.dir === "up" && index === 0 ? "down" : f.dir === "down" && index === items.length - 1 ? "up" : f.dir;
    buttons.current.get(`${f.id}:${dir}`)?.focus();
    focus.current = null;
  }, [items]);

  const move = (id: string, index: number, dir: "up" | "down") => {
    focus.current = { id, dir };
    onMove(id, dir === "up" ? index - 1 : index + 1);
  };

  return (
    <>
      <ul className="flex flex-col">
        {items.map((item, index) => {
          const name = <span className={cx(item.quiet && "text-ink-secondary")}>{item.primary}</span>;
          if (!reordering) {
            return (
              <li key={item.id}>
                <ListRow primary={name} secondary={item.secondary} onClick={item.onClick} />
              </li>
            );
          }
          const button = (dir: "up" | "down", disabled: boolean) => (
            <button
              type="button"
              ref={(el) => {
                if (el) buttons.current.set(`${item.id}:${dir}`, el);
                else buttons.current.delete(`${item.id}:${dir}`);
              }}
              aria-label={dir === "up" ? labels.moveUp(item.name) : labels.moveDown(item.name)}
              disabled={disabled}
              onClick={() => move(item.id, index, dir)}
              className="grid size-11 place-items-center rounded-md text-ink transition-colors hover:bg-surface disabled:text-line-strong disabled:hover:bg-transparent"
            >
              <Icon name={dir} />
            </button>
          );
          return (
            <li key={item.id}>
              <ListRow
                primary={name}
                secondary={item.secondary}
                end={
                  <span className="-my-2 flex gap-1">
                    {button("up", index === 0)}
                    {button("down", index === items.length - 1)}
                  </span>
                }
                className="items-center"
              />
            </li>
          );
        })}
      </ul>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </>
  );
}
