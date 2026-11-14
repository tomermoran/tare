import { getTranslations } from "next-intl/server";
import type { CoffeeLabels } from "@/components/screens/CoffeeScreen/CoffeeScreen";

/** SCR-COFFEE's words, shared by the page and its loading state. */
export async function coffeeLabels(): Promise<CoffeeLabels> {
  const t = await getTranslations();
  return {
    back: t("coffee.back"),
    addBag: t("coffee.addBag"),
    recipes: t("coffee.recipes"),
    noRecipes: t("coffee.noRecipes"),
    recentShots: t("coffee.recentShots"),
    noShots: t("coffee.noShots"),
    allShots: t("coffee.allShots"),
    bags: t("coffee.bags"),
    loading: t("coffee.loading"),
    loadFailedTitle: t("states.loadFailedTitle"),
    loadFailed: t("states.loadFailed"),
    retry: t("actions.retry"),
  };
}
