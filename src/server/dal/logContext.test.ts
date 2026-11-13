import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, batchPortions, drinkTypes, extractions, setupParts, setups } from "@/db/schema";
import { NO_BREW_VALUES } from "@/domain/brewControls";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getLogContext, getStartingValues } from "./logContext";
import { NotFoundError } from "./scope";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const day = (d: number) => new Date(Date.UTC(2026, 0, d, 8));

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

/** Another bag of the kitchen's coffee, with one portion. */
async function addPortion(dates: Partial<typeof batchPortions.$inferInsert> & { bagAt: Date }) {
  const { bagAt, ...rest } = dates;
  const batchId = newId();
  await db().insert(batches).values({ id: batchId, householdId: k.household.id, beanId: k.bean.id, bagWeight: 250, createdAt: bagAt });
  const id = newId();
  await db().insert(batchPortions).values({ id, batchId, weight: 250, createdAt: bagAt, ...rest });
  return id;
}

async function shot(values: Partial<typeof extractions.$inferInsert> = {}) {
  await db()
    .insert(extractions)
    .values({
      id: newId(),
      ...shotValues(k),
      loggedByUserId: k.user.id,
      portionId: k.portion.id,
      entryMode: "measured",
      createdAt: day(20),
      ...values,
    });
}

describe("getLogContext", () => {
  it("defaults to the current setup, with its grinder's scale", async () => {
    const c = await getLogContext();
    expect(c.setups).toHaveLength(1);
    expect(c.defaultSetupId).toBe(k.setup.id);
    expect(c.setups[0].grind).toEqual({ type: "stepless", min: 0, max: 50, step: 0.5, coarser: "higher" });
    expect(c.setups[0].parts.map((p) => p.kind)).toEqual(["machine", "grinder", "basket"]);
  });

  it("offers visible drinks in order and milks (AC 2)", async () => {
    const hidden = { id: newId(), householdId: k.household.id, nameKey: "drinks.lungo", hasMilk: false, hidden: true, sortOrder: 2 };
    await db().insert(drinkTypes).values(hidden);
    const c = await getLogContext();
    expect(c.drinks.map((d) => d.id)).toEqual([k.drinks.espresso.id, k.drinks.latte.id]);
    expect(c.drinks[1]).toMatchObject({ hasMilk: true, typicalMilkMl: 180 });
    expect(c.milks.map((m) => m.id)).toEqual([k.milk.id]);
  });

  it("starts from the first drink with no shots, then the latest shot's drink", async () => {
    expect((await getLogContext()).defaultDrinkId).toBe(k.drinks.espresso.id);
    await shot({ drinkTypeId: k.drinks.latte.id });
    expect((await getLogContext()).defaultDrinkId).toBe(k.drinks.latte.id);
  });

  it("uses a chosen drink and portion when they're options", async () => {
    const other = await addPortion({ bagAt: day(18) });
    const c = await getLogContext({ drinkId: k.drinks.latte.id, portionId: other });
    expect(c.defaultDrinkId).toBe(k.drinks.latte.id);
    expect(c.defaultPortionId).toBe(other);
    const bad = await getLogContext({ drinkId: "nope", portionId: "nope" });
    expect(bad.defaultDrinkId).toBe(k.drinks.espresso.id);
  });

  it("orders open, then unopened newest first, then frozen last and flagged (AC 2, AC 3)", async () => {
    const frozen = await addPortion({ bagAt: day(19), frozenAt: day(19) });
    const openLater = await addPortion({ bagAt: day(10), openedAt: day(14) });
    const openEarlier = await addPortion({ bagAt: day(11), openedAt: day(12) });
    const newestUnopened = await addPortion({ bagAt: day(17) });
    const finished = await addPortion({ bagAt: day(9), openedAt: day(9), finishedAt: day(13) });

    const c = await getLogContext();
    const ids = c.portions.map((p) => p.id);
    expect(ids).toEqual([openEarlier, openLater, newestUnopened, k.portion.id, frozen]);
    expect(ids).not.toContain(finished);
    expect(c.portions.at(-1)).toMatchObject({ frozen: true, state: "frozen", openedAt: null });
    expect(c.portions[0]).toMatchObject({ state: "counter", openedAt: day(12), bean: { name: "House Blend", roasterName: "Example Roasters" } });
  });

  it("starts from the open portion opened earliest, else the newest unopened", async () => {
    expect((await getLogContext()).defaultPortionId).toBe(k.portion.id);
    const newer = await addPortion({ bagAt: day(17) });
    expect((await getLogContext()).defaultPortionId).toBe(newer);
    const open = await addPortion({ bagAt: day(3), openedAt: day(4) });
    expect((await getLogContext()).defaultPortionId).toBe(open);
  });

  it("starts from the latest shot's portion unless it's frozen or finished", async () => {
    const open = await addPortion({ bagAt: day(3), openedAt: day(4) });
    await shot();
    expect((await getLogContext()).defaultPortionId).toBe(k.portion.id);

    await db().update(batchPortions).set({ frozenAt: day(21) }).where(eq(batchPortions.id, k.portion.id));
    expect((await getLogContext()).defaultPortionId).toBe(open);

    await db().update(batchPortions).set({ finishedAt: day(22) }).where(eq(batchPortions.id, k.portion.id));
    const c = await getLogContext();
    expect(c.defaultPortionId).toBe(open);
    expect(c.portions.map((p) => p.id)).not.toContain(k.portion.id);
  });

  it("treats a thawed portion as open from when it thawed", async () => {
    const thawed = await addPortion({ bagAt: day(2), frozenAt: day(3), thawedAt: day(6) });
    const c = await getLogContext();
    expect(c.portions[0]).toMatchObject({ id: thawed, state: "thawed", openedAt: day(6), frozen: false });
  });

  it("flags a missing setup and missing coffee (AC 5)", async () => {
    await db().delete(setupParts);
    await db().delete(setups);
    await db().update(batchPortions).set({ finishedAt: day(20) });
    const c = await getLogContext();
    expect(c).toMatchObject({ missingSetup: true, missingCoffee: true, defaultSetupId: null, defaultPortionId: null });
    expect((await getLogContext()).portions).toEqual([]);
  });

  it("shows nothing of another household", async () => {
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    const c = await getLogContext({ portionId: k.portion.id, drinkId: k.drinks.latte.id });
    expect(c).toMatchObject({ setups: [], drinks: [], portions: [], milks: [], defaultPortionId: null, defaultDrinkId: null });
  });
});

