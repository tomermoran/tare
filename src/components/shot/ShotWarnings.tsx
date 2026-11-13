import { Notice } from "@/components/ui/Notice/Notice";
import type { ShotWarningKind } from "@/domain/shotWarnings";

/*
 * The shot warnings, the same everywhere a shot is shown (STORY-01-05-04
 * AC 2): a block Notice on tasting, the shot's detail and edit mode, an
 * inline one in a Journal row. The only component that renders them; the
 * words carry the meaning, never the colour alone (AC 3). Nothing renders
 * without a warning.
 */
export function ShotWarnings({
  warnings,
  labels,
  size = "block",
  className,
}: {
  warnings: readonly ShotWarningKind[];
  labels: Record<ShotWarningKind, string>;
  size?: "block" | "inline";
  className?: string;
}) {
  if (warnings.length === 0) return null;
  return warnings.map((w) => (
    <Notice key={w} tone="warning" warning={w} size={size} className={className}>
      {labels[w]}
    </Notice>
  ));
}
