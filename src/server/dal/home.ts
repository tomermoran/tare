import "server-only";
import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "@/db/client";
import { batches, batchPortions, canonicalBeans, extractions, personas, roasters } from "@/db/schema";
import { closestSetup } from "@/domain/closestSetup";
import { pickCoffee, pickDrink, portionOf, DRINK_LOOKBACK_DAYS, type CoffeePortion } from "@/domain/homeDefaults";
import { pantryGroup } from "@/domain/onHandGroups";
import type { Remaining } from "@/domain/remaining";
import { getTimeZone } from "@/server/time";
import { resolveEntity } from "./catalogMerge";
import { getLogContext, type LogDrink, type LogMilk, type LogPortion, type LogSetup } from "./logContext";
import { getCurrentRecipe, listCurrentRecipesForBean, type Recipe } from "./recipes";
import { getRemaining } from "./remaining";
import { setupsLastUsed } from "./setups";
import { requireHousehold } from "./scope";

/*
 * Brew (STORY-02-02-01): the drink usually made at this time of day, the
 * coffee in use, the current setup, and the recipe for them on that setup.
 * `chosen` is a drink or coffee picked on Brew for the next pull only
 * (STORY-02-02-06); each is used when it's one of the options.
 */

export type HomeCoffee = {
  bean: { id: string; name: string; roasterName: string };
  /** Has a recipe for this persona and drink on the current setup. */
  hasRecipe: boolean;
  /** Every unfinished portion is in the freezer. */
  frozenOnly: boolean;
};

export type HomeState =
  /** A recipe on this setup: the one-tap pull. */
  | { kind: "recipe"; recipe: Recipe }
  /** No setup has a recipe for this drink and coffee (STORY-02-02-05). */
  | { kind: "noRecipe" }
  /** Another setup has one; dialling in starts from the closest (STORY-02-01-06). */
  | { kind: "noRecipeOnSetup"; from: LogSetup }
  /** The last pull's coffee is finished (AC 6); its recipe, if any, shows quietly. */
  | { kind: "finished"; recipe: Recipe | null }
  /** No unfinished coffee at all. */
  | { kind: "noCoffee" };

