import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, canonicalBeans, extractions, pinnedRecipes, setups } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import {
  enteredPinPreview,
  getBagRecipes,
  getCoffeeRecipes,
  getRecipeForBag,
  getCurrentRecipe,
  listCurrentRecipesForBean,
  OneTapPinError,
  pinEnteredRecipe,
  pinFromShot,
  pinPreview,
  type RecipeValues,
} from "./recipes";
import { getHome } from "./home";
import { getDialInFromRecipe } from "./logStart";
import { NotFoundError } from "./scope";
import { updateShot } from "./shots";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const at = (n: number) => new Date(Date.UTC(2026, 2, 1, 8, n));

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

async function shot(values: Partial<typeof extractions.$inferInsert> = {}) {
  const id = newId();
  await db()
    .insert(extractions)
    .values({ id, ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at(0), ...values });
  return id;
}
const key = (drink = k.drinks.espresso.id) => ({ beanId: k.bean.id, personaId: k.persona.id, setupId: k.setup.id, drinkTypeId: drink });

const ENTERED: RecipeValues = {
  grind: 14,
  dose: 18,
  yield: 38,
  timeMs: 29_000,
  brewTempC: null,
  brewTempStep: null,
  pressureBar: null,
  pressureStep: null,
  usedWdt: true,
  usedPuckScreen: false,
  milkTypeId: null,
  milkMl: null,
};

