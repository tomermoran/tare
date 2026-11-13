import "server-only";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { batches, batchPortions, canonicalBeans, drinkTypes, extractions, milkTypes, personas, pinnedRecipes } from "@/db/schema";
import { validateBrewControls, type BrewValues } from "@/domain/brewControls";
import { validateMilk } from "@/domain/milk";
import type { NamedMilk } from "@/domain/milkName";
import { mergeGroup, resolveEntity } from "./catalogMerge";
import { setupMachine } from "./logContext";
import { assertOwned, NotFoundError, requireHousehold } from "./scope";
import { checkValues } from "./shots";

/*
 * Pinned recipes (EPIC-02-01). A recipe is keyed by coffee, persona, setup
 * and drink; milk and prep are never part of the key. Re-pinning adds a row
 * and the latest pin wins; older rows are kept, unchanged (STORY-02-01-03).
 * getCurrentRecipe is the one "which recipe applies now" function (review
 * m10): everything that needs a recipe goes through it.
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
  sourceExtractionId: r.sourceExtractionId,
  pinnedAt: r.pinnedAt,
});

/** Newest pin first; the same millisecond is settled by ID, so the answer never wobbles. */
const NEWEST = [desc(pinnedRecipes.pinnedAt), desc(pinnedRecipes.id)];

/**
 * The recipe that applies now (STORY-02-01-01 AC 4, STORY-02-01-03): the
 * latest bean-wide pin for this coffee (across its merge group), persona,
 * setup and drink. Only for that setup; none when nothing was pinned.
 */
export async function getCurrentRecipe(key: RecipeKey): Promise<Recipe | null> {
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
        isNull(pinnedRecipes.batchId),
      ),
    )
    .orderBy(...NEWEST)
    .limit(1);
  return row ? toRecipe(row) : null;
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
  const seen = new Set<string>();
  return rows
    .filter((r) => {
      const k = `${r.setupId}|${r.drinkTypeId}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .map(toRecipe);
}

export type PinPreview = {
  key: RecipeKey;
  values: RecipeValues;
  /** The recipe this pin replaces, if any (STORY-02-01-01 AC 1). */
  replaces: Recipe | null;
  /** Fields that differ from the replaced recipe. */
  differences: RecipeField[];
  /** The milks named, for the milk lines. */
  milks: Record<string, NamedMilk>;
};

const differ = (values: RecipeValues, old: Recipe | null): RecipeField[] =>
  old ? RECIPE_FIELDS.filter((f) => (values[f] ?? null) !== (old[f] ?? null)) : [];

async function preview(key: RecipeKey, values: RecipeValues): Promise<PinPreview> {
  const replaces = await getCurrentRecipe(key);
  const ids = [values.milkTypeId, replaces?.milkTypeId].filter((id): id is string => !!id);
  const rows = ids.length
    ? await db.select({ id: milkTypes.id, name: milkTypes.name, nameKey: milkTypes.nameKey }).from(milkTypes).where(inArray(milkTypes.id, ids))
    : [];
  const milks = Object.fromEntries(rows.map((m) => [m.id, { name: m.name, nameKey: m.nameKey }]));
  return { key, values, replaces, differences: differ(values, replaces), milks };
}

/** What pinning a shot would save, and what it replaces. Measured shots only. */
async function fromShot(shotId: string): Promise<{ key: RecipeKey; values: RecipeValues }> {
  const { householdId } = await requireHousehold();
  await assertOwned("extractions", shotId, householdId);
  const [r] = await db
    .select({ shot: extractions, beanId: batches.beanId })
    .from(extractions)
    .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
    .innerJoin(batches, eq(batches.id, batchPortions.batchId))
    .where(eq(extractions.id, shotId));
  const s = r.shot;
  if (s.entryMode !== "measured") throw new OneTapPinError();
  const beanId = (await resolveEntity(db, canonicalBeans, r.beanId)) ?? r.beanId;
  return {
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
    },
  };
}

export async function pinPreview(shotId: string): Promise<PinPreview> {
  const { key, values } = await fromShot(shotId);
  return preview(key, values);
}

const insert = (householdId: string, key: RecipeKey, values: RecipeValues, sourceExtractionId: string | null, now: Date) => {
  const id = newId();
  return db
    .insert(pinnedRecipes)
    .values({
      id,
      householdId,
      ...key,
      batchId: null,
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
      sourceExtractionId,
      pinnedAt: now,
    })
    .then(() => ({ id }));
};

/**
 * Pin a measured shot (STORY-02-01-01 AC 2): its values, temperature and
 * pressure, prep, milk, setup, drink and persona, for its coffee. Values are
 * copied, so editing the shot later leaves the recipe as it was (AC 6).
 */
export async function pinFromShot(shotId: string, now = new Date()): Promise<{ id: string }> {
  const { householdId } = await requireHousehold();
  const { key, values } = await fromShot(shotId);
  return insert(householdId, key, values, shotId, now);
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
  const [[bag], [persona]] = await Promise.all([
    db.select({ beanId: batches.beanId }).from(batches).where(eq(batches.id, input.batchId)),
    db.select({ id: personas.id }).from(personas).where(and(eq(personas.householdId, householdId), eq(personas.isDefault, true))),
  ]);
  if (!persona) throw new NotFoundError();
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
    },
  };
}

export async function enteredPinPreview(input: EnteredRecipe): Promise<PinPreview> {
  const { key, values } = await entered(input);
  return preview(key, values);
}

/** Pin values typed in (STORY-02-01-02 AC 3): no source shot, and no shot is logged. */
export async function pinEnteredRecipe(input: EnteredRecipe, now = new Date()): Promise<{ id: string }> {
  const { householdId } = await requireHousehold();
  const { key, values } = await entered(input);
  return insert(householdId, key, values, null, now);
}
