import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { canonicalBeans, canonicalHardware, catalogAliases, catalogUrls, roasters } from "@/db/schema";
import coffee from "@/db/seed/coffee.json";
import hardware from "@/db/seed/hardware.json";
import { loadSeed, seedIds, type CoffeeSeed, type HardwareSeed } from "@/db/seed/load";
import { createTestDb } from "@/test/db";
import { makeHousehold } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { searchHardware } from "./catalog";
import { cleanTastingNotes, createCoffeeEntry, createHardwareEntry, DuplicateEntryError, InvalidLinkError } from "./catalogAdd";
import { searchCoffee } from "./coffeeCatalog";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

const db = () => testContext.db!;
let me: Awaited<ReturnType<typeof makeHousehold>>;
let them: Awaited<ReturnType<typeof makeHousehold>>;

beforeEach(async () => {
  testContext.db = await createTestDb();
  await loadSeed(testContext.db, hardware as HardwareSeed, coffee as CoffeeSeed);
  me = await makeHousehold(testContext.db);
  them = await makeHousehold(testContext.db);
  signInAs(me.user.firebaseUid);
});

const blend = (over: Partial<Parameters<typeof createCoffeeEntry>[0]["bean"]> = {}) => ({
  roaster: { name: "Example Roastery", url: "https://example.com/roastery" },
  bean: { name: "Morning Blend", url: "https://example.com/coffee/morning-blend", ...over },
});

describe("createCoffeeEntry (STORY-01-06-02)", () => {
  it("saves a new roaster and bean, user-added and unverified (AC 1, AC 2, AC 5)", async () => {
    const { id } = await createCoffeeEntry(blend({ roastLevel: "Medium-Light", tastingNotes: [" cocoa ", "Cherry", "cocoa", "", "plum", "fig", "honey"] }));
    const [bean] = await db().select().from(canonicalBeans).where(eq(canonicalBeans.id, id));
    expect(bean).toMatchObject({
      name: "Morning Blend",
      roastLevel: "Medium-Light",
      tastingNotes: ["cocoa", "Cherry", "plum", "fig"],
      source: "user",
      status: "unverified",
      createdByHouseholdId: me.household.id,
    });
    const [roaster] = await db().select().from(roasters).where(eq(roasters.id, bean.roasterId));
    expect(roaster).toMatchObject({ name: "Example Roastery", source: "user", status: "unverified" });
    const found = await searchCoffee(db(), me.household.id, { query: "morning blend" });
    expect(found.find((b) => b.id === id)).toMatchObject({ addedByYou: true });
  });

  it("leaves roast level and notes empty when not given, and ignores an unknown level (AC 3)", async () => {
    const { id } = await createCoffeeEntry(blend({ roastLevel: "Extra Dark" }));
    const [bean] = await db().select().from(canonicalBeans).where(eq(canonicalBeans.id, id));
    expect(bean).toMatchObject({ roastLevel: null, tastingNotes: null });
  });

  it("saves nothing without a product link (AC 4)", async () => {
    await expect(createCoffeeEntry(blend({ url: "" }))).rejects.toBeInstanceOf(InvalidLinkError);
    expect(await db().select().from(canonicalBeans).where(eq(canonicalBeans.source, "user"))).toHaveLength(0);
    expect(await db().select().from(roasters).where(eq(roasters.source, "user"))).toHaveLength(0);
  });

  it("adds to an existing roaster", async () => {
    const [seeded] = await db().select().from(roasters).limit(1);
    const { id } = await createCoffeeEntry({ ...blend(), roaster: { id: seeded.id } });
    const [bean] = await db().select().from(canonicalBeans).where(eq(canonicalBeans.id, id));
    expect(bean.roasterId).toBe(seeded.id);
  });

  it("offers our own coffee with the same link instead of adding it twice", async () => {
    const { id } = await createCoffeeEntry(blend());
    const error = await createCoffeeEntry(blend({ url: "https://www.example.com/coffee/morning-blend?utm_medium=x" })).catch((e) => e);
    expect(error).toBeInstanceOf(DuplicateEntryError);
    expect(error.match).toMatchObject({ catalog: "coffee", id, roasterName: "Example Roastery", addedByYou: true });
  });
});

