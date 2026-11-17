import "server-only";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { batches, batchPortions, canonicalBeans, drinkTypes, extractions, milkTypes, pinnedRecipes } from "@/db/schema";
import { validateBrewControls, type BrewValues } from "@/domain/brewControls";
import { validateMilk } from "@/domain/milk";
import type { NamedMilk } from "@/domain/milkName";
import { mergeGroup, resolveEntity } from "./catalogMerge";
import { setupMachine } from "./logContext";
import { assertOwned, requireHousehold } from "./scope";
import { checkValues } from "./shots";
import { actingPersona, actingPersonaId } from "./persona";

/*
 * Pinned recipes (EPIC-02-01). A recipe is keyed by coffee, persona, setup
 * and drink; milk, prep and sweetened are never part of the key. Re-pinning adds a row
 * and the latest pin wins; older rows are kept, unchanged (STORY-02-01-03).
 * getCurrentRecipe is the one "which recipe applies now" function (review
 * m10): everything that needs a recipe goes through it.
 *
 * One bag can have its own recipe (EPIC-02-04): a pin with `batchId` set.
 * It wins for that bag while it isn't removed; every other reader keeps to
 * the coffee's own pins (`batchId` null). A removed bag recipe (`removedAt`)
 * stops applying and is kept, like an older pin.
 */

export type RecipeValues = {
  grind: number;
  dose: number;
  yield: number;
  timeMs: number;
  usedWdt: boolean;
  usedPuckScreen: boolean;
  milkTypeId: string | null;
  milkMl: number | null;
  /** Whether the drink is usually sweetened; logs from the recipe start ticked. */
  sweetened: boolean;
} & BrewValues;

export type RecipeKey = { beanId: string; personaId: string; setupId: string; drinkTypeId: string };

export type Recipe = RecipeKey &
  RecipeValues & {
    id: string;
    batchId: string | null;
    sourceExtractionId: string | null;
    pinnedAt: Date;
  };

/** Pinning a one-tap shot, which has no measured values (STORY-02-01-01 AC 5). */
export class OneTapPinError extends Error {
  constructor() {
    super("A one-tap shot can't be pinned");
    this.name = "OneTapPinError";
  }
}

export const RECIPE_FIELDS = [
  "grind",
  "dose",
  "yield",
  "timeMs",
  "brewTempC",
  "brewTempStep",
  "pressureBar",
  "pressureStep",
  "usedWdt",
  "usedPuckScreen",
  "milkTypeId",
  "milkMl",
  "sweetened",
] as const satisfies readonly (keyof RecipeValues)[];
export type RecipeField = (typeof RECIPE_FIELDS)[number];

type Row = typeof pinnedRecipes.$inferSelect;

const toRecipe = (r: Row): Recipe => ({
  id: r.id,
  beanId: r.beanId,
  personaId: r.personaId,
  setupId: r.setupId,
  drinkTypeId: r.drinkTypeId,
  batchId: r.batchId,
  grind: r.grindSize,
  dose: r.doseWeight,
  yield: r.yieldWeight,
  timeMs: r.yieldTime,
  brewTempC: r.brewTempC,
  brewTempStep: r.brewTempStep,
  pressureBar: r.pressureBar,
  pressureStep: r.pressureStep,
  usedWdt: r.usedWdt,
  usedPuckScreen: r.usedPuckScreen,
  milkTypeId: r.milkTypeId,
  milkMl: r.milkMl,
  sweetened: r.sweetened,
  sourceExtractionId: r.sourceExtractionId,
  pinnedAt: r.pinnedAt,
});

/** Newest pin first; the same millisecond is settled by ID, so the answer never wobbles. */
const NEWEST = [desc(pinnedRecipes.pinnedAt), desc(pinnedRecipes.id)];

/** The coffee's merge group, newest pin first, for one key; `batchId` null for the coffee's own. */
async function newestFor(key: RecipeKey, batchId: string | null): Promise<Recipe | null> {
  const { householdId } = await requireHousehold();
  const beans = await mergeGroup(db, canonicalBeans, key.beanId);
  if (!beans.length) return null;
  const [row] = await db
    .select()
    .from(pinnedRecipes)
    .where(
      and(
        eq(pinnedRecipes.householdId, householdId),
        inArray(pinnedRecipes.beanId, beans),
        eq(pinnedRecipes.personaId, key.personaId),
        eq(pinnedRecipes.setupId, key.setupId),
        eq(pinnedRecipes.drinkTypeId, key.drinkTypeId),
        batchId === null ? isNull(pinnedRecipes.batchId) : and(eq(pinnedRecipes.batchId, batchId), isNull(pinnedRecipes.removedAt)),
      ),
    )
    .orderBy(...NEWEST)
    .limit(1);
  return row ? toRecipe(row) : null;
}

