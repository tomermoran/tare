/**
 * npm run db:seed — loads src/db/seed/*.json into DATABASE_URL (or the local
 * file). Safe to run any number of times.
 */
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import coffee from "../src/db/seed/coffee.json";
import hardware from "../src/db/seed/hardware.json";
import * as schema from "../src/db/schema";
import { loadSeed, SeedError, type CoffeeSeed, type HardwareSeed } from "../src/db/seed/load";

// Local settings, if any (DATABASE_URL for a remote database).
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local: use the local file database.
}

const url = process.env.DATABASE_URL ?? "file:./data/tare.db";
const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
const db = drizzle({ client, schema });

async function main() {
  try {
    const counts = await loadSeed(db, hardware as HardwareSeed, coffee as CoffeeSeed);
    console.log("Seed loaded:", counts);
  } catch (error) {
    console.error(error instanceof SeedError ? error.message : error);
    process.exitCode = 1;
  } finally {
    client.close();
  }
}

void main();
