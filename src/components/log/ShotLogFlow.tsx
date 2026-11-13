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
import type { GrindWheel } from "@/domain/grind";
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

type Draft = { drinkId: string | null; portionId: string | null; values: DialValues; sweetened: boolean };

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
  resume: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();

  const fresh = (): Draft => ({ drinkId: defaultDrinkId, portionId: defaultPortionId, values: toDial(start), sweetened: false });
  const [draft, setDraft] = useState<Draft>(fresh);
  const [sheet, setSheet] = useState<"drink" | "coffee" | null>(null);
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
  const dirty =
    draft.drinkId !== defaultDrinkId ||
    draft.portionId !== defaultPortionId ||
    draft.sweetened ||
    (Object.keys(startDial) as (keyof DialValues)[]).some((k) => Math.abs(draft.values[k] - startDial[k]) > 1e-9);
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
    setSheet(field === "drink" ? "drink" : "coffee");
  };

  const label = (list: SelectOption[], id: string | null) => list.find((o) => o.id === id)?.primary ?? "";

  const save = async (values: ShotValuesData, sweetened: boolean) => {
    if (!setupId) return setMissing("setup");
    if (!draft.portionId || !draft.drinkId) return setMissing("coffee");
    setMissing(null);
    setState("saving");
    const result = await saveMeasuredShotAction({
      setupId,
      drinkTypeId: draft.drinkId,
      portionId: draft.portionId,
      ...values,
      sweetened,
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
    void save({ grind: v.grind, dose: v.dose, yield: v.yield, timeMs: secondsToMs(v.time) }, draft.sweetened);
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
        values={draft.values}
        onValuesChange={(values) => setDraft((d) => ({ ...d, values }))}
        sweetened={draft.sweetened}
        onSweetenedChange={(sweetened) => setDraft((d) => ({ ...d, sweetened }))}
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
          setDraft((d) => ({ ...d, drinkId }));
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
      {confirm}
    </>
  );
}
