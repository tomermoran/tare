import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { extractions, ownedHardware, pinnedRecipes, setupParts, setups } from "@/db/schema";
import { partsKey } from "@/domain/setupKey";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getDialInStart } from "./dialIn";
import { NotFoundError } from "./scope";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const at = (day: number) => new Date(Date.UTC(2026, 2, day, 8));
const [MACHINE, GRINDER, BASKET] = [0, 1, 2];

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

/** Another part of the same model as one of the kitchen's (a second grinder, say). */
async function part(index: number) {
  const id = newId();
  await db().insert(ownedHardware).values({ id, householdId: k.household.id, hardwareId: k.parts[index].hardwareId });
  return id;
}

async function setup(partIds: string[], createdAt = at(2)) {
  const id = newId();
  await db().insert(setups).values({ id, householdId: k.household.id, partsKey: partsKey(partIds), createdAt });
  await db().insert(setupParts).values(partIds.map((p) => ({ setupId: id, ownedHardwareId: p })));
  return id;
}

async function recipe(setupId: string, values: Partial<typeof pinnedRecipes.$inferInsert> = {}) {
  await db().insert(pinnedRecipes).values({
    id: newId(),
    ...shotValues(k),
    setupId,
    beanId: k.bean.id,
    grindSize: 14,
    yieldWeight: 38,
    usedWdt: true,
    brewTempC: 93,
    pinnedAt: at(3),
    ...values,
  });
}

const start = (setupId: string, drink = k.drinks.espresso.id) => getDialInStart({ beanId: k.bean.id, drinkTypeId: drink, setupId });
const ids = (...i: number[]) => i.map((n) => k.parts[n].id);

describe("getDialInStart (STORY-02-01-06)", () => {
  it("is null with no recipe anywhere: a blank start (AC 6)", async () => {
    expect(await start(k.setup.id)).toBeNull();
  });

  it("carries everything on the same grinder and machine (AC 3, AC 4, AC 5)", async () => {
    await recipe(k.setup.id);
    const other = await setup([...ids(MACHINE, GRINDER), await part(BASKET)]);
    expect(await start(other)).toEqual({
      fromSetupId: k.setup.id,
      values: { grind: 14, dose: 18, yield: 38, timeMs: 28_000 },
      brew: { brewTempC: 93, brewTempStep: null, pressureBar: null, pressureStep: null },
      prep: { wdt: true, puckScreen: false },
      milk: { milkTypeId: null, milkMl: null },
      grindCarried: true,
    });
  });

  it("starts grind from a new grinder's last measured shot, else its middle (AC 4)", async () => {
    await recipe(k.setup.id);
    const grinder = await part(GRINDER);
    const other = await setup([k.parts[MACHINE].id, grinder, k.parts[BASKET].id]);
    expect(await start(other)).toMatchObject({ values: { grind: 25 }, grindCarried: false });
    // A measured shot on another setup with that grinder counts.
    const third = await setup([await part(MACHINE), grinder, k.parts[BASKET].id], at(1));
    await db().insert(extractions).values({ id: newId(), ...shotValues(k), setupId: third, grindSize: 31, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at(4) });
    expect(await start(other)).toMatchObject({ values: { grind: 31 }, grindCarried: false });
  });

  it("leaves temperature and pressure unset on another machine (AC 5)", async () => {
    await recipe(k.setup.id);
    const other = await setup([await part(MACHINE), ...ids(GRINDER, BASKET)]);
    expect((await start(other))?.brew).toEqual({ brewTempC: null, brewTempStep: null, pressureBar: null, pressureStep: null });
  });

  it("starts from the setup sharing the most parts, then the most recently used (AC 2)", async () => {
    const basket = await part(BASKET);
    const twoShared = await setup([...ids(MACHINE, GRINDER), basket], at(1));
    const oneShared = await setup([k.parts[MACHINE].id, await part(GRINDER), basket], at(1));
    await recipe(twoShared, { grindSize: 12 });
    await recipe(oneShared, { grindSize: 13 });
    expect((await start(k.setup.id))?.fromSetupId).toBe(twoShared);
  });

  it("uses this setup's own recipe when it has one", async () => {
    await recipe(k.setup.id, { grindSize: 16 });
    expect(await start(k.setup.id)).toMatchObject({ fromSetupId: k.setup.id, values: { grind: 16 }, grindCarried: true });
  });

  it("only for the household's own setup", async () => {
    await recipe(k.setup.id);
    signInAs((await makeHousehold(db())).user.firebaseUid);
    await expect(start(k.setup.id)).rejects.toBeInstanceOf(NotFoundError);
  });
});
