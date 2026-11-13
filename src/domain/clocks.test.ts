import { describe, expect, it } from "vitest";
import { frozenDays, isFromFrozen } from "./frozen";
import { localNoon } from "./localDay";
import { openedClock } from "./openedClock";
import { roastingClock, type BagDates } from "./roastingClock";
import type { PortionDates } from "./portionState";

const TZ = "Europe/London";
/** Noon on a day of March 2026 (the clocks go forward on the 29th in London). */
const day = (n: number, hour = 12) => new Date(localNoon(`2026-03-${String(n).padStart(2, "0")}`, TZ).getTime() + (hour - 12) * 3_600_000);
const portion = (dates: Partial<PortionDates> = {}): PortionDates => ({ frozenAt: null, thawedAt: null, openedAt: null, finishedAt: null, ...dates });
const bag = (dates: Partial<BagDates>): BagDates => ({ roastDate: null, packedAt: null, bestBefore: null, ...dates });

describe("isFromFrozen", () => {
  const p = portion({ frozenAt: day(5), thawedAt: day(10) });
  it.each([
    ["before the freeze", day(4), p, false],
    ["while frozen", day(7), p, true],
    ["after the thaw", day(11), p, false],
    ["at the thaw", day(10), p, false],
    ["never frozen", day(7), portion(), false],
    ["still frozen", day(20), portion({ frozenAt: day(5) }), true],
    ["thawed the same day, before the shot", day(5, 18), portion({ frozenAt: day(5, 8), thawedAt: day(5, 9) }), false],
    ["thawed the same day, after the shot", day(5, 8), portion({ frozenAt: day(5, 7), thawedAt: day(5, 9) }), true],
  ] as const)("%s", (_label, at, dates, expected) => {
    expect(isFromFrozen(at, dates)).toBe(expected);
  });
});

describe("frozenDays", () => {
  it("counts to the thaw, or to now while frozen, in whole local days", () => {
    expect(frozenDays(portion({ frozenAt: day(5), thawedAt: day(10) }), day(20), TZ)).toBe(5);
    expect(frozenDays(portion({ frozenAt: day(5) }), day(20), TZ)).toBe(15);
    expect(frozenDays(portion({ frozenAt: day(5, 8), thawedAt: day(5, 20) }), day(20), TZ)).toBe(0);
    expect(frozenDays(portion(), day(20), TZ)).toBe(0);
  });
});

describe("roastingClock", () => {
  it("counts days since roast, less freezer days (STORY-03-03-01 AC 1)", () => {
    const clock = roastingClock(bag({ roastDate: day(1) }), portion({ frozenAt: day(5), thawedAt: day(10) }), day(20), TZ);
    expect(clock).toEqual({ kind: "roasted", days: 14, frozenDays: 5 });
  });

  it("uses the packing date when there's no roast date (AC 2)", () => {
    expect(roastingClock(bag({ packedAt: day(3), bestBefore: day(30) }), portion(), day(10), TZ)).toEqual({ kind: "packed", days: 7, frozenDays: 0 });
  });

  it("shows time left to best-before, negative once passed, and no age (AC 3)", () => {
    expect(roastingClock(bag({ bestBefore: day(25) }), null, day(10), TZ)).toEqual({ kind: "bestBefore", daysLeft: 15, frozenDays: 0 });
    expect(roastingClock(bag({ bestBefore: day(5) }), null, day(10), TZ)).toEqual({ kind: "bestBefore", daysLeft: -5, frozenDays: 0 });
  });

  it("is unknown with no dates (AC 4)", () => {
    expect(roastingClock(bag({}), portion(), day(10), TZ)).toEqual({ kind: "unknown" });
  });

  it("goes up by one when a day passes, at midnight not after 24 hours (AC 5)", () => {
    const b = bag({ roastDate: day(1) });
    expect(roastingClock(b, null, day(10, 23), TZ)).toMatchObject({ days: 9 });
    expect(roastingClock(b, null, day(11, 0.5), TZ)).toMatchObject({ days: 10 });
  });

  it("neither skips nor repeats a day across a DST change", () => {
    const b = bag({ roastDate: day(28) });
    expect(roastingClock(b, null, day(29), TZ)).toMatchObject({ days: 1 });
    expect(roastingClock(b, null, day(30), TZ)).toMatchObject({ days: 2 });
  });

  it("stays put while still frozen (STORY-03-03-02 AC 1)", () => {
    const frozen = portion({ frozenAt: day(11) });
    expect(roastingClock(bag({ roastDate: day(1) }), frozen, day(15), TZ)).toEqual({ kind: "roasted", days: 10, frozenDays: 4 });
    expect(roastingClock(bag({ roastDate: day(1) }), frozen, day(25), TZ)).toEqual({ kind: "roasted", days: 10, frozenDays: 14 });
  });

  it("differs between a frozen and a fresh portion of one bag (STORY-03-03-02 AC 3)", () => {
    const b = bag({ roastDate: day(1) });
    expect(roastingClock(b, portion({ frozenAt: day(5) }), day(20), TZ)).not.toEqual(roastingClock(b, portion(), day(20), TZ));
  });
});

describe("openedClock", () => {
  it("is 0 when opened today, and goes up at local midnight (AC 1, AC 5)", () => {
    const p = portion({ openedAt: day(10, 7) });
    expect(openedClock(p, day(10, 23), TZ)).toEqual({ kind: "open", days: 0 });
    expect(openedClock(p, day(11, 0.5), TZ)).toEqual({ kind: "open", days: 1 });
  });

  it("is not opened, with no clock, while unopened (AC 2)", () => {
    expect(openedClock(portion(), day(10), TZ)).toEqual({ kind: "notOpened" });
  });

  it("is paused in the freezer (STORY-03-03-02 AC 1)", () => {
    expect(openedClock(portion({ openedAt: day(1), frozenAt: day(4) }), day(10), TZ)).toEqual({ kind: "paused" });
  });

  it("resumes from where it paused after a thaw (STORY-03-03-02 AC 2)", () => {
    const p = portion({ openedAt: day(1), frozenAt: day(4), thawedAt: day(20) });
    expect(openedClock(p, day(20), TZ)).toEqual({ kind: "open", days: 3 });
    expect(openedClock(p, day(22), TZ)).toEqual({ kind: "open", days: 5 });
  });

  it("doesn't take off freezer time from before it was opened", () => {
    expect(openedClock(portion({ frozenAt: day(1), thawedAt: day(10), openedAt: day(12) }), day(15), TZ)).toEqual({ kind: "open", days: 3 });
  });

  it("stops on the day it was finished", () => {
    expect(openedClock(portion({ openedAt: day(1), finishedAt: day(8) }), day(20), TZ)).toEqual({ kind: "open", days: 7 });
  });

  it("counts across a DST change one day at a time", () => {
    const p = portion({ openedAt: day(28, 23) });
    expect(openedClock(p, day(29, 1), TZ)).toEqual({ kind: "open", days: 1 });
    expect(openedClock(p, day(30, 0.5), TZ)).toEqual({ kind: "open", days: 2 });
  });
});
