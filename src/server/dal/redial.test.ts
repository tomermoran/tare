import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, batchPortions, canonicalBeans, maintenanceEvents, pinnedRecipes } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getRedialStart } from "./logStart";
import { listMaintenance } from "./maintenance";
import {
  confirmShift,
  getBrewRedialCard,
  getEvent,
  getGrinderRedial,
  getOffsetProposal,
  InvalidShiftError,
  listRedialCandidates,
  previewShift,
  setEventShift,
} from "./redial";
import { NotFoundError } from "./scope";

/*
 * Re-dialling after maintenance (TASK-04-03-04-BE1, BE2, 04-03-01-BE2,
 * 04-03-02-BE1, BE2, 04-03-05-BE1): the derived state, Brew's card, the
 * candidates, the proposal after a pin, and storing, previewing and
 * changing a shift.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const at = (day: number, hour = 8) => new Date(Date.UTC(2026, 2, day, hour));
const grinder = () => k.parts[1].id;

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

async function pin(day: number, over: Partial<typeof pinnedRecipes.$inferInsert> = {}) {
  const id = newId();
  await db()
    .insert(pinnedRecipes)
    .values({ id, ...shotValues(k), beanId: k.bean.id, grindSize: 15, pinnedAt: at(day), ...over });
  return id;
}

async function event(day: number, over: Partial<typeof maintenanceEvents.$inferInsert> = {}) {
  const id = newId();
  await db()
    .insert(maintenanceEvents)
    .values({ id, ownedHardwareId: grinder(), kind: "burrs", isRecalibration: true, occurredAt: at(day), ...over });
  return id;
}

const stateOf = async (id: string, partId = grinder()) => (await listMaintenance(partId)).find((e) => e.id === id)!.redial;

describe("re-dial state (TASK-04-03-04-BE1)", () => {
  it("awaits a re-dial with a recipe pinned before the event (AC 1)", async () => {
    await pin(1);
    const id = await event(5);
    expect(await stateOf(id)).toBe("awaiting");
    expect(await getGrinderRedial(grinder())).toEqual({ eventId: id, at: at(5) });
  });

  it("has nothing to map with no recipe before, and no status (AC 4)", async () => {
    const id = await event(5);
    await pin(6);
    expect(await stateOf(id)).toBe("nothingToMap");
    expect(await getGrinderRedial(grinder())).toBeNull();
  });

  it("ignores a clean, a repair, and a machine or basket event (AC 4)", async () => {
    await pin(1);
    const clean = await event(5, { kind: "clean", isRecalibration: false });
    const basket = await event(5, { ownedHardwareId: k.parts[2].id });
    expect(await stateOf(clean)).toBe("notRecalibration");
    expect(await stateOf(basket, k.parts[2].id)).toBe("notRecalibration");
    expect(await getBrewRedialCard(k.setup.id)).toBeNull();
  });

  it("counts a pin earlier the same day as before (STORY-04-03-01 AC 5)", async () => {
    await pin(5, { pinnedAt: at(5, 7) });
    const id = await event(5, { occurredAt: at(5, 9) });
    expect(await stateOf(id)).toBe("awaiting");
  });

  it("shows Brew's card on a setup with the grinder, naming it only with two grinders (AC 2)", async () => {
    await pin(1);
    const id = await event(5);
    expect(await getBrewRedialCard(k.setup.id)).toEqual({ eventId: id, grinder: null });
  });
});

describe("listRedialCandidates (AC 5)", () => {
  it("lists coffees on hand with a recipe before the event, Brew's coffee first", async () => {
    const otherBean = newId();
    await db().insert(canonicalBeans).values({ ...k.bean, id: otherBean, name: "Second Coffee" });
    const batchId = newId();
    await db().insert(batches).values({ id: batchId, householdId: k.household.id, beanId: otherBean, bagWeight: 250, createdAt: at(1) });
    await db().insert(batchPortions).values({ id: newId(), batchId, weight: 250, createdAt: at(1) });
    await pin(1);
    await pin(2, { beanId: otherBean });
    await pin(7, { beanId: otherBean, drinkTypeId: k.drinks.latte.id });
    const id = await event(5);
    const list = await listRedialCandidates(id, otherBean, at(8));
    expect(list.map((c) => c.bean.name)).toEqual(["Second Coffee", "House Blend"]);
    expect(list.every((c) => c.drink.id === k.drinks.espresso.id)).toBe(true);
  });
});

describe("getRedialStart (TASK-04-03-04-BE2)", () => {
  it("starts from the old recipe's raw grind as \"was\", with no adjustment", async () => {
    const recipeId = await pin(1, { grindSize: 22 });
    const id = await event(5);
    const s = await getRedialStart(id, recipeId);
    expect(s).toMatchObject({ setupId: k.setup.id, start: { grind: 22 }, applied: { grind: 22 }, grindAdjustment: null, redialEventId: id, suggestion: null });
  });

  it("refuses a recipe that isn't a candidate", async () => {
    const id = await event(5);
    const after = await pin(6);
    await expect(getRedialStart(id, after)).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("getOffsetProposal (TASK-04-03-01-BE2)", () => {
  it("proposes nothing with no event", async () => {
    await pin(1);
    expect(await getOffsetProposal(await pin(6, { grindSize: 13 }))).toEqual({ kind: "none" });
  });

  it("proposes the new grind minus the old, in steps (AC 1, AC 3)", async () => {
    const old = await pin(1, { grindSize: 15 });
    const id = await event(5);
    const p = await getOffsetProposal(await pin(6, { grindSize: 13.5 }));
    expect(p).toMatchObject({ kind: "proposal", eventId: id, baseline: { recipeId: old, grind: 15 }, newGrind: 13.5, shift: -1.5, words: { steps: 3, direction: "finer" } });
  });

  it("has no baseline when the coffee had no recipe before (AC 4)", async () => {
    const id = await event(5);
    expect(await getOffsetProposal(await pin(6))).toEqual({ kind: "noBaseline", eventId: id, grinderId: grinder() });
  });

  it("uses the most recent of two events, and none once re-dialled", async () => {
    await pin(1);
    await event(3);
    const later = await event(5);
    const first = await pin(6, { grindSize: 14 });
    expect(await getOffsetProposal(first)).toMatchObject({ kind: "proposal", eventId: later });
    expect(await getOffsetProposal(await pin(7, { grindSize: 13 }))).toEqual({ kind: "none" });
  });

  it("reads the baseline with an earlier confirmed shift applied", async () => {
    await pin(1, { grindSize: 15 });
    await event(3, { grindShift: -2, grindScale: 1 });
    await event(5);
    expect(await getOffsetProposal(await pin(6, { grindSize: 12 }))).toMatchObject({ baseline: { grind: 13 }, shift: -1 });
  });
});

describe("confirming and declining (TASK-04-03-02-BE1)", () => {
  it("stores the shift with its re-dial, and 0 on decline (AC 2, AC 3)", async () => {
    await pin(1);
    const id = await event(5);
    const redial = await pin(6, { grindSize: 13 });
    await confirmShift(id, -2, redial);
    const [row] = await db().select().from(maintenanceEvents).where(eq(maintenanceEvents.id, id));
    expect(row).toMatchObject({ grindShift: -2, grindScale: 1, offsetSourceRecipeId: redial });
    expect(await stateOf(id)).toBe("confirmed");
    await confirmShift(id, 0, redial);
    expect(await stateOf(id)).toBe("noAdjustment");
    expect(await getGrinderRedial(grinder())).toBeNull();
  });

  it("refuses a non-grinder or non-recalibrating event, and another household's", async () => {
    const clean = await event(5, { kind: "clean", isRecalibration: false });
    await expect(confirmShift(clean, -1, null)).rejects.toBeInstanceOf(InvalidShiftError);
    const id = await event(5);
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(confirmShift(id, -1, null)).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("previewShift (TASK-04-03-02-BE2)", () => {
  it("is empty with no other recipes", async () => {
    const id = await event(5);
    expect(await previewShift(id, -2)).toEqual({ rows: [], more: 0 });
  });

  it("shows three recipes as old to new, and counts the rest (AC 1)", async () => {
    const drinks = [k.drinks.espresso.id, k.drinks.latte.id];
    for (const [i, drinkTypeId] of drinks.entries()) await pin(1 + i, { drinkTypeId, grindSize: 15 + i });
    const otherBean = newId();
    await db().insert(canonicalBeans).values({ ...k.bean, id: otherBean, name: "Second Coffee" });
    for (const [i, drinkTypeId] of drinks.entries()) await pin(1 + i, { beanId: otherBean, drinkTypeId, grindSize: 20, pinnedAt: at(1 + i, 6) });
    await pin(0, { drinkTypeId: k.drinks.espresso.id, grindSize: 30 }); // older, same key: not shown
    const id = await event(5);
    const p = await previewShift(id, -2);
    expect(p.rows).toHaveLength(3);
    expect(p.more).toBe(1);
    expect(p.rows[0]).toMatchObject({ from: 16, to: 14 });
  });
});

describe("changing a shift later (TASK-04-03-05-BE1)", () => {
  it("edits, removes and sets a shift after a decline, keeping the source", async () => {
    await pin(1);
    const id = await event(5);
    const redial = await pin(6, { grindSize: 13 });
    await confirmShift(id, 0, redial);
    await setEventShift(id, -3);
    expect(await getEvent(id)).toMatchObject({ state: "confirmed", shift: -3, source: { bean: "House Blend", at: at(6) }, canRedial: false });
    await setEventShift(id, 0);
    expect((await getEvent(id)).state).toBe("noAdjustment");
    const [stored] = await db().select().from(pinnedRecipes).where(eq(pinnedRecipes.grindSize, 15));
    expect(stored.grindSize).toBe(15);
  });

  it("says an awaiting event can start a re-dial (AC 5)", async () => {
    await pin(1);
    const id = await event(5);
    expect(await getEvent(id)).toMatchObject({ state: "awaiting", canRedial: true, wheel: { step: 0.5, coarser: "higher" } });
  });
});

/** A second coffee, with a bag on hand. */
async function coffee(name: string) {
  const id = newId();
  await db().insert(canonicalBeans).values({ ...k.bean, id, name });
  const batchId = newId();
  await db().insert(batches).values({ id: batchId, householdId: k.household.id, beanId: id, bagWeight: 250, createdAt: at(1) });
  await db().insert(batchPortions).values({ id: newId(), batchId, weight: 250, createdAt: at(1) });
  return id;
}

