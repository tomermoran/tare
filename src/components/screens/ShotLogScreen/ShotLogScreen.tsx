"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button/Button";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { SelectField } from "@/components/ui/SelectField/SelectField";
import { ShotDial, type DialField } from "@/components/ui/ShotDial/ShotDial";
import type { ShotValuesData } from "@/components/ui/ShotValues/ShotValues";
import { Toggle } from "@/components/ui/Toggle/Toggle";
import { addStart, type BrewDial, type BrewTab, type BrewTabs } from "@/domain/brewControls";
import { MILK_RANGE } from "@/domain/milk";
import { NO_PREP, type Prep, type PrepKey } from "@/domain/prep";
import { msToSeconds, secondsToMs } from "@/lib/units";

type Mode = "new" | "dialIn" | "fix" | "edit";

/**
 * The dial's values in display units: grinder units, grams, seconds, and
 * the optional temperature and pressure in their tab's terms (a step, °C or
 * °F, bar), null while unset.
 */
export type DialValues = { grind: number; dose: number; yield: number; time: number } & BrewDial & {
  /** Millilitres of milk, for a milk drink. */
  milk?: number;
};

export type ContextField = "setup" | "drink" | "coffee" | "milk";

type ShotLogScreenProps = {
  mode: Mode;
  setup: string;
  drink: string;
  coffee: string;
  /** Starting values: the recipe, the last shot or the saved shot, per mode. */
  start: ShotValuesData;
  /** The grinder's wheel (grindWheelConfig); the default is a stepless 0-40 dial. */
  grind?: { min: number; max: number; step: number; majorEvery?: number; coarser?: "higher" | "lower" | null };
  /** The machine's temperature and pressure tabs (brewTabs); none by default. */
  brew?: BrewTabs;
  /** Where temperature and pressure start: set in prefilled modes, else unset (AC 2, AC 6). */
  brewStart?: BrewDial;
  /** The last used temperature and pressure, where "add" starts. */
  brewLast?: BrewDial;
  /**
   * A milk drink's milk (STORY-01-03-07): the chosen milk's name (null when
   * none is chosen) and where the amount started. Absent for drinks without
   * milk, which hides the field and the tab.
   */
  milk?: { name: string | null; startMl: number } | null;
  /** Controlled values; without them the screen keeps its own. */
  values?: DialValues;
  onValuesChange?: (values: DialValues) => void;
  sweetened?: boolean;
  onSweetenedChange?: (sweetened: boolean) => void;
  /** Puck prep ticks (STORY-01-03-06); controlled, or kept here from `prep`. */
  prep?: Prep;
  onPrepChange?: (key: PrepKey, value: boolean) => void;
  /** Fields that can't be changed here are shown read-only. */
  readOnly?: ContextField[];
  /**
   * A quiet ghost link under the dial when a part is "not sure", to tell Tare
   * more (STORY-01-06-08 AC 6). Never a Notice, never signal; once per screen.
   */
  capLink?: { label: string; onClick: () => void };
  /** A Notice under the dial: what's missing, or a failed save. */
  notice?: ReactNode;
  saving?: boolean;
  onCancel?: () => void;
  onSave?: (values: ShotValuesData, sweetened: boolean, brew: BrewDial, prep: Prep) => void;
  onPick?: (field: ContextField) => void;
};

const titleKey = { new: "titleNew", dialIn: "titleDialIn", fix: "titleFix", edit: "titleEdit" } as const;
const noop = () => {};

const NO_BREW: BrewDial = { temperature: null, pressure: null };
const NO_TABS: BrewTabs = { temperature: null, pressure: null };

export const toDial = (v: ShotValuesData, brew: BrewDial = NO_BREW): DialValues => ({
  grind: v.grind,
  dose: v.dose,
  yield: v.yield,
  time: msToSeconds(v.timeMs),
  ...brew,
});

/**
 * The shot log (SCR-LOG): context arrives pre-chosen, one value is edited at
 * a time, and Save is the only primary button.
 */
