import { sql } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createTestDb } from "@/test/db";

describe("test database", () => {
  it("enforces foreign keys", async () => {
    const db = await createTestDb();
    const rows = await db.all<{ foreign_keys: number }>(
      sql`PRAGMA foreign_keys`,
    );
    expect(rows[0]?.foreign_keys).toBe(1);
  });
});