describe("proposing a stretch (TASK-04-04-01-BE2)", () => {
  it("proposes no stretch for one coffee (AC 2)", async () => {
    await pin(1, { grindSize: 15 });
    await event(5);
    const p = await getOffsetProposal(await pin(6, { grindSize: 13 }));
    expect(p).toMatchObject({ kind: "proposal", shift: -2 });
    expect(p).not.toHaveProperty("stretch");
  });

  it("fits a stretch and shift through two coffees, re-proposed after the first was confirmed (AC 1)", async () => {
    const second = await coffee("Second Coffee");
    await pin(1, { grindSize: 15 });
    await pin(2, { beanId: second, grindSize: 30 });
    const id = await event(5);
    const first = await pin(6, { grindSize: 13 });
    await confirmShift(id, -2, first);
    const p = await getOffsetProposal(await pin(7, { beanId: second, grindSize: 26.5 }));
    expect(p).toMatchObject({
      kind: "proposal",
      eventId: id,
      coffee: "Second Coffee",
      shift: -0.5,
      words: { steps: 1, direction: "finer" },
      stretch: {
        percent: -10,
        uncertain: false,
        tooClose: false,
        shiftAlone: -2.5,
        coffees: [
          { coffee: "House Blend", was: 15, now: 13 },
          { coffee: "Second Coffee", was: 30, now: 26.5 },
        ],
      },
    });
  });

  it("rests on three coffees with noise", async () => {
    const second = await coffee("Second Coffee");
    const third = await coffee("Third Coffee");
    await pin(1, { grindSize: 15 });
    await pin(1, { beanId: second, grindSize: 30, pinnedAt: at(1, 9) });
    await pin(1, { beanId: third, grindSize: 22, pinnedAt: at(1, 10) });
    await event(5);
    await pin(6, { grindSize: 13 });
    await pin(6, { beanId: second, grindSize: 26.5, pinnedAt: at(6, 9) });
    const p = await getOffsetProposal(await pin(7, { beanId: third, grindSize: 19.5 }));
    if (p.kind !== "proposal" || !p.stretch) throw new Error("expected a stretch");
    expect(p.stretch.coffees).toHaveLength(3);
    expect(p.stretch.percent).toBeGreaterThanOrEqual(-11);
    expect(p.stretch.percent).toBeLessThanOrEqual(-9);
    expect(p.stretch.uncertain).toBe(false);
  });

  it("keeps the stretch at none when the old grinds are too close (AC 4)", async () => {
    const second = await coffee("Second Coffee");
    await pin(1, { grindSize: 15 });
    await pin(2, { beanId: second, grindSize: 15.5 });
    await event(5);
    await pin(6, { grindSize: 13 });
    const p = await getOffsetProposal(await pin(7, { beanId: second, grindSize: 13.5 }));
    expect(p).toMatchObject({ shift: -2, stretch: { percent: 0, tooClose: true } });
  });

  it("never proposes a stretch for an event that is not burrs (AC 5)", async () => {
    const second = await coffee("Second Coffee");
    await pin(1, { grindSize: 15 });
    await pin(2, { beanId: second, grindSize: 30 });
    const id = await event(5, { kind: "rezero" });
    const first = await pin(6, { grindSize: 13 });
    expect(await getOffsetProposal(first)).not.toHaveProperty("stretch");
    await confirmShift(id, -2, first);
    expect(await getOffsetProposal(await pin(7, { beanId: second, grindSize: 26.5 }))).toEqual({ kind: "none" });
  });
});

