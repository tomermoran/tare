import { describe, expect, it } from "vitest";
import { isTasteTag, PREP_TAGS, TASTE_TAGS } from "./taste";
import { InvalidTastingError, tastingColumns } from "./tasting";

describe("taste tags (TASK-01-05-03-BE1)", () => {
  it("are the six observations", () => {
    expect(TASTE_TAGS).toEqual(["sourAndBitter", "dryFinish", "flat", "burnt", "littleCrema", "channelling"]);
    expect(isTasteTag("burnt")).toBe(true);
    expect(isTasteTag("ranFast")).toBe(false);
    expect(isTasteTag(3)).toBe(false);
  });

  it("point to puck prep for channelling signs only", () => {
    expect([...PREP_TAGS].sort()).toEqual(["channelling", "dryFinish", "sourAndBitter"]);
  });
});

describe("tastingColumns", () => {
  it("writes only what was given (STORY-01-05-02 AC 3)", () => {
    expect(tastingColumns({}, "measured")).toEqual({});
    expect(tastingColumns({ rating: 4, balance: 0 }, "measured")).toEqual({ userRating: 4, tasteBalance: 0 });
  });

  it("keeps the full ranges and clears with null", () => {
    expect(tastingColumns({ balance: -2, strength: 2, body: 1, sweetness: -2, rating: null }, "measured")).toEqual({
      tasteBalance: -2,
      tasteStrength: 2,
      tasteBody: 1,
      tasteSweetness: -2,
      userRating: null,
    });
  });

  it.each([
    [{ rating: 0 }],
    [{ rating: 6 }],
    [{ rating: 3.5 }],
    [{ balance: 3 }],
    [{ body: -3 }],
    [{ strength: 0.5 }],
    [{ sweetness: 1 }],
    [{ tags: ["ranFast"] }],
  ])("rejects %j", (tasting) => {
    expect(() => tastingColumns(tasting as never, "measured")).toThrow(InvalidTastingError);
  });

  it("never rates a one-tap shot, but takes its answers (DQ-23)", () => {
    expect(() => tastingColumns({ rating: 4 }, "one-tap")).toThrow(InvalidTastingError);
    expect(tastingColumns({ balance: 1, tags: ["burnt"] }, "one-tap")).toEqual({ tasteBalance: 1, tasteTags: ["burnt"] });
  });

  it("stores tags once each, in list order, and none as empty", () => {
    expect(tastingColumns({ tags: ["channelling", "flat", "channelling"] }, "measured")).toEqual({ tasteTags: ["flat", "channelling"] });
    expect(tastingColumns({ tags: [] }, "measured")).toEqual({ tasteTags: [] });
  });
});
