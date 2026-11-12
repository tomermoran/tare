import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import { newId } from "@/db/ids";
import { canonicalHardware, hardwareMakers } from "@/db/schema";
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