describe("getStartingValues", () => {
  it("carries the last temperature and pressure used, for add (EPIC-01-04)", async () => {
    await shot({ brewTempStep: 2, pressureBar: 9 });
    expect((await getStartingValues(k.setup.id)).lastBrew).toEqual({ ...NO_BREW_VALUES, brewTempStep: 2, pressureBar: 9 });
  });

  it("gives each setup its machine's capabilities", async () => {
    expect((await getLogContext()).setups[0].machine).toEqual({ temperature: { control: "none" }, pressure: { control: "none", gauge: false } });
  });

  it("starts from DQ-07's neutral values, grind in the middle of the grinder", async () => {
    expect(await getStartingValues(k.setup.id)).toEqual({ grind: 25, dose: 18, yield: 36, timeMs: 28_000, lastBrew: NO_BREW_VALUES });
  });

  it("starts from the latest measured shot on this setup, ignoring one-tap shots (AC 2)", async () => {
    await shot({ grindSize: 12.5, doseWeight: 18.5, yieldWeight: 40, yieldTime: 27_600, createdAt: day(20) });
    await shot({ grindSize: 14, doseWeight: 19, yieldWeight: 38, yieldTime: 30_000, createdAt: day(21), entryMode: "one-tap" });
    expect(await getStartingValues(k.setup.id)).toEqual({ grind: 12.5, dose: 18.5, yield: 40, timeMs: 27_600, lastBrew: NO_BREW_VALUES });
  });

  it("refuses another household's setup", async () => {
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(getStartingValues(k.setup.id)).rejects.toBeInstanceOf(NotFoundError);
  });
});
