import { describe, expect, it } from "vitest";
import { isOpen, portionState, type PortionDates } from "./portionState";

const day = (n: number) => new Date(Date.UTC(2026, 0, n));
const portion = (dates: Partial<PortionDates>): PortionDates => ({
  frozenAt: null,
  thawedAt: null,
  openedAt: null,
  finishedAt: null,
  ...dates,
});

describe("portionState", () => {
  it.each([
    ["no dates", {}, "unopened", false],
    ["opened", { openedAt: day(2) }, "counter", true],
    ["frozen unopened", { frozenAt: day(2) }, "frozen", false],
    ["opened then frozen", { openedAt: day(2), frozenAt: day(3) }, "frozen", false],
    ["opened, frozen, then thawed", { openedAt: day(2), frozenAt: day(3), thawedAt: day(9) }, "thawed", true],
    ["frozen unopened, then thawed", { frozenAt: day(2), thawedAt: day(9) }, "thawed", true],
    ["thawed, then frozen again", { frozenAt: day(10), thawedAt: day(9) }, "frozen", false],
    ["thawed the same moment it froze", { frozenAt: day(5), thawedAt: day(5) }, "thawed", true],
    ["finished", { openedAt: day(2), finishedAt: day(8) }, "finished", false],
    ["finished while frozen", { frozenAt: day(3), finishedAt: day(8) }, "finished", false],
    ["finished after thawing", { frozenAt: day(3), thawedAt: day(6), finishedAt: day(8) }, "finished", false],
    ["finished without being opened", { finishedAt: day(8) }, "finished", false],
  ] as const)("%s", (_label, dates, state, open) => {
    expect(portionState(portion(dates))).toBe(state);
    expect(isOpen(portion(dates))).toBe(open);
  });
});