describe("saving the stretch (TASK-04-04-02-BE1)", () => {
  it("stores a percent as its factor, previews and reads it back, and declines to the shift alone (AC 1, AC 2, AC 4)", async () => {
    const second = await coffee("Second Coffee");
    const third = await coffee("Third Coffee");
    await pin(1, { grindSize: 15 });
    await pin(2, { beanId: second, grindSize: 30 });
    await pin(3, { beanId: third, grindSize: 20 });
    const id = await event(5);
    await pin(6, { grindSize: 13 });
    const redial = await pin(7, { beanId: second, grindSize: 26.5 });
    expect((await previewShift(id, -0.5, redial, -10)).rows.find((r) => r.bean === "Third Coffee")).toMatchObject({ from: 20, to: 17.5 });
    await confirmShift(id, -0.5, redial, -10);
    const [row] = await db().select().from(maintenanceEvents).where(eq(maintenanceEvents.id, id));
    expect(row).toMatchObject({ grindShift: -0.5, grindScale: 0.9 });
    expect(await getEvent(id)).toMatchObject({ state: "confirmed", kind: "burrs", stretchPercent: -10, redials: 2, redialMore: false });
    await setEventShift(id, -0.5, 30);
    expect((await getEvent(id)).stretchPercent).toBe(30);
    await confirmShift(id, -2.5, redial, 0);
    expect(await getEvent(id)).toMatchObject({ shift: -2.5, stretchPercent: 0 });
    // A stretch alone is still a mapping.
    await setEventShift(id, 0, -5);
    expect((await getEvent(id)).state).toBe("confirmed");
  });

  it("refuses a stretch out of range or not whole", async () => {
    await pin(1);
    const id = await event(5);
    await expect(setEventShift(id, -1, 31)).rejects.toBeInstanceOf(InvalidShiftError);
    await expect(setEventShift(id, -1, -31)).rejects.toBeInstanceOf(InvalidShiftError);
    await expect(setEventShift(id, -1, 1.5)).rejects.toBeInstanceOf(InvalidShiftError);
    await setEventShift(id, -1, -30);
    expect((await getEvent(id)).stretchPercent).toBe(-30);
  });
});