export function ShotLogScreen({
  mode,
  setup,
  drink,
  coffee,
  start,
  grind = { min: 0, max: 40, step: 0.5, majorEvery: 2, coarser: null },
  brew = NO_TABS,
  brewStart = NO_BREW,
  brewLast = NO_BREW,
  milk,
  values: controlled,
  onValuesChange,
  sweetened: controlledSweetened,
  onSweetenedChange,
  prep: controlledPrep,
  onPrepChange,
  readOnly = [],
  capLink,
  notice,
  saving = false,
  onCancel = noop,
  onSave = noop,
  onPick = noop,
}: ShotLogScreenProps) {
  const t = useTranslations("log");
  const tShot = useTranslations("shot");
  const tActions = useTranslations("actions");
  const format = useFormatter();
  const startSeconds = toDial(start, brewStart);
  const [own, setOwn] = useState<DialValues>(() => (milk ? { ...startSeconds, milk: milk.startMl } : startSeconds));
  const values = controlled ?? own;
  const setValues = (next: DialValues) => (onValuesChange ? onValuesChange(next) : setOwn(next));
  const [ownSweetened, setOwnSweetened] = useState(false);
  const sweetened = controlledSweetened ?? ownSweetened;
  const [selected, setSelected] = useState("grind");
  const [ownPrep, setOwnPrep] = useState<Prep>(NO_PREP);
  const prep = controlledPrep ?? ownPrep;
  const setPrep = (key: PrepKey, value: boolean) => (onPrepChange ? onPrepChange(key, value) : setOwnPrep((p) => ({ ...p, [key]: value })));

  // Finer and coarser follow the grinder's direction; unknown shows neither (DQ-11).
  const captions =
    grind.coarser === "higher"
      ? { lower: tShot("finer"), higher: tShot("coarser") }
      : grind.coarser === "lower"
        ? { lower: tShot("coarser"), higher: tShot("finer") }
        : undefined;
  // Ranges follow TQ-14.
  const fields: DialField[] = [
    {
      key: "grind",
      label: tShot("grind"),
      value: values.grind,
      startValue: startSeconds.grind,
      min: grind.min,
      max: grind.max,
      step: grind.step,
      majorEvery: grind.majorEvery ?? 2,
      endCaptions: captions,
    },
    { key: "dose", label: tShot("dose"), value: values.dose, startValue: startSeconds.dose, min: 5, max: 30, step: 0.1, majorEvery: 10, unit: "gram" },
    { key: "yield", label: tShot("yield"), value: values.yield, startValue: startSeconds.yield, min: 5, max: 100, step: 0.1, majorEvery: 10, unit: "gram" },
    { key: "time", label: tShot("time"), value: values.time, startValue: startSeconds.time, min: 5, max: 90, step: 0.1, majorEvery: 10, unit: "second" },
  ];
  // Temperature and pressure follow the core four, only when the machine has them (EPIC-01-04).
  const optional = (key: "temperature" | "pressure", tab: BrewTab, label: string, addLabel: string): DialField => {
    const base = {
      key,
      label,
      value: values[key] ?? null,
      startValue: startSeconds[key] ?? null,
      optional: { addLabel, clearLabel: t("clear"), hint: t("unsetHint"), addValue: addStart(tab, brewLast[key]) },
    };
    if (tab.kind === "steps") return { ...base, kind: "steps", count: tab.count };
    return {
      ...base,
      min: tab.min,
      max: tab.max,
      step: tab.step,
      majorEvery: tab.step >= 1 ? 5 : Math.round(2 / tab.step),
      ...(tab.unit === "bar"
        ? { unitLabel: { symbol: tShot("units.bar"), valueText: (value: string) => tShot("units.barValue", { value }) } }
        : { unit: tab.unit }),
    };
  };
  if (brew.temperature) fields.push(optional("temperature", brew.temperature, tShot("temperature"), t("addTemperature")));
  if (brew.pressure) {
    const label = brew.pressure.kind === "wheel" && brew.pressure.peak ? t("peakPressure") : tShot("pressure");
    fields.push(optional("pressure", brew.pressure, label, t("addPressure")));
  }
  // The milk amount comes last, by dragging only: no keyboard in the log (AC 1).
  if (milk) {
    fields.push({
      key: "milk",
      label: t("milkAmount"),
      value: values.milk ?? milk.startMl,
      startValue: milk.startMl,
      ...MILK_RANGE,
      majorEvery: 5,
      unit: "milliliter",
    });
  }
  const pick = (field: ContextField) => (readOnly.includes(field) ? undefined : () => onPick(field));

  return (
    <div className="flex flex-1 flex-col [&>*]:shrink-0">
      <PageHeader
        variant="task"
        title={t(titleKey[mode])}
        start={
          <Button variant="ghost" size="sm" className="-ms-4" onClick={onCancel}>
            {tActions("cancel")}
          </Button>
        }
      />
      <div data-testid="log-context" className="mt-2 grid gap-px overflow-hidden rounded-md bg-line">
        <SelectField label={t("setup")} value={setup} onClick={pick("setup")} />
        <SelectField label={t("drink")} value={drink} onClick={pick("drink")} />
        {milk && <SelectField label={t("milk")} value={milk.name ?? t("milkNone")} onClick={pick("milk")} />}
        <SelectField label={t("coffee")} value={coffee} onClick={pick("coffee")} />
      </div>
      <ShotDial
        label={t("values")}
        fields={fields}
        selected={selected}
        onSelect={setSelected}
        onChange={(key, v) => setValues({ ...values, [key]: v })}
        className="mt-6"
      />
      {capLink && (
        <Button variant="ghost" size="sm" className="mt-1 self-center" onClick={capLink.onClick}>
          {capLink.label}
        </Button>
      )}
      <p className="mt-2 text-center text-label text-ink-secondary">
        {tShot("ratio", { ratio: format.number(values.yield / values.dose, { maximumFractionDigits: 1 }) })}
      </p>
      <section aria-labelledby="log-prep" className="mt-5 border-t border-line pt-4">
        <h2 id="log-prep" className="text-overline uppercase text-ink-secondary">
          {t("prep")}
        </h2>
        <Toggle label={t("prepWdt")} checked={prep.wdt} onChange={(v) => setPrep("wdt", v)} className="py-3" />
        <Toggle label={t("prepPuckScreen")} checked={prep.puckScreen} onChange={(v) => setPrep("puckScreen", v)} className="py-3" />
      </section>
      <Toggle
        label={t("sweetened")}
        checked={sweetened}
        onChange={(v) => (onSweetenedChange ? onSweetenedChange(v) : setOwnSweetened(v))}
        className="mt-2 border-t border-line py-4"
      />
      {notice && <div className="mt-2">{notice}</div>}
      {/* Pinned above the safe area, so Save is always in reach; the toggles may scroll under it. */}
      <div data-testid="log-save" className="sticky bottom-0 -mx-4 mt-auto bg-paper px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button
          variant="primary"
          fullWidth
          disabled={saving}
          aria-busy={saving || undefined}
          onClick={() =>
            onSave(
              { grind: values.grind, dose: values.dose, yield: values.yield, timeMs: secondsToMs(values.time) },
              sweetened,
              { temperature: values.temperature ?? null, pressure: values.pressure ?? null },
              prep,
            )
          }
        >
          {t("save")}
        </Button>
      </div>
    </div>
  );
}
