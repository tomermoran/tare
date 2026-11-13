"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cx } from "@/lib/cx";

type Option = { value: string; label: string };

/** Words under the outer chips of a scale, e.g. "too sour" and "too bitter". */
type Ends = { start: string; end?: string };

type ChipGroupProps = {
  /** Accessible name for the group. */
  label: string;
  options: Option[];
  className?: string;
} & (
  | { multiple?: false; clearable?: false; ends?: Ends; value: string | null; onChange: (value: string) => void }
  /**
   * An optional scale: tapping the chosen chip again clears it, and arrow
   * keys only move, so moving never answers (space or enter chooses).
   */
  | { multiple?: false; clearable: true; ends?: Ends; value: string | null; onChange: (value: string | null) => void }
  | { multiple: true; clearable?: false; ends?: never; value: string[]; onChange: (value: string[]) => void }
);

const chip =
  "min-h-10 rounded-full border px-4 text-label transition-colors";
const off = "border-line-strong text-ink hover:bg-surface";
const on = "border-ink bg-ink text-on-action";

/**
 * Chips for choosing (NC-04). Single choice is a radio group: one tab stop,
 * arrow keys move and select (or only move, on a clearable scale). Multiple
 * choice is a set of toggle buttons.
 */
export function ChipGroup(props: ChipGroupProps) {
  const { label, options, className } = props;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focused, setFocused] = useState<number | null>(null);
  const endsId = useId();

  if (props.multiple) {
    const selected = new Set(props.value);
    return (
      <div role="group" aria-label={label} className={cx("flex flex-wrap gap-2", className)}>
        {options.map((o) => {
          const isOn = selected.has(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={isOn}
              onClick={() => {
                const next = new Set(selected);
                if (isOn) next.delete(o.value);
                else next.add(o.value);
                props.onChange(options.map((x) => x.value).filter((v) => next.has(v)));
              }}
              className={cx(chip, isOn ? on : off)}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    );
  }

  const { value, ends } = props;
  const chosen = options.findIndex((o) => o.value === value);
  const stop = focused ?? Math.max(0, chosen);

  const choose = (index: number) => {
    const v = options[index].value;
    if (props.clearable) props.onChange(v === value ? null : v);
    else props.onChange(v);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    let next: number | null = null;
    if (e.key === forward || e.key === "ArrowDown") next = (index + 1) % options.length;
    if (e.key === back || e.key === "ArrowUp") next = (index - 1 + options.length) % options.length;
    if (next === null) return;
    e.preventDefault();
    if (!props.clearable) props.onChange(options[next].value);
    setFocused(next);
    refs.current[next]?.focus();
  };

  const group = (
    <div
      role="radiogroup"
      aria-label={label}
      aria-describedby={ends ? endsId : undefined}
      className={cx("flex flex-wrap gap-2", !ends && className)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(null);
      }}
    >
      {options.map((o, i) => {
        const isOn = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isOn}
            tabIndex={i === stop ? 0 : -1}
            onClick={() => choose(i)}
            onFocus={() => setFocused(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cx(chip, isOn ? on : off)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );

  if (!ends) return group;
  return (
    <div className={cx("flex w-fit flex-col gap-1", className)}>
      {group}
      <div id={endsId} className="flex justify-between gap-4 text-label text-ink-secondary">
        <span>{ends.start}</span>
        {ends.end && <span className="text-end">{ends.end}</span>}
      </div>
    </div>
  );
}
