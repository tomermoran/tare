import { describe, expect, it, vi } from "vitest";
import { drinkTypes, households, milkTypes, users } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { ensureAccount } from "./bootstrap";

// The last milk breaks a NOT NULL column, so the bootstrap fails after the
// drinks are in: the milks are part of the same transaction.
vi.mock("@/domain/starterMilks", () => ({
  STARTER_MILKS: [
    { nameKey: "milks.whole", kind: "dairy" },
    { nameKey: "milks.broken", kind: null },
  ],
}));

describe("ensureAccount when seeding milks fails", () => {
  it("leaves no rows behind (STORY-01-01-08, atomic)", async () => {
    const db = await createTestDb();
    await expect(ensureAccount(db, "test-uid-a")).rejects.toThrow();
    expect(await db.select().from(users)).toHaveLength(0);
    expect(await db.select().from(households)).toHaveLength(0);
    expect(await db.select().from(drinkTypes)).toHaveLength(0);
    expect(await db.select().from(milkTypes)).toHaveLength(0);
  });
});
