import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import messages from "@/i18n/messages/en.json";
import { openedClockLabel, roastingClockLabel } from "./clockLabels";

const t = createTranslator({ locale: "en", messages });

describe("roastingClockLabel (STORY-03-03-01)", () => {
  it.each([
    [{ kind: "roasted", days: 12, frozenDays: 0 }, "12 days since roast"],
    [{ kind: "roasted", days: 1, frozenDays: 4 }, "1 day since roast"],
    [{ kind: "roasted", days: 0, frozenDays: 0 }, "Roasted today"],
    [{ kind: "packed", days: 20, frozenDays: 0 }, "20 days since packing"],
    [{ kind: "bestBefore", daysLeft: 30, frozenDays: 0 }, "Best before in 30 days"],
    [{ kind: "bestBefore", daysLeft: 0, frozenDays: 0 }, "Best before today"],
    [{ kind: "bestBefore", daysLeft: -3, frozenDays: 0 }, "Best before passed 3 days ago"],
    [{ kind: "unknown" }, "Age unknown"],
  ] as const)("%o reads %s", (clock, words) => {
    expect(roastingClockLabel(t, clock)).toBe(words);
  });
});

describe("openedClockLabel (STORY-03-03-04)", () => {
  it("words open, paused and never opened", () => {
    expect(openedClockLabel(t, { kind: "open", days: 3 })).toBe("open 3 days");
    expect(openedClockLabel(t, { kind: "open", days: 0 })).toBe("opened today");
    expect(openedClockLabel(t, { kind: "paused" })).toBe("Paused in the freezer");
    expect(openedClockLabel(t, { kind: "notOpened" })).toBeNull();
  });
});
