import { eq, inArray } from "drizzle-orm";
import type { Db } from "@/db/client";
import { canonicalBeans, canonicalHardware, hardwareMakers, roasters } from "@/db/schema";

/*
 * Catalog duplicates are merged by pointing the duplicate at the survivor
 * (mergedIntoId); the duplicate row stays so existing references keep
 * working. Reads follow the pointer to the survivor, and history views
 * gather the whole group so shots against either row count together.
 */

export type MergeableTable =
  | typeof hardwareMakers
  | typeof canonicalHardware
  | typeof roasters
  | typeof canonicalBeans;

/** Merge chains are short; anything longer is treated as broken data. */
export const MAX_MERGE_DEPTH = 10;

/**
 * The surviving row's id for `id`: follows mergedIntoId until a row that
 * isn't merged. Stops at a cycle (including a row merged into itself) or at
 * MAX_MERGE_DEPTH, returning the last row reached, so a bad pointer never
 * loops. Returns null when `id` doesn't exist.
 */
export async function resolveEntity(
  db: Db,
  table: MergeableTable,
  id: string,
): Promise<string | null> {
  const seen = new Set<string>();
  let current = id;
  let last: string | null = null;
  for (let depth = 0; depth <= MAX_MERGE_DEPTH; depth++) {
    const [row] = await db
      .select({ id: table.id, mergedIntoId: table.mergedIntoId })
      .from(table)
      .where(eq(table.id, current));
    // A pointer to a missing row: stay on the last row that exists.
    if (!row) return last;
    seen.add(row.id);
    last = row.id;
    const next = row.mergedIntoId;
    if (!next || seen.has(next) || depth === MAX_MERGE_DEPTH) return row.id;
    current = next;
  }
  return current; // Unreachable: the loop returns at MAX_MERGE_DEPTH.
}

/**
 * Every id in `id`'s merge group: its survivor and all rows that point at
 * it, directly or through a chain. Empty when `id` doesn't exist.
 */
export async function mergeGroup(
  db: Db,
  table: MergeableTable,
  id: string,
): Promise<string[]> {
  const root = await resolveEntity(db, table, id);
  if (!root) return [];
  const group = new Set([root]);
  let frontier = [root];
  for (let depth = 0; depth < MAX_MERGE_DEPTH && frontier.length > 0; depth++) {
    const rows = await db
      .select({ id: table.id })
      .from(table)
      .where(inArray(table.mergedIntoId, frontier));
    frontier = rows.map((r) => r.id).filter((r) => !group.has(r));
    frontier.forEach((r) => group.add(r));
  }
  return [...group].sort();
}
