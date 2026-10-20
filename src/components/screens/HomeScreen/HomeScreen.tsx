"use client";

import { useFormatter, useTranslations } from "next-intl";
import { LogoMark } from "@/components/brand/Logo/Logo";
import { Button } from "@/components/ui/Button/Button";
import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { SelectField } from "@/components/ui/SelectField/SelectField";
import { ShotValues, type ShotValuesData } from "@/components/ui/ShotValues/ShotValues";

type HomeScreenProps = {
  /** recipe: the daily driver. noRecipe: setup and coffee, but nothing pinned. firstRun: nothing set up. */
  state: "recipe" | "noRecipe" | "firstRun";
  /** Shown persona name; null shows the translated role label. */
  personaName?: string | null;
  drink: string;
  coffee: { bean: string; roaster: string; ageDays: number };
  recipe?: ShotValuesData;
  setup?: string;
  remainingGrams?: number;
  /** After a one-tap pull: the result replaces the buttons in place. */
  pulled?: boolean;
  reaction?: "good" | "off" | null;
  onPull?: () => void;
  onUndo?: () => void;
  onReaction?: (reaction: "good" | "off") => void;
  onDialIn?: () => void;
  onChangeDrink?: () => void;
  onChangeCoffee?: () => void;
  onProfile?: () => void;
  onAddMachine?: () => void;
};

const noop = () => {};

/**
 * Brew (SCR-HOME): today's recipe, one tap to log it. See
 * planning/drafts/design.md section 2.3.
 */
export function HomeScreen({
  state,
  personaName = null,
  drink,
  coffee,
  recipe,
  setup,
  remainingGrams,
  pulled = false,
  reaction = null,
  onPull = noop,
  onUndo = noop,
  onReaction = noop,
  onDialIn = noop,
  onChangeDrink = noop,
  onChangeCoffee = noop,
  onProfile = noop,
  onAddMachine = noop,
}: HomeScreenProps) {
  const t = useTranslations("home");
  const tProfile = useTranslations("profile");
  const format = useFormatter();
  const grams = (g: number) =>
    format.number(g, { style: "unit", unit: "gram", unitDisplay: "short", maximumFractionDigits: 0 });

  const header = (
    <div className="flex min-h-8 items-center justify-between">
      <button type="button" onClick={onProfile} className="py-1.5 text-label text-ink-secondary hover:text-ink">
        {personaName ?? tProfile("defaultName")}
      </button>
      <LogoMark size={24} className="text-ink" />
    </div>
  );

  if (state === "firstRun") {
    const steps = [
      { title: t("firstRun.parts"), hint: t("firstRun.partsHint"), next: true },
      { title: t("firstRun.bag"), hint: t("firstRun.bagHint") },
      { title: t("firstRun.shot") },
    ];
    return (
      <div className="flex flex-1 flex-col">
        {header}
        <h1 className="mt-7 text-h1">{t("firstRun.title")}</h1>
        <p className="text-body text-ink-secondary">{t("firstRun.body")}</p>
        <ol className="mt-8">
          {steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[28px_1fr] gap-3 border-t border-line py-4.5 last:border-b">
              <span aria-hidden="true" className="text-h3 font-extralight text-ink-tertiary">
                {i + 1}
              </span>
              <div className={s.next ? "text-ink" : "text-ink-secondary"}>
                <p className="text-body">{s.title}</p>
                {s.hint && <p className="text-label text-ink-secondary">{s.hint}</p>}
                {s.next && (
                  <Button variant="primary" fullWidth className="mt-3" onClick={onAddMachine}>
                    {t("firstRun.addMachine")}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {header}
      <SelectField
        look="quiet"
        value={drink}
        onClick={onChangeDrink}
        hiddenLabel={t("changeDrink")}
        valueClassName="text-h1"
        className="mt-7"
      />
      <SelectField
        look="quiet"
        value={t("coffeeLine", { bean: coffee.bean, roaster: coffee.roaster, age: t("age", { days: coffee.ageDays }) })}
        onClick={onChangeCoffee}
        hiddenLabel={t("changeCoffee")}
        valueClassName="text-body text-ink-secondary"
        className="mt-1.5 text-ink-secondary"
      />

      {state === "recipe" && recipe ? (
        <>
          <ShotValues values={recipe} className="mt-9" />
          {setup && <p className="mt-1 text-label text-ink-secondary">{setup}</p>}
        </>
      ) : (
        <p className="mt-9 max-w-[26ch] text-body text-ink-secondary">{t("noRecipe")}</p>
      )}

      <div className="mt-auto grid min-h-38 content-end gap-2 pt-7">
        <p className="sr-only" aria-live="polite">
          {pulled ? t("pulled") : ""}
        </p>
        {state !== "recipe" ? (
          <Button variant="primary" fullWidth onClick={onDialIn}>
            {t("dialIn")}
          </Button>
        ) : pulled ? (
          <div className="grid justify-items-center gap-3 text-center">
            <p className="text-h3">{t("pulled")}</p>
            <ChipGroup
              label={t("reactionLabel")}
              options={[
                { value: "good", label: t("reactionGood") },
                { value: "off", label: t("reactionOff") },
              ]}
              value={reaction}
              onChange={(v) => onReaction(v as "good" | "off")}
            />
            <Button variant="ghost" size="sm" onClick={onUndo}>
              {t("undo")}
            </Button>
          </div>
        ) : (
          <>
            <Button variant="primary" fullWidth onClick={onPull}>
              {t("pull")}
            </Button>
            <Button variant="ghost" fullWidth onClick={onDialIn}>
              {t("dialIn")}
            </Button>
          </>
        )}
        {state === "recipe" && remainingGrams !== undefined && (
          <p className="mt-2 text-center text-label text-ink-secondary">
            {t("remaining", { amount: grams(remainingGrams) })}
          </p>
        )}
      </div>
    </div>
  );
}
