"use client";

import { useLocale } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { cx } from "@/lib/cx";
import {
  decimalSeparator,
  decimalsOf,
  formatValueParts,
  parseDecimal,
  sanitizeDecimal,
  type CanonicalUnit,
} from "@/lib/units";

type NumberWheelProps = {
  /** Visible label, e.g. "Dose". Also the slider's accessible name. */
  label: string;
  /** Value in display units (grams, seconds, °C). Always a multiple of `step`. */
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  /** Smallest change, e.g. 0.1 for dose and time. */
  step: number;
  /** A labelled major tick every N steps. */
  majorEvery?: number;
  /** Intl unit; the browser supplies the localised symbol. */
  unit?: CanonicalUnit;
  /** For units Intl doesn't know (bar). Pass a translated string. */
  unitLabel?: string;
  className?: string;
};

const PX_PER_STEP = 12;
/** Momentum decays with this time constant (ms) after a flick. */
const DECAY_MS = 325;
const SETTLE_MS = 180;
/** Fastest flick in px/ms, so a jerky swipe can't fling the value across the range. */
const MAX_FLICK_PX_PER_MS = 3;

/**
 * A large ruler-style input for shot values. Drag or flick the ruler under
 * the fixed centre needle; it snaps to the nearest step. Fully operable by
 * keyboard (arrows, Page Up/Down, Home/End) and announced as a slider.
 * In right-to-left layouts the ruler mirrors: values increase leftwards.
 *
 * The big number is also a text field, for typing a value read off a scale.
 * It accepts digits and one decimal mark only, and commits on Enter or blur
 * (snapped to the step and clamped to the range). Escape cancels.
 */