/** A bag's own recipe for a key (STORY-02-04-01), none when it has none or it was removed. */
export function getBagOwnRecipe(key: RecipeKey, batchId: string): Promise<Recipe | null> {
  return newestFor(key, batchId);
}

/**
 * The recipe that applies now (STORY-02-01-01 AC 4, STORY-02-01-03): the
 * latest pin for this coffee (across its merge group), persona, setup and
 * drink. With the bag in use, that bag's own recipe wins when it has one
 * (STORY-02-04-02); otherwise the coffee's. None when nothing was pinned.
 */
export async function getCurrentRecipe(key: RecipeKey, batchId?: string | null): Promise<Recipe | null> {
  const own = batchId ? await newestFor(key, batchId) : null;
  return own ?? newestFor(key, null);
}

/** A coffee's current recipes for a persona: the newest per setup and drink. */
export async function listCurrentRecipesForBean(beanId: string, personaId: string): Promise<Recipe[]> {
  const { householdId } = await requireHousehold();
  const beans = await mergeGroup(db, canonicalBeans, beanId);
  if (!beans.length) return [];
  const rows = await db
    .select()
    .from(pinnedRecipes)
    .where(
      and(
        eq(pinnedRecipes.householdId, householdId),
        inArray(pinnedRecipes.beanId, beans),
        eq(pinnedRecipes.personaId, personaId),
        isNull(pinnedRecipes.batchId),
      ),
    )
    .orderBy(...NEWEST);
  return newestPerSetupAndDrink(rows).map(toRecipe);
}