describe("pinning a shot (STORY-02-01-01)", () => {
  it("previews the key and values with nothing replaced, then saves every field (AC 1, AC 2)", async () => {
    const id = await shot({ drinkTypeId: k.drinks.latte.id, usedWdt: true, milkTypeId: k.milk.id, milkMl: 180 });
    const p = await pinPreview(id);
    expect(p).toMatchObject({ key: key(k.drinks.latte.id), replaces: null, differences: [], milks: { [k.milk.id]: { nameKey: "milks.oat" } } });
    expect(p.values).toMatchObject({ grind: 15, dose: 18, yield: 36, timeMs: 28_000, usedWdt: true, usedPuckScreen: false, milkTypeId: k.milk.id, milkMl: 180 });

    await pinFromShot(id, at(5));
    expect(await getCurrentRecipe(key(k.drinks.latte.id))).toMatchObject({ ...p.values, sourceExtractionId: id, batchId: null, pinnedAt: at(5) });
  });

  it("shows what it replaces and how it differs (AC 1)", async () => {
    await pinFromShot(await shot(), at(1));
    const p = await pinPreview(await shot({ grindSize: 14, yieldWeight: 38 }));
    expect(p.replaces).toMatchObject({ grind: 15, yield: 36 });
    expect(p.differences).toEqual(["grind", "yield"]);
  });

  it("replaces the same recipe whatever the milk (AC 3)", async () => {
    const latte = { drinkTypeId: k.drinks.latte.id, milkMl: 180 };
    await pinFromShot(await shot({ ...latte, milkTypeId: k.milk.id }), at(1));
    await pinFromShot(await shot({ ...latte, milkTypeId: null, milkMl: null }), at(2));
    expect(await listCurrentRecipesForBean(k.bean.id, k.persona.id)).toHaveLength(1);
    expect((await getCurrentRecipe(key(k.drinks.latte.id)))?.milkTypeId).toBeNull();
  });

  it("applies only on its own setup (AC 4)", async () => {
    await pinFromShot(await shot(), at(1));
    const other = newId();
    await db().insert(setups).values({ id: other, householdId: k.household.id, partsKey: "other", createdAt: at(0) });
    expect(await getCurrentRecipe({ ...key(), setupId: other })).toBeNull();
  });

  it("refuses a one-tap shot (AC 5)", async () => {
    const id = await shot({ entryMode: "one-tap" });
    await expect(pinPreview(id)).rejects.toBeInstanceOf(OneTapPinError);
    await expect(pinFromShot(id)).rejects.toBeInstanceOf(OneTapPinError);
    expect(await db().select().from(pinnedRecipes)).toEqual([]);
  });

  it("keeps the recipe as pinned when the shot is edited later (AC 6)", async () => {
    const id = await shot();
    await pinFromShot(id, at(1));
    await updateShot(id, { grind: 20 });
    expect((await getCurrentRecipe(key()))?.grind).toBe(15);
  });

  it("finds a recipe pinned on a coffee that was later merged", async () => {
    await pinFromShot(await shot(), at(1));
    const survivor = newId();
    await db().insert(canonicalBeans).values({ id: survivor, roasterId: k.bean.roasterId, name: "House Blend (verified)", source: "seed", status: "verified", createdAt: at(0) });
    await db().update(canonicalBeans).set({ mergedIntoId: survivor }).where(eq(canonicalBeans.id, k.bean.id));
    expect(await getCurrentRecipe({ ...key(), beanId: survivor })).toMatchObject({ grind: 15 });
  });

  it("can't pin or preview another household's shot", async () => {
    const id = await shot();
    signInAs((await makeHousehold(db())).user.firebaseUid);
    await expect(pinFromShot(id)).rejects.toBeInstanceOf(NotFoundError);
    await expect(pinPreview(id)).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("pinning entered values (STORY-02-01-02)", () => {
  const input = (values: Partial<RecipeValues> = {}, drink = k.drinks.espresso.id) => ({
    batchId: k.batch.id,
    setupId: k.setup.id,
    drinkTypeId: drink,
    values: { ...ENTERED, ...values },
  });

  it("saves a recipe with no source and logs no shot (AC 3)", async () => {
    await pinEnteredRecipe(input(), at(1));
    expect(await getCurrentRecipe(key())).toMatchObject({ ...ENTERED, sourceExtractionId: null, personaId: k.persona.id });
    expect(await db().select().from(extractions)).toEqual([]);
  });

  it("checks values, temperature and milk against the setup and drink (AC 2)", async () => {
    await expect(pinEnteredRecipe(input({ dose: 0 }))).rejects.toMatchObject({ name: "InvalidShotError" });
    // The kitchen's machine can't set temperature.
    await expect(pinEnteredRecipe(input({ brewTempC: 93 }))).rejects.toMatchObject({ name: "InvalidBrewControlsError" });
    await expect(pinEnteredRecipe(input({ milkTypeId: k.milk.id, milkMl: 180 }))).rejects.toMatchObject({ name: "InvalidMilkError" });
    await pinEnteredRecipe(input({ milkTypeId: k.milk.id, milkMl: 180 }, k.drinks.latte.id), at(1));
    expect(await getCurrentRecipe(key(k.drinks.latte.id))).toMatchObject({ milkTypeId: k.milk.id, milkMl: 180 });
  });

  it("previews what it replaces", async () => {
    await pinFromShot(await shot(), at(1));
    const p = await enteredPinPreview(input());
    expect(p.replaces).toMatchObject({ grind: 15 });
    expect(p.differences).toEqual(["grind", "yield", "timeMs", "usedWdt"]);
  });

  it("can't pin for another household's bag", async () => {
    signInAs((await makeHousehold(db())).user.firebaseUid);
    await expect(pinEnteredRecipe(input())).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("re-pinning (STORY-02-01-03)", () => {
  it("makes the newest pin current and keeps the old one unchanged (AC 1, AC 2, AC 4)", async () => {
    const first = await pinFromShot(await shot(), at(1));
    const before = (await db().select().from(pinnedRecipes).where(eq(pinnedRecipes.id, first.id)))[0];
    const second = await pinEnteredRecipe({ batchId: k.batch.id, setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id, values: ENTERED }, at(2));
    expect((await getCurrentRecipe(key()))?.id).toBe(second.id);
    expect(await listCurrentRecipesForBean(k.bean.id, k.persona.id)).toHaveLength(1);
    expect((await db().select().from(pinnedRecipes).where(eq(pinnedRecipes.id, first.id)))[0]).toEqual(before);
  });

  it("is what every reader uses: Brew, the dial-in pre-fill, the bag and the coffee (AC 3)", async () => {
    await pinFromShot(await shot(), at(1));
    const second = await pinFromShot(await shot({ grindSize: 13, yieldWeight: 40 }), at(2));
    expect(await getHome({ drinkId: k.drinks.espresso.id, beanId: k.bean.id }, at(30))).toMatchObject({
      state: { kind: "recipe", recipe: { id: second.id, grind: 13, yield: 40 } },
    });
    expect((await getDialInFromRecipe({ drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id }))?.start).toMatchObject({ grind: 13, yield: 40 });
    for (const recipes of [await getBagRecipes(k.batch.id), await getCoffeeRecipes(k.bean.id)]) {
      expect(recipes.map((r) => [r.id, r.grind])).toEqual([[second.id, 13]]);
    }
  });

  it("settles pins in the same millisecond the same way every time", async () => {
    const a = await pinFromShot(await shot(), at(1));
    const b = await pinFromShot(await shot(), at(1));
    const winner = [a.id, b.id].sort().at(-1);
    expect((await getCurrentRecipe(key()))?.id).toBe(winner);
    expect((await getCurrentRecipe(key()))?.id).toBe(winner);
  });

  it("ignores a recipe pinned for one bag only", async () => {
    await db().insert(pinnedRecipes).values({
      id: newId(), ...shotValues(k), beanId: k.bean.id, batchId: k.batch.id, pinnedAt: at(9),
    });
    expect(await getCurrentRecipe(key())).toBeNull();
  });
});

describe("pin actions", () => {
  it("turn a one-tap shot or a bad value into a failed save, pinning nothing (AC 6)", async () => {
    const { pinFromShotAction, pinEnteredRecipeAction } = await import("@/server/actions/recipes");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await pinFromShotAction(await shot({ entryMode: "one-tap" }))).toEqual({ ok: false, error: "saveFailed" });
    expect(
      await pinEnteredRecipeAction({ batchId: k.batch.id, setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id, values: { ...ENTERED, yield: -1 } }),
    ).toEqual({ ok: false, error: "saveFailed" });
    expect(await pinFromShotAction("")).toEqual({ ok: false, error: "notFound" });
    expect(await db().select().from(pinnedRecipes)).toEqual([]);
  });
});

describe("getRecipeForBag", () => {
  const input = () => ({ batchId: k.batch.id, setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id });

  it("gives the bag's coffee and its current recipe on this setup and drink", async () => {
    expect(await getRecipeForBag(input())).toEqual({ bean: { id: k.bean.id, name: k.bean.name }, recipe: null });
    await pinFromShot(await shot(), at(1));
    expect((await getRecipeForBag(input())).recipe).toMatchObject({ grind: 15 });
    expect((await getRecipeForBag({ ...input(), drinkTypeId: k.drinks.latte.id })).recipe).toBeNull();
  });

  it("doesn't find another household's bag", async () => {
    signInAs((await makeHousehold(db())).user.firebaseUid);
    await expect(getRecipeForBag(input())).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("bag and coffee recipes (STORY-02-01-04)", () => {
  it("shows one current recipe per drink and setup (AC 1)", async () => {
    await pinFromShot(await shot(), at(1));
    await pinFromShot(await shot({ grindSize: 14 }), at(2));
    await pinFromShot(await shot({ drinkTypeId: k.drinks.latte.id, milkTypeId: k.milk.id, milkMl: 150 }), at(3));
    const rows = await getBagRecipes(k.batch.id);
    expect(rows.map((r) => [r.drinkTypeId, r.grind])).toEqual([
      [k.drinks.latte.id, 15],
      [k.drinks.espresso.id, 14],
    ]);
    expect(rows[0]).toMatchObject({ milkTypeId: k.milk.id, milkMl: 150, pinnedAt: at(3) });
  });

  it("shows the coffee's recipes on a new bag of it (AC 2)", async () => {
    await pinFromShot(await shot(), at(1));
    const newBag = newId();
    await db().insert(batches).values({ id: newBag, householdId: k.household.id, beanId: k.bean.id, bagWeight: 250, createdAt: at(5) });
    expect(await getBagRecipes(newBag)).toHaveLength(1);
  });

  it("includes recipes pinned on either side of a merge (AC 5)", async () => {
    await pinFromShot(await shot(), at(1));
    const survivor = newId();
    await db().insert(canonicalBeans).values({ id: survivor, roasterId: k.bean.roasterId, name: "House Blend (verified)", source: "seed", status: "verified", createdAt: at(0) });
    await db().update(canonicalBeans).set({ mergedIntoId: survivor }).where(eq(canonicalBeans.id, k.bean.id));
    expect(await getBagRecipes(k.batch.id)).toHaveLength(1);
    expect(await getCoffeeRecipes(survivor)).toHaveLength(1);
    expect(await getCoffeeRecipes(k.bean.id)).toHaveLength(1);
  });

  it("is empty with nothing pinned, and private to the household", async () => {
    expect(await getBagRecipes(k.batch.id)).toEqual([]);
    await pinFromShot(await shot(), at(1));
    signInAs((await makeHousehold(db())).user.firebaseUid);
    await expect(getBagRecipes(k.batch.id)).rejects.toBeInstanceOf(NotFoundError);
    expect(await getCoffeeRecipes(k.bean.id)).toEqual([]);
  });
});
