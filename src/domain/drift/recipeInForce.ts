import type { DriftPin, DriftShot } from "./types";

/*
 * Which recipe a shot was brewed from (TD-2, DQ-45): among the pins for its
 * persona, setup and drink pinned at or before the shot, the newest; a pin
 * for the shot's own bag wins, even if that bag recipe was removed later.
 * Null when nothing was pinned before it: the shot is left out, counted.
 */
export function recipeInForce(shot: Pick<DriftShot, "at" | "personaId" | "setupId" | "drinkTypeId" | "batchId">, pins: readonly DriftPin[]): DriftPin | null {
  const t = shot.at.getTime();
  const same = pins.filter(
    (p) => p.personaId === shot.personaId && p.setupId === shot.setupId && p.drinkTypeId === shot.drinkTypeId && p.pinnedAt.getTime() <= t,
  );
  const newest = (list: DriftPin[]) =>
    list.reduce<DriftPin | null>((best, p) => (!best || p.pinnedAt.getTime() > best.pinnedAt.getTime() || (p.pinnedAt.getTime() === best.pinnedAt.getTime() && p.id > best.id) ? p : best), null);
  const bag = newest(same.filter((p) => p.batchId === shot.batchId && (p.removedAt === null || p.removedAt.getTime() > t)));
  return bag ?? newest(same.filter((p) => p.batchId === null));
}
