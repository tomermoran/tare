import Link from "next/link";
import { cx } from "@/lib/cx";
import { Button } from "../Button/Button";

/*
 * What a list or screen shows when it has nothing yet (NC-12): one heading,
 * one sentence, and at most one action. The type allows only one, so a busy
 * empty state can't be built by accident.
 */

type Action =
  | { label: string; href: string; onClick?: never }
  | { label: string; onClick: () => void; href?: never };

const actionClass =
  "inline-flex h-12 items-center justify-center rounded-md bg-action px-6 text-body text-on-action hover:bg-action-hover";

export function EmptyState({
  title,
  children,
  action,
  className,
}: {
  title: string;
  /** One sentence saying what will appear here, or how to start. */
  children: string;
  action?: Action;
  className?: string;
}) {
  return (
    <section
      className={cx("flex flex-col items-center gap-3 px-4 py-16 text-center", className)}
    >
      <h2 className="text-h2 text-ink">{title}</h2>
      <p className="max-w-[32ch] text-body text-ink-secondary">{children}</p>
      {action &&
        (action.href !== undefined ? (
          <Link href={action.href} className={cx(actionClass, "mt-5")}>
            {action.label}
          </Link>
        ) : (
          <Button variant="primary" className="mt-5" onClick={action.onClick}>
            {action.label}
          </Button>
        ))}
    </section>
  );
}
