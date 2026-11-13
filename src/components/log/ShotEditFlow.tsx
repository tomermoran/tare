"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ShotLogScreen, toDial, type DialValues } from "@/components/screens/ShotLogScreen/ShotLogScreen";
import { ShotWarnings } from "@/components/shot/ShotWarnings";
import { TasteQuestions } from "@/components/taste/TasteQuestions";
import { TasteRating } from "@/components/taste/TasteRating";
import { TasteTags } from "@/components/taste/TasteTags";
import { useTasteLabels } from "@/components/taste/useTasteLabels";
import type { TasteAnswers } from "@/components/taste/TasteFlow";
import { useUnsavedChanges } from "@/components/task/useUnsavedChanges";
import { Notice } from "@/components/ui/Notice/Notice";
import { SelectSheet, type SelectOption } from "@/components/ui/SelectSheet/SelectSheet";
import type { ShotValuesData } from "@/components/ui/ShotValues/ShotValues";
import { brewToStored, type BrewDial, type BrewTabs } from "@/domain/brewControls";
import type { Prep } from "@/domain/prep";
import { shotWarnings } from "@/domain/shotWarnings";
import type { Tasting } from "@/domain/tasting";
import { secondsToMs } from "@/lib/units";
import { updateShotAction } from "@/server/actions/shots";
import type { ShotEdit } from "@/server/dal/shots";

/*
 * SCR-LOG in edit mode (STORY-02-06-02): a saved shot's values, milk, prep,
 * sweetened and taste on one screen, with its coffee, drink and setup shown
 * read-only. The deliberate exception to tasting's "leaving saves": it
 * saves only on "save changes" and asks before discarding. Only what
 * changed is sent, so a stored value nobody touched stays exactly as it
 * was, even outside today's ranges.
 */

