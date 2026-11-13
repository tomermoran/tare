import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getFormatter, getTranslations } from "next-intl/server";
import { BagClock } from "@/components/beans/BagClock";
import { BagFlow } from "@/components/beans/BagFlow";
import { localDayKey } from "@/domain/localDay";
import type { BagFact } from "@/components/screens/BagScreen/BagScreen";
import { RecipeRows } from "@/components/recipes/RecipeRows";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { setupLabel } from "@/domain/setupName";
import { LOG_PATH } from "@/lib/logRoutes";
import { getBag } from "@/server/dal/bags";
import { getLogContext } from "@/server/dal/logContext";
import { getBagRecipes } from "@/server/dal/recipes";
import { NotFoundError, unlessSignedOut } from "@/server/dal/scope";
import { getTimeZone } from "@/server/time";
import { recipeLines } from "../../recipeLines";
import { bagRows } from "../rows";

/** SCR-BAG: one bag's facts, portions and recipes. */
export default function BagPage({ params }: PageProps<"/beans/[batchId]">) {
  return (
    <Suspense fallback={null}>
      <Bag params={params} />
    </Suspense>
  );
}

async function Bag({ params }: Pick<PageProps<"/beans/[batchId]">, "params">) {
  const { batchId } = await params;
  const [t, format, timeZone] = await Promise.all([getTranslations(), getFormatter(), getTimeZone()]);
  const bag = await unlessSignedOut(getBag(batchId)).catch((e) => {
    if (e instanceof NotFoundError) notFound();
    throw e;
  });
  if (!bag) return null;

  const day = (d: Date) => format.dateTime(d, { dateStyle: "medium", timeZone });
  const [rows, recipes, context] = await Promise.all([bagRows(timeZone), getBagRecipes(bag.id), getLogContext()]);
  const { grams } = rows;
  const facts: BagFact[] = [
    { label: t("bag.roastDate"), value: bag.roastDate ? day(bag.roastDate) : t("bag.notGiven") },
    ...(bag.packedAt ? [{ label: t("bag.packedDate"), value: day(bag.packedAt) }] : []),
    ...(bag.bestBefore ? [{ label: t("bag.bestBefore"), value: day(bag.bestBefore) }] : []),
    ...(bag.lotCode ? [{ label: t("bag.lot"), value: bag.lotCode }] : []),
    ...(bag.purchasedAt ? [{ label: t("bag.purchased"), value: day(bag.purchasedAt) }] : []),
    { label: t("bag.bagWeight"), value: grams(bag.bagWeight) },
  ];

  // Recipes belong to the coffee: every bag of it shows them (STORY-02-01-04).
  const list = (items: string[]) => format.list(items, { type: "conjunction" });
  const inUse = bag.portions.find((p) => p.state !== "finished" && p.state !== "frozen");
  const recipeRows = recipes.flatMap((r) => {
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
        dialInHref: `${LOG_PATH}?${new URLSearchParams({ drinkId: drink.id, ...(inUse ? { portionId: inUse.id } : {}) })}`,
        changeHref: `${LOG_PATH}?${new URLSearchParams({ mode: "recipe", batchId: bag.id, setupId: setup.id, drinkId: drink.id })}`,
      },
    ];
  });

  return (
    <BagFlow
      labels={{
        back: t("bag.back"),
        facts: t("bag.facts"),
        portions: t("beans.portions"),
        recipes: t("bag.recipes"),
        noRecipes: t("bag.noRecipes"),
        addRecipe: t("recipe.add"),
      }}
      addRecipeHref={`/log?mode=recipe&batchId=${bag.id}`}
      recipes={
        recipeRows.length ? (
          <RecipeRows rows={recipeRows} labels={{ dialIn: t("recipe.dialIn"), change: t("recipe.changeRecipe"), close: t("actions.close") }} />
        ) : undefined
      }
      backHref="/beans"
      bean={bag.bean.name}
      roaster={bag.bean.roasterName}
      facts={facts}
      clocks={<BagClock batchId={bag.id} label={rows.clock(bag)} unknown={bag.roasting.kind === "unknown"} today={localDayKey(new Date(), timeZone)} />}
      status={rows.status(bag)}
      total={rows.total(bag.portions.filter((p) => p.state !== "finished"))}
      portions={bag.portions.map(rows.row)}
      info={bag.portions.map(rows.info)}
    />
  );
}
