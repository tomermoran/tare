import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, batchPortions, canonicalBeans, extractions } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getBeanFacets } from "./beanFacets";
import { getOnHand } from "./bags";
import { getTried } from "./tried";

/*
 * The coffees the Beans filters work over (TASK-03-07-01-BE2): on hand
 * only, tried only, both, and a merged coffee, each once.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const at = (day: number) => new Date(Date.UTC(2026, 2, day, 8));

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

async function coffee(name: string, over: Partial<typeof canonicalBeans.$inferInsert> = {}) {
  const id = newId();
  await db().insert(canonicalBeans).values({ id, roasterId: k.bean.roasterId, name, source: "user", status: "verified", createdAt: at(1), ...over });
  return id;
}

async function bag(beanId: string, finished = false) {
  const batchId = newId();
  await db().insert(batches).values({ id: batchId, householdId: k.household.id, beanId, bagWeight: 250, createdAt: at(1) });
  const portionId = newId();
  await db().insert(batchPortions).values({ id: portionId, batchId, weight: 250, createdAt: at(1), finishedAt: finished ? at(2) : null });
  return portionId;
}

const shot = (portionId: string, rating: number) =>
  db().insert(extractions).values({ id: newId(), ...shotValues(k), loggedByUserId: k.user.id, portionId, entryMode: "measured", userRating: rating, createdAt: at(3) });

async function facets() {
  const [onHand, tried] = await Promise.all([getOnHand(), getTried()]);
  return getBeanFacets({ onHand: onHand.flatMap((g) => g.bags.map((b) => b.bean.id)), tried });
}

describe("getBeanFacets", () => {
  it("lists each coffee once, on hand and tried together, with its rating word", async () => {
    // The kitchen's coffee: on hand and tried.
    await shot(k.portion.id, 5);
    // Tried only: a finished bag.
    const old = await coffee("Old Favourite", { roastLevel: "Dark", origin: "ET" });
    await shot(await bag(old, true), 2);
    // On hand only, never brewed.
    const fresh = await coffee("Fresh Bag", { origin: "blend" });
    await bag(fresh);
    const list = await facets();
    expect(list).toHaveLength(3);
    const by = new Map(list.map((f) => [f.beanId, f]));
    expect(by.get(k.bean.id)).toMatchObject({ rating: "mostlyGood", roasterName: "Example Roasters" });
    expect(by.get(old)).toMatchObject({ rating: "mostlyOff", roastLevel: "Dark", origin: "ET" });
    expect(by.get(fresh)).toMatchObject({ rating: "noRatings", origin: "blend" });
  });

  it("follows a merged coffee to the surviving entry", async () => {
    const survivor = await coffee("Survivor", { origin: "KE" });
    const merged = await coffee("Merged", { mergedIntoId: survivor, origin: "CO" });
    await shot(await bag(merged), 4);
    const list = await facets();
    expect(list.filter((f) => f.beanId === survivor)).toEqual([expect.objectContaining({ origin: "KE", rating: "mostlyGood" })]);
    expect(list.some((f) => f.beanId === merged)).toBe(false);
  });

  it("is empty with no coffees", async () => {
    expect(await getBeanFacets({ onHand: [], tried: [] })).toEqual([]);
  });
});
