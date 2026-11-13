"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { usePinFlow } from "@/components/recipes/usePinFlow";
import { ShotLogScreen, toDial, type ContextField, type DialValues } from "@/components/screens/ShotLogScreen/ShotLogScreen";
import { useUnsavedChanges } from "@/components/task/useUnsavedChanges";
import { SelectSheet, type SelectOption } from "@/components/ui/SelectSheet/SelectSheet";
import type { ShotValuesData } from "@/components/ui/ShotValues/ShotValues";
import { brewToStored, type BrewDial, type BrewTabs } from "@/domain/brewControls";
import type { MilkChoice } from "@/domain/milk";
import type { Prep } from "@/domain/prep";

/*
 * SCR-LOG in recipe mode (STORY-02-01-02): the bag's coffee is fixed, drink
 * and setup can be chosen, and the values start from the current recipe or
 * the usual defaults. Its primary opens SH-PIN; no shot is ever saved here
 * (AC 3, AC 4). Choosing another drink or setup reloads its own start.
 */

type Draft = { values: DialValues; prep: Prep; milkTypeId: string | null };

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function RecipeLogFlow({
  batchId,
  setupId,
  drinkTypeId,
  setup,
  drink,
  coffee,
  setups,
  drinks,
  milks,
  start,
  grind,
  brew,
  brewStart,
  prep,
  milk,
  pinTitle,
  backTo,
}: {
  batchId: string;
  setupId: string;
  drinkTypeId: string;
  setup: string;
  drink: string;
  coffee: string;
  setups: SelectOption[];
  drinks: SelectOption[];
  milks: SelectOption[];
  start: ShotValuesData;
  grind: { min: number; max: number; step: number; majorEvery?: number; coarser?: "higher" | "lower" | null };
  brew: BrewTabs;
  brewStart: BrewDial;
  prep: Prep;
  milk: MilkChoice | null;
  pinTitle: string;
  /** The bag, where cancelling and pinning go. */
  backTo: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [initial] = useState<Draft>(() => ({
    values: milk ? { ...toDial(start, brewStart), milk: milk.ml } : toDial(start, brewStart),
    prep,
    milkTypeId: milk?.milkTypeId ?? null,
  }));
  const [draft, setDraft] = useState(initial);
  const [picking, setPicking] = useState<ContextField | null>(null);

  const back = () => {
    router.replace(backTo);
    router.refresh();
  };
  const { leave, proceed, confirm } = useUnsavedChanges(!same(draft, initial), back);
  const pin = usePinFlow({ title: pinTitle, onPinned: () => proceed(back) });

  const reopen = (next: { setupId?: string; drinkId?: string }) => {
    const query = new URLSearchParams({ mode: "recipe", batchId, setupId: next.setupId ?? setupId, drinkId: next.drinkId ?? drinkTypeId });
    proceed(() => router.replace(`/log?${query}`));
  };

  const save = (values: ShotValuesData, _sweetened: boolean, dial: BrewDial, ticks: Prep) =>
    void pin.pinEntered({
      batchId,
      setupId,
      drinkTypeId,
      values: {
        grind: values.grind,
        dose: values.dose,
        yield: values.yield,
        timeMs: values.timeMs,
        ...brewToStored(brew, dial),
        usedWdt: ticks.wdt,
        usedPuckScreen: ticks.puckScreen,
        milkTypeId: milk ? draft.milkTypeId : null,
        milkMl: milk && draft.milkTypeId ? (draft.values.milk ?? milk.ml) : null,
      },
    });

  const sheets = {
    setup: { title: t("log.setup"), options: setups, value: setupId },
    drink: { title: t("log.drink"), options: drinks, value: drinkTypeId },
    milk: { title: t("log.milk"), options: milks, value: draft.milkTypeId },
  };
  const sheet = picking && picking !== "coffee" ? sheets[picking] : null;
  const choose = (id: string) => {
    const field = picking;
    setPicking(null);
    if (field === "setup" && id !== setupId) reopen({ setupId: id });
    if (field === "drink" && id !== drinkTypeId) reopen({ drinkId: id });
    if (field === "milk") setDraft((d) => ({ ...d, milkTypeId: id }));
  };

  return (
    <>
      <ShotLogScreen
        mode="recipe"
        setup={setup}
        drink={drink}
        coffee={coffee}
        start={start}
        grind={grind}
        brew={brew}
        brewStart={brewStart}
        brewLast={brewStart}
        milk={milk ? { name: milks.find((m) => m.id === draft.milkTypeId)?.primary ?? null, startMl: milk.ml } : null}
        values={draft.values}
        onValuesChange={(values) => setDraft((d) => ({ ...d, values }))}
        prep={draft.prep}
        onPrepChange={(key, value) => setDraft((d) => ({ ...d, prep: { ...d.prep, [key]: value } }))}
        readOnly={["coffee"]}
        notice={pin.status}
        onPick={setPicking}
        onCancel={leave}
        onSave={save}
      />
      <SelectSheet
        open={!!sheet}
        onClose={() => setPicking(null)}
        title={sheet?.title ?? ""}
        closeLabel={t("actions.close")}
        options={sheet?.options ?? []}
        value={sheet?.value ?? null}
        onChoose={choose}
      />
      {pin.sheet}
      {confirm}
    </>
  );
}
