import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { cx } from "@/lib/cx";

/*
 * Checklist (NC-12): numbered steps to a first goal. A done step shows a
 * check and drops to ink-secondary; the next step carries the only primary
 * action, or a detail in its place; later steps wait quietly.
 */

export type ChecklistStep = {
  id: string;
  title: string;
  /** One line under the next step. */
  hint?: string;
  state: "done" | "next" | "later";
  /** The next step's primary action. */
  action?: { label: string; href: string };
  /** Shown on the next step in place of its action, e.g. the setup offer. */
  detail?: ReactNode;
};

export function Checklist({ steps, doneLabel, className }: { steps: ChecklistStep[]; doneLabel: string; className?: string }) {
  return (
    <ol className={cx("flex flex-col", className)}>
      {steps.map((step, i) => {
        const done = step.state === "done";
        const next = step.state === "next";
        return (
          <li key={step.id} aria-current={next ? "step" : undefined} className="flex gap-4 border-b border-line py-5 last:border-b-0">
            <span
              aria-hidden="true"
              className={cx(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-label",
                next ? "border-ink text-ink" : "border-line text-ink-secondary",
              )}
            >
              {done ? <Icon name="check" size={16} /> : i + 1}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex flex-col gap-1 pt-0.5">
                <p className={cx("text-body", done || !next ? "text-ink-secondary" : "text-ink")}>
                  {step.title}
                  {done && <span className="sr-only">{`, ${doneLabel}`}</span>}
                </p>
                {next && step.hint && <p className="text-label text-ink-secondary">{step.hint}</p>}
              </div>
              {next &&
                (step.detail ??
                  (step.action && (
                    <Link href={step.action.href} className={cx(buttonClass({ variant: "primary" }), "self-start")}>
                      {step.action.label}
                    </Link>
                  )))}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
