import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { drinkLabel } from "./drinkName";

/*
 * A renamed drink shows its name everywhere (STORY-02-05-01 AC 1): every
 * screen that names a drink goes through drinkLabel, which puts a stored
 * name before the translated key.
 */

const SCREENS = {
  Brew: "src/app/(app)/page.tsx",
  "the shot log": "src/app/(task)/log/page.tsx",
  "the Journal": "src/components/journal/JournalList.tsx",
  "a shot's detail": "src/app/(app)/journal/[shotId]/page.tsx",
  "the tasting screen": "src/app/(task)/taste/[shotId]/page.tsx",
  "recipe rows": "src/app/(app)/beans/recipeRows.ts",
};

describe("drink names on every screen", () => {
  it.each(Object.entries(SCREENS))("%s names drinks with drinkLabel", (_, file) => {
    expect(readFileSync(file, "utf8")).toMatch(/drinkLabel\(/);
  });

  it("puts a stored name first, in any language", () => {
    const anyLanguage = () => "Café latte";
    expect(drinkLabel({ name: "Morning latte", nameKey: "drinks.latte" }, anyLanguage)).toBe("Morning latte");
    expect(drinkLabel({ name: null, nameKey: "drinks.latte" }, anyLanguage)).toBe("Café latte");
  });
});
