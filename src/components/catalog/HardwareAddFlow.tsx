"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useLayoutEffect, useRef, useState } from "react";
import { CatalogAddScreen, type CatalogAddErrors } from "@/components/screens/CatalogAddScreen/CatalogAddScreen";
import { useUnsavedChanges } from "@/components/task/useUnsavedChanges";
import { SelectSheet } from "@/components/ui/SelectSheet/SelectSheet";
import type { HardwareKind } from "@/domain/capabilities";
import { doseFromAnswer, DOSE_PRESETS, type DoseAnswer } from "@/domain/capabilityQuestions";
import { normalizeUrl } from "@/domain/url";
import { returnWithSelection } from "@/lib/returnTo";
import { createHardwareEntryAction } from "@/server/actions/catalog";
import type { CatalogMatch } from "@/server/dal/catalogAdd";
import { BasketQuestions, CapabilitySection } from "./BasketQuestions";

/*
 * SCR-CATALOG-ADD for a machine, grinder or basket, wired (STORY-01-06-01,
 * 01-06-04). The search text is the name; leaving the link checks it, and
 * "use it" goes back with the existing entry chosen. Saving goes back with
 * the new entry chosen; a failure keeps everything typed.
 */

const KINDS: HardwareKind[] = ["machine", "grinder", "basket"];
const NEW_MAKER = "new";

