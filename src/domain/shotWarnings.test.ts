import { describe, expect, it } from "vitest";
import { shotWarnings } from "./shotWarnings";
import { TASTE_TAGS } from "./taste";

describe("shotWarnings (STORY-01-05-04)", () => {
  it("warns for channelling seen", () => {
    expect(shotWarnings(["channelling"])).toEqual(["channelling"]);
    expect(shotWarnings(["flat", "channelling", "burnt"])).toEqual(["channelling"]);
  });

  it("never warns for any other tag, nor without tags (AC 4)", () => {
    for (const tag of TASTE_TAGS.filter((t) => t !== "channelling")) expect(shotWarnings([tag])).toEqual([]);
    expect(shotWarnings(["sourAndBitter", "dryFinish"])).toEqual([]);
    expect(shotWarnings([])).toEqual([]);
    expect(shotWarnings(null)).toEqual([]);
  });
});
