"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useId, useRef, type KeyboardEvent } from "react";
import { cx } from "@/lib/cx";
import { decimalsOf, type CanonicalUnit } from "@/lib/units";
import { NumberWheel } from "../NumberWheel/NumberWheel";

export type DialField = {
  key: string;
  label: string;
  /** In display units (grams, seconds, grinder units). */
  value: number;
  /** The value the log opened with, shown as "was" once changed. */
  startValue: number;
  min: number;
  max: number;
  step: number;
  majorEvery?: number;
  unit?: CanonicalUnit;
};

type ShotDialProps = {
  /** Accessible name for the row of value tabs. */
  label: string;
  fields: DialField[];
  selected: string;
  onSelect: (key: string) => void;
  onChange: (key: string, value: number) => void;
  className?: string;
};

/**
 * The shot log's editor (NC-09): a row of compact value tabs above one full
 * NumberWheel for the selected value. All values stay visible; one is edited
 * at a time, so the log fits a phone screen without scrolling.
 */
export function ShotDial({ label, fields, selected, onSelect, onChange, className }: ShotDialProps) {
  const t = useTranslations("log");
  const format = useFormatter();
  const baseId = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = fields.find((f) => f.key === selected) ?? fields[0];
  const show = (f: DialField, v: number) =>
    format.number(v, { minimumFractionDigits: decimalsOf(f.step), maximumFractionDigits: decimalsOf(f.step) });

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    let next: number | null = null;
    if (e.key === forward) next = (index + 1) % fields.length;
    if (e.key === back) next = (index - 1 + fields.length) % fields.length;
    if (next === null) return;
    e.preventDefault();
    onSelect(fields[next].key);
    tabs.current[next]?.focus();
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className="grid border-b border-line" style={{ gridTemplateColumns: `repeat(${fields.length}, 1fr)` }}>
        {fields.map((f, i) => {
          const active = f.key === current.key;
          const changed = Math.abs(f.value - f.startValue) > 1e-9;
          return (
            <button
              key={f.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${baseId}-tab-${f.key}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`${baseId}-panel`}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(f.key)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cx(
                "-mb-px flex flex-col items-center border-b-2 px-0.5 pt-2 pb-2.5",
                active ? "border-ink" : "border-transparent",
              )}
            >
              <span className="text-overline uppercase text-ink-secondary">{f.label}</span>
              <span className="text-h3 text-ink">{show(f, f.value)}</span>
              <span className="min-h-[1.1em] text-overline text-ink-secondary">
                {changed ? t("was", { value: show(f, f.startValue) }) : ""}
              </span>
            </button>
          );
        })}
      </div>
      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${current.key}`} className="pt-6">
        <NumberWheel
          key={current.key}
          label={current.label}
          value={current.value}
          onChange={(v) => onChange(current.key, v)}
          min={current.min}
          max={current.max}
          step={current.step}
          majorEvery={current.majorEvery}
          unit={current.unit}
        />
      </div>
    </div>
  );
}
