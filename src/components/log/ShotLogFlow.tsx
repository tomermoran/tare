"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useState } from "react";
import { ADD_BAG_PATH } from "@/components/beans/AddBagFlow";
import { ShotLogScreen, toDial, type ContextField, type DialValues } from "@/components/screens/ShotLogScreen/ShotLogScreen";
import { useUnsavedChanges } from "@/components/task/useUnsavedChanges";
import { Notice } from "@/components/ui/Notice/Notice";
import { SelectSheet, type SelectOption } from "@/components/ui/SelectSheet/SelectSheet";
import type { ShotValuesData } from "@/components/ui/ShotValues/ShotValues";
import { brewToStored, type BrewDial, type BrewTabs } from "@/domain/brewControls";
import type { GrindWheel } from "@/domain/grind";
import { milkAfterDrinkChange, milkStart, type MilkKey } from "@/domain/milk";
import type { Prep, PrepKey } from "@/domain/prep";
import { clearDraft, loadDraft, saveDraft } from "@/lib/drafts";
import { LOG_RESUME } from "@/lib/logRoutes";
import { secondsToMs } from "@/lib/units";
import { withReturnTo } from "@/lib/returnTo";
import { BUILDER_PATH } from "@/lib/setupRoutes";
import { saveMeasuredShotAction } from "@/server/actions/shots";

/*
 * The shot log, wired (STORY-01-03-01). Setup, drink and coffee arrive
 * chosen; drink and coffee change through SH-SELECT. A missing setup or
 * coffee opens its add task, which comes back here with the new item
 * chosen; the dial's values travel in a draft so nothing set is lost
 * (AC 5). In Milestone 1 there is only one setup, so its field is read-only.
 */

const DRAFT = "log";

type Draft = {
  drinkId: string | null;
  portionId: string | null;
  values: DialValues;
  sweetened: boolean;
  prep: Prep;
  /** Ticks the user changed, which a setup change leaves alone (STORY-01-03-06 AC 4). */
  prepTouched: PrepKey[];
  /** A milk drink's milk; the amount is `values.milk`. */
  milkTypeId: string | null;
  /** Milk values the user changed, which a drink change leaves alone (STORY-01-03-07 AC 5). */
  milkTouched: MilkKey[];
};

/** What the log needs about each drink's milk. */
export type DrinkMilk = { hasMilk: boolean; typicalMilkMl: number | null; lastMilkTypeId: string | null };

