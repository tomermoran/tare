import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getFormatter, getTranslations } from "next-intl/server";
import { BagClock } from "@/components/beans/BagClock";
import { BagFlow } from "@/components/beans/BagFlow";
import { localDayKey } from "@/domain/localDay";
import type { BagFact } from "@/components/screens/BagScreen/BagScreen";
import { BagRecipesLive } from "@/components/recipes/BagRecipesLive";
import { getBag } from "@/server/dal/bags";
import { getBagRecipes } from "@/server/dal/recipes";
import { NotFoundError, unlessSignedOut } from "@/server/dal/scope";
import { getTimeZone } from "@/server/time";
import { coffeeHref } from "@/lib/coffeeRoutes";
import { recipeRowMaker } from "../recipeRows";
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
  const [rows, recipes] = await Promise.all([bagRows(timeZone), getBagRecipes(bag.id)]);
  const { grams } = rows;
  const facts: BagFact[] = [
    { label: t("bag.roastDate"), value: bag.roastDate ? day(bag.roastDate) : t("bag.notGiven") },
    ...(bag.packedAt ? [{ label: t("bag.packedDate"), value: day(bag.packedAt) }] : []),
    ...(bag.bestBefore ? [{ label: t("bag.bestBefore"), value: day(bag.bestBefore) }] : []),
    ...(bag.lotCode ? [{ label: t("bag.lot"), value: bag.lotCode }] : []),
    ...(bag.purchasedAt ? [{ label: t("bag.purchased"), value: day(bag.purchasedAt) }] : []),
    { label: t("bag.bagWeight"), value: grams(bag.bagWeight) },
  ];

  // The coffee's recipes show on every bag of it (STORY-02-01-04); this bag's own come first (STORY-02-04-03).
  const inUse = bag.portions.find((p) => p.state !== "finished" && p.state !== "frozen");
  const toRows = await recipeRowMaker({ batchId: bag.id, portionId: inUse?.id }, timeZone);
  const [ownRows, coffeeRows] = [toRows(recipes.own), toRows(recipes.coffee)];

  return (
    <BagFlow
      labels={{
        back: t("bag.back"),
        facts: t("bag.facts"),
        portions: t("beans.portions"),
        recipes: t("bag.recipes"),
        noRecipes: t("bag.noRecipes"),
        addRecipe: t("recipe.add"),
        aboutCoffee: t("bag.aboutCoffee"),
      }}
      addRecipeHref={`/log?mode=recipe&batchId=${bag.id}`}
      recipes={
        ownRows.length || coffeeRows.length ? (
          <BagRecipesLive
            batchId={bag.id}
            own={ownRows}
            coffee={coffeeRows}
            labels={{
              dialIn: t("recipe.dialIn"),
              change: t("recipe.changeRecipe"),
              close: t("actions.close"),
              thisBagOnly: t("recipe.thisBagOnly"),
              coffeeDefault: t("recipe.coffeeDefault"),
            }}
            removeLabels={{
              action: t("recipe.bagRemove"),
              title: t("recipe.bagRemoveTitle"),
              body: t("recipe.bagRemoveBody"),
              confirm: t("recipe.bagRemoveConfirm"),
              cancel: t("actions.cancel"),
              failed: t("states.saveFailed"),
              retry: t("actions.retry"),
            }}
          />
        ) : undefined
      }
      backHref="/beans"
      coffeeHref={coffeeHref(bag.bean.id)}
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