export function HardwareAddFlow({
  initialKind,
  initialName,
  makers,
  returnTo,
}: {
  initialKind: HardwareKind;
  initialName: string;
  makers: { id: string; name: string; addedByYou: boolean }[];
  returnTo: string;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const locale = useLocale();
  const router = useRouter();

  const [kind, setKind] = useState<HardwareKind>(initialKind);
  const [url, setUrl] = useState("");
  const [makerId, setMakerId] = useState<string | null>(null);
  const [makerName, setMakerName] = useState("");
  const [makerUrl, setMakerUrl] = useState("");
  const [name, setName] = useState(initialName);
  const [dose, setDose] = useState<DoseAnswer>({ choice: null });
  const [pickingMaker, setPickingMaker] = useState(false);
  const [check, setCheck] = useState<"idle" | "checking" | "failed">("idle");
  const [duplicate, setDuplicate] = useState<CatalogMatch | null>(null);
  const [errors, setErrors] = useState<CatalogAddErrors>({});
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");
  const checked = useRef<string | null>(null);

  // Next keeps a left page's state; the task starts fresh each time.
  useLayoutEffect(
    () => () => {
      setUrl("");
      setMakerId(null);
      setName(initialName);
      setDuplicate(null);
      setErrors({});
      setState("idle");
      checked.current = null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on hide only
    [],
  );

  const dirty = url.trim() !== "" || makerId !== null || name !== initialName || dose.choice !== null;
  const { leave, proceed, confirm } = useUnsavedChanges(dirty, () => router.replace(returnTo));
  const backWith = (id: string) => proceed(() => router.replace(returnWithSelection(returnTo, id)));

  const checkUrl = async () => {
    const normalized = normalizeUrl(url);
    if (!normalized || checked.current === normalized) return;
    checked.current = normalized;
    setCheck("checking");
    try {
      const res = await fetch(`/api/catalog/check-url?${new URLSearchParams({ catalog: "hardware", url })}`);
      if (!res.ok) throw new Error(String(res.status));
      const { match } = (await res.json()) as { match: CatalogMatch | null };
      setDuplicate(match);
      setCheck("idle");
    } catch {
      checked.current = null;
      setCheck("failed");
    }
  };

  const save = async () => {
    const next: CatalogAddErrors = {};
    if (!normalizeUrl(url)) next.url = t("catalog.urlMissing");
    if (!makerId) next.parent = t("catalog.makerMissing");
    if (makerId === NEW_MAKER) {
      if (!makerName.trim()) next.parentName = t("catalog.makerNameMissing");
      if (!normalizeUrl(makerUrl)) next.parentUrl = t("catalog.makerUrlMissing");
    }
    if (!name.trim()) next.name = t("catalog.modelMissing");
    setErrors(next);
    if (Object.keys(next).length) return;

    setState("saving");
    const result = await createHardwareEntryAction({
      maker: makerId === NEW_MAKER ? { name: makerName, url: makerUrl } : { id: makerId! },
      model: { name, kind, url, capabilities: kind === "basket" ? { dose: doseFromAnswer(dose) } : undefined },
    });
    if (result.ok) return backWith(result.data.id);
    setState("idle");
    if (result.error === "duplicate") return setDuplicate(result.match);
    if (result.error === "invalidLink") {
      return setErrors({ [result.field === "url" ? "url" : "parentUrl"]: t(result.field === "url" ? "catalog.urlMissing" : "catalog.makerUrlMissing") });
    }
    if (result.error === "missingName") {
      return setErrors(result.field === "maker" ? { parentName: t("catalog.makerNameMissing") } : { name: t("catalog.modelMissing") });
    }
    setState("failed");
  };

  const grams = (n: number) => format.number(n, { style: "unit", unit: "gram", unitDisplay: "narrow" });
  const gramSymbol =
    new Intl.NumberFormat(locale, { style: "unit", unit: "gram", unitDisplay: "narrow" })
      .formatToParts(1)
      .find((p) => p.type === "unit")?.value ?? "";
  const chosenMaker = makerId === NEW_MAKER ? t("catalog.newMaker") : (makers.find((m) => m.id === makerId)?.name ?? null);

  return (
    <>
      <CatalogAddScreen
        labels={{
          title: t(`catalog.addTitle.${kind}`),
          cancel: t("actions.cancel"),
          url: t("catalog.url"),
          urlHint: t("catalog.urlHint"),
          checking: t("catalog.checking"),
          checkFailed: t("catalog.checkFailed"),
          useExisting: t("catalog.useExisting"),
          parent: t("catalog.maker"),
          chooseParent: t("catalog.chooseMaker"),
          parentName: t("catalog.makerName"),
          parentUrl: t("catalog.makerUrl"),
          parentUrlHint: t("catalog.makerUrlHint"),
          name: t("catalog.model"),
          nameHint: kind === "basket" ? t("catalog.modelBasketHint") : undefined,
          kindLabel: t("catalog.kind"),
          save: t("catalog.save"),
          saveFailedTitle: t("catalog.saveFailedTitle"),
          saveFailed: t("states.saveFailed"),
        }}
        url={url}
        onUrlChange={(v) => {
          setUrl(v);
          setErrors((e) => ({ ...e, url: undefined }));
          if (normalizeUrl(v) !== checked.current) setDuplicate(null);
        }}
        onUrlBlur={checkUrl}
        check={check}
        duplicate={duplicate ? t("catalog.duplicateFound", { name: duplicate.name, maker: duplicate.catalog === "hardware" ? duplicate.makerName : duplicate.roasterName }) : undefined}
        onUseExisting={duplicate ? () => backWith(duplicate.id) : undefined}
        parent={chosenMaker}
        onChooseParent={() => setPickingMaker(true)}
        newParent={makerId === NEW_MAKER}
        parentName={makerName}
        onParentNameChange={setMakerName}
        parentUrl={makerUrl}
        onParentUrlChange={setMakerUrl}
        name={name}
        onNameChange={setName}
        kinds={KINDS.map((k) => ({ value: k, label: t(`setup.kind.${k}`) }))}
        kind={kind}
        onKindChange={(k) => setKind(k as HardwareKind)}
        capabilities={
          kind === "basket" ? (
            <CapabilitySection title={t("catalog.cap.title")} why={t("catalog.cap.why")}>
              <BasketQuestions
                labels={{
                  question: t("catalog.cap.doseQ"),
                  presets: Object.fromEntries(
                    DOSE_PRESETS.map((p) => [p.id, t("catalog.cap.doseRange", { min: grams(p.min), max: grams(p.max) })]),
                  ) as Record<(typeof DOSE_PRESETS)[number]["id"], string>,
                  other: t("catalog.cap.other"),
                  notSure: t("catalog.cap.notSure"),
                  min: t("catalog.cap.doseMin"),
                  max: t("catalog.cap.doseMax"),
                  unit: gramSymbol,
                }}
                answer={dose}
                onChange={setDose}
              />
            </CapabilitySection>
          ) : undefined
        }
        errors={errors}
        state={state}
        onSave={save}
        onCancel={leave}
      />
      <SelectSheet
        open={pickingMaker}
        onClose={() => setPickingMaker(false)}
        title={t("catalog.maker")}
        closeLabel={t("actions.close")}
        options={makers.map((m) => ({ id: m.id, primary: m.name, marker: m.addedByYou ? t("catalog.addedByYou") : undefined }))}
        value={makerId}
        onChoose={(id) => {
          setMakerId(id);
          setErrors((e) => ({ ...e, parent: undefined }));
          setPickingMaker(false);
        }}
        footerRow={{
          label: t("catalog.newMaker"),
          icon: "plus",
          onClick: () => {
            setMakerId(NEW_MAKER);
            setErrors((e) => ({ ...e, parent: undefined }));
            setPickingMaker(false);
          },
        }}
      />
      {confirm}
    </>
  );
}
