import { useId } from "react";
import { cx } from "@/lib/cx";

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Can't be switched now; say why in `hint` (DES-02-05-04). */
  disabled?: boolean;
  /** A line under the switch, linked to it, e.g. why it's disabled. */
  hint?: string;
  className?: string;
};

/** An on/off switch with a visible label (NC-13), optionally disabled with its reason in words. */
export function Toggle({ label, checked, onChange, disabled = false, hint, className }: ToggleProps) {
  const labelId = useId();
  const hintId = useId();
  const row = (
    <div className={cx("flex items-center justify-between gap-4", !hint && className)}>
      <span id={labelId} className="text-body text-ink">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={hint ? hintId : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative h-[26px] w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-ink" : "bg-line-strong",
          disabled && "cursor-not-allowed opacity-40",
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            "absolute top-[3px] start-[3px] size-5 rounded-full bg-paper transition-transform",
            checked && "translate-x-[18px] rtl:-translate-x-[18px]",
          )}
        />
      </button>
    </div>
  );
  if (!hint) return row;
  return (
    <div className={cx("flex flex-col gap-1", className)}>
      {row}
      <p id={hintId} className="text-label text-ink-secondary">
        {hint}
      </p>
    </div>
  );
}