type Draft = { values: DialValues; sweetened: boolean; prep: Prep; milkTypeId: string | null; taste: TasteAnswers };

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function ShotEditFlow({
  shotId,
  oneTap,
  setup,
  drink,
  coffee,
  start,
  grind,
  brew,
  brewStart,
  sweetened,
  prep,
  milk,
  milks,
  milkDrink,
  taste,
  backTo,
}: {
  shotId: string;
  oneTap: boolean;
  setup: string;
  drink: string;
  coffee: string;
  start: ShotValuesData;
  grind: { min: number; max: number; step: number; majorEvery?: number; coarser?: "higher" | "lower" | null };
  brew: BrewTabs;
  brewStart: BrewDial;
  sweetened: boolean;
  prep: Prep;
  /** The saved milk, for a milk drink. */
  milk: { milkTypeId: string | null; ml: number } | null;
  milks: SelectOption[];
  milkDrink: boolean;
  taste: TasteAnswers;
  /** The shot's detail, where saving and leaving go. */
  backTo: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const words = useTasteLabels(milkDrink);
  const [initial] = useState<Draft>(() => ({
    values: milk ? { ...toDial(start, brewStart), milk: milk.ml } : toDial(start, brewStart),
    sweetened,
    prep,
    milkTypeId: milk?.milkTypeId ?? null,
    taste,
  }));
  const [draft, setDraft] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");
  const [picking, setPicking] = useState(false);

  const dirty = !same(draft, initial);
  const back = () => {
    router.replace(backTo);
    router.refresh();
  };
  const { leave, proceed, confirm } = useUnsavedChanges(dirty, back);

  /** Only what changed: unchanged values are never re-validated or rounded. */
  const changes = (): ShotEdit => {
    const v = draft.values;
    const was = initial.values;
    const edit: ShotEdit = {};
    if (v.grind !== was.grind) edit.grind = v.grind;
    if (v.dose !== was.dose) edit.dose = v.dose;
    if (v.yield !== was.yield) edit.yield = v.yield;
    if (v.time !== was.time) edit.timeMs = secondsToMs(v.time);
    const stored = brewToStored(brew, { temperature: v.temperature ?? null, pressure: v.pressure ?? null });
    if (v.temperature !== was.temperature) Object.assign(edit, { brewTempC: stored.brewTempC, brewTempStep: stored.brewTempStep });
    if (v.pressure !== was.pressure) Object.assign(edit, { pressureBar: stored.pressureBar, pressureStep: stored.pressureStep });
    if (milk && (v.milk !== was.milk || draft.milkTypeId !== initial.milkTypeId)) {
      edit.milkTypeId = draft.milkTypeId;
      edit.milkMl = draft.milkTypeId ? (v.milk ?? milk.ml) : null;
    }
    if (draft.sweetened !== initial.sweetened) edit.sweetened = draft.sweetened;
    if (draft.prep.wdt !== initial.prep.wdt) edit.usedWdt = draft.prep.wdt;
    if (draft.prep.puckScreen !== initial.prep.puckScreen) edit.usedPuckScreen = draft.prep.puckScreen;
    const tasting: Tasting = {};
    for (const key of ["rating", "balance", "strength", "body", "sweetness"] as const) {
      if (draft.taste[key] !== initial.taste[key]) tasting[key] = draft.taste[key];
    }
    if (!same(draft.taste.tags, initial.taste.tags)) tasting.tags = draft.taste.tags;
    if (Object.keys(tasting).length) edit.taste = tasting;
    return edit;
  };

  const save = async () => {
    if (!dirty) return proceed(back);
    setState("saving");
    const result = await updateShotAction(shotId, changes());
    if (!result.ok) return setState("failed");
    proceed(back);
  };

  const setTaste = (patch: Partial<TasteAnswers>) => setDraft((d) => ({ ...d, taste: { ...d.taste, ...patch } }));
  const milkName = milks.find((m) => m.id === draft.milkTypeId)?.primary ?? null;

  return (
    <>
      <ShotLogScreen
        mode="edit"
        setup={setup}
        drink={drink}
        coffee={coffee}
        start={start}
        grind={grind}
        brew={brew}
        brewStart={brewStart}
        brewLast={brewStart}
        milk={milk ? { name: milkName, startMl: milk.ml } : null}
        values={draft.values}
        onValuesChange={(values) => setDraft((d) => ({ ...d, values }))}
        sweetened={draft.sweetened}
        onSweetenedChange={(s) => setDraft((d) => ({ ...d, sweetened: s }))}
        prep={draft.prep}
        onPrepChange={(key, value) => setDraft((d) => ({ ...d, prep: { ...d.prep, [key]: value } }))}
        readOnly={["setup", "drink", "coffee"]}
        taste={
          <>
            {!oneTap && <TasteRating label={t("taste.rating")} rating={draft.taste.rating} onChange={(rating) => setTaste({ rating })} />}
            <TasteQuestions labels={words.questions} value={draft.taste} onChange={setTaste} />
            <div className="flex flex-col gap-3">
              <TasteTags labels={words} value={draft.taste.tags} onChange={(tags) => setTaste({ tags })} />
              <ShotWarnings warnings={shotWarnings(draft.taste.tags)} labels={{ channelling: t("shot.warnings.channelling") }} />
            </div>
          </>
        }
        notice={
          state === "failed" ? (
            <Notice urgent title={t("log.saveFailedTitle")} action={{ label: t("actions.retry"), onClick: () => void save() }}>
              {t("states.saveFailed")}
            </Notice>
          ) : undefined
        }
        saving={state === "saving"}
        onPick={(field) => field === "milk" && setPicking(true)}
        onCancel={leave}
        onSave={() => void save()}
      />
      <SelectSheet
        open={picking}
        onClose={() => setPicking(false)}
        title={t("log.milk")}
        closeLabel={t("actions.close")}
        options={milks}
        value={draft.milkTypeId}
        onChoose={(milkTypeId) => {
          setDraft((d) => ({ ...d, milkTypeId }));
          setPicking(false);
        }}
      />
      {confirm}
    </>
  );
}
