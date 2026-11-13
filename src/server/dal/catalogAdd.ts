import "server-only";
import { and, eq, isNull, or, sql } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { canonicalBeans, canonicalHardware, catalogAliases, catalogUrls, hardwareMakers, roasters, type CatalogEntityType } from "@/db/schema";
import { notSureCapabilities, parseCapabilities, type HardwareKind } from "@/domain/capabilities";
import { isMarket } from "@/domain/markets";
import { isRoastLevel } from "@/domain/roast";
import { normalizeUrl } from "@/domain/url";
import { assertVisibleCatalog, visibleCatalogId } from "./catalogVisibility";
import { requireHousehold } from "./scope";

/*
 * Adding to the catalog (STORY-01-06-01, 01-06-04): a missing model, and
 * the duplicate-link check that runs before anything else is typed and
 * again at save. New entries are the household's own, unverified, and
 * visible only to it until an admin verifies them.
 */

const KINDS: HardwareKind[] = ["machine", "grinder", "basket"];
const MAX_NAME = 80;

export type CatalogMatch =
  | { catalog: "hardware"; id: string; kind: HardwareKind; name: string; makerName: string; addedByYou: boolean }
  | { catalog: "coffee"; id: string; name: string; roasterName: string; addedByYou: boolean };

/** The link isn't an http(s) product page; nothing was saved (AC 5). */
export class InvalidLinkError extends Error {
  constructor(readonly field: "url" | "makerUrl") {
    super("Invalid link");
    this.name = "InvalidLinkError";
  }
}

/** A required name is missing; nothing was saved. */
export class MissingNameError extends Error {
  constructor(readonly field: "maker" | "model") {
    super("Missing name");
    this.name = "MissingNameError";
  }
}

/** The link is already a visible entry: offer it instead (STORY-01-06-04 AC 1, AC 5). */
export class DuplicateEntryError extends Error {
  constructor(readonly match: CatalogMatch) {
    super("Duplicate entry");
    this.name = "DuplicateEntryError";
  }
}

/**
 * A visible model (hardware) or bean (coffee) with this product page,
 * compared by normalised link, so regional paths and tracking parameters
 * don't matter (AC 2). Another household's unverified entry is never
 * reported (AC 3). Merged entries resolve to their survivor.
 */
export async function findByNormalizedUrl(
  catalog: "hardware" | "coffee",
  url: string,
  householdId: string,
): Promise<CatalogMatch | null> {
  const normalized = normalizeUrl(url);
  if (!normalized) return null;
  const type = catalog === "hardware" ? "model" : "bean";
  const rows = await db
    .select({ entityId: catalogUrls.entityId })
    .from(catalogUrls)
    .where(and(eq(catalogUrls.normalizedUrl, normalized), eq(catalogUrls.entityType, type)));
  for (const { entityId } of rows) {
    const id = await visibleCatalogId(type, entityId, householdId);
    if (!id) continue;
    if (catalog === "hardware") {
      const [m] = await db
        .select({ kind: canonicalHardware.kind, name: canonicalHardware.name, makerName: hardwareMakers.name, status: canonicalHardware.status })
        .from(canonicalHardware)
        .innerJoin(hardwareMakers, eq(hardwareMakers.id, canonicalHardware.makerId))
        .where(eq(canonicalHardware.id, id));
      if (m && KINDS.includes(m.kind)) {
        return { catalog, id, kind: m.kind, name: m.name, makerName: m.makerName, addedByYou: m.status !== "verified" };
      }
    } else {
      const [b] = await db
        .select({ name: canonicalBeans.name, roasterName: roasters.name, status: canonicalBeans.status })
        .from(canonicalBeans)
        .innerJoin(roasters, eq(roasters.id, canonicalBeans.roasterId))
        .where(eq(canonicalBeans.id, id));
      if (b) return { catalog, id, name: b.name, roasterName: b.roasterName, addedByYou: b.status !== "verified" };
    }
  }
  return null;
}

/** For the check-url route: the signed-in household's view. */
export async function checkCatalogUrl(catalog: "hardware" | "coffee", url: string): Promise<CatalogMatch | null> {
  const { householdId } = await requireHousehold();
  return findByNormalizedUrl(catalog, url, householdId);
}

/** More product pages and other names, each for a market or everywhere (STORY-01-06-05). */
export type CatalogExtras = {
  urls?: { url: string; market: string | null }[];
  aliases?: { name: string; market: string | null }[];
};

export type HardwareEntryInput = CatalogExtras & {
  /** An existing maker, or a new one with its own link (AC 3). */
  maker: { id: string } | { name: string; url: string };
  model: { name: string; kind: HardwareKind; url: string; capabilities?: unknown };
};

export type CoffeeEntryInput = CatalogExtras & {
  /** An existing roaster, or a new one with its own link (AC 2). */
  roaster: { id: string } | { name: string; url: string };
  bean: { name: string; url: string; roastLevel?: string | null; tastingNotes?: string[] };
};

