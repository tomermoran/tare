import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, batchPortions, canonicalBeans, extractions, setups } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getHome } from "./home";
import { pinEnteredRecipe, pinFromShot } from "./recipes";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const at = (day: number, hour = 8) => new Date(Date.UTC(2026, 2, day, hour));
const NOW = at(20, 8);

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
    .values({ id, ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at(1), ...values });
  return id;
}

/** Another coffee, with one portion. */
async function coffee(name: string, portion: Partial<typeof batchPortions.$inferInsert> = {}, addedAt = at(2)) {
  const beanId = newId();
  await db().insert(canonicalBeans).values({ id: beanId, roasterId: k.bean.roasterId, name, source: "user", status: "private", createdAt: addedAt });
  const batchId = newId();
  await db().insert(batches).values({ id: batchId, householdId: k.household.id, beanId, bagWeight: 250, createdAt: addedAt });
  const portionId = newId();
  await db().insert(batchPortions).values({ id: portionId, batchId, weight: 250, createdAt: addedAt, ...portion });
  return { beanId, portionId };
}

describe("getHome (STORY-02-02-01)", () => {
  it("shows the drink, coffee, setup and the recipe for them, with what's left (AC 1)", async () => {
    await pinFromShot(await shot({ drinkTypeId: k.drinks.latte.id, usedWdt: true, milkTypeId: k.milk.id, milkMl: 150, createdAt: at(19, 8) }), at(19, 9));
    const home = (await getHome({}, NOW))!;
    expect(home.drink.id).toBe(k.drinks.latte.id);
    expect(home.coffee?.id).toBe(k.bean.id);
    expect(home.setup.id).toBe(k.setup.id);
    expect(home.state).toMatchObject({ kind: "recipe", recipe: { grind: 15, usedWdt: true, milkTypeId: k.milk.id, milkMl: 150 } });
    // 250 g less the one 18 g dose.
    expect(home.remaining).toEqual({ grams: 232, overLogged: false });
  });

  it("follows the time of day (AC 3)", async () => {
    await shot({ drinkTypeId: k.drinks.latte.id, createdAt: at(18, 7) });
    await shot({ drinkTypeId: k.drinks.espresso.id, createdAt: at(18, 15) });
    expect((await getHome({}, at(20, 8)))!.drink.id).toBe(k.drinks.latte.id);
    expect((await getHome({}, at(20, 14)))!.drink.id).toBe(k.drinks.espresso.id);
  });

  it("prefers an open coffee with a recipe here, and never counts frozen as open (AC 4, AC 5)", async () => {
    // The kitchen's own coffee was opened, then frozen; it has the recipe.
    await pinEnteredRecipe(
      {
        batchId: k.batch.id,
        setupId: k.setup.id,
        drinkTypeId: k.drinks.espresso.id,
        values: { grind: 15, dose: 18, yield: 36, timeMs: 28_000, brewTempC: null, brewTempStep: null, pressureBar: null, pressureStep: null, usedWdt: false, usedPuckScreen: false, milkTypeId: null, milkMl: null },
      },
      at(1, 9),
    );
    await db().update(batchPortions).set({ openedAt: at(1), frozenAt: at(3) }).where(eq(batchPortions.id, k.portion.id));
    const sealed = await coffee("Sealed Blend");
    expect((await getHome({}, NOW))!.coffee?.id).toBe(sealed.beanId);

    const open = await coffee("Open Blend", { openedAt: at(5) });
    const home = (await getHome({}, NOW))!;
    expect(home.coffee?.id).toBe(open.beanId);
    expect(home.state.kind).toBe("noRecipe");
    // With a recipe here first, frozen-only last.
    expect(home.coffees.map((c) => c.bean.name)).toEqual(["Open Blend", "Sealed Blend", "House Blend"]);
    expect(home.coffees.at(-1)).toMatchObject({ frozenOnly: true, hasRecipe: true });
  });

  it("says the last pull's coffee is finished (AC 6)", async () => {
    await pinFromShot(await shot(), at(1, 9));
    await db().update(batchPortions).set({ finishedAt: at(4) }).where(eq(batchPortions.id, k.portion.id));
    await coffee("Next Blend");
    const home = (await getHome({}, NOW))!;
    expect(home.state).toMatchObject({ kind: "finished", recipe: { grind: 15 } });
    expect(home.coffee?.id).toBe(k.bean.id);
    expect(home.portion).toBeNull();
    // Choosing another coffee moves on, for this visit.
    const next = home.coffees[0].bean.id;
    expect((await getHome({ beanId: next }, NOW))!.coffee?.id).toBe(next);
  });

  it("tells no recipe from no recipe on this setup, naming the closest (STORY-02-02-05, STORY-02-01-06)", async () => {
    expect((await getHome({}, NOW))!.state.kind).toBe("noRecipe");
    const other = newId();
    await db().insert(setups).values({ id: other, householdId: k.household.id, partsKey: "other", createdAt: at(1) });
    await pinFromShot(await shot({ setupId: other }), at(2));
    // The latest shot was on the other setup; choose the kitchen's again.
    testContext.setupChoice = { setupId: k.setup.id, at: at(3).getTime() };
    const home = (await getHome({}, NOW))!;
    expect(home.setup.id).toBe(k.setup.id);
    expect(home.state).toMatchObject({ kind: "noRecipeOnSetup", from: { id: other } });
  });

  it("offers the pull once a recipe is pinned here (STORY-02-02-05 AC 4)", async () => {
    expect((await getHome({}, NOW))!.state.kind).toBe("noRecipe");
    await pinFromShot(await shot(), at(2));
    expect((await getHome({}, NOW))!.state).toMatchObject({ kind: "recipe", recipe: { grind: 15 } });
  });

  it("uses a drink chosen for this visit, when it's one of the options", async () => {
    expect((await getHome({ drinkId: k.drinks.latte.id }, NOW))!.drink.id).toBe(k.drinks.latte.id);
    expect((await getHome({ drinkId: "nope" }, NOW))!.drink.id).toBe(k.drinks.espresso.id);
  });

  it("says when there's no coffee left at all", async () => {
    await db().update(batchPortions).set({ finishedAt: at(4) }).where(eq(batchPortions.id, k.portion.id));
    expect((await getHome({}, NOW))!.state.kind).toBe("noCoffee");
  });

  it("never shows another household's coffee", async () => {
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    // A new household has no setup yet: Brew shows the checklist.
    await expect(getHome({}, NOW)).resolves.toBeNull();
  });
});
