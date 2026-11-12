import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import { canonicalHardware, catalogAliases, hardwareMakers, ownedHardware } from "@/db/schema";
import coffee from "@/db/seed/coffee.json";
import hardware from "@/db/seed/hardware.json";
import { loadSeed, seedIds, type CoffeeSeed, type HardwareSeed } from "@/db/seed/load";
import { createTestDb } from "@/test/db";
import { makeHousehold } from "@/test/fixtures";
import { listMakers, listModels, searchHardware } from "./catalog";

let db: Db;
let household: string;
let other: string;

const now = new Date("2026-01-15T08:00:00Z");
const BAMBINO = seedIds.model("breville", "bambino-plus");
const ZERO = seedIds.model("niche", "zero");

beforeEach(async () => {
  db = await createTestDb();
  await loadSeed(db, hardware as HardwareSeed, coffee as CoffeeSeed);
  household = (await makeHousehold(db)).household.id;
  other = (await makeHousehold(db)).household.id;
});

const names = (rs: { makerName: string; name: string }[]) => rs.map((r) => `${r.makerName} ${r.name}`);

describe("searchHardware", () => {
  it.each([
    ["model name", "zero", ZERO],
    ["maker name", "niche", ZERO],
    ["maker and model", "Niche Zero", ZERO],
    ["case", "BAMBINO", BAMBINO],
    ["a regional model alias", "Sage Bambino Plus", BAMBINO],
    ["a model number", "bes500", BAMBINO],
    ["a full market SKU", "SES500BSS4GUK1", BAMBINO],
  ])("finds by %s (AC 1, AC 5)", async (_label, query, id) => {
    const kind = id === ZERO ? "grinder" : "machine";
    const results = await searchHardware(db, household, { kind, query });
    expect(results[0]?.id).toBe(id);
  });

  it("finds a maker's models through the maker's alias", async () => {
    const results = await searchHardware(db, household, { kind: "machine", query: "sage" });
    expect(results.map((r) => r.id)).toContain(BAMBINO);
  });

  it("keeps to the kind asked for", async () => {
    expect(await searchHardware(db, household, { kind: "grinder", query: "bambino" })).toEqual([]);
  });

  it("says which alias matched, and nothing when the name did", async () => {
    const [byAlias] = await searchHardware(db, household, { kind: "machine", query: "BES500BSS1BUS1" });
    expect(byAlias.matchedAlias).toBe("BES500BSS1BUS1");
    const [byName] = await searchHardware(db, household, { kind: "machine", query: "bambino" });
    expect(byName.matchedAlias).toBeNull();
  });

  it("treats LIKE wildcards in the query as text", async () => {
    expect(await searchHardware(db, household, { kind: "basket", query: "%" })).toEqual([]);
    expect(await searchHardware(db, household, { kind: "basket", query: "_" })).toEqual([]);
  });

  it("carries maker and model on every result, so same-size baskets are told apart (AC 4)", async () => {
    const results = await searchHardware(db, household, { kind: "basket", query: "54mm double" });
    expect(names(results)).toEqual(
      expect.arrayContaining([
        "Breville 54mm Double Shot Dual Wall Basket",
        "Breville 54mm Double Shot Single Wall Basket",
        "Crema Coffee Products 54mm Double Shot Basket",
      ]),
    );
  });

  it("lists the household machine maker's stock baskets first (AC 3)", async () => {
    // Without a machine: alphabetical, so Breville's happen to lead; give
    // the household a machine by another maker to prove the ordering moves.
    await db.insert(hardwareMakers).values({ id: "m-x", name: "Aardvark Espresso", source: "seed", status: "verified", createdAt: now });
    await db.insert(canonicalHardware).values([
      { id: "x-machine", makerId: "m-x", kind: "machine", name: "One", capabilities: null, source: "seed", status: "verified", createdAt: now },
      { id: "x-basket", makerId: "m-x", kind: "basket", name: "58mm Double", capabilities: { dose: { min: 18, max: 20 } }, source: "seed", status: "verified", createdAt: now },
    ]);
    let browse = await searchHardware(db, household, { kind: "basket" });
    expect(browse[0].makerName).toBe("Aardvark Espresso");

    await db.insert(ownedHardware).values({ id: "owned-1", householdId: household, hardwareId: BAMBINO });
    browse = await searchHardware(db, household, { kind: "basket" });
    expect(browse.slice(0, 4).every((r) => r.makerName === "Breville" && r.stock)).toBe(true);
    expect(browse.filter((r) => r.stock)).toHaveLength(4);
    expect(browse.at(-1)?.makerName).not.toBe("Breville");
  });

  it("shows a household its own unverified additions, marked, and hides other households' (AC 6)", async () => {
    await db.insert(canonicalHardware).values([
      { id: "mine", makerId: seedIds.maker("niche"), kind: "grinder", name: "Zero Prototype", capabilities: null, source: "user", status: "unverified", createdByHouseholdId: household, createdAt: now },
      { id: "theirs", makerId: seedIds.maker("niche"), kind: "grinder", name: "Zero Secret", capabilities: null, source: "user", status: "unverified", createdByHouseholdId: other, createdAt: now },
    ]);
    const results = await searchHardware(db, household, { kind: "grinder", query: "zero" });
    expect(results.map((r) => r.id).sort()).toEqual(["mine", ZERO].sort());
    expect(results.find((r) => r.id === "mine")?.addedByYou).toBe(true);
    expect(results.find((r) => r.id === ZERO)?.addedByYou).toBe(false);
  });

  it("hides a merged duplicate and finds the survivor through its alias (AC 6)", async () => {
    await db.insert(canonicalHardware).values({ id: "dup", makerId: seedIds.maker("niche"), kind: "grinder", name: "Niche Zero Grinder", capabilities: null, source: "user", status: "verified", mergedIntoId: ZERO, createdAt: now });
    await db.insert(catalogAliases).values({ id: "dup-alias", entityType: "model", entityId: "dup", name: "NZ", market: null, createdAt: now });
    expect((await searchHardware(db, household, { kind: "grinder", query: "grinder" })).map((r) => r.id)).toEqual([]);
    expect((await searchHardware(db, household, { kind: "grinder", query: "NZ" })).map((r) => r.id)).toEqual([ZERO]);
  });
});

describe("browse", () => {
  it("lists makers alphabetically per kind (AC 2)", async () => {
    expect((await listMakers(db, household, { kind: "basket" })).map((m) => m.name)).toEqual([
      "Breville",
      "Crema Coffee Products",
    ]);
    expect((await listMakers(db, household, { kind: "grinder" })).map((m) => m.name)).toEqual(["Niche"]);
  });

  it("lists one maker's models of a kind", async () => {
    const models = await listModels(db, household, { makerId: seedIds.maker("breville"), kind: "basket" });
    expect(models.map((m) => m.name)).toEqual([
      "54mm Double Shot Dual Wall Basket",
      "54mm Double Shot Single Wall Basket",
      "54mm Single Shot Dual Wall Basket",
      "54mm Single Shot Single Wall Basket",
    ]);
  });
});
