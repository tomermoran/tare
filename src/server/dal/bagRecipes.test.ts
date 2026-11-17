import { and, eq, isNotNull } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, batchPortions, extractions, pinnedRecipes } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getHome } from "./home";
import { getDialInFromRecipe, getFixStart } from "./logStart";
import { pullShot } from "./pull";
import {
  BagPinError,
  bagsWithOwnRecipe,
  enteredPinPreview,
  getBagOwnRecipe,
  getBagRecipes,
  getCurrentRecipe,
  getRecipeForBag,
  pinEnteredRecipe,
  pinFromShot,
  pinPreview,
  removeBagRecipe,
  type RecipeValues,
} from "./recipes";
import { NotFoundError } from "./scope";

/*
 * One bag's own recipe (EPIC-02-04, wave 20a): pinning for a bag only, the
 * scope the pin sheet is offered, using the bag's recipe for Brew, the pull,
 * dial in and fix while that bag is in use, and going back to the coffee's.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const at = (n: number) => new Date(Date.UTC(2026, 2, 1, 8, n));
const NOW = new Date(Date.UTC(2026, 2, 2, 8));

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

const key = () => ({ beanId: k.bean.id, personaId: k.persona.id, setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id });
const values = (grind: number): RecipeValues => ({
  grind,
  dose: 18,
  yield: 36,
  timeMs: 28_000,
  brewTempC: null,
  brewTempStep: null,
  pressureBar: null,
  pressureStep: null,
  usedWdt: grind > 14,
  usedPuckScreen: false,
  milkTypeId: null,
  milkMl: null,
  sweetened: grind > 14,
});
const entered = (grind: number, batchId = k.batch.id) => ({ batchId, setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id, values: values(grind) });
const coffeePin = (grind = 12, n = 1) => pinEnteredRecipe(entered(grind), at(n));
const bagPin = (grind = 16, n = 2, batchId = k.batch.id) => pinEnteredRecipe(entered(grind, batchId), at(n), "batch");

async function shot(grind: number) {
  const id = newId();
  await db()
    .insert(extractions)
    .values({ id, ...shotValues(k), grindSize: grind, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at(0) });
  return id;
}

async function newBag() {
  const id = newId();
  await db().insert(batches).values({ id, householdId: k.household.id, beanId: k.bean.id, bagWeight: 250, createdAt: at(0) });
  const portionId = newId();
  await db().insert(batchPortions).values({ id: portionId, batchId: id, weight: 250, createdAt: at(0) });
  return { id, portionId };
}

const open = (portionId = k.portion.id, n = 0) => db().update(batchPortions).set({ openedAt: at(n) }).where(eq(batchPortions.id, portionId));

describe("the scope a pin is offered (STORY-02-04-01)", () => {
  it("isn't offered for the coffee's first recipe, and a bag pin is refused then (AC 2)", async () => {
    const p = await enteredPinPreview(entered(14));
    expect(p.scope).toMatchObject({ offered: false, default: "bean", batchId: k.batch.id, finished: false });
    expect(p.scope.roastDate).toEqual(k.batch.roastDate);
    await expect(bagPin()).rejects.toEqual(new BagPinError("noCoffeeRecipe"));
    expect(await db().select().from(pinnedRecipes)).toHaveLength(0);
  });

  it("is offered once the coffee has a recipe, the coffee by default, with both replaced recipes (AC 1)", async () => {
    const coffee = await coffeePin();
    const p = await pinPreview(await shot(15));
    expect(p.scope).toMatchObject({ offered: true, default: "bean" });
    expect(p.scope.replaces.bean?.id).toBe(coffee.id);
    // A bag with no recipe of its own takes over from the coffee's.
    expect(p.scope.replaces.batch?.id).toBe(coffee.id);
    expect(p.scope.differences.batch).toContain("grind");
  });

  it("defaults to the bag once the bag has its own recipe (AC 4)", async () => {
    await coffeePin();
    const own = await bagPin();
    const p = await enteredPinPreview(entered(17));
    expect(p.scope.default).toBe("batch");
    expect(p.replaces?.id).toBe(own.id);
    expect(p.scope.replaces.batch?.id).toBe(own.id);
  });

  it("refuses a bag pin for a finished bag and says it's finished (AC 6)", async () => {
    await coffeePin();
    await db().update(batchPortions).set({ finishedAt: at(3) }).where(eq(batchPortions.id, k.portion.id));
    expect((await enteredPinPreview(entered(16))).scope).toMatchObject({ finished: true, default: "bean" });
    await expect(bagPin()).rejects.toEqual(new BagPinError("bagFinished"));
  });
});

describe("pinning for one bag only (STORY-02-04-01)", () => {
  it("leaves the coffee's recipe as it was, and other bags keep using it (AC 3)", async () => {
    const coffee = await coffeePin();
    await pinFromShot(await shot(16), at(2), "batch");
    expect((await getCurrentRecipe(key()))?.id).toBe(coffee.id);
    expect(await getCurrentRecipe(key(), k.batch.id)).toMatchObject({ grind: 16, batchId: k.batch.id });
    const other = await newBag();
    expect((await getCurrentRecipe(key(), other.id))?.id).toBe(coffee.id);
    expect(await getBagOwnRecipe(key(), other.id)).toBeNull();
  });

  it("replaces the bag's recipe with a second bag pin and keeps the older row (AC 5)", async () => {
    await coffeePin();
    await bagPin(15, 2);
    await bagPin(17, 3);
    expect((await getCurrentRecipe(key(), k.batch.id))?.grind).toBe(17);
    expect(await db().select().from(pinnedRecipes).where(eq(pinnedRecipes.batchId, k.batch.id))).toHaveLength(2);
  });

  it("lists the bag's own recipes apart from the coffee's", async () => {
    const coffee = await coffeePin();
    const own = await bagPin();
    expect(await getBagRecipes(k.batch.id)).toMatchObject({ own: [{ id: own.id }], coffee: [{ id: coffee.id }] });
    expect(await bagsWithOwnRecipe([k.batch.id, (await newBag()).id])).toEqual(new Set([k.batch.id]));
    expect((await getRecipeForBag({ batchId: k.batch.id, setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id })).recipe?.id).toBe(own.id);
  });
});

describe("using the bag's recipe while it's in use (STORY-02-04-02)", () => {
  beforeEach(async () => {
    await coffeePin(12);
    await bagPin(16);
  });

  it("is Brew's recipe for the bag in use, marked as the bag's (AC 1)", async () => {
    await open();
    const home = await getHome({ drinkId: k.drinks.espresso.id, beanId: k.bean.id }, NOW);
    expect(home?.state).toMatchObject({ kind: "recipe", bagOwn: true, recipe: { grind: 16 } });
  });

  it("is what a pull copies, with prep and sweetened (AC 1, AC 2)", async () => {
    await open();
    const pulled = await pullShot({ clientId: newId(), drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id }, NOW);
    expect(pulled).toMatchObject({ kind: "pulled", sweetened: true });
    const [row] = await db().select().from(extractions).where(eq(extractions.entryMode, "one-tap"));
    expect(row).toMatchObject({ grindSize: 16, usedWdt: true, sweetened: true });
  });

  it("starts dial in and fix from it", async () => {
    await open();
    expect((await getDialInFromRecipe({ drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id }))?.start.grind).toBe(16);
    const pulled = await pullShot({ clientId: newId(), drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id }, NOW);
    expect((await getFixStart((pulled as { shotId: string }).shotId)).start.grind).toBe(16);
  });

  it("uses the coffee's for a new bag, with no prompt (AC 3)", async () => {
    const other = await newBag();
    await open(other.portionId);
    const home = await getHome({ drinkId: k.drinks.espresso.id, beanId: k.bean.id }, NOW);
    expect(home?.state).toMatchObject({ kind: "recipe", bagOwn: false, recipe: { grind: 12 } });
    expect((await getDialInFromRecipe({ drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id, portionId: other.portionId }))?.start.grind).toBe(12);
  });

  it("is shared by a split or frozen portion of the same bag (AC 4)", async () => {
    const frozen = newId();
    await db().insert(batchPortions).values({ id: frozen, batchId: k.batch.id, weight: 100, frozenAt: at(1), createdAt: at(0) });
    await pullShot({ clientId: newId(), drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id, portionId: frozen }, NOW);
    const [row] = await db().select().from(extractions).where(eq(extractions.portionId, frozen));
    expect(row.grindSize).toBe(16);
  });
});

describe("using the coffee's recipe for this bag again (STORY-02-04-04)", () => {
  const where = () => ({ batchId: k.batch.id, setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id });

  it("stops the bag's recipe applying, keeps its rows, and leaves the coffee's alone (AC 2)", async () => {
    const coffee = await coffeePin(12);
    await bagPin(15, 2);
    await bagPin(16, 3);
    await removeBagRecipe(where(), at(4));
    expect((await getCurrentRecipe(key(), k.batch.id))?.id).toBe(coffee.id);
    expect((await getBagRecipes(k.batch.id)).own).toEqual([]);
    expect(await bagsWithOwnRecipe([k.batch.id])).toEqual(new Set());
    const kept = await db().select().from(pinnedRecipes).where(and(eq(pinnedRecipes.batchId, k.batch.id), isNotNull(pinnedRecipes.removedAt)));
    expect(kept).toHaveLength(2);
    expect((await getCurrentRecipe(key()))?.id).toBe(coffee.id);
  });

  it("lets a later bag pin apply again", async () => {
    await coffeePin(12);
    await bagPin(15, 2);
    await removeBagRecipe(where(), at(3));
    await bagPin(17, 4);
    expect((await getCurrentRecipe(key(), k.batch.id))?.grind).toBe(17);
  });

  it("leaves past shots as they were", async () => {
    await coffeePin(12);
    await bagPin(16);
    await open();
    await pullShot({ clientId: newId(), drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id }, NOW);
    await removeBagRecipe(where());
    const [row] = await db().select().from(extractions).where(eq(extractions.entryMode, "one-tap"));
    expect(row.grindSize).toBe(16);
  });

  it("refuses another household's bag, changing nothing (AC 4)", async () => {
    await coffeePin(12);
    await bagPin(16);
    signInAs((await makeHousehold(db())).user.firebaseUid);
    await expect(removeBagRecipe(where())).rejects.toBeInstanceOf(NotFoundError);
    signInAs(k.user.firebaseUid);
    expect((await getCurrentRecipe(key(), k.batch.id))?.grind).toBe(16);
  });
});
