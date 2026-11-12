import { getTranslations } from "next-intl/server";
import type { SetupLabels } from "@/components/screens/SetupScreen/SetupScreen";

export async function setupLabels(): Promise<SetupLabels> {
  const t = await getTranslations("setup");
  return {
    title: t("title"),
    addPart: t("addPart"),
    setups: t("setups"),
    parts: t("parts"),
    kindPlural: { machine: t("kindPlural.machine"), grinder: t("kindPlural.grinder"), basket: t("kindPlural.basket") },
    emptyTitle: t("emptyTitle"),
    empty: t("empty"),
    addMachine: t("addMachine"),
    loading: t("partsLoading"),
  };
}
