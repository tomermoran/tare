import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import { newId } from "@/db/ids";
import { batches, canonicalBeans, roasters } from "@/db/schema";
import coffee from "@/db/seed/coffee.json";
import hardware from "@/db/seed/hardware.json";
import { loadSeed, seedIds, type CoffeeSeed, type HardwareSeed } from "@/db/seed/load";
import { createTestDb } from "@/test/db";
import { makeHousehold } from "@/test/fixtures";
import { listRoasterBeans, listRoasters, recentCoffee, searchCoffee } from "./coffeeCatalog";

let db: Db;
let household: string;
let other: string;

const now = new Date("2026-01-15T08:00:00Z");
const SIGNIA = seedIds.bean("portofino", "signia");
const CERRADO = seedIds.bean("coffee4u", "brazil-cerrado-insperation");
const PORTOFINO = seedIds.roaster("portofino");

beforeEach(async () => {
  db = await createTestDb();
  await loadSeed(db, hardware as HardwareSeed, coffee as CoffeeSeed);
  household = (await makeHousehold(db)).household.id;
  other = (await makeHousehold(db)).household.id;
});

const buy = (householdId: string, beanId: string, at: Date) =>
  db.insert(batches).values({ id: newId(), householdId, beanId, bagWeight: 250, createdAt: at });
const addBean = (name: string, extra: Partial<typeof canonicalBeans.$inferInsert> = {}) =>
  db.insert(canonicalBeans).values({
    id: newId(), roasterId: PORTOFINO, name, source: "user", status: "unverified", createdAt: now, ...extra,
  });

describe("searchCoffee", () => {
  it.each([
    ["bean name", "signia", SIGNIA],
    ["roaster name", "coffee4u", CERRADO],
    ["roaster and bean", "Portofino Signia", SIGNIA],
    ["case", "INSPERATION", CERRADO],
  ])("finds by %s, shown with its roaster (AC 1)", async (_l, query, id) => {
    const [first] = await searchCoffee(db, household, { query });
    expect(first.id).toBe(id);
    expect(first.roasterName).toBeTruthy();
  });

  it.each([
    ["a bean alias", "House Blend", SIGNIA],
    ["a spelling alias", "Inspiration", CERRADO],
    ["a Hebrew alias", "סיגניה", SIGNIA],
    ["a roaster alias", "פורטופינו", SIGNIA],
  ])("finds by %s (AC 3)", async (_l, query, id) => {
    const results = await searchCoffee(db, household, { query });
    expect(results.map((r) => r.id)).toContain(id);
  });

  it("names the alias that matched", async () => {
    const [r] = await searchCoffee(db, household, { query: "house blend" });
    expect(r.matchedAlias).toBe("House Blend");
  });

  it("puts beans I've bought first (AC 2)", async () => {
    await buy(household, CERRADO, now);
    const results = await searchCoffee(db, household, { query: "o" });
    expect(results[0]).toMatchObject({ id: CERRADO, bought: true });
  });

  it("shows a merged bean only as its survivor (AC 4)", async () => {
    await addBean("Signia Old", { status: "verified", source: "seed", mergedIntoId: SIGNIA });
    const ids = (await searchCoffee(db, household, { query: "signia" })).map((r) => r.id);
    expect(ids).toEqual([SIGNIA]);
  });

  it("shows my own additions, marked, and never another household's (AC 5)", async () => {
    await addBean("Kitchen Blend Mine", { createdByHouseholdId: household });
    await addBean("Kitchen Blend Theirs", { createdByHouseholdId: other });
    const results = await searchCoffee(db, household, { query: "kitchen blend" });
    expect(results.map((r) => [r.name, r.addedByYou])).toEqual([["Kitchen Blend Mine", true]]);
  });

  it("escapes LIKE wildcards", async () => {
    expect(await searchCoffee(db, household, { query: "%" })).toEqual([]);
  });
});

describe("recentCoffee", () => {
  it("lists my bought beans, newest bag first, each once, never another household's", async () => {
    await buy(household, SIGNIA, new Date("2026-01-01"));
    await buy(household, CERRADO, new Date("2026-01-10"));
    await buy(household, SIGNIA, new Date("2026-01-05"));
    await buy(other, SIGNIA, new Date("2026-01-20"));
    expect((await recentCoffee(db, household)).map((r) => r.id)).toEqual([CERRADO, SIGNIA]);
    expect(await recentCoffee(db, other)).toHaveLength(1);
  });

  it("follows a bought bean that was merged to its survivor", async () => {
    const dup = newId();
    await db.insert(canonicalBeans).values({
      id: dup, roasterId: PORTOFINO, name: "Signia (dup)", source: "user", status: "verified", mergedIntoId: SIGNIA, createdAt: now,
    });
    await buy(household, dup, now);
    expect((await recentCoffee(db, household)).map((r) => r.id)).toEqual([SIGNIA]);
  });
});

describe("browse", () => {
  it("lists roasters alphabetically and a roaster's beans", async () => {
    expect((await listRoasters(db, household)).map((r) => r.name)).toEqual(["Coffee4U", "Portofino"]);
    expect((await listRoasterBeans(db, household, PORTOFINO)).map((r) => r.id)).toEqual([SIGNIA]);
  });

  it("hides another household's roaster", async () => {
    const id = newId();
    await db.insert(roasters).values({ id, name: "Their Roastery", source: "user", status: "unverified", createdByHouseholdId: other, createdAt: now });
    await db.insert(canonicalBeans).values({ id: newId(), roasterId: id, name: "Theirs", source: "user", status: "unverified", createdByHouseholdId: other, createdAt: now });
    expect((await listRoasters(db, household)).map((r) => r.name)).not.toContain("Their Roastery");
  });
});
