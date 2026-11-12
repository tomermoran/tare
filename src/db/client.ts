import "server-only";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Locally DATABASE_URL is a file (file:./data/tare.db). In production it can
// point at a hosted libSQL database (Turso) with an auth token; no code change.
// libSQL enforces foreign keys by default (PRAGMA foreign_keys = 1), locally
// and on Turso; the unit tests check it on every test database.
// "server-only" makes importing this from a client component fail the build.
export const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL ?? "file:./data/tare.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  schema,
});

export type Db = typeof db;
