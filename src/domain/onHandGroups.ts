import type { PortionState } from "./portionState";

/*
 * On hand, grouped by state (STORY-03-02-05). A bag appears once, in the
 * first group it qualifies for: open (any open portion), unopened (none
 * open, at least one on the counter sealed), frozen (all left are in the
 * freezer). Calculated, never stored. Empty groups are left out (AC 5).
 */

export const PANTRY_GROUPS = ["open", "unopened", "frozen"] as const;
export type PantryGroup = (typeof PANTRY_GROUPS)[number];

/** What pantryOrder compares: a portion, or a whole bag by its best portion. */
export type PantryItem = {
  group: PantryGroup;
  /** When it became open; set for the open group only. */
  openSince: Date | null;
  /** When the bag was added. */
  addedAt: Date;
};

/** The group a portion counts in; null once finished. */
export function pantryGroup(p: { state: PortionState; openSince: Date | null }): PantryGroup | null {
  if (p.state === "finished") return null;
  if (p.state === "frozen") return "frozen";
  return p.openSince ? "open" : "unopened";
}

/**
 * The one pantry order, shared by On hand and the log's coffee options, so
 * the first open bag is the one a one-tap pull uses (AC 1): open by when it
 * opened, earliest first; then unopened, newest bag first; then frozen,
 * newest bag first.
 */
export function pantryOrder(a: PantryItem, b: PantryItem): number {
  const rank = PANTRY_GROUPS.indexOf(a.group) - PANTRY_GROUPS.indexOf(b.group);
  if (rank) return rank;
  if (a.group === "open") {
    const opened = a.openSince!.getTime() - b.openSince!.getTime();
    if (opened) return opened;
  }
  return b.addedAt.getTime() - a.addedAt.getTime();
}

type Bag<P> = { createdAt: Date; portions: P[] };
type Portion = { state: PortionState; openSince: Date | null };

/** A bag's place: its best group and, when open, its earliest opening. */
export function bagPantryItem<P extends Portion>(bag: Bag<P>): PantryItem | null {
  const items = bag.portions
    .map((p) => ({ group: pantryGroup(p), openSince: p.openSince, addedAt: bag.createdAt }))
    .filter((i): i is PantryItem => i.group !== null)
    .sort(pantryOrder);
  return items[0] ?? null;
}

/** Bags in their groups, in order; finished bags and empty groups left out. */
export function groupOnHand<P extends Portion, B extends Bag<P>>(bags: B[]): { group: PantryGroup; bags: B[] }[] {
  const placed = bags
    .map((bag) => ({ bag, item: bagPantryItem(bag) }))
    .filter((b): b is { bag: B; item: PantryItem } => b.item !== null)
    .sort((a, b) => pantryOrder(a.item, b.item));
  return PANTRY_GROUPS.map((group) => ({ group, bags: placed.filter((b) => b.item.group === group).map((b) => b.bag) })).filter(
    (g) => g.bags.length > 0,
  );
}
