import "server-only";
import { and, asc, eq, max, ne } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { milkTypes } from "@/db/schema";
import { checkListName, ListNameError } from "@/domain/listName";
import type { NamedMilk } from "@/domain/milkName";
import { KeepOneError } from "./drinks";
import { assertOwned, NotFoundError, requireHousehold } from "./scope";

/*
 * The household's milk list (STORY-02-05-05), the drinks list's twin:
 * rename, hide (one stays shown), add with its kind, move. Shots and
 * recipes refer to a milk by ID, so none of this touches them. There is no
 * delete: hiding is how a milk leaves the choosers (AC 5). The kind is
 * written once, when a milk is added.
 */

export const MILK_KINDS = ["dairy", "plant"] as const;
export type MilkKind = (typeof MILK_KINDS)[number];

export type ListMilk = NamedMilk & { id: string; kind: MilkKind; hidden: boolean };

/** How a milk is shown, for the name rule: the translated name of a starter unless renamed. */
export type MilkLabeler = (milk: NamedMilk) => string;

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

const asKind = (k: string): MilkKind => (k === "plant" ? "plant" : "dairy");

function rows(q: Tx | typeof db, householdId: string): Promise<ListMilk[]> {
  return q
    .select({ id: milkTypes.id, name: milkTypes.name, nameKey: milkTypes.nameKey, kind: milkTypes.kind, hidden: milkTypes.hidden })
    .from(milkTypes)
    .where(eq(milkTypes.householdId, householdId))
    .orderBy(asc(milkTypes.sortOrder), asc(milkTypes.id))
    .then((list) => list.map((m) => ({ ...m, kind: asKind(m.kind), hidden: m.hidden === true })));
}

/** The whole list, hidden milks included, in order (SCR-MILKS). */
export async function listMilks(): Promise<ListMilk[]> {
  const { householdId } = await requireHousehold();
  return rows(db, householdId);
}

export type MilkChanges = {
  /** A new name; null returns a renamed starter milk to its translated name. */
  name?: string | null;
  hidden?: boolean;
};

/** Saves the milk sheet in one go, all or nothing. The kind can't be changed. */
export async function updateMilk(id: string, changes: MilkChanges, labelOf: MilkLabeler): Promise<void> {
  const { householdId } = await requireHousehold();
  await assertOwned("milkTypes", id, householdId);
  await db.transaction(async (tx) => {
    const list = await rows(tx, householdId);
    const milk = list.find((m) => m.id === id);
    if (!milk) throw new NotFoundError();
    const others = list.filter((m) => m.id !== id).map(labelOf);
    const set: Partial<typeof milkTypes.$inferInsert> = {};
    if (changes.name !== undefined) {
      if (changes.name === null) {
        if (!milk.nameKey) throw new ListNameError("required");
        checkListName(labelOf({ name: null, nameKey: milk.nameKey }), others);
        set.name = null;
      } else {
        set.name = checkListName(changes.name, others);
      }
    }
    if (changes.hidden !== undefined) {
      if (changes.hidden && !milk.hidden && !list.some((m) => m.id !== id && !m.hidden)) throw new KeepOneError();
      set.hidden = changes.hidden;
    }
    if (Object.keys(set).length) await tx.update(milkTypes).set(set).where(eq(milkTypes.id, id));
  });
}

export const renameMilk = (id: string, name: string | null, labelOf: MilkLabeler) => updateMilk(id, { name }, labelOf);
export const setMilkHidden = (id: string, hidden: boolean, labelOf: MilkLabeler) => updateMilk(id, { hidden }, labelOf);

/** A milk of the household's own: added last and shown, with its kind chosen here only. */
export async function addMilk(input: { name: string; kind: MilkKind }, labelOf: MilkLabeler): Promise<{ id: string }> {
  const { householdId } = await requireHousehold();
  if (!MILK_KINDS.includes(input.kind)) throw new Error("Unknown milk kind");
  const id = newId();
  await db.transaction(async (tx) => {
    const list = await rows(tx, householdId);
    const name = checkListName(input.name, list.map(labelOf));
    const [{ last }] = await tx.select({ last: max(milkTypes.sortOrder) }).from(milkTypes).where(eq(milkTypes.householdId, householdId));
    await tx.insert(milkTypes).values({ id, householdId, name, nameKey: null, kind: input.kind, hidden: false, sortOrder: (last ?? -1) + 1 });
  });
  return { id };
}

/** Moves a milk to `toIndex` in the whole list and renumbers densely (AC 4). */
export async function moveMilk(id: string, toIndex: number): Promise<void> {
  const { householdId } = await requireHousehold();
  await assertOwned("milkTypes", id, householdId);
  await db.transaction(async (tx) => {
    const list = await rows(tx, householdId);
    const from = list.findIndex((m) => m.id === id);
    if (from < 0) throw new NotFoundError();
    if (!Number.isInteger(toIndex) || toIndex < 0 || toIndex >= list.length) throw new RangeError("No such place");
    const [moved] = list.splice(from, 1);
    list.splice(toIndex, 0, moved);
    for (const [i, m] of list.entries()) {
      await tx.update(milkTypes).set({ sortOrder: i }).where(and(eq(milkTypes.id, m.id), ne(milkTypes.sortOrder, i)));
    }
  });
}
