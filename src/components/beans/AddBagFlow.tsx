"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useState } from "react";
import { BagAddScreen, OTHER_WEIGHT, type BagFields } from "@/components/screens/BagAddScreen/BagAddScreen";
import { useUnsavedChanges } from "@/components/task/useUnsavedChanges";
import { clearDraft, loadDraft, saveDraft } from "@/lib/drafts";
import { returnWithSelection, withReturnTo } from "@/lib/returnTo";
import { decimalSeparator, parseDecimal, unitSymbol } from "@/lib/units";
import { addBagAction } from "@/server/actions/bags";

/*
 * The add-a-bag flow (SCR-BAG-ADD): pick the coffee, then the bag's details,
 * then save. Started from a coffee, the coffee is already chosen. The draft
 * survives the trip to the picker. Saving lands on the new bag, or on
 * `returnTo` with its one portion selected (the shot log's coffee field).
 */

export const ADD_BAG_PATH = "/beans/add";
const DRAFT = "add-bag";
const SIZES = [250, 340, 500, 1000];

type Coffee = { id: string; name: string; roasterName: string };
type Draft = { coffee: Coffee | null; fields: BagFields; otherDatesOpen: boolean; moreOpen: boolean };

export function AddBagFlow({
  picked,
  resume,
  returnTo,
  today,
}: {
  /** The coffee chosen in the picker, or the one this flow started from. */
  picked: Coffee | null;
  resume: boolean;
  returnTo: string | null;
  today: string;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const locale = useLocale();
  const router = useRouter();

  const fresh = (): Draft => ({
    coffee: picked,
    fields: { size: "", otherWeight: "", roastDate: "", packedAt: "", bestBefore: "", lotCode: "", purchasedAt: today },
    otherDatesOpen: false,
    moreOpen: false,
  });
  const [draft, setDraft] = useState<Draft>(fresh);
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");
  const [error, setError] = useState(t("states.saveFailed"));
  const [missing, setMissing] = useState({ coffee: false, weight: false });

  // Session storage exists only in the browser: restore after hydration.
  useEffect(() => {
    const saved = resume ? loadDraft<Draft>(DRAFT) : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one restore on mount
    if (saved) setDraft({ ...saved, coffee: picked ?? saved.coffee });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on mount
  }, []);

  // Next keeps a left page's state; a task starts fresh each time.
  useLayoutEffect(
    () => () => {
      setDraft(fresh());
      setState("idle");
      setMissing({ coffee: false, weight: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on hide only
    [],
  );

  const { fields } = draft;
  const dirty =
    (draft.coffee !== null && draft.coffee.id !== picked?.id) ||
    fields.size !== "" ||
    fields.roastDate !== "" ||
    fields.packedAt !== "" ||
    fields.bestBefore !== "" ||
    fields.lotCode.trim() !== "" ||
    fields.purchasedAt !== today;
  const { leave, proceed, confirm } = useUnsavedChanges(dirty, () => {
    clearDraft(DRAFT);
    router.replace(returnTo ?? "/beans");
  });

  const weight = (): number | null => {
    if (fields.size === OTHER_WEIGHT) {
      const n = parseDecimal(fields.otherWeight, decimalSeparator(locale));
      return n && n > 0 ? n : null;
    }
    return fields.size ? Number(fields.size) : null;
  };

  const chooseCoffee = () => {
    saveDraft(DRAFT, draft);
    const params = new URLSearchParams({ resume: "1" });
    if (returnTo) params.set("returnTo", returnTo);
    proceed(() => router.replace(withReturnTo("/catalog/pick?catalog=coffee", `${ADD_BAG_PATH}?${params}`)));
  };

  const save = async () => {
    const grams = weight();
    const lacking = { coffee: !draft.coffee, weight: grams === null };
    setMissing(lacking);
    if (lacking.coffee || lacking.weight) return;
    setState("saving");
    const result = await addBagAction({
      beanId: draft.coffee!.id,
      bagWeight: grams!,
      roastDate: fields.roastDate,
      packedAt: fields.packedAt,
      bestBefore: fields.bestBefore,
      lotCode: fields.lotCode,
      purchasedAt: fields.purchasedAt,
    });
    if (!result.ok) {
      if (result.error === "weightRequired") {
        setMissing({ coffee: false, weight: true });
        setState("idle");
        return;
      }
      setError(t(`states.${result.error}`));
      setState("failed");
      return;
    }
    clearDraft(DRAFT);
    const to = returnTo ? returnWithSelection(returnTo, result.data.portionId) : `/beans/${result.data.batchId}`;
    proceed(() => {
      router.replace(to);
      router.refresh();
    });
  };

  return (
    <>
      <BagAddScreen
        labels={{
          title: t("bag.addTitle"),
          cancel: t("actions.cancel"),
          coffee: t("bag.coffee"),
          chooseCoffee: t("bag.chooseCoffee"),
          change: t("bag.change"),
          coffeeMissing: t("bag.coffeeMissing"),
          weight: t("bag.weight"),
          sizes: SIZES.map((g) => ({
            value: String(g),
            label: format.number(g, { style: "unit", unit: "gram", unitDisplay: "narrow" }),
          })),
          otherWeight: t("bag.otherWeight"),
          otherWeightLabel: t("bag.otherWeightLabel"),
          gramUnit: unitSymbol(locale, "gram"),
          weightRequired: t("bag.weightRequired"),
          roastDate: t("bag.roastDate"),
          roastDateHint: t("bag.roastDateHint"),
          otherDates: t("bag.otherDates"),
          packedDate: t("bag.packedDate"),
          bestBefore: t("bag.bestBefore"),
          datesHint: t("bag.datesHint"),
          more: t("bag.more"),
          lot: t("bag.lot"),
          purchased: t("bag.purchased"),
          save: t("bag.save"),
          saveFailedTitle: t("bag.saveFailedTitle"),
          saveFailed: error,
        }}
        coffee={draft.coffee ? { name: draft.coffee.name, roaster: draft.coffee.roasterName } : null}
        onChooseCoffee={chooseCoffee}
        fields={fields}
        onChange={(patch) => setDraft((d) => ({ ...d, fields: { ...d.fields, ...patch } }))}
        otherDatesOpen={draft.otherDatesOpen}
        onOpenOtherDates={() => setDraft((d) => ({ ...d, otherDatesOpen: true }))}
        moreOpen={draft.moreOpen}
        onOpenMore={() => setDraft((d) => ({ ...d, moreOpen: true }))}
        today={today}
        coffeeMissing={missing.coffee}
        weightMissing={missing.weight}
        state={state}
        onSave={save}
        onCancel={leave}
      />
      {confirm}
    </>
  );
}
