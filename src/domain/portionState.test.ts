import { describe, expect, it } from "vitest";
import { isOpen, openSince, portionState, type PortionDates } from "./portionState";

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
    ["frozen unopened, then thawed", { frozenAt: day(2), thawedAt: day(9) }, "thawed", false],
    ["frozen unopened, thawed, then opened", { frozenAt: day(2), thawedAt: day(9), openedAt: day(10) }, "thawed", true],
    ["thawed, then frozen again", { frozenAt: day(10), thawedAt: day(9) }, "frozen", false],
    ["thawed the same moment it froze", { frozenAt: day(5), thawedAt: day(5) }, "thawed", false],
    ["finished", { openedAt: day(2), finishedAt: day(8) }, "finished", false],
    ["finished while frozen", { frozenAt: day(3), finishedAt: day(8) }, "finished", false],
    ["finished after thawing", { frozenAt: day(3), thawedAt: day(6), finishedAt: day(8) }, "finished", false],
    ["finished without being opened", { finishedAt: day(8) }, "finished", false],
  ] as const)("%s", (_label, dates, state, open) => {
    expect(portionState(portion(dates))).toBe(state);
    expect(isOpen(portion(dates))).toBe(open);
  });
});

describe("openSince", () => {
  it("is when it was opened, on the counter", () => {
    expect(openSince(portion({ openedAt: day(2) }))).toEqual(day(2));
  });
  it("is the thaw, for a portion opened before freezing", () => {
    expect(openSince(portion({ openedAt: day(2), frozenAt: day(3), thawedAt: day(9) }))).toEqual(day(9));
  });
  it("is the opening, for a portion opened after thawing", () => {
    expect(openSince(portion({ frozenAt: day(2), thawedAt: day(9), openedAt: day(10) }))).toEqual(day(10));
  });
  it("is null while sealed, frozen or finished", () => {
    expect(openSince(portion({ frozenAt: day(2), thawedAt: day(9) }))).toBeNull();
    expect(openSince(portion({ openedAt: day(2), frozenAt: day(3) }))).toBeNull();
    expect(openSince(portion({ openedAt: day(2), finishedAt: day(3) }))).toBeNull();
  });
});
