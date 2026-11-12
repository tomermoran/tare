import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import { newId } from "@/db/ids";
import {
  catalogAliases,
  catalogUrls,
  canonicalBeans,
  canonicalHardware,
  hardwareMakers,
  roasters,
} from "@/db/schema";
import { createTestDb } from "@/test/db";

let db: Db;
let makerId: string;
beforeEach(async () => {
  db = await createTestDb();
  makerId = newId();
  await db.insert(hardwareMakers).values({
    id: makerId,
    name: "Example Works",
    source: "seed",
    status: "verified",
    createdAt: new Date(),
  });
});

describe("hardware catalog", () => {
  it("rejects a kind that isn't a setup part", async () => {
    await expect(
      db.insert(canonicalHardware).values({
        id: newId(),
        makerId,
        // A tamper isn't tracked; only machines, grinders and baskets are.
        kind: "tamper" as "basket",
        name: "Example Tamper",
        source: "seed",
        status: "verified",
        createdAt: new Date(),
      }),
    ).rejects.toThrow();
  });

  it("stores capabilities as JSON", async () => {
    const id = newId();
    const capabilities = { dose: { min: 16, max: 18 } };
    await db.insert(canonicalHardware).values({
      id,
      makerId,
      kind: "basket",
      name: "Example 54 mm Double",
      capabilities,
      source: "seed",
      status: "verified",
      createdAt: new Date(),
    });
    const [row] = await db.select().from(canonicalHardware);
    expect(row.capabilities).toEqual(capabilities);
  });
});

describe("coffee catalog", () => {
  it("round-trips tasting notes as a string array", async () => {
    const roasterId = newId();
    await db.insert(roasters).values({
      id: roasterId,
      name: "Example Roasters",
      source: "seed",
      status: "verified",
      createdAt: new Date(),
    });
    await db.insert(canonicalBeans).values({
      id: newId(),
      roasterId,
      name: "House Blend",
      roastLevel: "Dark",
      tastingNotes: ["Nutty", "Chocolate"],
      source: "seed",
      status: "verified",
      createdAt: new Date(),
    });
    const [bean] = await db.select().from(canonicalBeans);
    expect(bean.tastingNotes).toEqual(["Nutty", "Chocolate"]);
  });
});

describe("catalog links and aliases", () => {
  it("point at any of the four entity types", async () => {
    const types = ["maker", "model", "roaster", "bean"] as const;
    for (const entityType of types) {
      await db.insert(catalogUrls).values({
        id: newId(),
        entityType,
        entityId: newId(),
        url: `https://example.com/${entityType}`,
        normalizedUrl: `example.com/${entityType}`,
        createdAt: new Date(),
      });
      await db.insert(catalogAliases).values({
        id: newId(),
        entityType,
        entityId: newId(),
        name: `Example ${entityType}`,
        createdAt: new Date(),
      });
    }
    const match = await db
      .select()
      .from(catalogUrls)
      .where(eq(catalogUrls.normalizedUrl, "example.com/bean"));
    expect(match).toHaveLength(1);
    expect(await db.select().from(catalogAliases)).toHaveLength(4);
  });
});
