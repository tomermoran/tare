import { and, eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import {
  canonicalBeans,
  extractions,
  maintenanceEvents,
  pinnedRecipes,
  roasters,
  stockChecks,
} from "@/db/schema";
import {
  assertOwned,
  NotFoundError,
  requireHousehold,
  visibleCatalog,
  type OwnedTable,
} from "@/server/dal/scope";
import { createTestDb } from "@/test/db";
import { makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

// Two households with a full kitchen each. Every data access read and action
// adds its case here (tasks section 5): the other household's rows must be
// invisible and untouchable.
type Kitchen = Awaited<ReturnType<typeof makeKitchen>>;
let mine: Kitchen;
let theirs: Kitchen;
let ids: Record<"mine" | "theirs", Record<OwnedTable, string>>;

async function addRows(k: Kitchen): Promise<Record<OwnedTable, string>> {
  const db = testContext.db!;
  const shot = { id: newId(), ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured" as const, createdAt: new Date() };
  await db.insert(extractions).values(shot);
  const recipe = { id: newId(), ...shotValues(k), beanId: k.bean.id, pinnedAt: new Date() };
  await db.insert(pinnedRecipes).values(recipe);
  const check = { id: newId(), portionId: k.portion.id, remainingWeight: 120, checkedAt: new Date() };
  await db.insert(stockChecks).values(check);
  const event = { id: newId(), ownedHardwareId: k.parts[1].id, kind: "clean", occurredAt: new Date() };
  await db.insert(maintenanceEvents).values(event);
  return {
    drinkTypes: k.drinks.espresso.id,
    milkTypes: k.milk.id,
    personas: k.persona.id,
    ownedHardware: k.parts[0].id,
    setups: k.setup.id,
    batches: k.batch.id,
    batchPortions: k.portion.id,
    extractions: shot.id,
    pinnedRecipes: recipe.id,
    stockChecks: check.id,
    maintenanceEvents: event.id,
  };
}

beforeEach(async () => {
  testContext.db = await createTestDb();
  mine = await makeKitchen(testContext.db);
  theirs = await makeKitchen(testContext.db);
  ids = { mine: await addRows(mine), theirs: await addRows(theirs) };
  signInAs(mine.user.firebaseUid);
});

describe("household isolation", () => {
  it("resolves the signed-in household from the session", async () => {
    expect(await requireHousehold()).toEqual({
      userId: mine.user.id,
      householdId: mine.household.id,
    });
  });

  it("refuses to run signed out", async () => {
    signInAs(null);
    await expect(requireHousehold()).rejects.toThrow("No session");
  });

  const tables = [
    "drinkTypes",
    "milkTypes",
    "personas",
    "ownedHardware",
    "setups",
    "batches",
    "batchPortions",
    "extractions",
    "pinnedRecipes",
    "stockChecks",
    "maintenanceEvents",
  ] as const satisfies readonly OwnedTable[];

  it.each(tables)("accepts my own %s", async (table) => {
    const { householdId } = await requireHousehold();
    await expect(assertOwned(table, ids.mine[table], householdId)).resolves.toBeUndefined();
  });

  it.each(tables)("treats another household's %s as not found", async (table) => {
    const { householdId } = await requireHousehold();
    await expect(assertOwned(table, ids.theirs[table], householdId)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("treats a missing row as not found", async () => {
    const { householdId } = await requireHousehold();
    await expect(assertOwned("setups", "no-such-id", householdId)).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("catalog visibility", () => {
  it("shows verified entries and my own additions, never another household's", async () => {
    const db = testContext.db!;
    const roasterId = mine.bean.roasterId;
    const add = (name: string, extra: Partial<typeof canonicalBeans.$inferInsert>) => ({
      id: newId(), roasterId, name, source: "user", status: "unverified", createdAt: new Date(), ...extra,
    });
    await db.insert(canonicalBeans).values([
      add("Mine, unverified", { createdByHouseholdId: mine.household.id }),
      add("Theirs, unverified", { createdByHouseholdId: theirs.household.id }),
      add("Merged away", { status: "verified", mergedIntoId: mine.bean.id }),
    ]);
    const { householdId } = await requireHousehold();
    const visible = await db
      .select({ name: canonicalBeans.name })
      .from(canonicalBeans)
      .where(and(visibleCatalog(canonicalBeans, householdId), eq(canonicalBeans.roasterId, roasterId)));
    expect(visible.map((b) => b.name).sort()).toEqual(["House Blend", "Mine, unverified"]);
    expect(await db.select().from(roasters)).toHaveLength(2);
  });
});
