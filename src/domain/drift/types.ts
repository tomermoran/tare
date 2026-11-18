/* The drift engine's input, all worked out by the reader beforehand (TD-3). */

export type DriftPrep = { wdt: boolean; puckScreen: boolean };

/** A shot of the coffee on a setup with the grinder, in the current period. */
export type DriftShot = {
  id: string;
  at: Date;
  entryMode: "measured" | "one-tap";
  reaction: "good" | "off" | null;
  personaId: string;
  setupId: string;
  drinkTypeId: string;
  batchId: string;
  grind: number;
  timeMs: number;
  prep: DriftPrep;
  /** The roasting clock's days when the shot was pulled; null when the bag's age isn't known. */
  roastDays: number | null;
  /** The opened clock's days then; null when unopened or frozen. */
  openedDays: number | null;
};

/** A pinned recipe for the coffee, any persona. `grind` already has servicing applied (TD-2, TD-5). */
export type DriftPin = {
  id: string;
  personaId: string;
  setupId: string;
  drinkTypeId: string;
  /** Null for the coffee's recipe; set for a bag's own. */
  batchId: string | null;
  pinnedAt: Date;
  removedAt: Date | null;
  grind: number;
  timeMs: number;
  prep: DriftPrep;
};
