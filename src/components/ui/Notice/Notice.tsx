import type { ReactNode } from "react";
import type { ShotWarningKind } from "@/domain/shotWarnings";
import { cx } from "@/lib/cx";
import { Button } from "../Button/Button";

type Tone =
  | { tone?: "neutral"; warning?: never }
  /** Shot warnings only: the warning tone needs a shot-warning kind. */
  | { tone: "warning"; warning: ShotWarningKind };

type NoticeProps = Tone & {
  /** block: on detail and tasting screens. inline: one line in a list row. */
  size?: "block" | "inline";
  title?: string;
  children: ReactNode;
  /** One optional action, e.g. retry after a failure. Block size only. */
  action?: { label: string; onClick: () => void };
  /** Announce at once (an error the user must act on); otherwise politely. */
  urgent?: boolean;
  className?: string;
};

/**
 * An inline message (NC-10). Neutral is ink on surface, for errors, info and
 * empty results. Warning is signal on signal-subtle, and only for shot
 * warnings; form errors and failures stay neutral.
 */
export function Notice({
  tone = "neutral",
  warning,
  size = "block",
  title,
  children,
  action,
  urgent = false,
  className,
}: NoticeProps) {
  const isWarning = tone === "warning";
  const role = urgent ? "alert" : "status";

  if (size === "inline") {
    return (
      <span
        role={role}
        data-warning={warning}
        className={cx("text-label", isWarning ? "text-signal" : "text-ink-secondary", className)}
      >
        {children}
      </span>
    );
  }

  return (
    <div
      role={role}
      data-warning={warning}
      className={cx(
        "flex flex-col gap-3 rounded-md px-4 py-3",
        isWarning ? "bg-signal-subtle text-signal" : "bg-surface text-ink",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        {title && <p className="text-body">{title}</p>}
        <div className={cx("text-body", !isWarning && title && "text-ink-secondary")}>
          {children}
        </div>
      </div>
      {action && (
        <Button size="sm" onClick={action.onClick} className="self-start">
          {action.label}
        </Button>
      )}
    </div>
  );
}
