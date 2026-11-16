import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batchPortions, extractions, ownedHardware, pinnedRecipes, setupParts, setups } from "@/db/schema";
import { partsKey } from "@/domain/setupKey";
import { recipeLines } from "@/app/(app)/recipeLines";
import { createTestDb } from "@/test/db";
import { makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getHome } from "./home";
import { getDialInFromRecipe, getDialInFromShot, getFixStart } from "./logStart";
import { pullShot, undoPull } from "./pull";
import {
  enteredPinPreview,
  getBagRecipes,
  getCoffeeRecipes,
  getCurrentRecipe,
  getRecipeForBag,
  pinEnteredRecipe,
  pinFromShot,
  pinPreview,
  type RecipeValues,
} from "./recipes";

/*
 * Sweetened on recipes (EPIC-02-01, design 5.0a): STORY-02-01-07, 02-01-08
 * and 02-01-09, and the criteria they amend in STORY-01-03-04, 02-01-04,
 * 02-01-06, 02-02-01, 02-02-02, 02-03-02 and 02-03-03.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const at = (day: number, hour = 8) => new Date(Date.UTC(2026, 2, day, hour));
const NOW = at(20);

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

async function shot(over: Partial<typeof extractions.$inferInsert> = {}) {
  const id = newId();
  await db()
    .insert(extractions)
    .values({ id, ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at(1), ...over });
  return id;
}

const key = () => ({ beanId: k.bean.id, personaId: k.persona.id, setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id });
const pinned = async () => (await getCurrentRecipe(key()))!;

const ENTERED: RecipeValues = {
  grind: 14,
  dose: 18,
  yield: 38,
  timeMs: 29_000,
  brewTempC: null,
  brewTempStep: null,
  pressureBar: null,
  pressureStep: null,
  usedWdt: false,
  usedPuckScreen: false,
  milkTypeId: null,
  milkMl: null,
  sweetened: true,
};
const entered = (values: Partial<RecipeValues> = {}) => ({
  batchId: k.batch.id,
  setupId: k.setup.id,
  drinkTypeId: k.drinks.espresso.id,
  values: { ...ENTERED, ...values },
});

describe("pinning sweetened (STORY-02-01-07)", () => {
  it("previews and saves a sweetened shot's value, and a plain shot's (AC 1)", async () => {
    const sweet = await shot({ sweetened: true });
    expect((await pinPreview(sweet)).values.sweetened).toBe(true);
    await pinFromShot(sweet, at(2));
    expect((await pinned()).sweetened).toBe(true);

    const plain = await shot({ sweetened: false, createdAt: at(3) });
    expect((await pinPreview(plain)).values.sweetened).toBe(false);
  });

  it("lists sweetened among the differences only when it changes (AC 2)", async () => {
    await pinFromShot(await shot({ sweetened: false }), at(2));
    expect((await pinPreview(await shot({ sweetened: true }))).differences).toEqual(["sweetened"]);
    expect((await pinPreview(await shot({ sweetened: false }))).differences).toEqual([]);
  });

  it("pins entered values with sweetened, and the recipe mode starts as the current recipe has it (AC 3)", async () => {
    const bag = { batchId: k.batch.id, setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id };
    expect((await getRecipeForBag(bag)).recipe).toBeNull();
    expect((await enteredPinPreview(entered())).values.sweetened).toBe(true);
    await pinEnteredRecipe(entered(), at(2));
    expect((await getRecipeForBag(bag)).recipe?.sweetened).toBe(true);
    // Left out by an older client: not sweetened.
    const older: Partial<RecipeValues> = { ...ENTERED };
    delete older.sweetened;
    await pinEnteredRecipe({ ...entered(), values: older as RecipeValues }, at(3));
    expect((await pinned()).sweetened).toBe(false);
  });

  it("replaces the same recipe whether or not it is sweetened (AC 4)", async () => {
    await pinFromShot(await shot({ sweetened: true }), at(2));
    await pinFromShot(await shot({ sweetened: false, createdAt: at(3) }), at(4));
    expect((await pinned()).sweetened).toBe(false);
    expect(await getCoffeeRecipes(k.bean.id)).toHaveLength(1);
  });

  it("reads recipes pinned before the change as not sweetened (AC 5)", async () => {
    // A row written without the column: the migration's default.
    await db().insert(pinnedRecipes).values({ id: newId(), ...shotValues(k), beanId: k.bean.id, pinnedAt: at(2) });
    expect((await pinned()).sweetened).toBe(false);
  });

  it("pins nothing when the values are refused (AC 6)", async () => {
    await expect(pinEnteredRecipe(entered({ yield: -1 }), at(2))).rejects.toThrow();
    expect(await db().select().from(pinnedRecipes)).toEqual([]);
  });
});

async function recipe(over: Partial<typeof pinnedRecipes.$inferInsert> = {}) {
  await db().insert(pinnedRecipes).values({ id: newId(), ...shotValues(k), beanId: k.bean.id, pinnedAt: at(2), ...over });
}

describe("starting a log with sweetened (STORY-02-01-08, STORY-01-03-04 AC 2)", () => {
  const dialIn = () => getDialInFromRecipe({ drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id });

  it("dials in ticked from a sweetened recipe, unticked from a plain one (AC 1, AC 2; STORY-02-03-03 AC 1)", async () => {
    await recipe({ sweetened: true });
    expect((await dialIn())!.sweetened).toBe(true);
    await recipe({ sweetened: false, pinnedAt: at(3) });
    expect((await dialIn())!.sweetened).toBe(false);
  });

  it("fixes an off one-tap shot ticked as the current recipe has it (AC 1; STORY-02-03-02 AC 1)", async () => {
    await recipe({ sweetened: true });
    const id = await shot({ entryMode: "one-tap", sweetened: false, reaction: "off" });
    expect((await getFixStart(id)).sweetened).toBe(true);
  });

  it("fixes from the one-tap shot itself when no recipe is left", async () => {
    const id = await shot({ entryMode: "one-tap", sweetened: true, reaction: "off" });
    expect((await getFixStart(id)).sweetened).toBe(true);
  });

  it("carries the closest setup's sweetened recipe to a new setup (AC 1, AC 4; STORY-02-01-06 AC 3)", async () => {
    await recipe({ sweetened: true, grindSize: 20 });
    const grinder = newId();
    await db().insert(ownedHardware).values({ id: grinder, householdId: k.household.id, hardwareId: k.parts[1].hardwareId });
    const other = newId();
    const partIds = [k.parts[0].id, grinder, k.parts[2].id];
    await db().insert(setups).values({ id: other, householdId: k.household.id, partsKey: partsKey(partIds), createdAt: at(4) });
    await db().insert(setupParts).values(partIds.map((p) => ({ setupId: other, ownedHardwareId: p })));
    testContext.setupChoice = { setupId: other, at: at(6).getTime() };
    const s = (await dialIn())!;
    // The other carried values and the note are as before.
    expect(s).toMatchObject({ setupId: other, sweetened: true, from: { setupId: k.setup.id, grindCarried: false } });
  });

  it("starts \"Dial in from this\" as the past shot was saved, whatever the recipe (AC 6)", async () => {
    await recipe({ sweetened: true });
    expect((await getDialInFromShot(await shot({ sweetened: false }))).sweetened).toBe(false);
    expect((await getDialInFromShot(await shot({ sweetened: true }))).sweetened).toBe(true);
  });

  it("has no start, so a blank log, with no recipe anywhere (AC 5)", async () => {
    expect(await dialIn()).toBeNull();
  });
});

describe("sweetened on Brew, the pull and recipe rows (STORY-02-01-09)", () => {
  const pull = (clientId = newId(), now = NOW) => pullShot({ clientId, drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id }, now);
  const shotRow = async (id: string) => (await db().select().from(extractions).where(eq(extractions.id, id)))[0];

  beforeEach(async () => {
    await db().update(batchPortions).set({ openedAt: at(1) }).where(eq(batchPortions.id, k.portion.id));
  });

  it("gives Brew the recipe's sweetened value (AC 1; STORY-02-02-01 AC 1)", async () => {
    await recipe({ sweetened: true });
    expect((await getHome({}, NOW))!.state).toMatchObject({ kind: "recipe", recipe: { sweetened: true } });
  });

  it("copies sweetened onto the one-tap shot with prep, and reports it (AC 3; STORY-02-02-02 AC 1)", async () => {
    await recipe({ sweetened: true, usedWdt: true });
    const result = await pull();
    expect(result).toMatchObject({ kind: "pulled", sweetened: true });
    const row = await shotRow((result as { shotId: string }).shotId);
    expect(row).toMatchObject({ entryMode: "one-tap", sweetened: true, usedWdt: true });
  });

  it("records a plain recipe's pull as not sweetened (AC 3)", async () => {
    await recipe({ sweetened: false });
    const result = await pull();
    expect(result).toMatchObject({ kind: "pulled", sweetened: false });
    expect((await shotRow((result as { shotId: string }).shotId)).sweetened).toBe(false);
  });

  it("reports the first shot's value on a repeated tap", async () => {
    await recipe({ sweetened: true });
    const clientId = newId();
    const first = await pull(clientId);
    // The recipe changes between taps; the repeat is the same shot.
    await recipe({ sweetened: false, pinnedAt: at(3) });
    expect(await pull(clientId)).toEqual(first);
  });

  it("leaves nothing behind after an undo (AC 5)", async () => {
    await recipe({ sweetened: true });
    const { shotId } = (await pull()) as { shotId: string };
    await undoPull(shotId, NOW);
    expect(await shotRow(shotId)).toBeUndefined();
    expect((await pinned()).sweetened).toBe(true);
  });

  it("gives the bag's and the coffee's rows the value (AC 2; STORY-02-01-04 AC 1)", async () => {
    await recipe({ sweetened: true });
    await recipe({ sweetened: false, drinkTypeId: k.drinks.latte.id });
    const rows = await getBagRecipes(k.batch.id);
    expect(rows.map((r) => [r.drinkTypeId, r.sweetened]).sort()).toEqual(
      [
        [k.drinks.espresso.id, true],
        [k.drinks.latte.id, false],
      ].sort(),
    );
    expect(await getCoffeeRecipes(k.bean.id)).toEqual(rows);
  });
});

describe("recipeLines (STORY-02-01-09 AC 1, AC 2)", () => {
  type Args = Parameters<typeof recipeLines>;
  const t = ((key: string) => key) as unknown as Args[2];
  const format = { list: (xs: string[]) => xs.join(", "), number: String } as unknown as Args[3];
  const lines = (sweetened: boolean) => recipeLines({ ...ENTERED, sweetened }, { hasMilk: false, milks: [] }, t, format);

  it("says sweetened in words only when the recipe is", () => {
    expect(lines(true)).toEqual(["recipe.sweetenedLine"]);
    expect(lines(false)).toEqual([]);
  });
});
