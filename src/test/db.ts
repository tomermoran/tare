import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "@/db/schema";
import type { Db } from "@/db/client";

/**
 * A fresh in-memory database with every migration applied. Call it in a
 * `beforeEach` (or once per file) so tests never share rows.
 */
export async function createTestDb(): Promise<Db> {
  const client = createClient({ url: ":memory:" });
  const db = drizzle({ client, schema });
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), "src/db/migrations"),
  });
  return db;
}