describe("more links and other names (STORY-01-06-05)", () => {
  it("saves each extra link with its market, or none (AC 1)", async () => {
    const { id } = await createCoffeeEntry({
      ...blend(),
      urls: [
        { url: "https://example.co.uk/morning-blend", market: "GB" },
        { url: "https://example.com/coffee/morning-blend?gclid=1", market: "US" }, // the main link again
        { url: "https://example.net/morning-blend", market: "XX" },
        { url: " ", market: null },
      ],
    });
    const links = await db().select().from(catalogUrls).where(eq(catalogUrls.entityId, id));
    expect(links.map((l) => [l.url, l.market]).sort()).toEqual([
      ["https://example.co.uk/morning-blend", "GB"],
      ["https://example.com/coffee/morning-blend", null],
      ["https://example.net/morning-blend", null],
    ]);
  });

  it("saves other names, optionally with a market, and finds the entry by them for us only (AC 2, AC 3)", async () => {
    const { id } = await createHardwareEntry({
      maker: { name: "Example Mills", url: "https://example.com/mills" },
      model: { name: "Hand Mill 40", kind: "grinder", url: "https://example.com/hand-mill-40" },
      aliases: [
        { name: "HM-40", market: null },
        { name: "Mill Forty", market: "GB" },
        { name: "hand mill 40", market: null }, // its own name
        { name: "hm-40", market: "US" }, // a repeat
      ],
    });
    const aliases = await db().select().from(catalogAliases).where(eq(catalogAliases.entityId, id));
    expect(aliases.map((a) => [a.name, a.market]).sort()).toEqual([
      ["HM-40", null],
      ["Mill Forty", "GB"],
    ]);
    const mine = await searchHardware(db(), me.household.id, { kind: "grinder", query: "mill forty" });
    expect(mine[0]).toMatchObject({ id, matchedAlias: "Mill Forty" });
    expect(await searchHardware(db(), them.household.id, { kind: "grinder", query: "mill forty" })).toEqual([]);

    // Verified, anyone finds it by its alias.
    await db().update(canonicalHardware).set({ status: "verified" }).where(eq(canonicalHardware.id, id));
    await db().update(canonicalHardware).set({ status: "verified" }).where(eq(canonicalHardware.id, id));
    const { hardwareMakers } = await import("@/db/schema");
    await db().update(hardwareMakers).set({ status: "verified" }).where(eq(hardwareMakers.source, "user"));
    expect((await searchHardware(db(), them.household.id, { kind: "grinder", query: "hm-40" }))[0]?.id).toBe(id);
  });

  it("tells about an extra link that matches another entry (AC 4)", async () => {
    const bambino = seedIds.model("breville", "bambino-plus");
    const error = await createHardwareEntry({
      maker: { name: "Example Works", url: "https://example.com/works" },
      model: { name: "Lever One", kind: "machine", url: "https://example.com/lever-one" },
      urls: [{ url: "https://www.breville.com/en-us/product/bes500", market: "US" }],
    }).catch((e) => e);
    expect(error).toBeInstanceOf(DuplicateEntryError);
    expect(error.match.id).toBe(bambino);
    expect(await db().select().from(canonicalHardware).where(eq(canonicalHardware.source, "user"))).toHaveLength(0);
  });
});

describe("cleanTastingNotes", () => {
  it("keeps at most four distinct notes, or none", () => {
    expect(cleanTastingNotes(["a", "b", "c", "d", "e"])).toEqual(["a", "b", "c", "d"]);
    expect(cleanTastingNotes(["  ", ""])).toBeNull();
    expect(cleanTastingNotes(undefined)).toBeNull();
  });
});
