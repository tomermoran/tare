import { count, eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import {
  canonicalBeans,
  canonicalHardware,
  catalogAliases,
  catalogUrls,
  hardwareMakers,
  roasters,
} from "@/db/schema";
import { parseCapabilities } from "@/domain/capabilities";
import { createTestDb } from "@/test/db";
import coffee from "./coffee.json";
import hardware from "./hardware.json";
import { loadSeed, SeedError, validateSeed, type CoffeeSeed, type HardwareSeed } from "./load";

const hw = hardware as HardwareSeed;
const cf = coffee as CoffeeSeed;
const clone = <T>(v: T): T => structuredClone(v);

let db: Db;
beforeEach(async () => {
  db = await createTestDb();
});

type Table =
  | typeof hardwareMakers
  | typeof canonicalHardware
  | typeof roasters
  | typeof canonicalBeans
  | typeof catalogAliases
  | typeof catalogUrls;

async function counts() {
  const n = async (t: Table) => (await db.select({ n: count() }).from(t))[0].n;
  return {
    makers: await n(hardwareMakers),
    models: await n(canonicalHardware),
    roasters: await n(roasters),
    beans: await n(canonicalBeans),
    aliases: await n(catalogAliases),
    urls: await n(catalogUrls),
  };
}

describe("the seed files", () => {
  it("are valid", () => {
    expect(validateSeed(hw, cf)).toEqual([]);
  });

  it("give every basket a dose range", () => {
    const baskets = hw.makers.flatMap((m) => m.models).filter((m) => m.kind === "basket");
    expect(baskets.length).toBeGreaterThan(0);
    for (const b of baskets) expect(parseCapabilities("basket", b.capabilities, { allowNotSure: false })).not.toBeNull();
  });

  it("include the machine maker's stock baskets", () => {
    const breville = hw.makers.find((m) => m.key === "breville")!;
    expect(breville.models.filter((m) => m.kind === "basket")).toHaveLength(4);
  });

  it("hold no personal data", () => {
    // Links carry long product ids (Crema's ?variant=), so check everything else.
    const text = JSON.stringify([hardware, coffee], (k, v) => (k === "url" ? undefined : v));
    expect(text).not.toMatch(/@[a-z0-9-]+\.[a-z]/i); // no email addresses
    expect(text).not.toMatch(/"serial/i); // no serial-number fields
    expect(text).not.toMatch(/\+?\d[\d\s-]{8,}\d/); // no phone numbers
  });
});

describe("loadSeed", () => {
  it("loads on an empty database", async () => {
    await loadSeed(db, hw, cf);
    expect(await counts()).toEqual({ makers: 3, models: 7, roasters: 2, beans: 2, aliases: 13, urls: 7 });
    const [zero] = await db.select().from(canonicalHardware).where(eq(canonicalHardware.name, "Zero"));
    expect(zero).toMatchObject({ kind: "grinder", source: "seed", status: "verified" });
  });

  it("changes nothing when run twice", async () => {
    await loadSeed(db, hw, cf);
    const first = await db.select().from(canonicalHardware).orderBy(canonicalHardware.id);
    const before = await counts();
    await loadSeed(db, hw, cf);
    expect(await counts()).toEqual(before);
    expect(await db.select().from(canonicalHardware).orderBy(canonicalHardware.id)).toEqual(first);
  });

  it("updates an edited entry in place", async () => {
    await loadSeed(db, hw, cf);
    const edited = clone(hw);
    edited.makers[1].models[0].capabilities = {
      grind: { type: "stepless", min: 0, max: 60, step: 0.5, coarser: "higher" },
    };
    await loadSeed(db, edited, cf);
    const rows = await db.select().from(canonicalHardware);
    expect(rows).toHaveLength(7);
    expect(rows.find((r) => r.name === "Zero")?.capabilities).toMatchObject({ grind: { max: 60 } });
  });

  it.each([
    ["an unknown kind", (h: HardwareSeed) => void (h.makers[0].models[0].kind = "tamper" as "machine")],
    ["\"not sure\" capabilities", (h: HardwareSeed) => void (h.makers[1].models[0].capabilities = { grind: { type: "unknown", min: null, max: null, step: null, coarser: "unknown" } })],
    ["a basket without a dose", (h: HardwareSeed) => void (h.makers[0].models[1].capabilities = {})],
    ["a bad link", (h: HardwareSeed) => void (h.makers[1].models[0].links = [{ url: "not a link", market: "GB" }])],
    ["a bad market", (h: HardwareSeed) => void (h.makers[0].aliases[0].market = "UK-ish")],
    ["a duplicate key", (h: HardwareSeed) => void h.makers.push(clone(h.makers[1]))],
  ])("fails on %s and writes nothing", async (_label, breakIt) => {
    const bad = clone(hw);
    breakIt(bad);
    await expect(loadSeed(db, bad, cf)).rejects.toBeInstanceOf(SeedError);
    expect((await counts()).makers).toBe(0);
  });

  it("fails on an unknown roast level", async () => {
    const bad = clone(cf);
    bad.roasters[0].beans[0].roastLevel = "Extra dark";
    expect(validateSeed(hw, bad)).toEqual([expect.stringContaining("unknown roast level")]);
  });

  it("keeps Crema's double basket link distinct from its other variants", async () => {
    await loadSeed(db, hw, cf);
    const [link] = await db.select().from(catalogUrls).where(eq(catalogUrls.entityId, "seed:model:crema-coffee-products:54mm-double"));
    expect(link.normalizedUrl).toContain("variant=43266907242711");
  });
});