/** The first (newest) row per setup and drink of rows already newest first. */
function newestPerSetupAndDrink(rows: Row[]): Row[] {
  const seen = new Set<string>();
  return rows.filter((r) => {
    const k = `${r.setupId}|${r.drinkTypeId}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** Where a pin is saved: for the coffee, or for one bag only (STORY-02-04-01). */
export type PinScope = "bean" | "batch";

export type ScopeChoice = {
  /** Offered only once the coffee has its own recipe for this drink and setup (AC 2). */
  offered: boolean;
  /** The bag when it already has its own recipe, else the coffee. */
  default: PinScope;
  batchId: string;
  roastDate: Date | null;
  /** No unfinished portion left: a bag-only pin is refused (AC 6). */
  finished: boolean;
  /** What each choice replaces, so the sheet swaps without loading. */
  replaces: Record<PinScope, Recipe | null>;
  differences: Record<PinScope, RecipeField[]>;
};

export type PinPreview = {
  key: RecipeKey;
  values: RecipeValues;
  /** The recipe this pin replaces with the default scope, if any (STORY-02-01-01 AC 1). */
  replaces: Recipe | null;
  /** Fields that differ from the replaced recipe. */
  differences: RecipeField[];
  /** The milks named, for the milk lines. */
  milks: Record<string, NamedMilk>;
  scope: ScopeChoice;
};

/** A bag-only pin can't be saved. */
export class BagPinError extends Error {
  constructor(readonly reason: "noCoffeeRecipe" | "bagFinished") {
    super(`Bag pin refused: ${reason}`);
    this.name = "BagPinError";
  }
}

const differ = (values: RecipeValues, old: Recipe | null): RecipeField[] =>
  old ? RECIPE_FIELDS.filter((f) => (values[f] ?? null) !== (old[f] ?? null)) : [];

async function bagFinished(batchId: string): Promise<boolean> {
  const open = await db
    .select({ id: batchPortions.id })
    .from(batchPortions)
    .where(and(eq(batchPortions.batchId, batchId), isNull(batchPortions.finishedAt)))
    .limit(1);
  return open.length === 0;
}

async function preview(key: RecipeKey, values: RecipeValues, batchId: string): Promise<PinPreview> {
  const [bean, batch, [bag], finished] = await Promise.all([
    newestFor(key, null),
    newestFor(key, batchId),
    db.select({ roastDate: batches.roastDate }).from(batches).where(eq(batches.id, batchId)),
    bagFinished(batchId),
  ]);
  const offered = bean !== null;
  const scopeDefault: PinScope = offered && batch !== null && !finished ? "batch" : "bean";
  // With the bag chosen and no own recipe yet, the bag's pin takes over from the coffee's.
  const replaces = { bean, batch: batch ?? bean };
  const ids = [values.milkTypeId, replaces.bean?.milkTypeId, replaces.batch?.milkTypeId].filter((id): id is string => !!id);
  const rows = ids.length
    ? await db.select({ id: milkTypes.id, name: milkTypes.name, nameKey: milkTypes.nameKey }).from(milkTypes).where(inArray(milkTypes.id, ids))
    : [];
  const milks = Object.fromEntries(rows.map((m) => [m.id, { name: m.name, nameKey: m.nameKey }]));
  const differences = { bean: differ(values, replaces.bean), batch: differ(values, replaces.batch) };
  return {
    key,
    values,
    replaces: replaces[scopeDefault],
    differences: differences[scopeDefault],
    milks,
    scope: { offered, default: scopeDefault, batchId, roastDate: bag?.roastDate ?? null, finished, replaces, differences },
  };
}

/** Refuses a bag-only pin the server can't take (STORY-02-04-01 AC 2, AC 6). */
async function batchFor(key: RecipeKey, scope: PinScope, batchId: string): Promise<string | null> {
  if (scope !== "batch") return null;
  if (!(await newestFor(key, null))) throw new BagPinError("noCoffeeRecipe");
  if (await bagFinished(batchId)) throw new BagPinError("bagFinished");
  return batchId;
}

/** What pinning a shot would save, and what it replaces. Measured shots only. */
async function fromShot(shotId: string): Promise<{ key: RecipeKey; values: RecipeValues; batchId: string }> {
  const { householdId } = await requireHousehold();
  await assertOwned("extractions", shotId, householdId);
  const [r] = await db
    .select({ shot: extractions, beanId: batches.beanId, batchId: batches.id })
    .from(extractions)
    .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
    .innerJoin(batches, eq(batches.id, batchPortions.batchId))
    .where(eq(extractions.id, shotId));
  const s = r.shot;
  if (s.entryMode !== "measured") throw new OneTapPinError();
  const beanId = (await resolveEntity(db, canonicalBeans, r.beanId)) ?? r.beanId;
  return {
    batchId: r.batchId,
    key: { beanId, personaId: s.personaId, setupId: s.setupId, drinkTypeId: s.drinkTypeId },
    values: {
      grind: s.grindSize,
      dose: s.doseWeight,
      yield: s.yieldWeight,
      timeMs: s.yieldTime,
      brewTempC: s.brewTempC,
      brewTempStep: s.brewTempStep,
      pressureBar: s.pressureBar,
      pressureStep: s.pressureStep,
      usedWdt: s.usedWdt,
      usedPuckScreen: s.usedPuckScreen,
      milkTypeId: s.milkTypeId,
      milkMl: s.milkMl,
      sweetened: s.sweetened === true,
    },
  };
}

export async function pinPreview(shotId: string): Promise<PinPreview> {
  const { key, values, batchId } = await fromShot(shotId);
  return preview(key, values, batchId);
}

const insert = (householdId: string, key: RecipeKey, values: RecipeValues, sourceExtractionId: string | null, now: Date, batchId: string | null = null) => {
  const id = newId();
  return db
    .insert(pinnedRecipes)
    .values({
      id,
      householdId,
      ...key,
      batchId,
      grindSize: values.grind,
      doseWeight: values.dose,
      yieldWeight: values.yield,
      yieldTime: Math.round(values.timeMs),
      brewTempC: values.brewTempC,
      brewTempStep: values.brewTempStep,
      pressureBar: values.pressureBar,
      pressureStep: values.pressureStep,
      usedWdt: values.usedWdt,
      usedPuckScreen: values.usedPuckScreen,
      milkTypeId: values.milkTypeId,
      milkMl: values.milkMl,
      sweetened: values.sweetened,
      sourceExtractionId,
      pinnedAt: now,
    })
    .then(() => ({ id }));
};

/**
 * Pin a measured shot (STORY-02-01-01 AC 2): its values, temperature and
 * pressure, prep, milk, whether it was sweetened (STORY-02-01-07), setup, drink and persona, for its coffee. Values are
 * copied, so editing the shot later leaves the recipe as it was (AC 6).
 * With the "batch" scope it is for the shot's bag only (STORY-02-04-01).
 */
export async function pinFromShot(shotId: string, now = new Date(), scope: PinScope = "bean"): Promise<{ id: string }> {
  const { householdId } = await requireHousehold();
  const { key, values, batchId } = await fromShot(shotId);
  return insert(householdId, key, values, shotId, now, await batchFor(key, scope, batchId));
}

export type EnteredRecipe = { batchId: string; setupId: string; drinkTypeId: string; values: RecipeValues };

/** The key and checked values for a recipe typed in, with the default persona (STORY-02-01-02). */
async function entered(input: EnteredRecipe): Promise<{ key: RecipeKey; values: RecipeValues }> {
  const { householdId } = await requireHousehold();
  checkValues(input.values);
  await Promise.all([
    assertOwned("batches", input.batchId, householdId),
    assertOwned("setups", input.setupId, householdId),
    assertOwned("drinkTypes", input.drinkTypeId, householdId),
  ]);
  const v = input.values;
  const brew: BrewValues = {
    brewTempC: v.brewTempC ?? null,
    brewTempStep: v.brewTempStep ?? null,
    pressureBar: v.pressureBar ?? null,
    pressureStep: v.pressureStep ?? null,
  };
  if (Object.values(brew).some((x) => x !== null)) validateBrewControls(await setupMachine(input.setupId), brew);
  const milk = { milkTypeId: v.milkTypeId ?? null, ml: v.milkMl ?? null };
  if (milk.milkTypeId !== null || milk.ml !== null) {
    const [[drink], milks] = await Promise.all([
      db.select({ hasMilk: drinkTypes.hasMilk }).from(drinkTypes).where(eq(drinkTypes.id, input.drinkTypeId)),
      db.select({ id: milkTypes.id }).from(milkTypes).where(eq(milkTypes.householdId, householdId)),
    ]);
    validateMilk({ hasMilk: drink.hasMilk, ...milk, visibleMilkIds: milks.map((m) => m.id) });
  }
  const [[bag], persona] = await Promise.all([
    db.select({ beanId: batches.beanId }).from(batches).where(eq(batches.id, input.batchId)),
    actingPersona(),
  ]);
  const beanId = (await resolveEntity(db, canonicalBeans, bag.beanId)) ?? bag.beanId;
  return {
    key: { beanId, personaId: persona.id, setupId: input.setupId, drinkTypeId: input.drinkTypeId },
    values: {
      grind: v.grind,
      dose: v.dose,
      yield: v.yield,
      timeMs: Math.round(v.timeMs),
      ...brew,
      usedWdt: v.usedWdt === true,
      usedPuckScreen: v.usedPuckScreen === true,
      milkTypeId: milk.milkTypeId,
      milkMl: milk.ml,
      sweetened: v.sweetened === true,
    },
  };
}

export async function enteredPinPreview(input: EnteredRecipe): Promise<PinPreview> {
  const { key, values } = await entered(input);
  return preview(key, values, input.batchId);
}

/** Pin values typed in (STORY-02-01-02 AC 3): no source shot, and no shot is logged. "batch": for this bag only. */
export async function pinEnteredRecipe(input: EnteredRecipe, now = new Date(), scope: PinScope = "bean"): Promise<{ id: string }> {
  const { householdId } = await requireHousehold();
  const { key, values } = await entered(input);
  return insert(householdId, key, values, null, now, await batchFor(key, scope, input.batchId));
}

/**
 * The recipe mode's start (STORY-02-01-02): the bag's coffee and the current
 * recipe for it on this setup and drink (the bag's own when it has one),
 * with the default persona. Another household's bag is not found.
 */
export async function getRecipeForBag(input: { batchId: string; setupId: string; drinkTypeId: string }): Promise<{
  bean: { id: string; name: string };
  recipe: Recipe | null;
}> {
  const { householdId } = await requireHousehold();
  await Promise.all([
    assertOwned("batches", input.batchId, householdId),
    assertOwned("setups", input.setupId, householdId),
    assertOwned("drinkTypes", input.drinkTypeId, householdId),
  ]);
  const [[bag], persona] = await Promise.all([
    db.select({ beanId: batches.beanId }).from(batches).where(eq(batches.id, input.batchId)),
    actingPersona(),
  ]);
  const beanId = (await resolveEntity(db, canonicalBeans, bag.beanId)) ?? bag.beanId;
  const [bean] = await db.select({ id: canonicalBeans.id, name: canonicalBeans.name }).from(canonicalBeans).where(eq(canonicalBeans.id, beanId));
  const recipe = await getCurrentRecipe({ beanId, personaId: persona.id, setupId: input.setupId, drinkTypeId: input.drinkTypeId }, input.batchId);
  return { bean, recipe };
}

/** The bag's own recipes, newest per setup and drink, removed ones left out (STORY-02-04-03). */
async function listBagOwnRecipes(batchId: string, personaId: string): Promise<Recipe[]> {
  const { householdId } = await requireHousehold();
  const rows = await db
    .select()
    .from(pinnedRecipes)
    .where(
      and(
        eq(pinnedRecipes.householdId, householdId),
        eq(pinnedRecipes.batchId, batchId),
        eq(pinnedRecipes.personaId, personaId),
        isNull(pinnedRecipes.removedAt),
      ),
    )
    .orderBy(...NEWEST);
  return newestPerSetupAndDrink(rows).map(toRecipe);
}

export type BagRecipes = {
  /** This bag's own recipes (STORY-02-04-03 AC 2). */
  own: Recipe[];
  /** The coffee's, which other bags use; the same on every bag of it (STORY-02-01-04 AC 2), merges included (AC 5). */
  coffee: Recipe[];
};

/** The recipes on a bag's screen: its own, then the coffee's, newest pin first. */
export async function getBagRecipes(batchId: string): Promise<BagRecipes> {
  const { householdId } = await requireHousehold();
  await assertOwned("batches", batchId, householdId);
  const [[bag], persona] = await Promise.all([
    db.select({ beanId: batches.beanId }).from(batches).where(eq(batches.id, batchId)),
    actingPersona(),
  ]);
  const [own, coffee] = await Promise.all([listBagOwnRecipes(batchId, persona.id), getCoffeeRecipes(bag.beanId)]);
  return { own, coffee };
}

/** Which bags of a coffee have their own recipe (STORY-02-04-03 AC 4), for its bag rows. */
export async function bagsWithOwnRecipe(batchIds: readonly string[]): Promise<Set<string>> {
  if (!batchIds.length) return new Set();
  const { householdId } = await requireHousehold();
  const rows = await db
    .selectDistinct({ batchId: pinnedRecipes.batchId })
    .from(pinnedRecipes)
    .where(
      and(
        eq(pinnedRecipes.householdId, householdId),
        inArray(pinnedRecipes.batchId, [...batchIds]),
        isNull(pinnedRecipes.removedAt),
        eq(pinnedRecipes.personaId, await actingPersonaId()),
      ),
    );
  return new Set(rows.map((r) => r.batchId!));
}

/**
 * Use the coffee's recipe for this bag again (STORY-02-04-04): the bag's
 * own pins for this setup and drink stop applying and are kept. The
 * coffee's recipe and every shot are untouched; a later bag pin applies
 * again.
 */
export async function removeBagRecipe(input: { batchId: string; setupId: string; drinkTypeId: string }, now = new Date()): Promise<void> {
  const { householdId } = await requireHousehold();
  await Promise.all([
    assertOwned("batches", input.batchId, householdId),
    assertOwned("setups", input.setupId, householdId),
    assertOwned("drinkTypes", input.drinkTypeId, householdId),
  ]);
  const persona = await actingPersona();
  await db
    .update(pinnedRecipes)
    .set({ removedAt: now })
    .where(
      and(
        eq(pinnedRecipes.householdId, householdId),
        eq(pinnedRecipes.batchId, input.batchId),
        eq(pinnedRecipes.personaId, persona.id),
        eq(pinnedRecipes.setupId, input.setupId),
        eq(pinnedRecipes.drinkTypeId, input.drinkTypeId),
        isNull(pinnedRecipes.removedAt),
      ),
    );
}

/** The same rows for a coffee (STORY-03-06-03), for the persona brewed for. */
export async function getCoffeeRecipes(beanId: string): Promise<Recipe[]> {
  const persona = await actingPersona();
  const resolved = (await resolveEntity(db, canonicalBeans, beanId)) ?? beanId;
  return listCurrentRecipesForBean(resolved, persona.id);
}
