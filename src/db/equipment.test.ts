import { sql } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import { newId } from "@/db/ids";
import { maintenanceEvents, setups } from "@/db/schema";
import { partsKey } from "@/domain/setupKey";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen } from "@/test/fixtures";

let db: Db;
beforeEach(async () => {
  db = await createTestDb();
});

async function tableNames() {
  const rows = await db.all<{ name: string }>(
    sql`select name from sqlite_master where type = 'table'`,
  );
  return rows.map((r) => r.name);
}

describe("owned hardware", () => {
  it("exists without the retired toolkits table", async () => {
    const names = await tableNames();
    expect(names).toContain("owned_hardware");
    expect(names).not.toContain("toolkits");
  });
});

describe("setups", () => {
  it("allows one setup per household for the same parts", async () => {
    const { household } = await makeHousehold(db);
    const key = partsKey(["m", "g", "b"]);
    const row = () => ({
      id: newId(),
      householdId: household.id,
      partsKey: key,
      createdAt: new Date(),
    });
    await db.insert(setups).values(row());
    await expect(db.insert(setups).values(row())).rejects.toThrow();
  });

  it("lets another household have the same parts key", async () => {
    const a = await makeHousehold(db);
    const b = await makeHousehold(db);
    const key = partsKey(["m", "g", "b"]);
    for (const h of [a, b]) {
      await db.insert(setups).values({
        id: newId(),
        householdId: h.household.id,
        partsKey: key,
        createdAt: new Date(),
      });
    }
    expect(await db.select().from(setups)).toHaveLength(2);
  });
});

describe("maintenance events", () => {
  it("defaults to not a recalibration, with no grind offset", async () => {
    const kitchen = await makeKitchen(db);
    await db.insert(maintenanceEvents).values({
      id: newId(),
      ownedHardwareId: kitchen.parts[1].id,
      kind: "burrs",
      occurredAt: new Date(),
    });
    const [event] = await db.select().from(maintenanceEvents);
    expect(event).toMatchObject({
      isRecalibration: false,
      grindShift: null,
      grindScale: null,
      offsetSourceRecipeId: null,
    });
  });
});
