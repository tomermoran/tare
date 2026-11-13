import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, batchPortions, extractions, householdMembers, users } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getHome } from "./home";
import { NoRecipeError, pullShot, undoPull, UndoRefusedError, UNDO_WINDOW_MS } from "./pull";
import { pinFromShot } from "./recipes";
import { NotFoundError } from "./scope";

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

/** Pins a latte recipe with prep and milk from a measured shot on the kitchen's portion. */
async function pinLatte() {
  const id = newId();
  await db().insert(extractions).values({
    id,
    ...shotValues(k),
    drinkTypeId: k.drinks.latte.id,
    usedWdt: true,
    milkTypeId: k.milk.id,
    milkMl: 150,
    loggedByUserId: k.user.id,
    portionId: k.portion.id,
    entryMode: "measured",
    createdAt: at(1),
  });
  await pinFromShot(id, at(1, 9));
}

const setPortion = (id: string, dates: Partial<typeof batchPortions.$inferInsert>) =>
  db().update(batchPortions).set(dates).where(eq(batchPortions.id, id));

async function portionOfKitchenBean(dates: Partial<typeof batchPortions.$inferInsert>, addedAt = at(2)) {
  const batchId = newId();
  await db().insert(batches).values({ id: batchId, householdId: k.household.id, beanId: k.bean.id, bagWeight: 250, createdAt: addedAt });
  const id = newId();
  await db().insert(batchPortions).values({ id, batchId, weight: 250, createdAt: addedAt, ...dates });
  return id;
}

const pull = (extra: { clientId?: string; portionId?: string } = {}, now = NOW) =>
  pullShot({ clientId: extra.clientId ?? newId(), drinkTypeId: k.drinks.latte.id, beanId: k.bean.id, portionId: extra.portionId }, now);
const shotRow = async (id: string) => (await db().select().from(extractions).where(eq(extractions.id, id)))[0];

