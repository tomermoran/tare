import "server-only";
import { desc, eq, inArray, and } from "drizzle-orm";
import { db } from "@/db/client";
import { batches, batchPortions, canonicalBeans, extractions, roasters } from "@/db/schema";
import { triedSummary, type TriedSummary } from "@/domain/triedSummary";
import { getCoffeeBags, type BagView } from "./bags";
import { mergeGroup, resolveEntity } from "./catalogMerge";
import { listJournal, type JournalShot } from "./journal";
import { getCoffeeRecipes, type Recipe } from "./recipes";
import { NotFoundError, requireHousehold } from "./scope";

/*
 * SCR-COFFEE (STORY-03-06-03): one coffee, merge group resolved, as this
 * household knows it. A coffee the household has never had a bag of isn't
 * found, so another household's coffee stays private.
 */

export const RECENT_SHOTS = 5;

export type Coffee = {
  bean: { id: string; name: string; roasterName: string; roastLevel: string | null; tastingNotes: string[] };
  /** How its shots went; null before its first shot. */
  summary: TriedSummary | null;
  recipes: Recipe[];
  /** Up to five, newest first. */
  recentShots: JournalShot[];
  bags: BagView[];
  /** A bag with any portion left: adding another isn't the main action (STORY-03-06-04 AC 3). */
  onHand: boolean;
};

export async function getCoffee(beanId: string, now = new Date()): Promise<Coffee> {
  const { householdId } = await requireHousehold();
  const id = (await resolveEntity(db, canonicalBeans, beanId)) ?? beanId;
  const group = await mergeGroup(db, canonicalBeans, id);
  if (!group.length) throw new NotFoundError();
  const [bags, [bean], shots] = await Promise.all([
    getCoffeeBags(id),
    db
      .select({
        id: canonicalBeans.id,
        name: canonicalBeans.name,
        roasterName: roasters.name,
        roastLevel: canonicalBeans.roastLevel,
        tastingNotes: canonicalBeans.tastingNotes,
      })
      .from(canonicalBeans)
      .innerJoin(roasters, eq(roasters.id, canonicalBeans.roasterId))
      .where(eq(canonicalBeans.id, id)),
    db
      .select({ rating: extractions.userRating, reaction: extractions.reaction })
      .from(extractions)
      .innerJoin(batchPortions, eq(batchPortions.id, extractions.portionId))
      .innerJoin(batches, eq(batches.id, batchPortions.batchId))
      .where(and(eq(extractions.householdId, householdId), inArray(batches.beanId, group)))
      .orderBy(desc(extractions.createdAt), desc(extractions.id)),
  ]);
  if (!bags.length || !bean) throw new NotFoundError();

  const [recipes, recent] = await Promise.all([
    getCoffeeRecipes(id),
    // Newest first from just after now, whatever their age.
    listJournal({ before: { at: now.getTime() + 1, id: "" }, limit: RECENT_SHOTS, now, filters: { beanId: id } }),
  ]);
  return {
    bean: { ...bean, tastingNotes: bean.tastingNotes ?? [] },
    summary: shots.length ? triedSummary(shots.map((s) => ({ rating: s.rating, reaction: s.reaction ?? null }))) : null,
    recipes,
    recentShots: recent.shots,
    bags,
    onHand: bags.some((b) => b.status !== "finished"),
  };
}
