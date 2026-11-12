import { sql } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import { createTestDb } from "@/test/db";

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
