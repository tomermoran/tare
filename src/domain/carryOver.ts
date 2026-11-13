import { NO_BREW_VALUES, type BrewValues } from "./brewControls";

/*
 * What carries over between two setups (STORY-02-01-06 AC 3 to AC 5,
 * STORY-02-02-07 AC 4, DQ-20): dose, yield and time always do. Grind only
 * with the same grinder, since another grinder's numbers mean something
 * else; otherwise this grinder's last measured grind, else the middle of
 * its range. Temperature and pressure only with the same machine, else
 * unset. Prep and milk aren't tied to a part, so callers carry them as is.
 */

export type SetupPartIds = { grinderId: string | null; machineId: string | null };

export type CarriedValues = {
  grind: number;
  /** False when grind didn't carry over, so the user is told (AC 4). */
  grindCarried: boolean;
  brew: BrewValues;
};

/** Whether two setups share their grinder and their machine; two missing parts never match. */
export function sameParts(from: SetupPartIds, to: SetupPartIds): { grinder: boolean; machine: boolean } {
  return {
    grinder: from.grinderId !== null && from.grinderId === to.grinderId,
    machine: from.machineId !== null && from.machineId === to.machineId,
  };
}

export function carryOver({
  from,
  to,
  grind,
  brew,
  lastGrindOnGrinder,
  middleGrind,
}: {
  from: SetupPartIds;
  to: SetupPartIds;
  grind: number;
  brew: BrewValues;
  /** The new grinder's last measured grind, if any. */
  lastGrindOnGrinder: number | null;
  /** The middle of the new grinder's range. */
  middleGrind: number;
}): CarriedValues {
  const same = sameParts(from, to);
  return {
    grind: same.grinder ? grind : (lastGrindOnGrinder ?? middleGrind),
    grindCarried: same.grinder,
    brew: same.machine ? brew : NO_BREW_VALUES,
  };
}