export function NumberWheel({
  label,
  value,
  onChange,
  min,
  max,
  step,
  majorEvery = 10,
  unit,
  unitLabel,
  className,
}: NumberWheelProps) {
  const locale = useLocale();
  const labelId = useId();
  const unitId = useId();
  const rulerRef = useRef<HTMLDivElement>(null);
  const decimals = decimalsOf(step);

  // While dragging or animating, the ruler follows a fractional position;
  // otherwise it shows the controlled value.
  const [livePosition, setLivePosition] = useState<number | null>(null);
  const position = livePosition ?? value;
  const [width, setWidth] = useState(0);
  // Text being typed into the big number; null when not editing.
  const [draft, setDraft] = useState<string | null>(null);
  const separator = decimalSeparator(locale);

  // Handlers and animation frames read these between renders.
  const positionRef = useRef(position);
  const lastEmitted = useRef(value);
  useLayoutEffect(() => {
    positionRef.current = position;
    if (livePosition === null) lastEmitted.current = value;
  });
  const frame = useRef<number | null>(null);
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startPosition: number;
    lastPosition: number;
    lastTime: number;
    velocity: number; // value units per ms
  } | null>(null);

  const clamp = useCallback(
    (v: number) => Math.min(max, Math.max(min, v)),
    [min, max],
  );
  const snap = useCallback(
    (v: number) =>
      Number(clamp(min + Math.round((v - min) / step) * step).toFixed(decimals)),
    [clamp, min, step, decimals],
  );

  const emit = useCallback(
    (v: number) => {
      const snapped = snap(v);
      if (snapped !== lastEmitted.current) {
        lastEmitted.current = snapped;
        onChange(snapped);
      }
    },
    [snap, onChange],
  );

  const moveTo = useCallback(
    (v: number) => {
      positionRef.current = v;
      setLivePosition(v);
      emit(v);
    },
    [emit],
  );

  const stopAnimation = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };

  /** Eases to the nearest step, then hands control back to `value`. */
  const settle = useCallback(() => {
    const from = positionRef.current;
    const to = snap(from);
    emit(to);
    if (prefersReducedMotion() || from === to) {
      setLivePosition(null);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SETTLE_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      positionRef.current = from + (to - from) * eased;
      setLivePosition(positionRef.current);
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else {
        frame.current = null;
        setLivePosition(null);
      }
    };
    frame.current = requestAnimationFrame(tick);
  }, [snap, emit]);

  /** Coasts with decaying velocity after a flick, then settles. */
  const coast = useCallback(
    (initialVelocity: number) => {
      let velocity = initialVelocity;
      let last = performance.now();
      const tick = (now: number) => {
        const dt = now - last;
        last = now;
        velocity *= Math.exp(-dt / DECAY_MS);
        const next = positionRef.current + velocity * dt;
        const clamped = clamp(next);
        moveTo(clamped);
        const slowEnough = Math.abs(velocity) < (step * 2) / 1000;
        if (slowEnough || clamped !== next) {
          frame.current = null;
          settle();
        } else {
          frame.current = requestAnimationFrame(tick);
        }
      };
      frame.current = requestAnimationFrame(tick);
    },
    [clamp, moveTo, settle, step],
  );

  useEffect(() => stopAnimation, []);

  // Track the ruler's width to render only the ticks that are visible.
  useEffect(() => {
    const el = rulerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Horizontal trackpad swipes move the ruler; vertical scrolling is left
  // to the page. Needs a non-passive listener to prevent the browser's
  // back/forward swipe.
  useEffect(() => {
    const el = rulerRef.current;
    if (!el) return;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      stopAnimation();
      const sign = isRtl(el) ? -1 : 1;
      moveTo(clamp(positionRef.current + ((e.deltaX * sign) / PX_PER_STEP) * step));
      clearTimeout(idle);
      idle = setTimeout(settle, 120);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(idle);
    };
  }, [clamp, moveTo, settle, step]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    stopAnimation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startPosition: positionRef.current,
      lastPosition: positionRef.current,
      lastTime: e.timeStamp,
      velocity: 0,
    };
    setLivePosition(positionRef.current);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    // Dragging the ruler towards the start reveals higher values.
    const sign = isRtl(e.currentTarget) ? -1 : 1;
    const dx = (e.clientX - d.startX) * sign;
    const next = clamp(d.startPosition - (dx / PX_PER_STEP) * step);
    const dt = Math.max(1, e.timeStamp - d.lastTime);
    const instant = (next - d.lastPosition) / dt;
    d.velocity = d.velocity * 0.2 + instant * 0.8;
    d.lastPosition = next;
    d.lastTime = e.timeStamp;
    moveTo(next);
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    drag.current = null;
    // A pause before release means no flick.
    const stale = e.timeStamp - d.lastTime > 80;
    const minFlick = (step * 4) / 1000;
    if (!stale && !prefersReducedMotion() && Math.abs(d.velocity) > minFlick) {
      const maxFlick = (MAX_FLICK_PX_PER_MS / PX_PER_STEP) * step;
      coast(Math.max(-maxFlick, Math.min(maxFlick, d.velocity)));
    } else {
      settle();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const rtl = isRtl(e.currentTarget);
    const big = step * majorEvery;
    const deltas: Record<string, number> = {
      ArrowUp: step,
      ArrowDown: -step,
      ArrowRight: rtl ? -step : step,
      ArrowLeft: rtl ? step : -step,
      PageUp: big,
      PageDown: -big,
    };
    let next: number | undefined;
    if (e.key in deltas) next = value + deltas[e.key];
    else if (e.key === "Home") next = min;
    else if (e.key === "End") next = max;
    if (next === undefined) return;
    e.preventDefault();
    stopAnimation();
    setLivePosition(null);
    emit(next);
  };

  // Enter and Escape blur the field themselves; the blur that follows must
  // not commit again (or, after Escape, commit the text being cancelled).
  const skipBlurCommit = useRef(false);

  const commitDraft = () => {
    if (skipBlurCommit.current) {
      skipBlurCommit.current = false;
      return;
    }
    if (draft === null) return;
    const typed = parseDecimal(draft, separator);
    setDraft(null);
    if (typed === null) return;
    stopAnimation();
    setLivePosition(null);
    emit(typed);
  };

  const onDraftKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitDraft();
      skipBlurCommit.current = true;
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setDraft(null);
      skipBlurCommit.current = true;
      e.currentTarget.blur();
    }
  };

  // Display the snapped value even mid-drag, so digits change in whole steps.
  const shown = snap(position);
  const parts = formatValueParts(locale, shown, decimals, unit);
  const unitText = unitLabel ?? parts.unit;
  const fieldText = draft ?? parts.number;
  const valueText = unitLabel
    ? `${parts.number} ${unitLabel}`
    : new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        ...(unit && { style: "unit", unit, unitDisplay: "long" }),
      }).format(shown);

  // Only the ticks that fit in the ruler (plus a margin) are rendered.
  const centre = (position - min) / step;
  const half = Math.ceil(width / 2 / PX_PER_STEP) + 2;
  const lastIndex = Math.round((max - min) / step);
  const ticks: number[] = [];
  for (
    let i = Math.max(0, Math.floor(centre - half));
    i <= Math.min(lastIndex, Math.ceil(centre + half));
    i++
  ) {
    ticks.push(i);
  }
  const majorFormat = new Intl.NumberFormat(locale, {
    maximumFractionDigits: decimals,
  });

  return (
    <div className={cx("flex w-full flex-col items-center gap-4", className)}>
      <span id={labelId} className="text-overline text-ink-secondary uppercase">
        {label}
      </span>

      <div className="flex items-baseline gap-2">
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          enterKeyHint="done"
          aria-labelledby={labelId}
          aria-describedby={unitText ? unitId : undefined}
          value={fieldText}
          onFocus={(e) => {
            setDraft(parts.number);
            e.currentTarget.select();
          }}
          onChange={(e) =>
            setDraft(sanitizeDecimal(e.target.value, separator, decimals))
          }
          onBlur={commitDraft}
          onKeyDown={onDraftKeyDown}
          className={cx(
            "text-display-xl bg-transparent text-end text-ink outline-none",
            "border-b border-transparent focus:border-ink",
          )}
          style={{ width: fieldWidth(fieldText, separator) }}
        />
        {unitText && (
          <span id={unitId} aria-hidden="true" className="text-h2 text-ink-tertiary">
            {unitText}
          </span>
        )}
      </div>

      <div
        ref={rulerRef}
        role="slider"
        tabIndex={0}
        aria-labelledby={labelId}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={shown}
        aria-valuetext={valueText}
        aria-orientation="horizontal"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className={cx(
          "relative h-20 w-full cursor-grab touch-pan-y select-none overflow-hidden rounded-md",
          "active:cursor-grabbing",
          "[mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]",
        )}
      >
        {ticks.map((i) => {
          const major = i % majorEvery === 0;
          const mid = majorEvery % 2 === 0 && i % (majorEvery / 2) === 0;
          return (
            <div
              key={i}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center gap-2 rtl:translate-x-1/2"
              style={{ insetInlineStart: `calc(50% + ${(i - centre) * PX_PER_STEP}px)` }}
            >
              <div
                className={cx(
                  "w-px",
                  major ? "h-8 bg-ink-tertiary" : mid ? "h-6 bg-line-strong" : "h-4 bg-line-strong",
                )}
              />
              {major && (
                <span className="text-label text-ink-secondary">
                  {majorFormat.format(min + i * step)}
                </span>
              )}
            </div>
          );
        })}
        {/* The fixed needle marking the current value. */}
        <div className="pointer-events-none absolute top-0 start-1/2 h-11 w-0.5 -translate-x-1/2 rounded-full bg-ink rtl:translate-x-1/2" />
      </div>
    </div>
  );
}

/** Sizes the field to its text: tabular digits are 1ch, the decimal mark about half. */
function fieldWidth(text: string, separator: string) {
  const marks = text.split(separator).length - 1;
  const digits = text.length - marks;
  return `${Math.max(1, digits + marks * 0.5)}ch`;
}

function isRtl(el: Element) {
  return getComputedStyle(el).direction === "rtl";
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
