/*
 * The actions on a shot's page (STORY-02-06-03 AC 3), in order. A measured
 * shot leads with "pin as recipe"; a one-tap shot can't be pinned
 * (STORY-02-01-01 AC 5), so it leads with its reaction chips and edit is
 * its primary, with "dial in from this" last.
 */

export type ShotAction = "reaction" | "pin" | "dialIn" | "edit";

export function shotActions(entryMode: "measured" | "one-tap"): { actions: ShotAction[]; primary: ShotAction } {
  return entryMode === "measured"
    ? { actions: ["pin", "dialIn", "edit"], primary: "pin" }
    : { actions: ["reaction", "edit", "dialIn"], primary: "edit" };
}
