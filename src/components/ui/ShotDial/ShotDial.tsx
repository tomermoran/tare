"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useId, useRef, type KeyboardEvent } from "react";
import { cx } from "@/lib/cx";
import { decimalsOf, type CanonicalUnit } from "@/lib/units";
import { Button } from "../Button/Button";
import { ChipGroup } from "../ChipGroup/ChipGroup";
import { NumberWheel } from "../NumberWheel/NumberWheel";

type FieldBase = {
  key: string;
  label: string;
  /**
   * An optional value (temperature, pressure): it can be unset (null), shown
   * as an em dash, with a button to add it and one to clear it again.
   */
  optional?: { addLabel: string; clearLabel: string; hint: string; addValue: number };
};

export type WheelField = FieldBase & {
  kind?: "wheel";
  /** In display units (grams, seconds, grinder units, °C or °F, bar). */
  value: number | null;
  /** The value the log opened with, shown as "was" once changed. */
  startValue: number | null;
  min: number;
  max: number;
  step: number;
  majorEvery?: number;
  unit?: CanonicalUnit;
  /** A unit Intl doesn't know (bar), from the messages. */
  unitLabel?: { symbol: string; valueText: (formattedNumber: string) => string };
  /** The ruler's end captions, e.g. finer and coarser for grind. */
  endCaptions?: { lower: string; higher: string };
};

/** A machine's numbered settings, 1 to count: never degrees or bar. */
export type StepsField = FieldBase & { kind: "steps"; count: number; value: number | null; startValue: number | null };

export type DialField = WheelField | StepsField;

type ShotDialProps = {
  /** Accessible name for the row of value tabs. */
  label: string;
  fields: DialField[];
  selected: string;
  onSelect: (key: string) => void;
  onChange: (key: string, value: number | null) => void;
  className?: string;
};

const stepOf = (f: DialField) => (f.kind === "steps" ? 1 : f.step);

/**
 * The shot log's editor (NC-09): a row of compact value tabs above one full
 * NumberWheel (or a machine's settings as chips) for the selected value.
 * All values stay visible; one is edited at a time, so the log fits a phone
 * screen. Optional values start unset; past six tabs the row scrolls.
 */
export function ShotDial({ label, fields, selected, onSelect, onChange, className }: ShotDialProps) {
  const t = useTranslations("log");
  const format = useFormatter();
  const baseId = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = fields.find((f) => f.key === selected) ?? fields[0];
  const show = (f: DialField, v: number | null) =>
    v === null
      ? t("unset")
      : format.number(v, { minimumFractionDigits: decimalsOf(stepOf(f)), maximumFractionDigits: decimalsOf(stepOf(f)) });

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

  const panel = (f: DialField) => {
    if (f.value === null && f.optional) {
      const add = f.optional.addValue;
      return (
        <div className="flex flex-col items-center gap-3 py-6">
          <Button variant="secondary" onClick={() => onChange(f.key, add)}>
            {f.optional.addLabel}
          </Button>
          <p className="text-center text-label text-ink-secondary">{f.optional.hint}</p>
        </div>
      );
    }
    const value = f.value ?? 0;
    return (
      <div className="flex flex-col gap-4">
        {f.kind === "steps" ? (
          <ChipGroup
            label={f.label}
            className="justify-center"
            options={Array.from({ length: f.count }, (_, i) => ({ value: String(i + 1), label: format.number(i + 1) }))}
            value={String(value)}
            onChange={(v) => onChange(f.key, Number(v))}
          />
        ) : (
          <NumberWheel
            key={f.key}
            label={f.label}
            value={value}
            onChange={(v) => onChange(f.key, v)}
            min={f.min}
            max={f.max}
            step={f.step}
            majorEvery={f.majorEvery}
            endCaptions={f.endCaptions}
            unit={f.unit}
            unitLabel={f.unitLabel}
          />
        )}
        {f.optional && (
          <Button variant="ghost" size="sm" className="self-center" onClick={() => onChange(f.key, null)}>
            {f.optional.clearLabel}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className="flex overflow-x-auto border-b border-line">
        {fields.map((f, i) => {
          const active = f.key === current.key;
          // "was" names a starting value; an optional value that started unset has none.
          const changed = f.startValue !== null && (f.value === null || Math.abs(f.value - f.startValue) > 1e-9);
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
                "-mb-px flex min-w-14 flex-1 shrink-0 flex-col items-center border-b-2 px-0.5 pt-2 pb-2.5",
                active ? "border-ink" : "border-transparent",
              )}
            >
              <span className="max-w-full truncate text-overline uppercase text-ink-secondary">{f.label}</span>
              <span className={cx("text-h3", f.value === null ? "text-ink-secondary" : "text-ink")}>
                {f.value === null ? (
                  <>
                    <span aria-hidden="true">{t("unset")}</span>
                    <span className="sr-only">{t("notSet")}</span>
                  </>
                ) : (
                  show(f, f.value)
                )}
              </span>
              <span className="min-h-[1.1em] text-overline text-ink-secondary">
                {changed ? t("was", { value: show(f, f.startValue) }) : ""}
              </span>
            </button>
          );
        })}
      </div>
      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${current.key}`} className="pt-6">
        {panel(current)}
      </div>
    </div>
  );
}
