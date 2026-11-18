import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, batchPortions, canonicalBeans, extractions, personas } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getTried } from "./tried";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/personaChoice", () => import("@/test/mocks/personaChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const at = (day: number) => new Date(Date.UTC(2026, 2, day, 8));

beforeEach(async () => {
  testContext.db = await createTestDb();
  testContext.personaChoice = null;
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

async function bagOf(beanId: string) {
  const batchId = newId();
  await db().insert(batches).values({ id: batchId, householdId: k.household.id, beanId, bagWeight: 250, createdAt: at(1) });
  const portionId = newId();
  await db().insert(batchPortions).values({ id: portionId, batchId, weight: 250, createdAt: at(1) });
  return portionId;
}

async function coffee(name: string, mergedIntoId?: string) {
  const id = newId();
  await db().insert(canonicalBeans).values({ id, roasterId: k.bean.roasterId, name, source: "user", status: "verified", mergedIntoId, createdAt: at(1) });
  return id;
}

async function shot(portionId: string, day: number, over: Partial<typeof extractions.$inferInsert> = {}) {
  await db()
    .insert(extractions)
    .values({ id: newId(), ...shotValues(k), loggedByUserId: k.user.id, portionId, entryMode: "measured", createdAt: at(day), ...over });
}

describe("getTried (STORY-03-06-01)", () => {
  it("is every brewed coffee, newest-had first, with its last had and bags (AC 1, AC 2)", async () => {
    const other = await coffee("Example Single Origin");
    const otherPortion = await bagOf(other);
    await shot(k.portion.id, 3);
    await shot(otherPortion, 5, { entryMode: "one-tap", reaction: "good" });
    await shot(k.portion.id, 2);
    // A second bag of the kitchen's coffee, finished or not, counts.
    await bagOf(k.bean.id);
    const tried = await getTried();
    expect(tried.map((c) => c.beanId)).toEqual([other, k.bean.id]);
    expect(tried[0]).toMatchObject({ name: "Example Single Origin", roasterName: "Example Roasters", lastHad: at(5), bagCount: 1, summary: { kind: "mostlyGood" } });
    expect(tried[1]).toMatchObject({ lastHad: at(3), bagCount: 2, summary: { kind: "noRatings" } });
  });

  it("leaves out a coffee with bags but no shot (AC 3)", async () => {
    await bagOf(await coffee("Never Brewed"));
    expect(await getTried()).toEqual([]);
    await shot(k.portion.id, 2);
    expect((await getTried()).map((c) => c.beanId)).toEqual([k.bean.id]);
  });

  it("shows merged catalog entries as one coffee (AC 4)", async () => {
    const dup = await coffee("House Blend (duplicate)", k.bean.id);
    const dupPortion = await bagOf(dup);
    await shot(k.portion.id, 2, { userRating: 5 });
    await shot(dupPortion, 4, { userRating: 2 });
    const tried = await getTried();
    expect(tried).toHaveLength(1);
    expect(tried[0]).toMatchObject({ beanId: k.bean.id, name: k.bean.name, lastHad: at(4), bagCount: 2, summary: { kind: "lastRated", rating: 2 } });
  });

  it("is this household's only", async () => {
    await shot(k.portion.id, 2);
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    expect(await getTried()).toEqual([]);
  });
});

describe("Tried per profile (TASK-05-01-07-BE1, QA1)", () => {
  it("summarises only the shots of the person chosen on Brew, keeping coffees others brewed", async () => {
    const guest = newId();
    await db().insert(personas).values({ id: guest, householdId: k.household.id, name: "Guest", isDefault: false });
    const loved = await coffee("Loved by one");
    const theirs = await coffee("Only theirs");
    const a = await bagOf(loved);
    const b = await bagOf(theirs);
    for (const day of [2, 3, 4]) await shot(a, day, { userRating: 5 });
    for (const day of [5, 6, 7]) await shot(a, day, { userRating: 1, personaId: guest });
    await shot(b, 8, { userRating: 5, personaId: guest });

    const mine = new Map((await getTried()).map((c) => [c.name, c.summary.kind]));
    expect(mine.get("Loved by one")).toBe("mostlyGood");
    expect(mine.get("Only theirs")).toBe("noRatings");

    testContext.personaChoice = guest;
    const guests = new Map((await getTried()).map((c) => [c.name, c.summary.kind]));
    expect(guests.get("Loved by one")).toBe("mostlyOff");
    expect(guests.get("Only theirs")).toBe("lastRated");
  });
});