export type Home = {
  drinks: LogDrink[];
  drink: LogDrink;
  /** What Brew would show with nothing chosen, marked "usual" in the selects. */
  usual: { drinkId: string; beanId: string | null };
  /** Coffees with an unfinished portion: with a recipe here first, frozen-only last. */
  coffees: HomeCoffee[];
  /** The coffee shown; on "finished", the one that ran out. */
  coffee: HomeCoffee["bean"] | null;
  /** The portion in use; null when finished or none. */
  portion: LogPortion | null;
  remaining: Remaining | null;
  setup: LogSetup;
  setups: LogSetup[];
  milks: LogMilk[];
  state: HomeState;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** Null until there's a setup and a drink: Brew shows the checklist then. */
export async function getHome(chosen: { drinkId?: string; beanId?: string } = {}, at?: Date): Promise<Home | null> {
  const { householdId } = await requireHousehold();
  const context = await getLogContext({}, at);
  const now = at ?? new Date();
  const setup = context.setups.find((s) => s.id === context.defaultSetupId);
  if (!setup || !context.drinks.length) return null;

  const [persona] = await db
    .select({ id: personas.id })
    .from(personas)
    .where(and(eq(personas.householdId, householdId), eq(personas.isDefault, true)));
  const timeZone = await getTimeZone();

  // DQ-02: the last 14 days, plus the latest shot for the fallback.
  const since = new Date(now.getTime() - (DRINK_LOOKBACK_DAYS + 1) * DAY_MS);
  const shotsOf = (where = eq(extractions.personaId, persona.id)) =>
    db
      .select({ drinkTypeId: extractions.drinkTypeId, at: extractions.createdAt })
      .from(extractions)
      .where(and(eq(extractions.householdId, householdId), where))
      .orderBy(desc(extractions.createdAt));
  const [recent, [latest]] = await Promise.all([
    shotsOf(and(eq(extractions.personaId, persona.id), gte(extractions.createdAt, since))),
    shotsOf().limit(1),
  ]);
  const drinkIds = context.drinks.map((d) => d.id);
  const usualDrinkId = pickDrink({ shots: latest ? [...recent, latest] : recent, drinkIds, now, timeZone })!;
  const drinkId = chosen.drinkId && drinkIds.includes(chosen.drinkId) ? chosen.drinkId : usualDrinkId;
  const drink = context.drinks.find((d) => d.id === drinkId)!;

  // Which coffees have a recipe for this drink here, and on which setups.
  const beans = new Map(context.portions.map((p) => [p.bean.id, p.bean]));
  const recipesHere = new Map<string, Recipe>();
  await Promise.all(
    [...beans.keys()].map(async (beanId) => {
      const recipe = await getCurrentRecipe({ beanId, personaId: persona.id, setupId: setup.id, drinkTypeId: drink.id });
      if (recipe) recipesHere.set(beanId, recipe);
    }),
  );

  const portions: CoffeePortion[] = context.portions.map((p) => ({
    id: p.id,
    beanId: p.bean.id,
    group: pantryGroup({ state: p.state, openSince: p.openedAt })!,
  }));
  const lastBeanId = await lastPulledBean(householdId, persona.id, drink.id);
  const usual = pickCoffee({ portions, lastBeanId, hasRecipe: (b) => recipesHere.has(b) });
  const choice =
    chosen.beanId && beans.has(chosen.beanId)
      ? { kind: "coffee" as const, beanId: chosen.beanId, portionId: portionOf(chosen.beanId, portions)!.id }
      : usual;

  const coffees: HomeCoffee[] = [...beans.values()]
    .map((bean) => ({
      bean,
      hasRecipe: recipesHere.has(bean.id),
      frozenOnly: portions.every((p) => p.beanId !== bean.id || p.group === "frozen"),
    }))
    // Stable: within each rank, the pantry order the portions came in.
    .sort((a, b) => rank(a) - rank(b));

  const base = {
    drinks: context.drinks,
    drink,
    usual: { drinkId: usualDrinkId, beanId: usual.kind === "coffee" ? usual.beanId : null },
    coffees,
    setup,
    setups: context.setups,
    milks: context.milks,
  };

  if (choice.kind === "none") return { ...base, coffee: null, portion: null, remaining: null, state: { kind: "noCoffee" } };

  if (choice.kind === "finished") {
    const bean = await beanOf(choice.beanId);
    const recipe = await getCurrentRecipe({ beanId: choice.beanId, personaId: persona.id, setupId: setup.id, drinkTypeId: drink.id });
    return { ...base, coffee: bean, portion: null, remaining: null, state: { kind: "finished", recipe } };
  }

  const portion = context.portions.find((p) => p.id === choice.portionId)!;
  const remaining = (await getRemaining([portion.id])).get(portion.id) ?? null;
  const shown = { ...base, coffee: portion.bean, portion, remaining };
  const recipe = recipesHere.get(choice.beanId);
  if (recipe) return { ...shown, state: { kind: "recipe", recipe } };

  const elsewhere = (await listCurrentRecipesForBean(choice.beanId, persona.id)).filter((r) => r.drinkTypeId === drink.id);
  const withRecipe = new Set(elsewhere.map((r) => r.setupId));
  const parts = (s: LogSetup) => ({ id: s.id, partIds: s.parts.map((p) => p.id) });
  const closest = closestSetup(parts(setup), context.setups.map(parts), (id) => withRecipe.has(id), await setupsLastUsed(householdId));
  const from = closest && context.setups.find((s) => s.id === closest.id);
  return { ...shown, state: from ? { kind: "noRecipeOnSetup", from } : { kind: "noRecipe" } };
}

const rank = (c: HomeCoffee) => (c.frozenOnly ? 2 : c.hasRecipe ? 0 : 1);

/** The coffee of the persona's latest shot of this drink, merges followed. */
async function lastPulledBean(householdId: string, personaId: string, drinkTypeId: string): Promise<string | null> {
  const [row] = await db
    .select({ beanId: batches.beanId })
    .from(extractions)
    .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
    .innerJoin(batches, eq(batches.id, batchPortions.batchId))
    .where(and(eq(extractions.householdId, householdId), eq(extractions.personaId, personaId), eq(extractions.drinkTypeId, drinkTypeId)))
    .orderBy(desc(extractions.createdAt))
    .limit(1);
  if (!row) return null;
  return (await resolveEntity(db, canonicalBeans, row.beanId)) ?? row.beanId;
}

async function beanOf(beanId: string): Promise<HomeCoffee["bean"] | null> {
  const [bean] = await db
    .select({ id: canonicalBeans.id, name: canonicalBeans.name, roasterName: roasters.name })
    .from(canonicalBeans)
    .innerJoin(roasters, eq(roasters.id, canonicalBeans.roasterId))
    .where(eq(canonicalBeans.id, beanId));
  return bean ?? null;
}
