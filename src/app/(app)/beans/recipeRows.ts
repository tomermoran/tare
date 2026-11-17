import { getFormatter, getTranslations } from "next-intl/server";
import type { RecipeRow } from "@/components/recipes/RecipeRows";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { setupLabel } from "@/domain/setupName";
import { LOG_PATH } from "@/lib/logRoutes";
import { listDrinks } from "@/server/dal/drinks";
import { getLogContext } from "@/server/dal/logContext";
import { listMilks } from "@/server/dal/milks";
import type { Recipe } from "@/server/dal/recipes";
import { recipeLines } from "../recipeLines";

/**
 * A coffee's recipe rows (STORY-02-01-04), for the bag and coffee screens:
 * dial in on the bag in use, change through a bag of the coffee. A hidden
 * drink's recipes stay, quieter and marked, and its milk is named even when
 * hidden (STORY-02-05-08 AC 1, AC 3).
 */
export async function recipeRowsFor(recipes: Recipe[], bag: { batchId: string; portionId?: string }, timeZone: string): Promise<RecipeRow[]> {
  return (await recipeRowMaker(bag, timeZone))(recipes);
}

/**
 * Loads what the rows need once, for several groups of recipes (a bag's own
 * and its coffee's). Not twice in parallel: the log context starts a
 * transaction, and two at once lock the database.
 */
export async function recipeRowMaker(bag: { batchId: string; portionId?: string }, timeZone: string): Promise<(recipes: Recipe[]) => RecipeRow[]> {
  const [t, format, context, drinks, milks] = await Promise.all([getTranslations(), getFormatter(), getLogContext(), listDrinks(), listMilks()]);
  const list = (items: string[]) => format.list(items, { type: "conjunction" });
  const day = (d: Date) => format.dateTime(d, { dateStyle: "medium", timeZone });
  return (recipes) => recipes.flatMap((r) => {
    const drink = drinks.find((d) => d.id === r.drinkTypeId);
    const setup = context.setups.find((s) => s.id === r.setupId);
    if (!drink || !setup) return [];
    const drinkName = drinkLabel(drink, (key: DrinkKey) => t(key));
    return [
      {
        id: r.id,
        setupId: setup.id,
        drinkTypeId: drink.id,
        title: t("recipe.row", { drink: drinkName, setup: setupLabel(setup, context.setups, list) }),
        values: { grind: r.grind, dose: r.dose, yield: r.yield, timeMs: r.timeMs },
        hidden: drink.hidden ? t("drinkList.hidden") : undefined,
        lines: recipeLines(r, { hasMilk: drink.hasMilk, milks }, t, format),
        date: t("recipe.pinnedOn", { date: day(r.pinnedAt) }),
        dialInHref: `${LOG_PATH}?${new URLSearchParams({ drinkId: drink.id, ...(bag.portionId ? { portionId: bag.portionId } : {}) })}`,
        changeHref: `${LOG_PATH}?${new URLSearchParams({ mode: "recipe", batchId: bag.batchId, setupId: setup.id, drinkId: drink.id })}`,
      },
    ];
  });
}
