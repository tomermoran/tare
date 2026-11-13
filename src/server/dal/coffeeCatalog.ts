import "server-only";
import { and, desc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import type { Db } from "@/db/client";
import { batches, canonicalBeans, catalogAliases, roasters } from "@/db/schema";
import { resolveEntity } from "./catalogMerge";

/*
 * Coffee catalog reads for the picker (STORY-03-01-01). Same rules as the
 * hardware catalog: verified rows and the household's own additions;
 * merged duplicates are hidden and found through their survivor. Beans the
 * household has bought before come first (AC 2).
 */

export type CoffeeResult = {
  id: string;
  name: string;
  roasterId: string;
  roasterName: string;
  addedByYou: boolean;
  matchedAlias: string | null;
  /** A bean of one of the household's bags. */
  bought: boolean;
};

export type RoasterResult = { id: string; name: string; addedByYou: boolean };

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

function contains(query: string) {
  return `%${query.toLowerCase().replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

function visible(householdId: string) {
  return and(
    or(eq(canonicalBeans.status, "verified"), eq(canonicalBeans.createdByHouseholdId, householdId)),
    isNull(canonicalBeans.mergedIntoId),
    or(eq(roasters.status, "verified"), eq(roasters.createdByHouseholdId, householdId)),
    isNull(roasters.mergedIntoId),
  );
}

async function beansByIds(db: Db, householdId: string, ids: string[] | null): Promise<CoffeeResult[]> {
  const rows = await db
    .select({
      id: canonicalBeans.id,
      name: canonicalBeans.name,
      roasterId: roasters.id,
      roasterName: roasters.name,
      status: canonicalBeans.status,
    })
    .from(canonicalBeans)
    .innerJoin(roasters, eq(roasters.id, canonicalBeans.roasterId))
    .where(and(visible(householdId), ids === null ? undefined : inArray(canonicalBeans.id, ids.length ? ids : [""])));
  return rows.map(({ status, ...r }) => ({ ...r, addedByYou: status !== "verified", matchedAlias: null, bought: false }));
}

/** The household's bought beans, newest bag first, each once, as survivors. */
async function boughtBeanIds(db: Db, householdId: string): Promise<string[]> {
  const rows = await db
    .select({ beanId: batches.beanId })
    .from(batches)
    .where(eq(batches.householdId, householdId))
    .orderBy(desc(batches.createdAt));
  const ids: string[] = [];
  for (const { beanId } of rows) {
    const id = await resolveEntity(db, canonicalBeans, beanId);
    if (id && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

/** Beans the household has bought, most recent bag first (AC 2). */
export async function recentCoffee(db: Db, householdId: string): Promise<CoffeeResult[]> {
  const ids = await boughtBeanIds(db, householdId);
  const rows = await beansByIds(db, householdId, ids);
  const order = new Map(ids.map((id, i) => [id, i]));
  return rows.map((r) => ({ ...r, bought: true })).sort((a, b) => order.get(a.id)! - order.get(b.id)!);
}

/**
 * Beans matching `query` on bean name, roaster name, "roaster bean", or an
 * alias of either (AC 1, AC 3). Bought beans first, then exact and prefix
 * matches, then roaster and name.
 */
export async function searchCoffee(db: Db, householdId: string, { query }: { query: string }): Promise<CoffeeResult[]> {
  const q = query.trim();
  if (!q) return recentCoffee(db, householdId);
  const pattern = contains(q);
  const lower = (col: unknown) => sql`lower(${col}) like ${pattern} escape '\\'`;

  const direct = await db
    .select({ id: canonicalBeans.id })
    .from(canonicalBeans)
    .innerJoin(roasters, eq(roasters.id, canonicalBeans.roasterId))
    .where(or(lower(canonicalBeans.name), lower(roasters.name), lower(sql`${roasters.name} || ' ' || ${canonicalBeans.name}`)));

  const aliasRows = await db
    .select({ type: catalogAliases.entityType, entityId: catalogAliases.entityId, name: catalogAliases.name })
    .from(catalogAliases)
    .where(and(inArray(catalogAliases.entityType, ["bean", "roaster"]), lower(catalogAliases.name)));
  const aliasFor = new Map<string, string>();
  const roasterHits: string[] = [];
  for (const a of aliasRows) {
    if (a.type === "bean") {
      const id = await resolveEntity(db, canonicalBeans, a.entityId);
      if (id && !aliasFor.has(id)) aliasFor.set(id, a.name);
    } else {
      const id = await resolveEntity(db, roasters, a.entityId);
      if (id) roasterHits.push(id);
    }
  }
  const byRoasterAlias = roasterHits.length
    ? await db.select({ id: canonicalBeans.id }).from(canonicalBeans).where(inArray(canonicalBeans.roasterId, roasterHits))
    : [];

  // A direct hit on a merged duplicate counts for its survivor.
  const hits = new Set<string>([...aliasFor.keys()]);
  for (const { id } of [...direct, ...byRoasterAlias]) {
    const survivor = await resolveEntity(db, canonicalBeans, id);
    if (survivor) hits.add(survivor);
  }

  const bought = new Set(await boughtBeanIds(db, householdId));
  const ql = q.toLowerCase();
  const rank = (r: CoffeeResult) => {
    const names = [r.name, `${r.roasterName} ${r.name}`, r.matchedAlias ?? ""].map((n) => n.toLowerCase());
    if (names.includes(ql)) return 0;
    if (names.some((n) => n.startsWith(ql))) return 1;
    return 2;
  };
  return (await beansByIds(db, householdId, [...hits]))
    .map((r) => {
      const nameHit = `${r.roasterName} ${r.name}`.toLowerCase().includes(ql);
      return { ...r, bought: bought.has(r.id), matchedAlias: nameHit ? null : (aliasFor.get(r.id) ?? null) };
    })
    .sort(
      (a, b) =>
        Number(b.bought) - Number(a.bought) ||
        rank(a) - rank(b) ||
        collator.compare(a.roasterName, b.roasterName) ||
        collator.compare(a.name, b.name),
    );
}

/** Roasters with at least one visible bean, alphabetical (browse). */
export async function listRoasters(db: Db, householdId: string): Promise<RoasterResult[]> {
  const rows = await db
    .selectDistinct({ id: roasters.id, name: roasters.name, status: roasters.status })
    .from(roasters)
    .innerJoin(canonicalBeans, eq(canonicalBeans.roasterId, roasters.id))
    .where(visible(householdId));
  return rows
    .map(({ status, ...r }) => ({ ...r, addedByYou: status !== "verified" }))
    .sort((a, b) => collator.compare(a.name, b.name));
}

/** One roaster's visible beans, alphabetical. */
export async function listRoasterBeans(db: Db, householdId: string, roasterId: string): Promise<CoffeeResult[]> {
  const survivor = (await resolveEntity(db, roasters, roasterId)) ?? roasterId;
  const bought = new Set(await boughtBeanIds(db, householdId));
  return (await beansByIds(db, householdId, null))
    .filter((r) => r.roasterId === survivor)
    .map((r) => ({ ...r, bought: bought.has(r.id) }))
    .sort((a, b) => collator.compare(a.name, b.name));
}
