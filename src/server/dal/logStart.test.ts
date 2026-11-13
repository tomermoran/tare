import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { extractions, ownedHardware, pinnedRecipes, setupParts, setups } from "@/db/schema";
import { partsKey } from "@/domain/setupKey";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getDialInFromRecipe, getDialInFromShot, getFixStart, getPendingSuggestion, suggestionForShot } from "./logStart";
import { NotFoundError } from "./scope";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const at = (day: number) => new Date(Date.UTC(2026, 2, day, 8));

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

async function recipe(over: Partial<typeof pinnedRecipes.$inferInsert> = {}) {
  await db().insert(pinnedRecipes).values({ id: newId(), ...shotValues(k), beanId: k.bean.id, grindSize: 14, usedWdt: true, pinnedAt: at(3), ...over });
}

async function shot(over: Partial<typeof extractions.$inferInsert> = {}) {
  const id = newId();
  await db()
    .insert(extractions)
    .values({ id, ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at(5), ...over });
  return id;
}

const espresso = () => ({ beanId: k.bean.id, setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id });

describe("suggestionForShot and getPendingSuggestion (STORY-02-03-07)", () => {
  it("works the suggestion out again from the shot's saved answers", async () => {
    // The kitchen's grinder: stepless, step 0.5, higher is coarser.
    const id = await shot({ tasteBalance: -2 });
    expect((await suggestionForShot(id)).change).toMatchObject({ lever: "grind", direction: "finer", from: 15, to: 14 });
  });

  it("is the latest shot on the coffee, setup and drink, only with a change (AC 3, AC 5)", async () => {
    await shot({ tasteBalance: -1, createdAt: at(4) });
    expect(await getPendingSuggestion(espresso())).toMatchObject({ shotId: expect.any(String) });
    // A newer shot that tasted right: nothing pending.
    await shot({ tasteBalance: 0, createdAt: at(6) });
    expect(await getPendingSuggestion(espresso())).toBeNull();
    const newest = await shot({ tasteBody: 1, createdAt: at(7) });
    expect(await getPendingSuggestion(espresso())).toEqual({ shotId: newest });
    expect(await getPendingSuggestion({ ...espresso(), drinkTypeId: k.drinks.latte.id })).toBeNull();
  });
});

describe("getFixStart (STORY-02-03-02)", () => {
  it("starts from the recipe, with the one-tap shot's portion, drink and setup locked (AC 1)", async () => {
    await recipe();
    const id = await shot({ entryMode: "one-tap", grindSize: 14, usedWdt: true, reaction: "off", tasteBalance: -2 });
    const s = await getFixStart(id);
    expect(s).toMatchObject({ setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id, portionId: k.portion.id, locked: true, suggestion: null });
    expect(s.start).toMatchObject({ grind: 14, prep: { wdt: true, puckScreen: false } });
    expect(s.applied).toEqual(s.start);
  });

  it("makes the suggested change, keeping the recipe as what it was (AC 2, AC 3)", async () => {
    await recipe();
    const id = await shot({ entryMode: "one-tap", grindSize: 14, usedWdt: true, reaction: "off", tasteBalance: -2 });
    const s = await getFixStart(id, id);
    expect(s.start.grind).toBe(14);
    expect(s.applied.grind).toBe(13);
    expect(s.suggestion?.change).toMatchObject({ lever: "grind", direction: "finer" });
  });

  it("doesn't open another household's shot, or apply its suggestion", async () => {
    const id = await shot({ entryMode: "one-tap" });
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(getFixStart(id)).rejects.toThrow(NotFoundError);
  });
});

describe("getDialInFromShot (STORY-02-03-07 AC 1)", () => {
  it("is the tasted shot's values plus its change, in the same bag", async () => {
    const id = await shot({ tasteStrength: -1, yieldWeight: 36 });
    const s = await getDialInFromShot(id, id);
    expect(s).toMatchObject({ portionId: k.portion.id, locked: false });
    expect(s.start.yield).toBe(36);
    expect(s.applied.yield).toBe(34);
  });
});

describe("getDialInFromRecipe (STORY-02-03-03, STORY-02-01-06)", () => {
  const key = () => ({ drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id });

  it("is null with no recipe anywhere: a blank dial-in", async () => {
    expect(await getDialInFromRecipe(key())).toBeNull();
  });

  it("starts from the recipe on this setup, with a pending suggestion when given (AC 1, AC 2)", async () => {
    await recipe({ grindSize: 20 });
    expect(await getDialInFromRecipe(key())).toMatchObject({ setupId: k.setup.id, from: null, suggestion: null, start: { grind: 20 } });
    const pending = await shot({ tasteBody: -1 });
    const s = (await getDialInFromRecipe({ ...key(), suggested: pending }))!;
    expect(s.start.dose).toBe(18);
    expect(s.applied.dose).toBe(18);
    // The kitchen's basket is made for 16-18 g, so dose can't go up: no change, nothing applied.
    expect(s.suggestion).toBeNull();
  });

  it("starts from the closest setup's recipe, saying grind wasn't carried for another grinder", async () => {
    await recipe({ grindSize: 20 });
    const grinder = newId();
    await db().insert(ownedHardware).values({ id: grinder, householdId: k.household.id, hardwareId: k.parts[1].hardwareId });
    const other = newId();
    const partIds = [k.parts[0].id, grinder, k.parts[2].id];
    await db().insert(setups).values({ id: other, householdId: k.household.id, partsKey: partsKey(partIds), createdAt: at(4) });
    await db().insert(setupParts).values(partIds.map((p) => ({ setupId: other, ownedHardwareId: p })));
    testContext.setupChoice = { setupId: other, at: at(6).getTime() };
    const s = (await getDialInFromRecipe(key()))!;
    expect(s).toMatchObject({ setupId: other, from: { setupId: k.setup.id, grindCarried: false } });
  });
});
