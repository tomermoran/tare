import { useId, type ComponentProps } from "react";
import { cx } from "@/lib/cx";

type InputProps = Omit<ComponentProps<"input">, "size"> & {
  label: string;
  /** Short helper text under the field. */
  hint?: string;
  /** Replaces the hint and marks the field invalid. */
  error?: string;
  /** Unit shown at the inline end of the field, e.g. "g". */
  unit?: string;
};

/*
 * Errors use ink and a stronger border, not the signal colour:
 * signal is reserved for shot warnings.
 */
export function Input({
  label,
  hint,
  error,
  unit,
  id,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <label htmlFor={inputId} className="text-label text-ink-secondary">
        {label}
      </label>
      <div
        className={cx(
          "flex h-12 items-center gap-2 rounded-md bg-surface-sunken px-4",
          "border transition-colors",
          error ? "border-ink" : "border-transparent hover:border-line-strong",
          "focus-within:border-ink",
          props.disabled && "opacity-60",
        )}
      >
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cx(
            "min-w-0 flex-1 bg-transparent text-body text-ink outline-none",
            "placeholder:text-ink-tertiary disabled:cursor-not-allowed",
          )}
          {...props}
        />
        {unit && (
          <span aria-hidden="true" className="text-body text-ink-tertiary">
            {unit}
          </span>
        )}
      </div>
      {message && (
        <p
          id={messageId}
          className={cx("text-label", error ? "text-ink" : "text-ink-secondary")}
        >
          {message}
        </p>
      )}
    </div>
  );
}
