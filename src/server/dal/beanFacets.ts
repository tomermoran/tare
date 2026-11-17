import "server-only";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { canonicalBeans, roasters } from "@/db/schema";
import { ratingWord, type BeanFacet } from "@/domain/beansFilter";
import { parseOrigin } from "@/domain/origin";
import type { TriedCoffee } from "./tried";

/*
 * The coffees the Beans filters work over (TASK-03-07-01-BE2): one each,
 * on hand and tried together, with roaster, roast level, origin and the
 * rating word. The rating comes from Tried's own summary, passed in rather
 * than worked out again; a coffee on hand that was never brewed reads "no
 * ratings yet". Both lists already follow merges to the surviving coffee.
 */
export async function getBeanFacets({ onHand, tried }: { onHand: readonly string[]; tried: readonly TriedCoffee[] }): Promise<BeanFacet[]> {
  const ids = [...new Set([...onHand, ...tried.map((c) => c.beanId)])];
  if (ids.length === 0) return [];
  const rows = await db
    .select({
      beanId: canonicalBeans.id,
      roasterId: roasters.id,
      roasterName: roasters.name,
      roastLevel: canonicalBeans.roastLevel,
      origin: canonicalBeans.origin,
    })
    .from(canonicalBeans)
    .innerJoin(roasters, eq(roasters.id, canonicalBeans.roasterId))
    .where(inArray(canonicalBeans.id, ids));
  const summaries = new Map(tried.map((c) => [c.beanId, c.summary]));
  return rows.map((r) => ({ ...r, origin: parseOrigin(r.origin), rating: ratingWord(summaries.get(r.beanId) ?? null) }));
}
