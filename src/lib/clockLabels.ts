import type { OpenedClock } from "@/domain/openedClock";
import type { RoastingClock } from "@/domain/roastingClock";

/*
 * The two freshness clocks in words (EPIC-03-03), one way everywhere: Beans,
 * the bag, Brew and the log. Each kind of date is worded differently, so a
 * packing date never reads as a roast date and best-before is never an age.
 * No colour: these are facts, not warnings.
 */

type Translate = {
  (key: "bag.daysSinceRoast" | "bag.daysSincePacked" | "bag.bestBeforeIn" | "bag.bestBeforePassed", values: { days: number }): string;
  (key: "bag.ageUnknown" | "portion.agePaused"): string;
  (key: "portion.openFor", values: { days: number }): string;
};

/** The since-roasting clock, or what's known instead (STORY-03-03-01). */
export function roastingClockLabel(t: Translate, clock: RoastingClock): string {
  switch (clock.kind) {
    case "roasted":
      return t("bag.daysSinceRoast", { days: clock.days });
    case "packed":
      return t("bag.daysSincePacked", { days: clock.days });
    case "bestBefore":
      return clock.daysLeft >= 0 ? t("bag.bestBeforeIn", { days: clock.daysLeft }) : t("bag.bestBeforePassed", { days: -clock.daysLeft });
    case "unknown":
      return t("bag.ageUnknown");
  }
}

/** How long a portion has been open (STORY-03-03-04); paused in the freezer; nothing when never opened. */
export function openedClockLabel(t: Translate, clock: OpenedClock): string | null {
  switch (clock.kind) {
    case "open":
      return t("portion.openFor", { days: clock.days });
    case "paused":
      return t("portion.agePaused");
    case "notOpened":
      return null;
  }
}
