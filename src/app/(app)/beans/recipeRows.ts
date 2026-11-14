import { getFormatter, getTranslations } from "next-intl/server";
import type { RecipeRow } from "@/components/recipes/RecipeRows";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { setupLabel } from "@/domain/setupName";
import { LOG_PATH } from "@/lib/logRoutes";
import { getLogContext } from "@/server/dal/logContext";
import type { Recipe } from "@/server/dal/recipes";
import { recipeLines } from "../recipeLines";

/**
 * A coffee's recipe rows (STORY-02-01-04), for the bag and coffee screens:
 * dial in on the bag in use, change through a bag of the coffee.
 */
export async function recipeRowsFor(recipes: Recipe[], bag: { batchId: string; portionId?: string }, timeZone: string): Promise<RecipeRow[]> {
  const [t, format, context] = await Promise.all([getTranslations(), getFormatter(), getLogContext()]);
  const list = (items: string[]) => format.list(items, { type: "conjunction" });
  const day = (d: Date) => format.dateTime(d, { dateStyle: "medium", timeZone });
  return recipes.flatMap((r) => {
    const drink = context.drinks.find((d) => d.id === r.drinkTypeId);
    const setup = context.setups.find((s) => s.id === r.setupId);
    if (!drink || !setup) return [];
    const drinkName = drinkLabel(drink, (key: DrinkKey) => t(key));
    return [
      {
        id: r.id,
        title: t("recipe.row", { drink: drinkName, setup: setupLabel(setup, context.setups, list) }),
        values: { grind: r.grind, dose: r.dose, yield: r.yield, timeMs: r.timeMs },
        lines: recipeLines(r, { hasMilk: drink.hasMilk, milks: context.milks }, t, format),
        date: t("recipe.pinnedOn", { date: day(r.pinnedAt) }),
        dialInHref: `${LOG_PATH}?${new URLSearchParams({ drinkId: drink.id, ...(bag.portionId ? { portionId: bag.portionId } : {}) })}`,
        changeHref: `${LOG_PATH}?${new URLSearchParams({ mode: "recipe", batchId: bag.batchId, setupId: setup.id, drinkId: drink.id })}`,
      },
    ];
  });
}
