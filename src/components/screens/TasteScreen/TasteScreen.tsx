"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { Icon } from "@/components/ui/Icon/Icon";
import { Notice } from "@/components/ui/Notice/Notice";
import { ShotValues, type ShotValuesData } from "@/components/ui/ShotValues/ShotValues";
import { RATINGS } from "@/domain/tasting";

/*
 * SCR-TASTE (STORY-01-05-01): right after saving a measured shot, say how it
 * tasted, in seconds and with nothing required. The saved values stay in
 * view while rating (AC 1). Props only: the just-right rows, the tags, the
 * shot warning and a suggestion arrive as slots, and the actions are chosen
 * by the caller (one primary). A failed save keeps the screen with retry
 * and "leave without saving tasting" (AC 4).
 */

export type TasteScreenLabels = {
  title: string;
  close: string;
  rating: string;
  saveFailed: string;
  retry: string;
  leaveWithout: string;
};

export type TasteAction = { label: string; onClick: () => void };

export function TasteScreen({
  labels,
  values,
  rating,
  onRatingChange,
  questions,
  tags,
  warning,
  suggestion,
  primary,
  secondary = [],
  state = "idle",
  onClose,
  onRetry,
  onLeaveWithout,
}: {
  labels: TasteScreenLabels;
  values: ShotValuesData;
  rating: number | null;
  onRatingChange: (rating: number | null) => void;
  /** The four just-right rows and "all just right". */
  questions?: ReactNode;
  /** The six observation tags. */
  tags?: ReactNode;
  /** The block shot warning, directly under the tags. */
  warning?: ReactNode;
  /** A SuggestionCard, above the actions. */
  suggestion?: ReactNode;
  primary: TasteAction;
  secondary?: TasteAction[];
  state?: "idle" | "saving" | "failed";
  /** The header's close; saves like every other way out. */
  onClose: () => void;
  onRetry: () => void;
  onLeaveWithout: () => void;
}) {
  const saving = state === "saving";
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={saving} className="self-start">
          <Icon name="close" />
          {labels.close}
        </Button>
        <header className="flex flex-col gap-2">
          <h1 className="text-h2">{labels.title}</h1>
          <ShotValues values={values} size="compact" align="start" />
        </header>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        <section className="flex flex-col gap-3">
          <h2 className="text-body text-ink">{labels.rating}</h2>
          <ChipGroup
            clearable
            label={labels.rating}
            options={RATINGS.map((r) => ({ value: String(r), label: String(r) }))}
            value={rating === null ? null : String(rating)}
            onChange={(v) => onRatingChange(v === null ? null : Number(v))}
          />
        </section>
        {questions}
        {(tags || warning) && (
          <div className="flex flex-col gap-3">
            {tags}
            {warning}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 -mx-4 mt-auto flex flex-col gap-3 bg-paper px-4 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {state === "failed" && (
          <>
            <Notice urgent action={{ label: labels.retry, onClick: onRetry }}>
              {labels.saveFailed}
            </Notice>
            <Button variant="ghost" onClick={onLeaveWithout}>
              {labels.leaveWithout}
            </Button>
          </>
        )}
        {state !== "failed" && (
          <>
            {suggestion}
            <Button variant="primary" fullWidth disabled={saving} aria-busy={saving || undefined} onClick={primary.onClick}>
              {primary.label}
            </Button>
            {secondary.map((a) => (
              <Button key={a.label} fullWidth disabled={saving} onClick={a.onClick}>
                {a.label}
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