export function ShotLogFlow({
  setupId,
  setup,
  drinks,
  defaultDrinkId,
  portions,
  defaultPortionId,
  selectedPortionId,
  start,
  grind,
  brew,
  brewLast,
  prep,
  drinkMilk,
  milks,
  resume,
}: {
  setupId: string | null;
  /** The setup's name; null when there is none yet. */
  setup: string | null;
  drinks: SelectOption[];
  defaultDrinkId: string | null;
  portions: SelectOption[];
  defaultPortionId: string | null;
  /** A portion just added from the log (add a bag came back with it). */
  selectedPortionId: string | null;
  start: ShotValuesData;
  grind?: GrindWheel;
  /** The setup machine's temperature and pressure tabs. */
  brew: BrewTabs;
  /** The last temperature and pressure used, where "add" starts. */
  brewLast: BrewDial;
  /** Where the puck prep ticks start (prepStart). */
  prep: Prep;
  /** Each drink's milk facts, by drink ID. */
  drinkMilk: Record<string, DrinkMilk>;
  /** The household's visible milks, in list order. */
  milks: SelectOption[];
  resume: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();

  const milkFor = (drinkId: string | null) => {
    const drink = drinkId ? drinkMilk[drinkId] : undefined;
    return drink ? milkStart({ drink, lastMilkOfDrink: drink.lastMilkTypeId, milks }) : null;
  };
  const fresh = (): Draft => {
    const milk = milkFor(defaultDrinkId);
    return {
      drinkId: defaultDrinkId,
      portionId: defaultPortionId,
      values: { ...toDial(start), ...(milk && { milk: milk.ml }) },
      sweetened: false,
      prep,
      prepTouched: [],
      milkTypeId: milk?.milkTypeId ?? null,
      milkTouched: [],
    };
  };
  const [draft, setDraft] = useState<Draft>(fresh);
  const [sheet, setSheet] = useState<"drink" | "coffee" | "milk" | null>(null);
  const [missing, setMissing] = useState<"setup" | "coffee" | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "failed" | "portionFinished">("idle");

  // Session storage exists only in the browser: restore after hydration.
  useEffect(() => {
    const saved = resume ? loadDraft<Draft>(DRAFT) : null;
    if (!saved) return;
    const known = (id: string | null, list: SelectOption[]) => (id && list.some((o) => o.id === id) ? id : null);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one restore on mount
    setDraft({
      ...saved,
      // Drafts from before puck prep have no ticks.
      prep: saved.prep ?? prep,
      prepTouched: saved.prepTouched ?? [],
      milkTypeId: known(saved.milkTypeId ?? null, milks),
      milkTouched: saved.milkTouched ?? [],
      drinkId: known(saved.drinkId, drinks) ?? defaultDrinkId,
      portionId: selectedPortionId ?? known(saved.portionId, portions) ?? defaultPortionId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on mount
  }, []);

  // Next keeps a left page's state; a task starts fresh each time.
  useLayoutEffect(
    () => () => {
      setDraft(fresh());
      setSheet(null);
      setMissing(null);
      setState("idle");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on hide only
    [],
  );

  const startDial = toDial(start);
  const startMilk = milkFor(draft.drinkId);
  const freshMilk = milkFor(defaultDrinkId);
  const dirty =
    draft.milkTouched.length > 0 ||
    draft.milkTypeId !== (freshMilk?.milkTypeId ?? null) ||
    draft.drinkId !== defaultDrinkId ||
    draft.portionId !== defaultPortionId ||
    draft.sweetened ||
    draft.prep.wdt !== prep.wdt ||
    draft.prep.puckScreen !== prep.puckScreen ||
    (Object.keys(startDial) as (keyof DialValues)[]).some((k) => {
      const a = draft.values[k] ?? null;
      const b = startDial[k] ?? null;
      return a === null || b === null ? a !== b : Math.abs(a - b) > 1e-9;
    });
  const { leave, proceed, confirm } = useUnsavedChanges(dirty, () => {
    clearDraft(DRAFT);
    router.replace("/");
  });

  /** Leaves for an add task, keeping the draft for the way back. */
  const sideTrip = (path: string) => {
    saveDraft(DRAFT, draft);
    setSheet(null);
    proceed(() => router.replace(withReturnTo(path, LOG_RESUME)));
  };

  const onPick = (field: ContextField) => {
    if (field === "setup") return setup ? undefined : sideTrip(BUILDER_PATH);
    if (field === "coffee" && portions.length === 0) return sideTrip(ADD_BAG_PATH);
    setSheet(field);
  };

  const label = (list: SelectOption[], id: string | null) => list.find((o) => o.id === id)?.primary ?? "";

  const save = async (values: ShotValuesData, sweetened: boolean, dial: BrewDial, ticks: Prep) => {
    if (!setupId) return setMissing("setup");
    if (!draft.portionId || !draft.drinkId) return setMissing("coffee");
    setMissing(null);
    setState("saving");
    const result = await saveMeasuredShotAction({
      setupId,
      drinkTypeId: draft.drinkId,
      portionId: draft.portionId,
      ...values,
      ...brewToStored(brew, dial),
      sweetened,
      usedWdt: ticks.wdt,
      usedPuckScreen: ticks.puckScreen,
      // Milk only for a milk drink with a milk chosen (STORY-01-03-07 AC 2, AC 6).
      ...(startMilk && draft.milkTypeId
        ? { milkTypeId: draft.milkTypeId, milkMl: draft.values.milk ?? startMilk.ml }
        : { milkTypeId: null, milkMl: null }),
    });
    if (!result.ok) {
      // Values stay as they are, so trying again sends the same shot (AC 4).
      setState(result.error === "portionFinished" ? "portionFinished" : "failed");
      return;
    }
    clearDraft(DRAFT);
    // Tasting (SCR-TASTE) lands with EPIC-01-05; until then, back to Brew.
    proceed(() => {
      router.replace("/");
      router.refresh();
    });
  };
  const retry = () => {
    const v = draft.values;
    void save({ grind: v.grind, dose: v.dose, yield: v.yield, timeMs: secondsToMs(v.time) }, draft.sweetened, {
      temperature: v.temperature ?? null,
      pressure: v.pressure ?? null,
    }, draft.prep);
  };

  return (
    <>
      <ShotLogScreen
        mode="new"
        setup={setup ?? t("log.missingSetup")}
        drink={label(drinks, draft.drinkId)}
        coffee={portions.length ? label(portions, draft.portionId) : t("log.missingCoffee")}
        start={start}
        grind={grind}
        brew={brew}
        brewLast={brewLast}
        values={draft.values}
        onValuesChange={(values) =>
          setDraft((d) => ({
            ...d,
            values,
            milkTouched: values.milk !== d.values.milk ? [...new Set<MilkKey>([...d.milkTouched, "ml"])] : d.milkTouched,
          }))
        }
        milk={startMilk ? { name: label(milks, draft.milkTypeId) || null, startMl: startMilk.ml } : null}
        sweetened={draft.sweetened}
        onSweetenedChange={(sweetened) => setDraft((d) => ({ ...d, sweetened }))}
        prep={draft.prep}
        onPrepChange={(key, value) =>
          setDraft((d) => ({ ...d, prep: { ...d.prep, [key]: value }, prepTouched: [...new Set([...d.prepTouched, key])] }))
        }
        readOnly={setup ? ["setup"] : []}
        notice={
          missing ? (
            <Notice urgent>{t(missing === "setup" ? "log.missingSetupNote" : "log.missingCoffeeNote")}</Notice>
          ) : state === "failed" ? (
            <Notice urgent title={t("log.saveFailedTitle")} action={{ label: t("actions.retry"), onClick: retry }}>
              {t("states.saveFailed")}
            </Notice>
          ) : state === "portionFinished" ? (
            <Notice urgent>{t("log.portionFinished")}</Notice>
          ) : undefined
        }
        saving={state === "saving"}
        onPick={onPick}
        onCancel={leave}
        onSave={save}
      />
      <SelectSheet
        open={sheet === "drink"}
        onClose={() => setSheet(null)}
        title={t("log.drink")}
        closeLabel={t("actions.close")}
        options={drinks}
        value={draft.drinkId}
        onChoose={(drinkId) => {
          setDraft((d) => {
            // Untouched milk values follow the new drink; none for a drink without milk (AC 5).
            const current = milkFor(d.drinkId) ? { milkTypeId: d.milkTypeId, ml: d.values.milk ?? 0 } : null;
            const next = milkAfterDrinkChange(current, new Set(d.milkTouched), milkFor(drinkId));
            const { milk: _old, ...rest } = d.values;
            void _old;
            return {
              ...d,
              drinkId,
              milkTypeId: next?.milkTypeId ?? null,
              values: next ? { ...rest, milk: next.ml } : rest,
            };
          });
          setSheet(null);
        }}
      />
      <SelectSheet
        open={sheet === "coffee"}
        onClose={() => setSheet(null)}
        title={t("log.coffee")}
        closeLabel={t("actions.close")}
        options={portions}
        value={draft.portionId}
        onChoose={(portionId) => {
          setDraft((d) => ({ ...d, portionId }));
          setMissing(null);
          setState("idle");
          setSheet(null);
        }}
        footerRow={{ label: t("log.addBag"), onClick: () => sideTrip(ADD_BAG_PATH) }}
      />
      <SelectSheet
        open={sheet === "milk"}
        onClose={() => setSheet(null)}
        title={t("log.milk")}
        closeLabel={t("actions.close")}
        options={milks}
        value={draft.milkTypeId}
        onChoose={(milkTypeId) => {
          setDraft((d) => ({ ...d, milkTypeId, milkTouched: [...new Set<MilkKey>([...d.milkTouched, "milkTypeId"])] }));
          setSheet(null);
        }}
      />
      {confirm}
    </>
  );
}
