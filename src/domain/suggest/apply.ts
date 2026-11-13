import type { BrewValues } from "../brewControls";
import type { Prep } from "../prep";
import type { Change } from "./types";

/*
 * A suggested change made on the next shot's starting values (design
 * "Pre-fill"): the log opens with it applied and the changed tab shows what
 * it was. Nothing is stored until that shot is saved. A change without
 * numbers (grind direction or temperature not known) leaves the values as
 * they are; the note still says what to change.
 */

export type StartValues = {
  grind: number;
  dose: number;
  yield: number;
  timeMs: number;
  brew: BrewValues;
  prep: Prep;
  milkMl: number | null;
};

export function applyChange(start: StartValues, change: Change | null): StartValues {
  if (!change) return start;
  switch (change.lever) {
    case "prep":
      if (change.tool === "checkDistribution") return start;
      return { ...start, prep: { ...start.prep, [change.tool]: true } };
    case "grind":
      return change.to === null ? start : { ...start, grind: change.to };
    case "yield":
      return { ...start, yield: change.to };
    case "dose":
      return { ...start, dose: change.to };
    case "milk":
      return start.milkMl === null ? start : { ...start, milkMl: change.to };
    case "temperature":
      // Only a temperature the shot recorded in degrees moves.
      if (change.to === null || start.brew.brewTempC === null) return start;
      return { ...start, brew: { ...start.brew, brewTempC: start.brew.brewTempC + (change.to - (change.from ?? change.to)) } };
  }
}
