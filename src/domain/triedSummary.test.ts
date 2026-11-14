import { describe, expect, it } from "vitest";
import { triedSummary, type TriedShot } from "./triedSummary";

const rated = (...ratings: number[]): TriedShot[] => ratings.map((rating) => ({ rating, reaction: null }));
const reacted = (...reactions: ("good" | "off")[]): TriedShot[] => reactions.map((reaction) => ({ rating: null, reaction }));

describe("triedSummary (STORY-03-06-02)", () => {
  it.each([
    [[5, 4, 3], "mostlyGood"],
    [[4, 4, 1, 2, 5], "mostlyGood"],
    [[1, 2, 3], "mostlyOff"],
    [[3, 3, 3], "mixed"],
    // Ties are mixed: two good and two off of four.
    [[5, 4, 1, 2], "mixed"],
    // Exactly half good is not most.
    [[5, 4, 3, 3], "mixed"],
  ])("three or more ratings %j are %s (AC 1)", (ratings, kind) => {
    expect(triedSummary(rated(...ratings))).toEqual({ kind });
  });

  it("says the newest rating with one or two (AC 2)", () => {
    expect(triedSummary(rated(4))).toEqual({ kind: "lastRated", rating: 4 });
    expect(triedSummary(rated(2, 5))).toEqual({ kind: "lastRated", rating: 2 });
  });

  it("ignores reactions once there are ratings", () => {
    expect(triedSummary([...reacted("off", "off", "off"), ...rated(5)])).toEqual({ kind: "lastRated", rating: 5 });
  });

  it("goes by reactions with no ratings (AC 3)", () => {
    expect(triedSummary(reacted("good"))).toEqual({ kind: "mostlyGood" });
    expect(triedSummary(reacted("good", "off", "off"))).toEqual({ kind: "mostlyOff" });
    expect(triedSummary(reacted("good", "off"))).toEqual({ kind: "mixed" });
  });

  it("says no ratings yet with neither (AC 4)", () => {
    expect(triedSummary([{ rating: null, reaction: null }])).toEqual({ kind: "noRatings" });
    expect(triedSummary([])).toEqual({ kind: "noRatings" });
  });
});
