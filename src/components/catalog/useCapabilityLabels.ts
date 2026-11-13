"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";
import { DOSE_PRESETS, SETTING_COUNTS } from "@/domain/capabilityQuestions";
import type { BasketQuestionLabels } from "./BasketQuestions";
import type { GrinderQuestionLabels } from "./GrinderQuestions";
import type { MachineQuestionLabels } from "./MachineQuestions";

/** A unit's symbol as Intl writes it ("g", "°C"), never typed by hand. */
function unitSymbol(locale: string, unit: string) {
  return (
    new Intl.NumberFormat(locale, { style: "unit", unit, unitDisplay: "narrow" }).formatToParts(1).find((p) => p.type === "unit")?.value ?? ""
  );
}

/** The capability questions' labels, shared by catalog add and answering later. */
export function useCapabilityLabels() {
  const t = useTranslations();
  const format = useFormatter();
  const locale = useLocale();
  const grams = (n: number) => format.number(n, { style: "unit", unit: "gram", unitDisplay: "narrow" });
  const common = { notSure: t("catalog.cap.notSure"), lowest: t("catalog.cap.lowest"), highest: t("catalog.cap.highest"), rangeHint: t("catalog.cap.rangeHint") };

  const machine: MachineQuestionLabels = {
    ...common,
    yes: t("catalog.cap.yes"),
    no: t("catalog.cap.no"),
    tempQ: t("catalog.cap.tempQ"),
    fewSettings: t("catalog.cap.fewSettings"),
    exactNumber: t("catalog.cap.exactNumber"),
    howMany: t("catalog.cap.howMany"),
    counts: Object.fromEntries(SETTING_COUNTS.map((n) => [n, format.number(n)])) as MachineQuestionLabels["counts"],
    unitQ: t("catalog.cap.unitQ"),
    celsius: unitSymbol(locale, "celsius"),
    fahrenheit: unitSymbol(locale, "fahrenheit"),
    pressureQ: t("catalog.cap.pressureQ"),
    byHand: t("catalog.cap.byHand"),
    gaugeQ: t("catalog.cap.gaugeQ"),
    bar: t("unit.barSymbol"),
  };

  const grinder: GrinderQuestionLabels = {
    ...common,
    dialQ: t("catalog.cap.dialQ"),
    clicks: t("catalog.cap.clicks"),
    smooth: t("catalog.cap.smooth"),
    rangeQ: t("catalog.cap.rangeQ"),
    stepQ: t("catalog.cap.stepQ"),
    coarserQ: t("catalog.cap.coarserQ"),
    higher: t("catalog.cap.higher"),
    lower: t("catalog.cap.lower"),
  };

  const basket: BasketQuestionLabels = {
    question: t("catalog.cap.doseQ"),
    presets: Object.fromEntries(
      DOSE_PRESETS.map((p) => [p.id, t("catalog.cap.doseRange", { min: grams(p.min), max: grams(p.max) })]),
    ) as BasketQuestionLabels["presets"],
    other: t("catalog.cap.other"),
    notSure: t("catalog.cap.notSure"),
    min: t("catalog.cap.doseMin"),
    max: t("catalog.cap.doseMax"),
    unit: unitSymbol(locale, "gram"),
  };

  return { machine, grinder, basket };
}
