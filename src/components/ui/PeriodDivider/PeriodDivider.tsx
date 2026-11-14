import Link from "next/link";
import { cx } from "@/lib/cx";

/**
 * A grind period divider (STORY-04-01-04): a strong hairline with one quiet
 * line naming the grinder, the work and the date, and "recalibration" in
 * words when marked. Quieter than a shot row: overline size, no values.
 * With `href` it opens the grinder. Render it inside a list item so screen
 * readers announce it among the shots. Props only.
 */
export function PeriodDivider({ text, marker, href }: { text: string; marker?: string; href?: string }) {
  const words = (
    <span className="text-overline uppercase text-ink-secondary">
      {text}
      {marker && (
        <>
          {" · "}
          {marker}
        </>
      )}
    </span>
  );
  const line = <span aria-hidden="true" className="h-px min-w-6 flex-1 bg-line-strong" />;
  const row = "flex min-h-11 items-center gap-2.5 py-2 text-center";
  return href ? (
    <Link href={href} className={cx(row, "transition-colors hover:bg-surface")}>
      {line}
      {words}
      {line}
    </Link>
  ) : (
    <div className={row}>
      {line}
      {words}
      {line}
    </div>
  );
}