describe("the second coffee (TASK-04-04-03-BE1)", () => {
  it("invites a second coffee after one re-dial of burrs, farthest first (AC 1, AC 2)", async () => {
    const near = await coffee("Near Coffee");
    const far = await coffee("Far Coffee");
    await pin(1, { grindSize: 15 });
    await pin(2, { beanId: near, grindSize: 16 });
    await pin(3, { beanId: far, grindSize: 30 });
    const id = await event(5);
    await confirmShift(id, -2, await pin(6, { grindSize: 13 }));
    expect(await getEvent(id)).toMatchObject({ redials: 1, redialMore: true });
    const list = await listRedialCandidates(id, null, at(8));
    expect(list.map((c) => [c.bean.name, c.farFromFirst ?? false])).toEqual([
      ["Far Coffee", true],
      ["Near Coffee", false],
    ]);
  });

  it("neither invites nor orders for another kind of event (AC 3)", async () => {
    const far = await coffee("Far Coffee");
    await pin(1, { grindSize: 15 });
    await pin(3, { beanId: far, grindSize: 30 });
    const id = await event(5, { kind: "rezero" });
    await confirmShift(id, -2, await pin(6, { grindSize: 13 }));
    expect((await getEvent(id)).redialMore).toBe(false);
    const list = await listRedialCandidates(id, null, at(8));
    expect(list.map((c) => c.bean.name)).toEqual(["Far Coffee"]);
    expect(list[0].farFromFirst).toBeUndefined();
  });
});
