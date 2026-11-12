import "server-only";
import { and, count, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { ownedHardware, canonicalHardware, pinnedRecipes, setupParts, setups } from "@/db/schema";
import type { HardwareKind } from "@/domain/capabilities";
import { matchSetup, SETUP_KINDS, validateParts } from "@/domain/setup";
import { getSetupTab, type Part, type SetupSummary } from "./parts";
import { NotFoundError, requireHousehold } from "./scope";

/*
 * Finding or making a setup (STORY-01-02-04) and the first-setup shortcut
 * (STORY-01-02-05). Milestone 1 limit (revision 4): a household has at most
 * one setup. Making a second is refused with SetupExistsError and changes
 * nothing; TASK-01-02-04-BE3 (wave 6) lifts the limit.
 */

/** The chosen parts aren't one of each kind; nothing was saved (AC 5). */
export class MissingPartsError extends Error {
  constructor(
    readonly missing: HardwareKind[],
    readonly extra: HardwareKind[],
  ) {
    super("Missing parts");
    this.name = "MissingPartsError";
  }
}

/**
 * The household already has a setup (Milestone 1). `same` says whether it's
 * this very combination, e.g. a double tap, which callers treat as success.
 */
export class SetupExistsError extends Error {
  constructor(
    readonly setupId: string,
    readonly same: boolean,
  ) {
    super("Setup exists");
    this.name = "SetupExistsError";
  }
}

export type SetupPreview =
  | { kind: "existing"; id: string; name: string | null; recipeCount: number }
  | { kind: "new" };

async function recipeCounts(householdId: string): Promise<Map<string, number>> {
  const rows = await db
    .select({ setupId: pinnedRecipes.setupId, n: count() })
    .from(pinnedRecipes)
    .where(eq(pinnedRecipes.householdId, householdId))
    .groupBy(pinnedRecipes.setupId);
  return new Map(rows.map((r) => [r.setupId, r.n]));
}

async function keyedSetups(householdId: string) {
  return db
    .select({ id: setups.id, key: setups.partsKey, name: setups.name })
    .from(setups)
    .where(eq(setups.householdId, householdId));
}

/** Whether these parts are one of the household's setups (AC 2). */
export async function previewSetup(partIds: string[]): Promise<SetupPreview> {
  const { householdId } = await requireHousehold();
  const match = matchSetup(partIds, await keyedSetups(householdId));
  if (!match) return { kind: "new" };
  const counts = await recipeCounts(householdId);
  return { kind: "existing", id: match.id, name: match.name, recipeCount: counts.get(match.id) ?? 0 };
}

/**
 * Inserts the setup and its parts in one atomic batch, or reads the setup
 * when the same combination already exists, so two quick calls make one
 * setup. The unique (household, parts) index decides. A batch, not an
 * interactive transaction: one libSQL client can't hold two of those at
 * once.
 */
export async function findOrCreateSetup(
  householdId: string,
  partIds: string[],
  key: string,
  name: string | null,
): Promise<string> {
  const id = newId();
  try {
    await db.batch([
      db.insert(setups).values({ id, householdId, partsKey: key, name, createdAt: new Date() }),
      db.insert(setupParts).values(partIds.map((ownedHardwareId) => ({ setupId: id, ownedHardwareId }))),
    ]);
    return id;
  } catch (error) {
    const [existing] = await db
      .select({ id: setups.id })
      .from(setups)
      .where(and(eq(setups.householdId, householdId), eq(setups.partsKey, key)));
    if (existing) return existing.id;
    throw error;
  }
}

/**
 * Makes the setup for these three parts (AC 4, AC 5). Every part must be the
 * household's own. Milestone 1: refused once any setup exists.
 */
export async function resolveSetup(partIds: string[], name?: string | null): Promise<{ id: string }> {
  const { householdId } = await requireHousehold();
  const unique = [...new Set(partIds)];
  const parts = await db
    .select({ id: ownedHardware.id, kind: canonicalHardware.kind })
    .from(ownedHardware)
    .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
    .where(and(eq(ownedHardware.householdId, householdId), inArray(ownedHardware.id, unique.length ? unique : [""])));
  if (parts.length !== unique.length) throw new NotFoundError();

  const check = validateParts(parts);
  if (!check.ok) throw new MissingPartsError(check.missing, check.extra);

  const existing = await keyedSetups(householdId);
  if (existing.length) {
    const same = existing.find((s) => s.key === check.key);
    throw new SetupExistsError(same?.id ?? existing[0].id, !!same);
  }
  const id = await findOrCreateSetup(householdId, check.ids, check.key, name?.trim().slice(0, 60) || null);
  return { id };
}

export type SetupSuggestion = {
  /** Exactly one of each kind: one tap makes the setup (AC 1). */
  oneTap: boolean;
  /** The parts it will use: the only one of each kind, or the most recent (AC 2). */
  parts: Record<HardwareKind, Part>;
};

/** The first-setup offer: null once any setup exists (AC 5) or a kind is missing. */
export async function getSetupSuggestion(): Promise<SetupSuggestion | null> {
  const tab = await getSetupTab();
  return suggestionFrom(tab.parts, tab.setups);
}

export function suggestionFrom(
  parts: Record<HardwareKind, Part[]>,
  existing: SetupSummary[],
): SetupSuggestion | null {
  if (existing.length) return null;
  if (SETUP_KINDS.some((k) => parts[k].length === 0)) return null;
  const latest = (list: Part[]) =>
    list.reduce((a, b) => (b.createdAt.getTime() > a.createdAt.getTime() ? b : a));
  return {
    oneTap: SETUP_KINDS.every((k) => parts[k].length === 1),
    parts: { machine: latest(parts.machine), grinder: latest(parts.grinder), basket: latest(parts.basket) },
  };
}

/** One tap on the offer: the suggested parts as a setup with no name (AC 1). */
export async function createFirstSetup(): Promise<{ id: string }> {
  const tab = await getSetupTab();
  // Built from the parts alone, not the offer, so a double tap (the setup
  // now exists) resolves the same combination and reads as already made.
  const suggestion = suggestionFrom(tab.parts, []);
  if (!suggestion) throw new MissingPartsError(SETUP_KINDS.filter((k) => !tab.parts[k].length), []);
  return resolveSetup(SETUP_KINDS.map((k) => suggestion.parts[k].id));
}
