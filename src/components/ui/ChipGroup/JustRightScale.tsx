"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cx } from "@/lib/cx";

/*
 * The just-right scale (NC-04, STORY-01-05-02): one taste question as five
 * compact chips, or three for a one-sided question, with "just right" in
 * the middle. The outer chips are dots that grow from "a bit" to "much";
 * their accessible names say which. Nothing is chosen until tapped, and
 * tapping the chosen chip again clears it (AC 3, AC 5). A radio group:
 * arrow keys move, space or enter chooses. End words sit under the outer
 * chips and mirror in right-to-left. The centre's outline is a step
 * stronger, as the resting point.
 */

export type JustRightLabels = {
  /** The question, e.g. "Balance". */
  label: string;
  justRight: string;
  /** Under the start and end chips, e.g. "Too sour" and "Too bitter". */
  start: string;
  end?: string;
  /** Accessible name per answer, e.g. { "-2": "Much too sour", ... }. */
  names: Record<string, string>;
};

const dot = { 1: "size-2", 2: "size-3.5" } as const;

export function JustRightScale({
  labels,
  oneSided = false,
  value,
  onChange,
  className,
}: {
  labels: JustRightLabels;
  /** Sweetness: from "much" to "just right" only. */
  oneSided?: boolean;
  /** -2..2 (or -2..0 one-sided); null when unanswered. */
  value: number | null;
  onChange: (value: number | null) => void;
  className?: string;
}) {
  const points = oneSided ? [-2, -1, 0] : [-2, -1, 0, 1, 2];
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focused, setFocused] = useState<number | null>(null);
  const id = useId();
  const chosen = points.indexOf(value ?? NaN);
  const stop = focused ?? (chosen >= 0 ? chosen : points.indexOf(0));

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    let next: number | null = null;
    if (e.key === forward || e.key === "ArrowDown") next = Math.min(points.length - 1, index + 1);
    if (e.key === back || e.key === "ArrowUp") next = Math.max(0, index - 1);
    if (next === null) return;
    e.preventDefault();
    setFocused(next);
    refs.current[next]?.focus();
  };

  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <span id={`${id}-label`} className="text-body text-ink">
        {labels.label}
      </span>
      <div className="flex w-fit flex-col gap-1">
        <div
          role="radiogroup"
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-ends`}
          className="flex items-center gap-2"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setFocused(null);
          }}
        >
          {points.map((p, i) => {
            const isOn = p === value;
            const centre = p === 0;
            return (
              <button
                key={p}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isOn}
                aria-label={centre ? undefined : labels.names[String(p)]}
                tabIndex={i === stop ? 0 : -1}
                onClick={() => onChange(isOn ? null : p)}
                onFocus={() => setFocused(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cx(
                  "flex h-10 shrink-0 items-center justify-center rounded-full border transition-colors",
                  centre ? "px-4 text-label" : "w-10",
                  isOn
                    ? "border-ink bg-ink text-on-action"
                    : cx("text-ink hover:bg-surface", centre ? "border-line-strong" : "border-line"),
                )}
              >
                {centre ? (
                  labels.justRight
                ) : (
                  <span aria-hidden className={cx("rounded-full", dot[Math.abs(p) as 1 | 2], isOn ? "bg-on-action" : "bg-ink-secondary")} />
                )}
              </button>
            );
          })}
        </div>
        <div id={`${id}-ends`} className="flex justify-between gap-4 text-label text-ink-secondary">
          <span>{labels.start}</span>
          {labels.end && <span className="text-end">{labels.end}</span>}
        </div>
      </div>
    </div>
  );
}
