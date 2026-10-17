import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Locally DATABASE_URL is a file (file:./data/tare.db). In production it can
// point at a hosted libSQL database (Turso) with an auth token; no code change.
export const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL ?? "file:./data/tare.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  schema,
});
