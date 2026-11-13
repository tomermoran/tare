import type { GrindScale } from "../capabilities";
import type { OpenedClock } from "../openedClock";
import type { Prep } from "../prep";
import type { RoastingClock } from "../roastingClock";
import type { TasteTag } from "../taste";
import type { TasteQuestion } from "../tastePhrase";

/*
 * What the suggestion engine reads and returns (STORY-02-03-05). It runs on
 * the device on every answer change and nothing it returns is stored.
 */

/** Just-right answers: -2..2 (sweetness -2..0), 0 just right, null unanswered. */
export type Answers = Record<TasteQuestion, number | null>;

export type SuggestInput = {
  shot: {
    grind: number;
    dose: number;
    yield: number;
    timeMs: number;
    /** °C as brewed, when the machine records it. */
    brewTempC: number | null;
    prep: Prep;
    milkMl: number | null;
    milkDrink: boolean;
  };
  answers: Answers;
  tags: TasteTag[];
  /** The recipe this shot was dialled in against, for time as a diagnostic. */
  recipe: { timeMs: number } | null;
  setup: {
    /** The grinder's scale; null or "unknown" direction gives finer/coarser only. */
    grind: GrindScale | null;
    /** Whether the machine can set its temperature. */
    temperature: boolean;
    /** The basket's dose range in grams; null when "not sure". */
    doseRange: { min: number; max: number } | null;
  };
  /**
   * The shot before this one on the same coffee, setup and drink, only when
   * it's in the grinder's current grind period (STORY-04-01-03): shots
   * across a recalibration aren't comparable. Tells whether a grind change
   * helped the balance.
   */
  previous: { grind: number; balance: number | null } | null;
  /** The portion's clocks (EPIC-03-03); absent until known. */
  clocks: { roasting: RoastingClock | null; opened: OpenedClock | null };
};

export type Lever = "prep" | "grind" | "yield" | "dose" | "temperature" | "milk";

/** One change for the next shot. Values are in the shot's units; none when only a direction is known. */
export type Change =
  | { lever: "prep"; tool: "wdt" | "puckScreen" | "checkDistribution" }
  /** `steps` on the grinder's own scale; dial values only when its direction is known. */
  | { lever: "grind"; direction: "finer" | "coarser"; steps: number; from: number | null; to: number | null }
  | { lever: "yield" | "dose" | "milk"; direction: "more" | "less"; from: number; to: number }
  /** Hotter or cooler; degrees only when the shot recorded its temperature. */
  | { lever: "temperature"; direction: "more" | "less"; from: number | null; to: number | null };

/** What the one-line reason is drawn from, in order. */
export type ReasonPart =
  | { kind: "answer"; question: TasteQuestion; value: number }
  | { kind: "tag"; tag: TasteTag }
  /** Ran fast or slow against the recipe: a diagnostic, never the change. */
  | { kind: "time"; ran: "fast" | "slow" };

export type Freshness = "veryFresh" | "pastPeakRoasted" | "pastPeakOpen";

export type Suggestion = {
  /** Exactly one change, or none (AC 2, AC 3). */
  change: Change | null;
  reason: ReasonPart[];
  /** An explanation only, never a change (AC 4). */
  freshness: Freshness | null;
};
