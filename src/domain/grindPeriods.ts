/*
 * A grinder's current grind period (STORY-04-01-03, PEC-06): it starts at
 * the latest grinder maintenance at or before now. Shots either side of an
 * event aren't directly comparable. Derived from dates, never stored, so a
 * back-dated event moves the start and changes no shot.
 */

export function currentPeriodStart(events: readonly { at: Date }[], now: Date): Date | null {
  let start: Date | null = null;
  for (const e of events) {
    if (e.at.getTime() > now.getTime()) continue;
    if (!start || e.at.getTime() > start.getTime()) start = e.at;
  }
  return start;
}
