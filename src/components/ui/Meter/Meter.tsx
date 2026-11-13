/**
 * Meter (NC-15): how much of something is left, as a 2 px hairline track
 * with an ink fill growing from the inline start, so it mirrors in RTL. It
 * only supports a number shown beside it, and carries that number as text
 * for assistive tech.
 */
export function Meter({
  label,
  value,
  max,
  valueText,
  className = "",
}: {
  /** The meter's accessible name. */
  label: string;
  value: number;
  max: number;
  /** The value in words, e.g. "120 g of 250 g left". */
  valueText: string;
  className?: string;
}) {
  const clamped = Math.min(Math.max(value, 0), Math.max(max, 0));
  const percent = max > 0 ? (clamped / max) * 100 : 0;
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-valuetext={valueText}
      className={`h-0.5 w-full bg-line ${className}`}
    >
      <div className="h-full bg-ink" style={{ width: `${percent}%` }} />
    </div>
  );
}
