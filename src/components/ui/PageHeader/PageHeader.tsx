import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type PageHeaderProps = {
  title: string;
  /**
   * page: a tab's own screen, with a large title at the start.
   * task: a full-screen task (shot log, add a bag), with a small centred title
   * and a cancel or back action at the start.
   */
  variant?: "page" | "task";
  start?: ReactNode;
  end?: ReactNode;
  className?: string;
};

/** Screen header (NC-02). */
export function PageHeader({ title, variant = "page", start, end, className }: PageHeaderProps) {
  if (variant === "page") {
    return (
      <header className={cx("flex items-end justify-between gap-4", className)}>
        <h1 className="text-h1">{title}</h1>
        {end}
      </header>
    );
  }
  return (
    <header className={cx("grid min-h-11 grid-cols-[1fr_auto_1fr] items-center", className)}>
      <div className="justify-self-start">{start}</div>
      <h1 className="text-body text-ink">{title}</h1>
      <div className="justify-self-end">{end}</div>
    </header>
  );
}
