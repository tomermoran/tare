import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { canonicalBeans, canonicalHardware, hardwareMakers, roasters } from "@/db/schema";
import type { CatalogEntityType } from "@/db/schema";
import { resolveEntity } from "./catalogMerge";
import { NotFoundError } from "./scope";

/*
 * Catalog visibility (STORY-01-06-03): a household sees verified entries
 * and the unverified ones it added itself, never another household's.
 * Merged duplicates resolve to their survivor. Every action that stores a
 * catalog reference checks it here first, so a guessed ID of another
 * household's private entry reads as not found.
 */

const TABLES = {
  maker: hardwareMakers,
  model: canonicalHardware,
  roaster: roasters,
  bean: canonicalBeans,
} as const;

/** The visible survivor of a catalog ID, or null. */
export async function visibleCatalogId(type: CatalogEntityType, id: string, householdId: string): Promise<string | null> {
  const table = TABLES[type];
  const survivor = await resolveEntity(db, table, id);
  if (!survivor) return null;
  const [row] = await db
    .select({ status: table.status, owner: table.createdByHouseholdId })
    .from(table)
    .where(eq(table.id, survivor));
  if (!row || !(row.status === "verified" || row.owner === householdId)) return null;
  return survivor;
}

/** Like visibleCatalogId, but throws NotFoundError for anything the household can't see. */
export async function assertVisibleCatalog(type: CatalogEntityType, id: string, householdId: string): Promise<string> {
  const visible = await visibleCatalogId(type, id, householdId);
  if (!visible) throw new NotFoundError();
  return visible;
}
