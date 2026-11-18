"use client";

import { Button } from "@/components/ui/Button/Button";
import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { Notice } from "@/components/ui/Notice/Notice";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { ShotValues, type ShotValuesData } from "@/components/ui/ShotValues/ShotValues";

/*
 * SH-PIN (EPIC-02-01), props only: which drink, coffee and setup the recipe
 * is for, its values with the milk and puck-prep lines, and the recipe it
 * replaces above it in ink-secondary, with what changes. One primary to
 * confirm; a failed pin keeps the sheet with a retry (STORY-02-01-01 AC 6).
 *
 * Scope (STORY-02-04-01): once the coffee has a recipe, a row under the
 * title chooses the coffee or this bag only, always one chosen, with a
 * polite line saying what the choice does. The bag chip is disabled when
 * the bag is finished, and the line says why. The caller swaps the
 * replaced block and the changes as the choice changes.
 */

export type PinScopeView<S extends string = string> = {
  label: string;
  options: { value: S; label: string; disabled?: boolean }[];
  value: S;
  onChange: (value: S) => void;
  /** What the choice does, or why the bag can't be chosen. */
  effect: string;
};

export type PinRecipeView = {
  values: ShotValuesData;
  /** Milk, prep, temperature and pressure, already in words. */
  lines: string[];
};

type Failure = { message: string; retryLabel: string; onRetry: () => void };

function RecipeBlock({ heading, recipe, quiet = false }: { heading: string; recipe: PinRecipeView; quiet?: boolean }) {
  const tone = quiet ? "text-ink-secondary" : "text-ink";
  return (
    <section className="flex flex-col gap-1">
      <h3 className="text-overline uppercase text-ink-secondary">{heading}</h3>
      <ShotValues values={recipe.values} size="compact" align="start" quiet={quiet} />
      {recipe.lines.map((line) => (
        <p key={line} className={`text-label ${tone}`}>
          {line}
        </p>
      ))}
    </section>
  );
}

export function PinSheet({
  open,
  onClose,
  labels,
  recipe,
  replaces,
  changes,
  onConfirm,
  saving = false,
  failure,
  scope,
  forPerson,
}: {
  /** "for {name}" at the top, with more than one profile (STORY-05-01-04 AC 2). */
  forPerson?: string;
  open: boolean;
  onClose: () => void;
  labels: { title: string; close: string; newRecipe: string; replaces: string; changes: string; confirm: string };
  recipe: PinRecipeView;
  /** The current recipe this pin replaces, if any. */
  replaces?: PinRecipeView | null;
  /** What differs from the replaced recipe, each already in words. */
  changes: string[];
  onConfirm: () => void;
  saving?: boolean;
  failure?: Failure;
  /** Absent when not offered: the coffee's first recipe (STORY-02-04-01 AC 2). */
  scope?: PinScopeView;
}) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={labels.title}
      closeLabel={labels.close}
      footer={
        <Button variant="primary" fullWidth disabled={saving} aria-busy={saving || undefined} onClick={onConfirm}>
          {labels.confirm}
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        {forPerson && <p className="text-label text-ink-secondary">{forPerson}</p>}
        {scope && (
          <section className="flex flex-col gap-2">
            <h3 className="text-overline uppercase text-ink-secondary">{scope.label}</h3>
            <ChipGroup label={scope.label} options={scope.options} value={scope.value} onChange={scope.onChange} />
            <p aria-live="polite" className="text-label text-ink-secondary">
              {scope.effect}
            </p>
          </section>
        )}
        {replaces && <RecipeBlock heading={labels.replaces} recipe={replaces} quiet />}
        <RecipeBlock heading={labels.newRecipe} recipe={recipe} />
        {replaces && changes.length > 0 && (
          <section className="flex flex-col gap-1 border-t border-line pt-4">
            <h3 className="text-overline uppercase text-ink-secondary">{labels.changes}</h3>
            <ul className="flex flex-col gap-0.5">
              {changes.map((c) => (
                <li key={c} className="text-label text-ink">
                  {c}
                </li>
              ))}
            </ul>
          </section>
        )}
        {failure && (
          <Notice urgent action={{ label: failure.retryLabel, onClick: failure.onRetry }}>
            {failure.message}
          </Notice>
        )}
      </div>
    </Sheet>
  );
}
