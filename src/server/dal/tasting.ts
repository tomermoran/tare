import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { extractions } from "@/db/schema";
import { tastingColumns, type Tasting } from "@/domain/tasting";
import { assertOwned, requireHousehold } from "./scope";

/**
 * Saves how a shot tasted (STORY-01-05-01 to 03): only the given fields are
 * written, and nothing at all when none are. The household's own shots
 * only; another household's shot is not found.
 */
export async function saveTasting(shotId: string, tasting: Tasting): Promise<void> {
  const { householdId } = await requireHousehold();
  await assertOwned("extractions", shotId, householdId);
  const [shot] = await db.select({ entryMode: extractions.entryMode }).from(extractions).where(eq(extractions.id, shotId));
  const columns = tastingColumns(tasting, shot.entryMode);
  if (Object.keys(columns).length === 0) return;
  await db.update(extractions).set(columns).where(eq(extractions.id, shotId));
}