const MAX_EXTRAS = 10;
const MAX_NOTES = 4;

const cleanName = (name: string) => name.trim().replace(/\s+/g, " ").slice(0, MAX_NAME);

/** A visible maker with this name, so typing a known maker doesn't add it twice. */
async function visibleMakerNamed(name: string, householdId: string) {
  const [row] = await db
    .select({ id: hardwareMakers.id })
    .from(hardwareMakers)
    .where(
      and(
        sql`lower(${hardwareMakers.name}) = ${name.toLowerCase()}`,
        isNull(hardwareMakers.mergedIntoId),
        or(eq(hardwareMakers.status, "verified"), eq(hardwareMakers.createdByHouseholdId, householdId)),
      ),
    )
    .limit(1);
  return row?.id ?? null;
}

/**
 * The extra links and names, cleaned: links normalised, deduplicated
 * (against the main link too) and each checked for a duplicate entry
 * (AC 4); names trimmed and deduplicated against the entry's own name.
 * A market is one of the known codes, or null for everywhere.
 */
async function cleanExtras(
  catalog: "hardware" | "coffee",
  extras: CatalogExtras,
  primary: { normalized: string; name: string },
  householdId: string,
) {
  const urls: { url: string; normalized: string; market: string | null }[] = [];
  const seen = new Set([primary.normalized]);
  for (const u of (extras.urls ?? []).slice(0, MAX_EXTRAS)) {
    const url = u.url?.trim() ?? "";
    if (!url) continue;
    const normalized = normalizeUrl(url);
    if (!normalized) throw new InvalidLinkError("url");
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    const duplicate = await findByNormalizedUrl(catalog, url, householdId);
    if (duplicate) throw new DuplicateEntryError(duplicate);
    urls.push({ url, normalized, market: isMarket(u.market) ? u.market : null });
  }
  const aliases: { name: string; market: string | null }[] = [];
  const names = new Set([primary.name.toLowerCase()]);
  for (const a of (extras.aliases ?? []).slice(0, MAX_EXTRAS)) {
    const name = cleanName(a.name ?? "");
    if (!name || names.has(name.toLowerCase())) continue;
    names.add(name.toLowerCase());
    aliases.push({ name, market: isMarket(a.market) ? a.market : null });
  }
  return { urls, aliases };
}

function extraStatements(
  entityType: CatalogEntityType,
  entityId: string,
  extras: Awaited<ReturnType<typeof cleanExtras>>,
  householdId: string,
  now: Date,
): BatchItem<"sqlite">[] {
  return [
    ...extras.urls.map((u) =>
      db.insert(catalogUrls).values({
        id: newId(),
        entityType,
        entityId,
        url: u.url,
        normalizedUrl: u.normalized,
        market: u.market,
        addedByHouseholdId: householdId,
        createdAt: now,
      }),
    ),
    ...extras.aliases.map((a) =>
      db.insert(catalogAliases).values({ id: newId(), entityType, entityId, name: a.name, market: a.market, createdAt: now }),
    ),
  ];
}

/**
 * Adds a model, and its maker when new, with their links in one atomic
 * batch (AC 2, AC 3). Marked user-added and unverified (AC 6). The link is
 * required (AC 5) and the duplicate check reruns first (STORY-01-06-04
 * AC 5). Capabilities default to "not sure"; a basket's carry only its
 * dose range (AC 4).
 */
export async function createHardwareEntry(input: HardwareEntryInput): Promise<{ id: string; kind: HardwareKind }> {
  const { householdId } = await requireHousehold();
  const kind = input.model.kind;
  if (!KINDS.includes(kind)) throw new MissingNameError("model");

  const url = input.model.url?.trim() ?? "";
  const normalized = normalizeUrl(url);
  if (!normalized) throw new InvalidLinkError("url");
  const name = cleanName(input.model.name ?? "");
  if (!name) throw new MissingNameError("model");

  const capabilities =
    input.model.capabilities === undefined ? notSureCapabilities(kind) : parseCapabilities(kind, input.model.capabilities);
  if (!capabilities) throw new MissingNameError("model");

  const duplicate = await findByNormalizedUrl("hardware", url, householdId);
  if (duplicate) throw new DuplicateEntryError(duplicate);
  const extras = await cleanExtras("hardware", input, { normalized, name }, householdId);

  const now = new Date();
  const statements: BatchItem<"sqlite">[] = [];
  let makerId: string;
  if ("id" in input.maker) {
    makerId = await assertVisibleCatalog("maker", input.maker.id, householdId);
  } else {
    const makerName = cleanName(input.maker.name ?? "");
    if (!makerName) throw new MissingNameError("maker");
    const known = await visibleMakerNamed(makerName, householdId);
    if (known) {
      makerId = known;
    } else {
      const makerUrl = input.maker.url?.trim() ?? "";
      const makerNormalized = normalizeUrl(makerUrl);
      if (!makerNormalized) throw new InvalidLinkError("makerUrl");
      makerId = newId();
      statements.push(
        db.insert(hardwareMakers).values({
          id: makerId,
          name: makerName,
          source: "user",
          status: "unverified",
          createdByHouseholdId: householdId,
          createdAt: now,
        }),
        db.insert(catalogUrls).values({
          id: newId(),
          entityType: "maker",
          entityId: makerId,
          url: makerUrl,
          normalizedUrl: makerNormalized,
          addedByHouseholdId: householdId,
          createdAt: now,
        }),
      );
    }
  }

  const id = newId();
  statements.push(
    db.insert(canonicalHardware).values({
      id,
      makerId,
      kind,
      name,
      capabilities,
      source: "user",
      status: "unverified",
      createdByHouseholdId: householdId,
      createdAt: now,
    }),
    db.insert(catalogUrls).values({
      id: newId(),
      entityType: "model",
      entityId: id,
      url,
      normalizedUrl: normalized,
      addedByHouseholdId: householdId,
      createdAt: now,
    }),
    ...extraStatements("model", id, extras, householdId, now),
  );
  await db.batch(statements as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]]);
  return { id, kind };
}

