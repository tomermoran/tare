import { isOpen, portionState, type PortionDates } from "./portionState";

/*
 * A bag's status (STORY-03-04-03): finished when every portion is, open
 * when any portion is open (isOpen, so opened then frozen isn't), else none,
 * and its portions speak for themselves (AC 3). Calculated, never stored.
 */

export type BagStatus = "open" | "finished" | null;

export function bagStatus(portions: readonly PortionDates[]): BagStatus {
  if (portions.length && portions.every((p) => portionState(p) === "finished")) return "finished";
  return portions.some(isOpen) ? "open" : null;
}
