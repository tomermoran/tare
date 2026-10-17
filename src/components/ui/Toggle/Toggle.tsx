import { useId } from "react";
import { cx } from "@/lib/cx";

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

/** An on/off switch with a visible label (NC-13). */
export function Toggle({ label, checked, onChange, className }: ToggleProps) {
  const labelId = useId();
  return (
    <div className={cx("flex items-center justify-between gap-4", className)}>
      <span id={labelId} className="text-body text-ink">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative h-[26px] w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-ink" : "bg-line-strong",
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
}
