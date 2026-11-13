import "server-only";
import { and, desc, eq, inArray, max } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { canonicalHardware, extractions, ownedHardware, personas, setupParts, setups } from "@/db/schema";
import type { HardwareKind } from "@/domain/capabilities";
import { currentSetupId, isOlder } from "@/domain/currentSetup";
import { matchSetup, SETUP_KINDS, validateParts } from "@/domain/setup";
import { partsKey } from "@/domain/setupKey";
import { readSetupChoice, writeSetupChoice } from "@/server/setupChoice";
import { getSetupTab, partsOf, recipeCounts, setupsOf, type Part, type SetupSummary } from "./parts";
import { assertOwned, NotFoundError, requireHousehold } from "./scope";

/*
 * Finding or making a setup (STORY-01-02-04), the first-setup shortcut
 * (STORY-01-02-05), which setup is current and the setups list
 * (STORY-01-02-09), and where changing a part starts (STORY-01-02-08).
 * Setups never change: a different combination is a different setup, and
 * only the name can be edited.
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

const cleanName = (name: string | null | undefined) => name?.trim().slice(0, 60) || null;
const keyOf = (s: SetupSummary) => partsKey(s.parts.map((p) => p.id));

export type SetupPreview =
  | { kind: "existing"; id: string; name: string | null; recipeCount: number }
  | { kind: "new" };

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
 * Finds or makes the setup for these three parts (AC 3, AC 4, AC 5) and
 * makes it current on this device (AC 6). Every part must be the
 * household's own. A known combination reuses its setup and recipes.
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

  const known = matchSetup(check.ids, await keyedSetups(householdId));
  const id = known?.id ?? (await findOrCreateSetup(householdId, check.ids, check.key, cleanName(name)));
  await writeSetupChoice(id);
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
  // A stale offer once setups exist never makes another one.
  if (tab.setups.length && suggestion) {
    const known = matchSetup(SETUP_KINDS.map((k) => suggestion.parts[k].id), tab.setups.map((s) => ({ id: s.id, key: keyOf(s) })));
    return { id: known?.id ?? tab.setups[0].id };
  }
  if (!suggestion) throw new MissingPartsError(SETUP_KINDS.filter((k) => !tab.parts[k].length), []);
  return resolveSetup(SETUP_KINDS.map((k) => suggestion.parts[k].id));
}

/** The setup of the default persona's latest shot, measured or one-tap (AC 1). */
async function latestShotSetup(householdId: string) {
  const [row] = await db
    .select({ setupId: extractions.setupId, at: extractions.createdAt })
    .from(extractions)
    .innerJoin(personas, eq(personas.id, extractions.personaId))
    .where(and(eq(extractions.householdId, householdId), eq(personas.isDefault, true)))
    .orderBy(desc(extractions.createdAt))
    .limit(1);
  return row ?? null;
}

/** Which of these setups is current (STORY-01-02-09 AC 1 to AC 3). */
export async function currentSetupOf(
  householdId: string,
  list: readonly { id: string; createdAt: Date }[],
): Promise<string | null> {
  const [latestShot, choice] = await Promise.all([latestShotSetup(householdId), readSetupChoice()]);
  return currentSetupId({ setups: list, latestShot, choice });
}

export type SetupListItem = SetupSummary & {
  current: boolean;
  /** The latest shot on it, by anyone in the household. */
  lastUsedAt: Date | null;
  /** Unused for 90 days, grouped out of the way (AC 4). */
  older: boolean;
};

/**
 * The household's setups for SCR-KIT (AC 4): the current one first, then by
 * last used (or made, if never used), each with its parts, recipe count and
 * last use.
 */
export async function getSetups(now?: Date): Promise<SetupListItem[]> {
  const { householdId } = await requireHousehold();
  // After the session read, so a page never reads the clock while prerendering.
  const at = now ?? new Date();
  const list = await setupsOf(householdId, await partsOf(householdId));
  if (list.length === 0) return [];
  const [current, used] = await Promise.all([
    currentSetupOf(householdId, list),
    db
      .select({ setupId: extractions.setupId, at: max(extractions.createdAt) })
      .from(extractions)
      .where(eq(extractions.householdId, householdId))
      .groupBy(extractions.setupId),
  ]);
  // max() comes back as the stored number, not a Date.
  const lastUsed = new Map(used.map((u) => [u.setupId, u.at == null ? null : new Date(u.at as unknown as number)]));
  const recency = (s: SetupListItem) => (s.lastUsedAt ?? s.createdAt).getTime();
  return list
    .map((s) => {
      const lastUsedAt = lastUsed.get(s.id) ?? null;
      return { ...s, current: s.id === current, lastUsedAt, older: isOlder({ ...s, lastUsedAt }, current, at) };
    })
    .sort((a, b) => Number(b.current) - Number(a.current) || recency(b) - recency(a));
}

/** "Use this": makes one of the household's setups current at once (AC 3). */
export async function chooseSetup(id: string): Promise<{ id: string }> {
  const { householdId } = await requireHousehold();
  await assertOwned("setups", id, householdId);
  await writeSetupChoice(id);
  return { id };
}

/** Names or renames a setup; empty clears the name. Nothing else changes (AC 5). */
export async function renameSetup(id: string, name: string | null): Promise<{ id: string }> {
  const { householdId } = await requireHousehold();
  await assertOwned("setups", id, householdId);
  await db.update(setups).set({ name: cleanName(name) }).where(and(eq(setups.id, id), eq(setups.householdId, householdId)));
  return { id };
}

/**
 * Where the builder starts when changing a part (STORY-01-02-08 AC 1, AC 5):
 * a setup's three parts, or the current setup's. With `newPartId`, that part
 * takes the place of the part of its kind. There is no way to edit a setup's
 * parts: the builder resolves the result as a setup of its own (AC 6).
 */
export async function getChangePartStart({
  setupId,
  newPartId,
}: { setupId?: string; newPartId?: string } = {}): Promise<Record<HardwareKind, string> | null> {
  const { householdId } = await requireHousehold();
  const parts = await partsOf(householdId);
  const list = await setupsOf(householdId, parts);
  const id = setupId && list.some((s) => s.id === setupId) ? setupId : await currentSetupOf(householdId, list);
  const setup = list.find((s) => s.id === id);
  if (!setup) return null;
  const start = Object.fromEntries(setup.parts.map((p) => [p.kind, p.id])) as Record<HardwareKind, string>;
  const fresh = newPartId ? parts.find((p) => p.id === newPartId) : undefined;
  if (fresh && SETUP_KINDS.includes(fresh.kind as (typeof SETUP_KINDS)[number])) start[fresh.kind] = fresh.id;
  return start;
}
