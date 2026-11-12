import { describe, expect, it, vi } from "vitest";
import { households, personas, users } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { ensureAccount } from "./bootstrap";

// The last drink breaks a NOT NULL column, so the bootstrap fails after the
// user, household and persona are already inserted.
vi.mock("@/domain/starterDrinks", () => ({
  STARTER_DRINKS: [
    { nameKey: "drinks.espresso", hasMilk: false, typicalMilkMl: null },
    { nameKey: "drinks.broken", hasMilk: null, typicalMilkMl: null },
  ],
}));

describe("ensureAccount when a step fails", () => {
  it("leaves no rows behind", async () => {
    const db = await createTestDb();
    await expect(ensureAccount(db, "test-uid-a")).rejects.toThrow();
    expect(await db.select().from(users)).toHaveLength(0);
    expect(await db.select().from(households)).toHaveLength(0);
    expect(await db.select().from(personas)).toHaveLength(0);
  });
});
