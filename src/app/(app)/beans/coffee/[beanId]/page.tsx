import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { getFormatter, getTranslations } from "next-intl/server";
import { RecipeRows } from "@/components/recipes/RecipeRows";
import { CoffeeScreen, type CoffeeBagRow, type CoffeeShotRow } from "@/components/screens/CoffeeScreen/CoffeeScreen";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { journalHref } from "@/lib/journalFilters";
import { getCoffee } from "@/server/dal/coffee";
import { NotFoundError, unlessSignedOut } from "@/server/dal/scope";
import { getTimeZone } from "@/server/time";
import { recipeRowsFor } from "../../recipeRows";
import { bagRows } from "../../rows";
import { coffeeLabels } from "./labels";

/** SCR-COFFEE (STORY-03-06-03), from Tried or a bag on hand. */
export default function CoffeePage({ params }: PageProps<"/beans/coffee/[beanId]">) {
  return (
    <Suspense fallback={<CoffeeLoading />}>
      <Coffee params={params} />
    </Suspense>
  );
}

async function CoffeeLoading() {
  return <CoffeeScreen state="loading" labels={await coffeeLabels()} backHref="/beans" />;
}

async function Coffee({ params }: Pick<PageProps<"/beans/coffee/[beanId]">, "params">) {
  const beanId = decodeURIComponent((await params).beanId);
  const [t, format, timeZone, labels] = await Promise.all([getTranslations(), getFormatter(), getTimeZone(), coffeeLabels()]);
  // Recent shots and bag states depend on the request time.
  await connection();
  const c = await unlessSignedOut(getCoffee(beanId)).catch((e) => {
    if (e instanceof NotFoundError) notFound();
    throw e;
  });
  if (!c) return null;

  const rows = await bagRows(timeZone);
  const day = (d: Date) => format.dateTime(d, { day: "numeric", month: "short", timeZone });
  const roast = c.bean.roastLevel ? t(`catalog.roast.${c.bean.roastLevel}` as "catalog.roast.Medium") : null;
  const notes = c.bean.tastingNotes.length ? format.list(c.bean.tastingNotes, { type: "conjunction" }) : null;
  const details = roast && notes ? t("coffee.details", { roast, notes }) : (roast ?? notes ?? undefined);
  const summary = c.summary
    ? c.summary.kind === "lastRated"
      ? t("beans.summary.lastRated", { rating: c.summary.rating })
      : t(`beans.summary.${c.summary.kind}`)
    : undefined;

  // Recipes dial in on the bag in use, and change through the newest bag.
  const inUse = c.bags.flatMap((b) => b.portions).find((p) => p.state !== "finished" && p.state !== "frozen");
  const recipeRows = await recipeRowsFor(c.recipes, { batchId: c.bags[0].id, portionId: inUse?.id }, timeZone);

  const shots: CoffeeShotRow[] = c.recentShots.map((s) => ({
    id: s.id,
    href: `/journal/${s.id}`,
    primary: t("journal.rowTitle", {
      drink: drinkLabel(s.drink, (key: DrinkKey) => t(key)),
      time: format.dateTime(s.at, { hour: "2-digit", minute: "2-digit", timeZone }),
    }),
    secondary: format.dateTime(s.at, { dateStyle: "medium", timeZone }),
    values: s.values,
  }));
  const bags: CoffeeBagRow[] = c.bags.map((b) => ({
    id: b.id,
    href: `/beans/${b.id}`,
    primary: b.roastDate ? t("portion.bagRoasted", { date: day(b.roastDate) }) : t("portion.bagAdded", { date: day(b.createdAt) }),
    secondary: rows.status(b),
    end: rows.grams(b.bagWeight),
  }));

  return (
    <CoffeeScreen
      labels={labels}
      backHref="/beans"
      name={c.bean.name}
      roaster={c.bean.roasterName}
      details={details}
      summary={summary}
      addBag={{
        href: `/beans/add?${new URLSearchParams({ beanId: c.bean.id, returnTo: `/beans/coffee/${encodeURIComponent(c.bean.id)}` })}`,
        primary: !c.onHand,
      }}
      recipes={
        recipeRows.length ? (
          <RecipeRows rows={recipeRows} labels={{ dialIn: t("recipe.dialIn"), change: t("recipe.changeRecipe"), close: t("actions.close") }} />
        ) : undefined
      }
      shots={shots}
      allShotsHref={shots.length ? journalHref({ beanId: c.bean.id }) : undefined}
      bags={bags}
    />
  );
}
