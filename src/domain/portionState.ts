/**
 * Where a portion is, calculated from its dates only (S-08 stores no status).
 * Precedence: finished, then frozen, then thawed, then on the counter, then
 * unopened. A portion opened and then frozen counts as frozen, not open;
 * thawing makes it usable, and so open, again.
 */
export type PortionState =
  | "finished"
  | "frozen"
  | "thawed"
  | "counter"
  | "unopened";

export type PortionDates = {
  frozenAt: Date | null;
  thawedAt: Date | null;
  openedAt: Date | null;
  finishedAt: Date | null;
};

export function portionState(p: PortionDates): PortionState {
  if (p.finishedAt) return "finished";
  if (p.frozenAt) {
    // Thawed only counts if it came after the latest freeze.
    const thawed = p.thawedAt && p.thawedAt >= p.frozenAt;
    return thawed ? "thawed" : "frozen";
  }
  if (p.openedAt) return "counter";
  return "unopened";
}

/**
 * The one definition of "open" for the whole app (review M5): opened or
 * thawed, not finished, not in the freezer. Brew, the bag-ready check and
 * the beans list all use this, never their own date checks.
 */
export function isOpen(p: PortionDates): boolean {
  const state = portionState(p);
  return state === "counter" || state === "thawed";
}
