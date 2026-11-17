import "server-only";
import { eq } from "drizzle-orm";
import type { Db } from "@/db/client";
import { batches, extractions, ownedHardware } from "@/db/schema";

/**
 * "Nothing entered yet" (STORY-05-03-04, defined once; also used by
 * STORY-05-03-02 and STORY-05-02-02): no parts, no bags and no shots. The
 * starter drinks and milks and the profile come with every new household,
 * so they don't count.
 */
export async function isHouseholdEmpty(database: Db, householdId: string): Promise<boolean> {
  const any = async (q: Promise<unknown[]>) => (await q).length > 0;
  const found = await Promise.all([
    any(database.select({ id: ownedHardware.id }).from(ownedHardware).where(eq(ownedHardware.householdId, householdId)).limit(1)),
    any(database.select({ id: batches.id }).from(batches).where(eq(batches.householdId, householdId)).limit(1)),
    any(database.select({ id: extractions.id }).from(extractions).where(eq(extractions.householdId, householdId)).limit(1)),
  ]);
  return !found.some(Boolean);
}
