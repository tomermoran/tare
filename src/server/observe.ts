import "server-only";

/*
 * Observability (R-28, STORY-04-02-09 AC 3): one function writing one
 * structured line per event. Counts and outcomes only, never an ID of a
 * person or a value from their profile. The single place to swap in a real
 * observability tool.
 */

export type DriftOutcomeEvent = {
  outcome: "applied" | "none" | "limited" | "failed";
  /** Why nothing was shown, or what failed; a code, never free text from the user. */
  reason?: "tooFew" | "subStep" | "noSignal" | "noGrinder" | "error";
  measured?: number;
  people?: number;
  leftOut?: number;
};

export function observe(event: "drift.outcome", fields: DriftOutcomeEvent): void {
  console.info(JSON.stringify({ event, ...fields }));
}
