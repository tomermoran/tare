/*
 * Re-dial state for a maintenance event (TD-7, STORY-04-03-04): derived,
 * never stored. A recalibrating grinder event waits for a re-dial while a
 * recipe was pinned before it and no shift is set; a stored shift (or
 * stretch) is a confirmed mapping, a shift of 0 with no stretch is "no
 * adjustment" (declined or removed, DQ-42d).
 */

export type RedialState = "awaiting" | "confirmed" | "noAdjustment" | "nothingToMap" | "notRecalibration";

export type RedialEvent = {
  isGrinder: boolean;
  isRecalibration: boolean;
  grindShift: number | null;
  grindScale: number | null;
};

/** Whether a mapping is stored, and whether it changes anything. */
export function storedMapping(e: Pick<RedialEvent, "grindShift" | "grindScale">): "none" | "zero" | "set" {
  if (e.grindShift === null && e.grindScale === null) return "none";
  return (e.grindShift ?? 0) === 0 && (e.grindScale ?? 1) === 1 ? "zero" : "set";
}

export function redialState(e: RedialEvent, hasRecipeBefore: boolean): RedialState {
  if (!e.isGrinder || !e.isRecalibration) return "notRecalibration";
  const stored = storedMapping(e);
  if (stored === "set") return "confirmed";
  if (stored === "zero") return "noAdjustment";
  return hasRecipeBefore ? "awaiting" : "nothingToMap";
}

/** "Before" the event: pinned earlier than it, so a pin earlier today counts for an event logged today (AC 5). */
export const pinnedBefore = (pinnedAt: Date, eventAt: Date) => pinnedAt.getTime() < eventAt.getTime();
