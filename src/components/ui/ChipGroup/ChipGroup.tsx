"use client";

import { useRef, type KeyboardEvent } from "react";
import { cx } from "@/lib/cx";

type Option = { value: string; label: string };

type ChipGroupProps = {
  /** Accessible name for the group. */
  label: string;
  options: Option[];
  className?: string;
} & (
  | { multiple?: false; value: string | null; onChange: (value: string) => void }
  | { multiple: true; value: string[]; onChange: (value: string[]) => void }
);

const chip =
  "min-h-10 rounded-full border px-4 text-label transition-colors";
const off = "border-line-strong text-ink hover:bg-surface";
const on = "border-ink bg-ink text-on-action";

/**
 * Chips for choosing (NC-04). Single choice is a radio group: one tab stop,
 * arrow keys move and select. Multiple choice is a set of toggle buttons.
 */
export function ChipGroup(props: ChipGroupProps) {
  const { label, options, className } = props;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

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

  const { value, onChange } = props;
  const current = Math.max(0, options.findIndex((o) => o.value === value));

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    let next: number | null = null;
    if (e.key === forward || e.key === "ArrowDown") next = (index + 1) % options.length;
    if (e.key === back || e.key === "ArrowUp") next = (index - 1 + options.length) % options.length;
    if (next === null) return;
    e.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={label} className={cx("flex flex-wrap gap-2", className)}>
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
            tabIndex={i === current ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cx(chip, isOn ? on : off)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
