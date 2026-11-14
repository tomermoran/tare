import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, batchPortions, canonicalBeans, extractions, pinnedRecipes } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getCoffee } from "./coffee";
import { NotFoundError } from "./scope";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const at = (day: number) => new Date(Date.UTC(2026, 2, day, 8));
const NOW = at(30);

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

async function shot(day: number, over: Partial<typeof extractions.$inferInsert> = {}) {
  const id = newId();
  await db()
    .insert(extractions)
    .values({ id, ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at(day), ...over });
  return id;
}

describe("getCoffee (STORY-03-06-03)", () => {
  it("has the catalog details, and empty sections before any shot (AC 1, AC 5)", async () => {
    await db().update(canonicalBeans).set({ roastLevel: "Medium", tastingNotes: ["cocoa", "plum"] }).where(eq(canonicalBeans.id, k.bean.id));
    const c = await getCoffee(k.bean.id, NOW);
    expect(c.bean).toEqual({ id: k.bean.id, name: k.bean.name, roasterName: "Example Roasters", roastLevel: "Medium", tastingNotes: ["cocoa", "plum"] });
    expect(c).toMatchObject({ summary: null, recipes: [], recentShots: [], onHand: true });
    expect(c.bags.map((b) => b.id)).toEqual([k.batch.id]);
  });

  it("has the summary, recipes and the five newest shots, whatever their age (AC 2, AC 3)", async () => {
    const ids = [];
    for (let day = 1; day <= 7; day++) ids.push(await shot(day, { userRating: 5 }));
    await db().insert(pinnedRecipes).values({ id: newId(), ...shotValues(k), beanId: k.bean.id, pinnedAt: at(2) });
    const c = await getCoffee(k.bean.id, at(200));
    expect(c.summary).toEqual({ kind: "mostlyGood" });
    expect(c.recipes).toHaveLength(1);
    expect(c.recentShots.map((s) => s.id)).toEqual(ids.slice(2).reverse());
  });

  it("lists finished bags too, and isn't on hand when all are finished (AC 4)", async () => {
    await db().update(batchPortions).set({ openedAt: at(2), finishedAt: at(5) }).where(eq(batchPortions.id, k.portion.id));
    const c = await getCoffee(k.bean.id, NOW);
    expect(c.bags).toHaveLength(1);
    expect(c.bags[0].status).toBe("finished");
    expect(c.onHand).toBe(false);
  });

  it("is the same coffee from a merged duplicate's ID, with both bags", async () => {
    const dup = newId();
    await db().insert(canonicalBeans).values({ id: dup, roasterId: k.bean.roasterId, name: "Duplicate", source: "user", status: "verified", mergedIntoId: k.bean.id, createdAt: at(1) });
    const batchId = newId();
    await db().insert(batches).values({ id: batchId, householdId: k.household.id, beanId: dup, bagWeight: 250, createdAt: at(3) });
    await db().insert(batchPortions).values({ id: newId(), batchId, weight: 250, createdAt: at(3) });
    const c = await getCoffee(dup, NOW);
    expect(c.bean.id).toBe(k.bean.id);
    expect(c.bags).toHaveLength(2);
  });

  it("isn't found for another household, or a coffee never bought", async () => {
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(getCoffee(k.bean.id, NOW)).rejects.toBeInstanceOf(NotFoundError);
    signInAs(k.user.firebaseUid);
    await expect(getCoffee(newId(), NOW)).rejects.toBeInstanceOf(NotFoundError);
  });
});
