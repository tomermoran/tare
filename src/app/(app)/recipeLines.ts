import type { getFormatter, getTranslations } from "next-intl/server";
import { milkLabel, type MilkKey } from "@/domain/milkName";
import { milkLine } from "@/lib/milkLine";
import type { LogMilk } from "@/server/dal/logContext";
import type { RecipeValues } from "@/server/dal/recipes";

type T = Awaited<ReturnType<typeof getTranslations<never>>>;
type F = Awaited<ReturnType<typeof getFormatter>>;

/** The quiet lines under the values: milk, puck prep, sweetened, temperature and pressure (design 2.3, item 4; 5.0a). */
export function recipeLines(
  recipe: RecipeValues,
  drink: { hasMilk: boolean; milks: readonly LogMilk[] },
  t: T,
  format: F,
): string[] {
  const lines: string[] = [];
  const milk = drink.milks.find((m) => m.id === recipe.milkTypeId);
  if (drink.hasMilk && milk) {
    const name = milkLabel(milk, (key: MilkKey) => t(key));
    lines.push(milkLine(name, recipe.milkMl, t, format));
  }
  const tools = [recipe.usedWdt && t("log.prepWdt"), recipe.usedPuckScreen && t("log.prepPuckScreen")].filter((x): x is string => !!x);
  if (tools.length) lines.push(t("home.prep", { tools: format.list(tools, { type: "conjunction" }) }));
  if (recipe.sweetened) lines.push(t("recipe.sweetenedLine"));
  const value = (field: string, v: string) => t("recipe.valueLine", { field, value: v });
  if (recipe.brewTempC !== null)
    lines.push(value(t("shot.temperature"), format.number(recipe.brewTempC, { style: "unit", unit: "celsius", maximumFractionDigits: 1 })));
  else if (recipe.brewTempStep !== null) lines.push(value(t("shot.temperature"), t("recipe.step", { step: recipe.brewTempStep })));
  if (recipe.pressureBar !== null)
    lines.push(value(t("shot.pressure"), t("shot.units.barValue", { value: format.number(recipe.pressureBar, { maximumFractionDigits: 1 }) })));
  else if (recipe.pressureStep !== null) lines.push(value(t("shot.pressure"), t("recipe.step", { step: recipe.pressureStep })));
  return lines;
}

