import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { eq } from "drizzle-orm";
import { batches, batchPortions, extractions, ownedHardware, pinnedRecipes, setupParts, setups } from "@/db/schema";
import { partsKey } from "@/domain/setupKey";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { dialInPortion, getDialInFromRecipe, getDialInFromShot, getFixStart, getPendingSuggestion, suggestionForShot } from "./logStart";
import { NotFoundError } from "./scope";
import { currentSetupOf } from "./setups";
import { saveMeasuredShot } from "./shots";

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
    // The note is the suggestion, not "starting from your shot".
    expect(s.fromShot).toBeNull();
  });
});

describe("dial in from a past shot (STORY-02-06-06)", () => {
  const setPortion = (id: string, dates: Partial<typeof batchPortions.$inferInsert>) =>
    db().update(batchPortions).set(dates).where(eq(batchPortions.id, id));
  async function anotherBag(dates: Partial<typeof batchPortions.$inferInsert> = {}) {
    const batchId = newId();
    await db().insert(batches).values({ id: batchId, householdId: k.household.id, beanId: k.bean.id, bagWeight: 250, createdAt: at(2) });
    const id = newId();
    await db().insert(batchPortions).values({ id, batchId, weight: 250, createdAt: at(2), ...dates });
    return id;
  }

  it("starts from the shot's values, prep, milk, setup and drink, and says which shot (AC 1)", async () => {
    const id = await shot({ drinkTypeId: k.drinks.latte.id, milkTypeId: k.milk.id, milkMl: 150, usedWdt: true, grindSize: 13, tasteBalance: -2 });
    const s = await getDialInFromShot(id);
    expect(s).toMatchObject({ setupId: k.setup.id, drinkTypeId: k.drinks.latte.id, milkTypeId: k.milk.id, portionId: k.portion.id, locked: false });
    expect(s.start).toMatchObject({ grind: 13, milkMl: 150, prep: { wdt: true, puckScreen: false } });
    // No suggestion is applied unless asked for.
    expect(s.suggestion).toBeNull();
    expect(s.applied).toEqual(s.start);
    expect(s.fromShot).toEqual({ at: at(5) });
  });

  it("uses the shot's bag while it's open, else another open bag of the coffee", async () => {
    await setPortion(k.portion.id, { openedAt: at(4) });
    const id = await shot();
    expect(await dialInPortion(id)).toEqual({ kind: "portion", portionId: k.portion.id });
    await setPortion(k.portion.id, { finishedAt: at(6) });
    const other = await anotherBag({ openedAt: at(6) });
    expect(await dialInPortion(id)).toEqual({ kind: "portion", portionId: other });
  });

  it("asks which bag when none of the coffee is open (AC 2)", async () => {
    await setPortion(k.portion.id, { openedAt: at(4), finishedAt: at(6) });
    const id = await shot();
    const sealed = await anotherBag();
    const result = await dialInPortion(id);
    expect(result).toMatchObject({ kind: "choose", portions: [{ id: sealed }] });
    // The chosen bag is the log's, and must be this coffee's.
    expect((await getDialInFromShot(id, undefined, sealed)).portionId).toBe(sealed);
    await expect(getDialInFromShot(id, undefined, k.portion.id)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("has no bags to offer when the coffee is finished (AC 3)", async () => {
    await setPortion(k.portion.id, { openedAt: at(4), finishedAt: at(6) });
    const id = await shot();
    expect(await dialInPortion(id)).toEqual({ kind: "choose", portions: [] });
    expect((await getDialInFromShot(id)).portionId).toBeNull();
  });

  it("makes the shot's setup current once the new shot is saved (AC 4)", async () => {
    const id = await shot();
    const other = newId();
    await db().insert(setups).values({ id: other, householdId: k.household.id, partsKey: "other", createdAt: at(4) });
    testContext.setupChoice = { setupId: other, at: at(6).getTime() };
    const list = () => db().select({ id: setups.id, createdAt: setups.createdAt }).from(setups).where(eq(setups.householdId, k.household.id));
    expect(await currentSetupOf(k.household.id, await list())).toBe(other);
    const s = await getDialInFromShot(id);
    // Leaving changes nothing; only a saved shot does.
    expect(await currentSetupOf(k.household.id, await list())).toBe(other);
    await saveMeasuredShot(
      { setupId: s.setupId, drinkTypeId: s.drinkTypeId, portionId: s.portionId!, grind: s.start.grind, dose: s.start.dose, yield: s.start.yield, timeMs: s.start.timeMs },
      at(7),
    );
    expect(await currentSetupOf(k.household.id, await list())).toBe(k.setup.id);
  });

  it("only reads the past shot (AC 5)", async () => {
    const id = await shot({ tasteBalance: -1 });
    const [before] = await db().select().from(extractions).where(eq(extractions.id, id));
    await getDialInFromShot(id);
    await dialInPortion(id);
    const [after] = await db().select().from(extractions).where(eq(extractions.id, id));
    expect(after).toEqual(before);
  });

  it("doesn't open another household's shot", async () => {
    const id = await shot();
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(dialInPortion(id)).rejects.toBeInstanceOf(NotFoundError);
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
