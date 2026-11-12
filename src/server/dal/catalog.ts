import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";
import type { Db } from "@/db/client";
import {
  canonicalHardware,
  catalogAliases,
  hardwareMakers,
  ownedHardware,
} from "@/db/schema";
import type { HardwareKind } from "@/domain/capabilities";
import { resolveEntity } from "./catalogMerge";

/*
 * Hardware catalog reads for the picker (STORY-01-02-01). A household sees
 * verified rows and its own unverified additions; merged duplicates are
 * hidden and found through their survivor. These take the database and the
 * household explicitly; routes pass requireHousehold()'s household.
 */

export type HardwareResult = {
  id: string;
  kind: HardwareKind;
  name: string;
  makerId: string;
  makerName: string;
  /** An unverified entry this household added (shown as "added by you"). */
  addedByYou: boolean;
  /** The alias that matched, when the match wasn't on the name. */
  matchedAlias: string | null;
  /** A basket by the household's machine maker ("made for your machine"). */
  stock: boolean;
};

export type MakerResult = { id: string; name: string; addedByYou: boolean };

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });
const byMakerThenName = (a: HardwareResult, b: HardwareResult) =>
  collator.compare(a.makerName, b.makerName) || collator.compare(a.name, b.name);

/** LIKE pattern for "contains", with the wildcards in the query escaped. */
function contains(query: string) {
  return `%${query.toLowerCase().replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

function visible(householdId: string) {
  return and(
    or(eq(canonicalHardware.status, "verified"), eq(canonicalHardware.createdByHouseholdId, householdId)),
    isNull(canonicalHardware.mergedIntoId),
    or(eq(hardwareMakers.status, "verified"), eq(hardwareMakers.createdByHouseholdId, householdId)),
  );
}

async function rowsByIds(db: Db, householdId: string, kind: HardwareKind, ids: string[] | null) {
  const rows = await db
    .select({
      id: canonicalHardware.id,
      kind: canonicalHardware.kind,
      name: canonicalHardware.name,
      makerId: hardwareMakers.id,
      makerName: hardwareMakers.name,
      status: canonicalHardware.status,
    })
    .from(canonicalHardware)
    .innerJoin(hardwareMakers, eq(hardwareMakers.id, canonicalHardware.makerId))
    .where(
      and(
        eq(canonicalHardware.kind, kind),
        visible(householdId),
        ids === null ? undefined : inArray(canonicalHardware.id, ids.length ? ids : [""]),
      ),
    );
  return rows.map(({ status, ...r }) => ({
    ...r,
    addedByYou: status !== "verified",
    matchedAlias: null as string | null,
    stock: false,
  }));
}

/** Makers of the machines this household owns, for "stock baskets first". */
async function householdMachineMakers(db: Db, householdId: string): Promise<Set<string>> {
  const rows = await db
    .select({ makerId: canonicalHardware.makerId })
    .from(ownedHardware)
    .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
    .where(and(eq(ownedHardware.householdId, householdId), eq(canonicalHardware.kind, "machine")));
  return new Set(rows.map((r) => r.makerId));
}

/**
 * Models of one kind matching `query` on model name, maker name, "maker
 * model", or an alias of either (AC 1, AC 5). With no query, every model of
 * the kind (browse). Baskets by the household's machine maker come first
 * (AC 3); otherwise exact and prefix matches lead, then maker and model.
 */
export async function searchHardware(
  db: Db,
  householdId: string,
  { kind, query = "" }: { kind: HardwareKind; query?: string },
): Promise<HardwareResult[]> {
  const q = query.trim();
  let results: HardwareResult[];

  if (!q) {
    results = await rowsByIds(db, householdId, kind, null);
  } else {
    const pattern = contains(q);
    const lower = (col: unknown) => sql`lower(${col}) like ${pattern} escape '\\'`;

    const direct = await db
      .select({ id: canonicalHardware.id })
      .from(canonicalHardware)
      .innerJoin(hardwareMakers, eq(hardwareMakers.id, canonicalHardware.makerId))
      .where(
        and(
          eq(canonicalHardware.kind, kind),
          or(
            lower(canonicalHardware.name),
            lower(hardwareMakers.name),
            lower(sql`${hardwareMakers.name} || ' ' || ${canonicalHardware.name}`),
          ),
        ),
      );

    const aliasRows = await db
      .select({ type: catalogAliases.entityType, entityId: catalogAliases.entityId, name: catalogAliases.name })
      .from(catalogAliases)
      .where(and(inArray(catalogAliases.entityType, ["model", "maker"]), lower(catalogAliases.name)));

    // Alias hits may point at a merged duplicate: follow it to the survivor.
    const aliasFor = new Map<string, string>();
    const makerHits: string[] = [];
    for (const a of aliasRows) {
      if (a.type === "model") {
        const id = await resolveEntity(db, canonicalHardware, a.entityId);
        if (id && !aliasFor.has(id)) aliasFor.set(id, a.name);
      } else {
        const id = await resolveEntity(db, hardwareMakers, a.entityId);
        if (id) makerHits.push(id);
      }
    }
    const byMakerAlias = makerHits.length
      ? await db
          .select({ id: canonicalHardware.id })
          .from(canonicalHardware)
          .where(and(eq(canonicalHardware.kind, kind), inArray(canonicalHardware.makerId, makerHits)))
      : [];

    const ids = [...new Set([...direct, ...byMakerAlias].map((r) => r.id).concat([...aliasFor.keys()]))];
    results = (await rowsByIds(db, householdId, kind, ids)).map((r) => {
      const nameHit = `${r.makerName} ${r.name}`.toLowerCase().includes(q.toLowerCase());
      return { ...r, matchedAlias: nameHit ? null : (aliasFor.get(r.id) ?? null) };
    });
  }

  const stock = kind === "basket" ? await householdMachineMakers(db, householdId) : new Set<string>();
  const ql = q.toLowerCase();
  const rank = (r: HardwareResult) => {
    const names = [r.name, `${r.makerName} ${r.name}`, r.matchedAlias ?? ""].map((n) => n.toLowerCase());
    if (!ql) return 0;
    if (names.includes(ql)) return 0;
    if (names.some((n) => n.startsWith(ql))) return 1;
    return 2;
  };
  for (const r of results) r.stock = stock.has(r.makerId);
  return results.sort(
    (a, b) =>
      Number(b.stock) - Number(a.stock) ||
      rank(a) - rank(b) ||
      byMakerThenName(a, b),
  );
}

/** Makers with at least one visible model of `kind`, alphabetical (AC 2). */
export async function listMakers(
  db: Db,
  householdId: string,
  { kind }: { kind: HardwareKind },
): Promise<MakerResult[]> {
  const rows = await rowsByIds(db, householdId, kind, null);
  const makers = new Map<string, MakerResult>();
  for (const r of rows) {
    if (!makers.has(r.makerId)) makers.set(r.makerId, { id: r.makerId, name: r.makerName, addedByYou: false });
  }
  const unverified = await db
    .select({ id: hardwareMakers.id })
    .from(hardwareMakers)
    .where(and(inArray(hardwareMakers.id, [...makers.keys(), ""]), eq(hardwareMakers.status, "unverified")));
  for (const { id } of unverified) makers.get(id)!.addedByYou = true;
  return [...makers.values()].sort((a, b) => collator.compare(a.name, b.name));
}

/** One maker's visible models of `kind`, alphabetical. */
export async function listModels(
  db: Db,
  householdId: string,
  { makerId, kind }: { makerId: string; kind: HardwareKind },
): Promise<HardwareResult[]> {
  const survivor = (await resolveEntity(db, hardwareMakers, makerId)) ?? makerId;
  const rows = await rowsByIds(db, householdId, kind, null);
  return rows.filter((r) => r.makerId === survivor).sort(byMakerThenName);
}
