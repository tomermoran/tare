import { cx } from "@/lib/cx";

type SelectFieldProps = {
  /** The current choice, as shown. */
  value: string;
  onClick: () => void;
  /**
   * field: a labelled row on surface-sunken, like Input (shot log context).
   * quiet: the value alone with a chevron (the home screen's drink and coffee).
   */
  look?: "field" | "quiet";
  /** Visible label for the field look. */
  label?: string;
  /**
   * For the quiet look, which has no visible label: read before the value by
   * screen readers ("Change drink"), so the spoken name contains the visible text.
   */
  hiddenLabel?: string;
  /** Type classes for the quiet look's value, e.g. "text-h1". */
  valueClassName?: string;
  className?: string;
};

function Chevron() {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className="size-3 shrink-0 fill-none stroke-current"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 4.5 6 7.5 9 4.5" />
    </svg>
  );
}

/** Shows the current choice and opens a picker (NC-06). */
export function SelectField({
  value,
  onClick,
  look = "field",
  label,
  hiddenLabel,
  valueClassName,
  className,
}: SelectFieldProps) {
  if (look === "quiet") {
    return (
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={onClick}
        className={cx("inline-flex items-center gap-2 text-start", className)}
      >
        <span className={valueClassName}>
          {hiddenLabel && <span className="sr-only">{hiddenLabel}: </span>}
          {value}
        </span>
        <Chevron />
      </button>
    );
  }
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onClick}
      className={cx(
        "flex w-full items-center justify-between gap-3 bg-surface-sunken px-4 py-2.5 text-start transition-colors hover:bg-line",
        className,
      )}
    >
      <span className="text-overline uppercase text-ink-secondary">{label}</span>
      <span className="flex items-center gap-2 text-body text-ink">
        {value}
        <Chevron />
      </span>
    </button>
  );
}