describe("pullShot (STORY-02-02-02)", () => {
  beforeEach(async () => {
    await pinLatte();
    await setPortion(k.portion.id, { openedAt: at(1) });
  });

  it("records the recipe's values, prep, milk and setup as a one-tap shot (AC 1, AC 2)", async () => {
    const result = await pull();
    expect(result).toMatchObject({ kind: "pulled", openedPortion: false });
    const row = await shotRow((result as { shotId: string }).shotId);
    expect(row).toMatchObject({
      entryMode: "one-tap",
      grindSize: 15,
      doseWeight: 18,
      yieldWeight: 36,
      yieldTime: 28_000,
      usedWdt: true,
      usedPuckScreen: false,
      milkTypeId: k.milk.id,
      milkMl: 150,
      setupId: k.setup.id,
      drinkTypeId: k.drinks.latte.id,
      personaId: k.persona.id,
      loggedByUserId: k.user.id,
      portionId: k.portion.id,
      isNetworkEligible: false,
      createdAt: NOW,
    });
  });

  it("uses the earliest-opened open portion, never a frozen one (AC 3)", async () => {
    // Opened earlier than the kitchen's, but in the freezer now.
    const frozen = await portionOfKitchenBean({ openedAt: at(1, 6), frozenAt: at(2) });
    const later = await portionOfKitchenBean({ openedAt: at(5) });
    const { shotId } = (await pull()) as { shotId: string };
    expect((await shotRow(shotId)).portionId).toBe(k.portion.id);
    expect([frozen, later]).not.toContain((await shotRow(shotId)).portionId);
  });

  it("makes one shot from a doubled tap (AC 4)", async () => {
    const clientId = newId();
    const [a, b] = await Promise.all([pull({ clientId }), pull({ clientId })]);
    expect(a).toEqual(b);
    expect(await db().select().from(extractions).where(eq(extractions.entryMode, "one-tap"))).toHaveLength(1);
  });

  it("records nothing without a recipe here (AC 5)", async () => {
    await expect(pullShot({ clientId: newId(), drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id }, NOW)).rejects.toBeInstanceOf(NoRecipeError);
    expect(await db().select().from(extractions).where(eq(extractions.entryMode, "one-tap"))).toEqual([]);
  });

  it("counts against what's left and refuses a bad client ID", async () => {
    await pull();
    expect((await getHome({ drinkId: k.drinks.latte.id }, NOW))!.remaining).toEqual({ grams: 250 - 18 - 18, overLogged: false });
    await expect(pull({ clientId: "not-a-uuid" })).rejects.toBeInstanceOf(NotFoundError);
  });

  it("can't pull with another household's shot ID or coffee", async () => {
    const { shotId } = (await pull()) as { shotId: string };
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(pullShot({ clientId: shotId, drinkTypeId: k.drinks.latte.id, beanId: k.bean.id })).rejects.toBeInstanceOf(NotFoundError);
    await expect(pullShot({ clientId: newId(), drinkTypeId: k.drinks.latte.id, beanId: k.bean.id })).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("choosing a bag when none is open (STORY-02-02-03)", () => {
  beforeEach(pinLatte);

  it("asks only when none is open, counter first and frozen last (AC 1)", async () => {
    const frozen = await portionOfKitchenBean({ frozenAt: at(3) }, at(3));
    const result = await pull();
    expect(result.kind).toBe("needsPortion");
    const portions = (result as { portions: { id: string; frozen: boolean; remaining: unknown }[] }).portions;
    expect(portions.map((p) => p.id)).toEqual([k.portion.id, frozen]);
    expect(portions[1]).toMatchObject({ frozen: true, remaining: { grams: 250, overLogged: false } });
    expect(await db().select().from(extractions).where(eq(extractions.entryMode, "one-tap"))).toEqual([]);
  });

  it("opens an unopened portion at the shot time (AC 2)", async () => {
    const result = await pull({ portionId: k.portion.id });
    expect(result).toMatchObject({ kind: "pulled", openedPortion: true });
    const [p] = await db().select().from(batchPortions).where(eq(batchPortions.id, k.portion.id));
    expect(p.openedAt).toEqual(NOW);
  });

  it("opens a sealed thawed portion too", async () => {
    await setPortion(k.portion.id, { frozenAt: at(2), thawedAt: at(3) });
    await pull({ portionId: k.portion.id });
    const [p] = await db().select().from(batchPortions).where(eq(batchPortions.id, k.portion.id));
    expect(p).toMatchObject({ openedAt: NOW, frozenAt: at(2), thawedAt: at(3) });
  });

  it("grinds a frozen portion from frozen, changing no dates (AC 3)", async () => {
    await setPortion(k.portion.id, { openedAt: at(1), frozenAt: at(2) });
    const result = await pull({ portionId: k.portion.id });
    expect(result).toMatchObject({ kind: "pulled", openedPortion: false });
    const [p] = await db().select().from(batchPortions).where(eq(batchPortions.id, k.portion.id));
    expect(p).toMatchObject({ openedAt: at(1), frozenAt: at(2), thawedAt: null });
  });

  it("says none is left and records nothing (AC 4)", async () => {
    await setPortion(k.portion.id, { finishedAt: at(4) });
    expect(await pull()).toEqual({ kind: "noneLeft" });
    expect(await db().select().from(extractions).where(eq(extractions.entryMode, "one-tap"))).toEqual([]);
  });
});

describe("undoPull (STORY-02-02-04)", () => {
  beforeEach(pinLatte);

  it("removes the shot and makes a portion it opened unopened again (AC 1 to AC 3)", async () => {
    await setPortion(k.portion.id, { finishedAt: at(4) });
    const fresh = await portionOfKitchenBean({}, at(5));
    const { shotId } = (await pull({ portionId: fresh })) as { shotId: string };
    await undoPull(shotId, new Date(NOW.getTime() + 5_000));
    expect(await shotRow(shotId)).toBeUndefined();
    const [p] = await db().select().from(batchPortions).where(eq(batchPortions.id, fresh));
    expect(p.openedAt).toBeNull();
    expect((await getHome({ drinkId: k.drinks.latte.id }, NOW))!.remaining).toEqual({ grams: 250, overLogged: false });
  });

  it("keeps the portion open when another shot used it", async () => {
    // The pinned measured shot was pulled from this portion too.
    const { shotId } = (await pull({ portionId: k.portion.id })) as { shotId: string };
    await undoPull(shotId, NOW);
    const [p] = await db().select().from(batchPortions).where(eq(batchPortions.id, k.portion.id));
    expect(p.openedAt).toEqual(NOW);
  });

  it("leaves the portion open when it was open already", async () => {
    await setPortion(k.portion.id, { openedAt: at(1) });
    const { shotId } = (await pull()) as { shotId: string };
    await undoPull(shotId, NOW);
    const [p] = await db().select().from(batchPortions).where(eq(batchPortions.id, k.portion.id));
    expect(p.openedAt).toEqual(at(1));
  });

  it("refuses after the window, a measured shot, and another user's shot (AC 4)", async () => {
    await setPortion(k.portion.id, { openedAt: at(1) });
    const { shotId } = (await pull()) as { shotId: string };
    await expect(undoPull(shotId, new Date(NOW.getTime() + UNDO_WINDOW_MS + 1))).rejects.toBeInstanceOf(UndoRefusedError);
    const [measured] = await db().select().from(extractions).where(eq(extractions.entryMode, "measured"));
    await expect(undoPull(measured.id, measured.createdAt)).rejects.toBeInstanceOf(UndoRefusedError);

    const memberId = newId();
    await db().insert(users).values({ id: memberId, firebaseUid: "member-uid", createdAt: at(1) });
    await db().insert(householdMembers).values({ householdId: k.household.id, userId: memberId, role: "member", joinedAt: at(1) });
    signInAs("member-uid");
    await expect(undoPull(shotId, NOW)).rejects.toBeInstanceOf(UndoRefusedError);
    expect(await shotRow(shotId)).toBeDefined();
  });

  it("can't undo another household's shot", async () => {
    await setPortion(k.portion.id, { openedAt: at(1) });
    const { shotId } = (await pull()) as { shotId: string };
    signInAs((await makeHousehold(db())).user.firebaseUid);
    await expect(undoPull(shotId, NOW)).rejects.toBeInstanceOf(NotFoundError);
  });
});
