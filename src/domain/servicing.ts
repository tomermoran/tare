/*
 * Servicing on read (TD-5, STORY-04-03-03): a recipe pinned before a
 * confirmed grinder event reads as `grind x scale + shift`, each event after
 * the pin in date order. Stored recipes are never rewritten. Events before
 * the pin, unconfirmed or with no change are skipped; a back-dated event
 * slots into its date place because order is by date, never by entry.
 */

export type ServicingEvent = { id: string; at: Date; grindShift: number | null; grindScale: number | null };
/** One event's change to a grind; `scale` is its stretch factor, 1 for a shift alone (EPIC-04-04). */
export type ServicingStep = { eventId: string; at: Date; from: number; to: number; scale: number };

const tidy = (n: number) => Number(n.toFixed(6));

export function applyServicing(
  grind: number,
  pinnedAt: Date,
  events: readonly ServicingEvent[],
): { grind: number; steps: ServicingStep[] } {
  const after = events
    .filter((e) => e.at.getTime() > pinnedAt.getTime() && (e.grindShift !== null || e.grindScale !== null))
    .sort((a, b) => a.at.getTime() - b.at.getTime() || (a.id < b.id ? -1 : 1));
  const steps: ServicingStep[] = [];
  let g = grind;
  for (const e of after) {
    const to = tidy(g * (e.grindScale ?? 1) + (e.grindShift ?? 0));
    if (to !== g) steps.push({ eventId: e.id, at: e.at, from: g, to, scale: e.grindScale ?? 1 });
    g = to;
  }
  return { grind: g, steps };
}
