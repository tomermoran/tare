import { getTranslations } from "next-intl/server";
import type { BeansLabels } from "@/components/screens/BeansScreen/BeansScreen";

export const ADD_BAG = "/beans/add";

export async function beansLabels(): Promise<BeansLabels> {
  const t = await getTranslations();
  return {
    title: t("beans.title"),
    addBag: t("beans.addBag"),
    onHand: t("beans.onHand"),
    tried: t("beans.tried"),
    emptyTitle: t("beans.emptyTitle"),
    empty: t("beans.empty"),
    onHandEmptyTitle: t("beans.onHandEmptyTitle"),
    onHandEmpty: t("beans.onHandEmpty"),
    triedEmpty: t("beans.triedEmpty"),
    loading: t("states.loading"),
  };
}
