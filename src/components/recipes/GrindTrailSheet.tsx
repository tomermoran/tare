"use client";

import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import type { GrindTrailView } from "@/lib/grindTrail";

/**
 * The quiet line under the values on Brew and under the grind wheel in the
 * log (STORY-04-02-06 AC 1): the recipe's grind and the reason, opening
 * SH-DRIFT. A ghost button, never a warning colour.
 */
export function GrindReasonLine({ label, onClick, className }: { label: string; onClick: () => void; className?: string }) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick} className={`self-start text-label text-ink-secondary ${className ?? ""}`}>
      {label}
      <Icon name="chevron" />
    </Button>
  );
}

/**
 * SH-DRIFT, "why this grind" (STORY-04-02-08): the recipe's grind, a signed
 * row per step that moved it, a hairline, then the grind shown; what it
 * rests on below; on Brew, a footer to use the recipe's grind for this pull
 * only. Ink only.
 */
export function GrindTrailSheet({
  open,
  onClose,
  view,
  onUseRecipe,
}: {
  open: boolean;
  onClose: () => void;
  view: GrindTrailView;
  onUseRecipe?: () => void;
}) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={view.title}
      closeLabel={view.close}
      footer={
        view.useRecipe && onUseRecipe ? (
          <Button variant="secondary" fullWidth onClick={onUseRecipe}>
            {view.useRecipe}
          </Button>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-body text-ink-secondary">{view.recipe.label}</span>
          <span className="text-h3 text-ink">{view.recipe.value}</span>
        </div>
        <ul className="-mt-4">
          {view.rows.map((row) => (
            <li key={row.label}>
              <ListRow primary={row.label} end={<span className="text-body text-ink">{row.value}</span>} />
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
          <span className="text-body text-ink">{view.shown.label}</span>
          <span className="text-display text-ink">{view.shown.value}</span>
        </div>
        <ul className="flex flex-col gap-1.5">
          {view.evidence.map((line) => (
            <li key={line} className="text-label text-ink-secondary">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </Sheet>
  );
}