/** A visible roaster with this name, so typing a known roaster doesn't add it twice. */
async function visibleRoasterNamed(name: string, householdId: string) {
  const [row] = await db
    .select({ id: roasters.id })
    .from(roasters)
    .where(
      and(
        sql`lower(${roasters.name}) = ${name.toLowerCase()}`,
        isNull(roasters.mergedIntoId),
        or(eq(roasters.status, "verified"), eq(roasters.createdByHouseholdId, householdId)),
      ),
    )
    .limit(1);
  return row?.id ?? null;
}

/** Up to four tasting notes, trimmed, without repeats; none is fine (AC 3). */
export function cleanTastingNotes(notes: readonly string[] | undefined): string[] | null {
  const out: string[] = [];
  for (const n of notes ?? []) {
    const note = n.trim().replace(/\s+/g, " ").slice(0, 40);
    if (note && !out.some((o) => o.toLowerCase() === note.toLowerCase())) out.push(note);
    if (out.length === MAX_NOTES) break;
  }
  return out.length ? out : null;
}

/**
 * Adds a bean, and its roaster when new, with the hardware rules
 * (STORY-01-06-02): a link is required, the duplicate check reruns, and
 * the entry is user-added and unverified. Roast level comes from the fixed
 * list (S-09) and tasting notes are optional.
 */
export async function createCoffeeEntry(input: CoffeeEntryInput): Promise<{ id: string }> {
  const { householdId } = await requireHousehold();
  const url = input.bean.url?.trim() ?? "";
  const normalized = normalizeUrl(url);
  if (!normalized) throw new InvalidLinkError("url");
  const name = cleanName(input.bean.name ?? "");
  if (!name) throw new MissingNameError("model");
  const roastLevel = isRoastLevel(input.bean.roastLevel) ? input.bean.roastLevel : null;

  const duplicate = await findByNormalizedUrl("coffee", url, householdId);
  if (duplicate) throw new DuplicateEntryError(duplicate);
  const extras = await cleanExtras("coffee", input, { normalized, name }, householdId);

  const now = new Date();
  const statements: BatchItem<"sqlite">[] = [];
  let roasterId: string;
  if ("id" in input.roaster) {
    roasterId = await assertVisibleCatalog("roaster", input.roaster.id, householdId);
  } else {
    const roasterName = cleanName(input.roaster.name ?? "");
    if (!roasterName) throw new MissingNameError("maker");
    const known = await visibleRoasterNamed(roasterName, householdId);
    if (known) {
      roasterId = known;
    } else {
      const roasterUrl = input.roaster.url?.trim() ?? "";
      const roasterNormalized = normalizeUrl(roasterUrl);
      if (!roasterNormalized) throw new InvalidLinkError("makerUrl");
      roasterId = newId();
      statements.push(
        db.insert(roasters).values({
          id: roasterId,
          name: roasterName,
          source: "user",
          status: "unverified",
          createdByHouseholdId: householdId,
          createdAt: now,
        }),
        db.insert(catalogUrls).values({
          id: newId(),
          entityType: "roaster",
          entityId: roasterId,
          url: roasterUrl,
          normalizedUrl: roasterNormalized,
          addedByHouseholdId: householdId,
          createdAt: now,
        }),
      );
    }
  }

  const id = newId();
  statements.push(
    db.insert(canonicalBeans).values({
      id,
      roasterId,
      name,
      roastLevel,
      tastingNotes: cleanTastingNotes(input.bean.tastingNotes),
      source: "user",
      status: "unverified",
      createdByHouseholdId: householdId,
      createdAt: now,
    }),
    db.insert(catalogUrls).values({
      id: newId(),
      entityType: "bean",
      entityId: id,
      url,
      normalizedUrl: normalized,
      addedByHouseholdId: householdId,
      createdAt: now,
    }),
    ...extraStatements("bean", id, extras, householdId, now),
  );
  await db.batch(statements as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]]);
  return { id };
}
