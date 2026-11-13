"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";

export type Reaction = "good" | "off";

/**
 * The in-place result of a one-tap pull (NC-07): the confirmation, undo
 * while its window lasts (it fades, with no countdown), the good and off
 * chips when reactions are wired, and an optional notice. It takes the
 * buttons' place, so nothing jumps.
 */
export function PulledState({
  labels,
  undoAvailable,
  onUndo,
  reaction = null,
  onReaction,
  notice,
}: {
  labels: { pulled: string; undo: string; reaction?: { label: string; good: string; off: string } };
  /** False once the undo window has passed. */
  undoAvailable: boolean;
  onUndo: () => void;
  reaction?: Reaction | null;
  /** Leave out to hide the chips (EPIC-02-03 wires them). */
  onReaction?: (reaction: Reaction) => void;
  notice?: ReactNode;
}) {
  return (
    <div className="grid justify-items-center gap-3 text-center">
      <p className="text-h3 text-ink">{labels.pulled}</p>
      {onReaction && labels.reaction && (
        <ChipGroup
          label={labels.reaction.label}
          options={[
            { value: "good", label: labels.reaction.good },
            { value: "off", label: labels.reaction.off },
          ]}
          value={reaction}
          onChange={(v) => onReaction(v as Reaction)}
        />
      )}
      <div className="min-h-9 motion-safe:transition-opacity motion-safe:duration-500" style={{ opacity: undoAvailable ? 1 : 0 }}>
        {undoAvailable && (
          <Button variant="ghost" size="sm" onClick={onUndo}>
            {labels.undo}
          </Button>
        )}
      </div>
      {notice}
    </div>
  );
}
