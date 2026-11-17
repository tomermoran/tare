import "server-only";
import { and, asc, eq, max, ne } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { drinkTypes } from "@/db/schema";
import type { NamedDrink } from "@/domain/drinkName";
import { checkListName, ListNameError } from "@/domain/listName";
import { MILK_RANGE } from "@/domain/milk";
import { assertOwned, NotFoundError, requireHousehold } from "./scope";

/*
 * The household's drink list (EPIC-02-05): every drink, hidden ones too, in
 * the household's order. Renaming, hiding, adding, moving and the usual milk
 * amount. Recipes and shots refer to a drink by ID, so none of this touches
 * them. Whether a drink has milk is chosen once, when it's added: nothing
 * here changes it (STORY-02-05-03 AC 3).
 */

export type ListDrink = NamedDrink & {
  id: string;
  hasMilk: boolean;
  typicalMilkMl: number | null;
  hidden: boolean;
};

/** How a drink is shown, for the name rule: the translated name of a starter unless renamed. */
export type DrinkLabeler = (drink: NamedDrink) => string;

/** At least one drink stays shown (STORY-02-05-02 AC 5). */
export class KeepOneError extends Error {
  constructor() {
    super("At least one item has to stay visible");
    this.name = "KeepOneError";
  }
}

export class InvalidUsualMilkError extends Error {
  constructor() {
    super("Invalid usual milk");
    this.name = "InvalidUsualMilkError";
  }
}

/** A drink with milk starts at 120 ml usual (STORY-02-05-03 AC 2). */
export const NEW_DRINK_MILK_ML = 120;

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

function rows(q: Tx | typeof db, householdId: string): Promise<ListDrink[]> {
  return q
    .select({
      id: drinkTypes.id,
      name: drinkTypes.name,
      nameKey: drinkTypes.nameKey,
      hasMilk: drinkTypes.hasMilk,
      typicalMilkMl: drinkTypes.typicalMilkMl,
      hidden: drinkTypes.hidden,
    })
    .from(drinkTypes)
    .where(eq(drinkTypes.householdId, householdId))
    .orderBy(asc(drinkTypes.sortOrder), asc(drinkTypes.id))
    .then((list) => list.map((d) => ({ ...d, hidden: d.hidden === true })));
}

/** The whole list, hidden drinks included, in order (SCR-DRINKS). */
export async function listDrinks(): Promise<ListDrink[]> {
  const { householdId } = await requireHousehold();
  return rows(db, householdId);
}

function checkUsualMilk(ml: number) {
  if (!Number.isFinite(ml) || ml < MILK_RANGE.min || ml > MILK_RANGE.max || ml % MILK_RANGE.step !== 0) throw new InvalidUsualMilkError();
}

export type DrinkChanges = {
  /** A new name; null returns a renamed starter drink to its translated name (AC 2). */
  name?: string | null;
  hidden?: boolean;
  /** Milk drinks only, 0 to 500 in tens (STORY-02-05-06). */
  typicalMilkMl?: number;
};

/**
 * Saves the drink sheet in one go: name, shown or hidden, usual milk. All or
 * nothing, so a refused name changes nothing else (AC 3, AC 6). There is no
 * way to change whether a drink has milk.
 */
export async function updateDrink(id: string, changes: DrinkChanges, labelOf: DrinkLabeler): Promise<void> {
  const { householdId } = await requireHousehold();
  await assertOwned("drinkTypes", id, householdId);
  if ("hasMilk" in changes && (changes as { hasMilk?: unknown }).hasMilk !== undefined) throw new Error("A drink's milk can't be changed");
  await db.transaction(async (tx) => {
    const list = await rows(tx, householdId);
    const drink = list.find((d) => d.id === id);
    if (!drink) throw new NotFoundError();
    const set: Partial<typeof drinkTypes.$inferInsert> = {};
    if (changes.name !== undefined) {
      if (changes.name === null) {
        // Only a starter drink has a name to go back to.
        if (!drink.nameKey) throw new ListNameError("required");
        const original = labelOf({ name: null, nameKey: drink.nameKey });
        checkListName(original, list.filter((d) => d.id !== id).map(labelOf));
        set.name = null;
      } else {
        set.name = checkListName(changes.name, list.filter((d) => d.id !== id).map(labelOf));
      }
    }
    if (changes.typicalMilkMl !== undefined) {
      if (!drink.hasMilk) throw new InvalidUsualMilkError();
      checkUsualMilk(changes.typicalMilkMl);
      set.typicalMilkMl = changes.typicalMilkMl;
    }
    if (changes.hidden !== undefined) {
      if (changes.hidden && !drink.hidden && !list.some((d) => d.id !== id && !d.hidden)) throw new KeepOneError();
      set.hidden = changes.hidden;
    }
    if (Object.keys(set).length) await tx.update(drinkTypes).set(set).where(eq(drinkTypes.id, id));
  });
}

export const renameDrink = (id: string, name: string | null, labelOf: DrinkLabeler) => updateDrink(id, { name }, labelOf);
export const setDrinkHidden = (id: string, hidden: boolean, labelOf: DrinkLabeler) => updateDrink(id, { hidden }, labelOf);
export const setUsualMilk = (id: string, ml: number, labelOf: DrinkLabeler) => updateDrink(id, { typicalMilkMl: ml }, labelOf);

/**
 * A drink of the household's own (STORY-02-05-03): added last and shown.
 * With milk it gets a usual amount, 120 ml unless given; without, none.
 */
export async function addDrink(input: { name: string; hasMilk: boolean; typicalMilkMl?: number }, labelOf: DrinkLabeler): Promise<{ id: string }> {
  const { householdId } = await requireHousehold();
  const typicalMilkMl = input.hasMilk ? (input.typicalMilkMl ?? NEW_DRINK_MILK_ML) : null;
  if (typicalMilkMl !== null) checkUsualMilk(typicalMilkMl);
  const id = newId();
  await db.transaction(async (tx) => {
    const list = await rows(tx, householdId);
    const name = checkListName(input.name, list.map(labelOf));
    const [{ last }] = await tx.select({ last: max(drinkTypes.sortOrder) }).from(drinkTypes).where(eq(drinkTypes.householdId, householdId));
    await tx.insert(drinkTypes).values({
      id,
      householdId,
      name,
      nameKey: null,
      hasMilk: input.hasMilk,
      typicalMilkMl,
      hidden: false,
      sortOrder: (last ?? -1) + 1,
    });
  });
  return { id };
}

/**
 * Moves a drink to `toIndex` in the whole list, hidden ones included, and
 * renumbers the order densely in one transaction (STORY-02-05-04): every
 * chooser reads it through the household's order index.
 */
export async function moveDrink(id: string, toIndex: number): Promise<void> {
  const { householdId } = await requireHousehold();
  await assertOwned("drinkTypes", id, householdId);
  await db.transaction(async (tx) => {
    const list = await rows(tx, householdId);
    const from = list.findIndex((d) => d.id === id);
    if (from < 0) throw new NotFoundError();
    if (!Number.isInteger(toIndex) || toIndex < 0 || toIndex >= list.length) throw new RangeError("No such place");
    const [moved] = list.splice(from, 1);
    list.splice(toIndex, 0, moved);
    for (const [i, d] of list.entries()) {
      await tx.update(drinkTypes).set({ sortOrder: i }).where(and(eq(drinkTypes.id, d.id), ne(drinkTypes.sortOrder, i)));
    }
  });
}
