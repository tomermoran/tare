/*
 * One name rule for the household's lists: drinks, milks and, later,
 * profiles (STORY-02-05-01 AC 3, DQ-38). A name is trimmed, 1 to 40
 * characters, and unique ignoring case against every item of the list,
 * hidden ones included. A starter item is compared by the name it shows
 * (its translated name unless renamed), which the caller resolves.
 */

export const LIST_NAME_MAX = 40;

export type ListNameProblem = "required" | "taken";

export class ListNameError extends Error {
  constructor(readonly problem: ListNameProblem) {
    super(`List name ${problem}`);
    this.name = "ListNameError";
  }
}

const fold = (s: string) => s.trim().toLocaleLowerCase();

/**
 * The name to store, or a ListNameError. `others` are the list's items as
 * shown, the item being renamed left out. Over 40 characters can't be typed
 * (the field stops at 40), so it is refused as a plain error.
 */
export function checkListName(name: string, others: readonly string[]): string {
  const trimmed = name.trim();
  if (!trimmed) throw new ListNameError("required");
  if (trimmed.length > LIST_NAME_MAX) throw new Error("List name too long");
  if (others.some((o) => fold(o) === fold(trimmed))) throw new ListNameError("taken");
  return trimmed;
}
