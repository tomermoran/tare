import "server-only";
import { and, count, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { drinkTypes, milkTypes } from "@/db/schema";
import { requireHousehold } from "./scope";

/*
 * The one-line summaries of Your lists on Profile (STORY-02-05-07): how
 * many drinks and milks the household has, and how many are hidden.
 */

export type ListSummary = { count: number; hidden: number };
export type ListSummaries = { drinks: ListSummary; milks: ListSummary };

export async function getListSummaries(): Promise<ListSummaries> {
  const { householdId } = await requireHousehold();
  const tally = async (table: typeof drinkTypes | typeof milkTypes): Promise<ListSummary> => {
    const [all, hidden] = await Promise.all([
      db.select({ n: count() }).from(table).where(eq(table.householdId, householdId)),
      db.select({ n: count() }).from(table).where(and(eq(table.householdId, householdId), eq(table.hidden, true))),
    ]);
    return { count: all[0].n, hidden: hidden[0].n };
  };
  const [drinks, milks] = await Promise.all([tally(drinkTypes), tally(milkTypes)]);
  return { drinks, milks };
}
