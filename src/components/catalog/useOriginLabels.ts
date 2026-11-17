"use client";

import { useTranslations } from "next-intl";
import type { OriginSheetLabels } from "./OriginSheet";

/** The origin choice's words, shared by Add a coffee and the coffee screen. */
export function useOriginLabels(): OriginSheetLabels {
  const t = useTranslations();
  return {
    title: t("catalog.origin.title"),
    close: t("actions.close"),
    notStated: t("catalog.origin.notStated"),
    blend: t("catalog.origin.blend"),
    other: t("catalog.origin.other"),
    otherLabel: t("catalog.origin.otherLabel"),
    otherHint: t("catalog.origin.otherHint"),
    done: t("catalog.origin.done"),
  };
}
