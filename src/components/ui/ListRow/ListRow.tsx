import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type ListRowProps = {
  primary: ReactNode;
  secondary?: ReactNode;
  /** Values or a short label at the inline end. */
  end?: ReactNode;
  /** A full-width line under the row: markers, an inline shot warning. */
  footer?: ReactNode;
  /** Makes the whole row one button. */
  onClick?: () => void;
  className?: string;
};

/** A hairline-separated list row (NC-03). Lighter than a Card, for lists. */
export function ListRow({ primary, secondary, end, footer, onClick, className }: ListRowProps) {
  const content = (
    <>
      <span className="flex min-w-0 flex-col">
        <span className="text-body text-ink">{primary}</span>
        {secondary && <span className="text-label text-ink-secondary">{secondary}</span>}
      </span>
      {end && <span className="text-end">{end}</span>}
      {footer && <span className="col-span-2 flex flex-wrap gap-x-3 gap-y-1">{footer}</span>}
    </>
  );
  const classes = cx(
    "grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 border-b border-line py-3.5 text-start",
    className,
  );
  return onClick ? (
    <button type="button" onClick={onClick} className={cx(classes, "transition-colors hover:bg-surface")}>
      {content}
    </button>
  ) : (
    <div className={classes}>{content}</div>
  );
}
