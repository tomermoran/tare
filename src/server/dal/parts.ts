import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { canonicalHardware, hardwareMakers, ownedHardware, setupParts, setups } from "@/db/schema";
import type { HardwareKind } from "@/domain/capabilities";
import { resolveEntity } from "./catalogMerge";
import { assertOwned, NotFoundError, requireHousehold } from "./scope";

/*
 * The household's parts (STORY-01-02-02): the machines, grinders and baskets
 * it owns. Each is one physical unit, so two of the same model are two parts
 * with their own history.
 */

export const PART_KINDS: HardwareKind[] = ["machine", "grinder", "basket"];

export type Part = {
  id: string;
  kind: HardwareKind;
  hardwareId: string;
  model: string;
  maker: string;
  nickname: string | null;
  acquiredAt: Date | null;
  createdAt: Date;
};

export type SetupSummary = {
  id: string;
  name: string | null;
  createdAt: Date;
  /** Its three parts, in kind order (machine, grinder, basket). */
  parts: Part[];
};

const partColumns = {
  id: ownedHardware.id,
  kind: canonicalHardware.kind,
  hardwareId: canonicalHardware.id,
  model: canonicalHardware.name,
  maker: hardwareMakers.name,
  nickname: ownedHardware.nickname,
  acquiredAt: ownedHardware.acquiredAt,
  createdAt: ownedHardware.createdAt,
};

const kindOrder = (p: Part) => PART_KINDS.indexOf(p.kind);
const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

async function partsOf(householdId: string, ids?: string[]): Promise<Part[]> {
  return db
    .select(partColumns)
    .from(ownedHardware)
    .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
    .innerJoin(hardwareMakers, eq(hardwareMakers.id, canonicalHardware.makerId))
    .where(
      and(
        eq(ownedHardware.householdId, householdId),
        ids ? inArray(ownedHardware.id, ids.length ? ids : [""]) : undefined,
      ),
    );
}

async function setupsOf(householdId: string, parts: Part[]): Promise<SetupSummary[]> {
  const rows = await db.select().from(setups).where(eq(setups.householdId, householdId));
  if (rows.length === 0) return [];
  const links = await db
    .select()
    .from(setupParts)
    .where(inArray(setupParts.setupId, rows.map((r) => r.id)));
  const byId = new Map(parts.map((p) => [p.id, p]));
  return rows.map((s) => ({
    id: s.id,
    name: s.name,
    createdAt: s.createdAt,
    parts: links
      .filter((l) => l.setupId === s.id)
      .map((l) => byId.get(l.ownedHardwareId))
      .filter((p): p is Part => !!p)
      .sort((a, b) => kindOrder(a) - kindOrder(b)),
  }));
}

/** Everything the Setup tab shows: parts grouped by kind, and the setups. */
export async function getSetupTab(): Promise<{
  parts: Record<HardwareKind, Part[]>;
  setups: SetupSummary[];
}> {
  const { householdId } = await requireHousehold();
  const parts = await partsOf(householdId);
  const grouped: Record<HardwareKind, Part[]> = { machine: [], grinder: [], basket: [] };
  for (const p of parts) grouped[p.kind].push(p);
  for (const kind of PART_KINDS) {
    grouped[kind].sort(
      (a, b) =>
        collator.compare(a.maker, b.maker) ||
        collator.compare(a.model, b.model) ||
        a.createdAt.getTime() - b.createdAt.getTime(),
    );
  }
  const list = await setupsOf(householdId, parts);
  list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return { parts: grouped, setups: list };
}

/** One part, with the household's setups it's in (AC 5). */
export async function getPart(id: string): Promise<Part & { capabilities: unknown; setups: SetupSummary[] }> {
  const { householdId } = await requireHousehold();
  await assertOwned("ownedHardware", id, householdId);
  const [part] = await partsOf(householdId, [id]);
  const [{ capabilities }] = await db
    .select({ capabilities: canonicalHardware.capabilities })
    .from(canonicalHardware)
    .where(eq(canonicalHardware.id, part.hardwareId));
  const all = await setupsOf(householdId, await partsOf(householdId));
  return { ...part, capabilities, setups: all.filter((s) => s.parts.some((p) => p.id === id)) };
}

export type PartModel = {
  id: string;
  kind: HardwareKind;
  model: string;
  maker: string;
  capabilities: unknown;
};

/** A model the household can see, followed to its merge survivor. */
async function visibleModel(householdId: string, hardwareId: string) {
  const id = await resolveEntity(db, canonicalHardware, hardwareId);
  if (!id) return null;
  const [row] = await db
    .select({
      id: canonicalHardware.id,
      kind: canonicalHardware.kind,
      model: canonicalHardware.name,
      maker: hardwareMakers.name,
      capabilities: canonicalHardware.capabilities,
      status: canonicalHardware.status,
      owner: canonicalHardware.createdByHouseholdId,
    })
    .from(canonicalHardware)
    .innerJoin(hardwareMakers, eq(hardwareMakers.id, canonicalHardware.makerId))
    .where(eq(canonicalHardware.id, id));
  if (!row || !(row.status === "verified" || row.owner === householdId)) return null;
  if (!PART_KINDS.includes(row.kind)) return null;
  return { id: row.id, kind: row.kind, model: row.model, maker: row.maker, capabilities: row.capabilities };
}

/** The model picked for a new part, for SCR-UNIT-ADD; null if it can't be used. */
export async function getPartModel(hardwareId: string): Promise<PartModel | null> {
  const { householdId } = await requireHousehold();
  return visibleModel(householdId, hardwareId);
}

/**
 * Adds a part from a catalog model (AC 1, AC 2, AC 4). The model must be
 * visible to the household (verified or its own addition) and of one of the
 * three kinds; a merged model is stored as its survivor. Never touches a
 * setup (STORY-01-02-08).
 */
export async function addPart(input: {
  hardwareId: string;
  nickname?: string | null;
  acquiredAt?: Date | null;
}): Promise<{ id: string; kind: HardwareKind }> {
  const { householdId } = await requireHousehold();
  const model = await visibleModel(householdId, input.hardwareId);
  if (!model) throw new NotFoundError();

  const nickname = input.nickname?.trim().slice(0, 60) || null;
  const id = newId();
  await db.insert(ownedHardware).values({
    id,
    householdId,
    hardwareId: model.id,
    nickname,
    acquiredAt: input.acquiredAt ?? null,
    createdAt: new Date(),
  });
  return { id, kind: model.kind };
}
