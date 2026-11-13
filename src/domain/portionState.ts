/**
 * Where a portion is, calculated from its dates only (S-08 stores no status).
 * Precedence: finished, then frozen, then thawed, then on the counter, then
 * unopened. A portion opened and then frozen counts as frozen, not open;
 * thawing makes it open again, if it had been opened.
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
 * When a portion became open, or null while it isn't (spec S-02: "open means
 * opened, not finished and not in the freezer"). On the counter, that's when
 * it was opened. Thawed, it's open only once it has been opened, before the
 * freeze or after the thaw, and open since the later of the two: a sealed
 * portion that thawed is still unopened (STORY-03-02-05 AC 2).
 */
export function openSince(p: PortionDates): Date | null {
  const state = portionState(p);
  if (state === "counter") return p.openedAt;
  if (state === "thawed" && p.openedAt) return p.openedAt > p.thawedAt! ? p.openedAt : p.thawedAt;
  return null;
}

/**
 * The one definition of "open" for the whole app (review M5): opened, not
 * finished, not in the freezer. Brew, the bag-ready check and the beans list
 * all use this, never their own date checks.
 */
export function isOpen(p: PortionDates): boolean {
  return openSince(p) !== null;
}
