import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "@/db/schema";
import type { Db } from "@/db/client";

/**
 * A fresh in-memory database with every migration applied. Call it in a
 * `beforeEach` (or once per file) so tests never share rows.
 *
 * An in-memory database has a single connection, so it can't run two
 * transactions at once. Pass `{ file: true }` for a throwaway file database
 * when a test needs concurrent writes, as the real database allows.
 */
export async function createTestDb({ file = false } = {}): Promise<Db> {
  const url = file
    ? `file:${path.join(mkdtempSync(path.join(tmpdir(), "tare-test-")), "test.db")}`
    : ":memory:";
  const client = createClient({ url });
  const db = drizzle({ client, schema });
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), "src/db/migrations"),
  });
  return db;
}
