import type { PortionState } from "./portionState";

/*
 * What can be done to a portion in each state (EPIC-03-02, SH-PORTION-ACTIONS).
 * One freeze and one thaw per portion, so a thawed portion can't be frozen
 * again. Dates are set once, through their action, and can be back-dated
 * then; nothing changes a date already set (review M4).
 */

export const PORTION_ACTIONS = ["open", "freeze", "thaw", "finish", "weigh", "split"] as const;
export type PortionAction = (typeof PORTION_ACTIONS)[number];

/** The dated actions, which go through SH-DATE. */
export type DatedAction = Extract<PortionAction, "open" | "freeze" | "thaw" | "finish">;
export const DATED_ACTIONS: readonly DatedAction[] = ["open", "freeze", "thaw", "finish"];

const ALLOWED: Record<PortionState, readonly PortionAction[]> = {
  unopened: ["open", "freeze", "split"],
  counter: ["weigh", "split", "freeze", "finish"],
  frozen: ["thaw", "split"],
  thawed: ["open", "weigh", "finish"],
  finished: [],
};

export function allowedActions(state: PortionState): readonly PortionAction[] {
  return ALLOWED[state];
}

export function isDatedAction(action: PortionAction): action is DatedAction {
  return (DATED_ACTIONS as readonly string[]).includes(action);
}
