import { describe, expect, it } from "vitest";
import { currentPeriodStart } from "./grindPeriods";
import { remainingWeight, totalRemaining } from "./remaining";

const d = (day: number) => new Date(Date.UTC(2026, 2, day, 12));

describe("remainingWeight (STORY-03-04-01)", () => {
  it("is the weight with no shots", () => {
    expect(remainingWeight({ weight: 250, latestCheck: null, doses: [] })).toEqual({ grams: 250, overLogged: false });
  });

  it("takes every dose off the weight (AC 1)", () => {
    expect(remainingWeight({ weight: 250, latestCheck: null, doses: [{ grams: 18, at: d(1) }, { grams: 18.5, at: d(2) }] })).toEqual({
      grams: 213.5,
      overLogged: false,
    });
  });

  it("starts from the latest check and takes only later doses (STORY-03-04-02 AC 1, AC 2)", () => {
    const doses = [{ grams: 18, at: d(1) }, { grams: 18, at: d(3) }, { grams: 17.5, at: d(5) }];
    expect(remainingWeight({ weight: 250, latestCheck: { grams: 150, at: d(4) }, doses })).toEqual({ grams: 132.5, overLogged: false });
  });

  it("never goes negative, and says it was over-logged (AC 4)", () => {
    expect(remainingWeight({ weight: 30, latestCheck: null, doses: [{ grams: 18, at: d(1) }, { grams: 18, at: d(2) }] })).toEqual({
      grams: 0,
      overLogged: true,
    });
    expect(remainingWeight({ weight: 36, latestCheck: null, doses: [{ grams: 18, at: d(1) }, { grams: 18, at: d(2) }] })).toEqual({
      grams: 0,
      overLogged: false,
    });
  });

  it("totals a bag's portions", () => {
    expect(totalRemaining([{ grams: 100.2, overLogged: false }, { grams: 0, overLogged: true }])).toEqual({ grams: 100.2, overLogged: true });
  });
});

describe("currentPeriodStart (STORY-04-01-03)", () => {
  it("has no start without events (AC 2)", () => {
    expect(currentPeriodStart([], d(10))).toBeNull();
  });

  it("starts at the latest event, back-dated or not, ignoring the future (AC 1, AC 3)", () => {
    expect(currentPeriodStart([{ at: d(2) }, { at: d(7) }, { at: d(4) }], d(10))).toEqual(d(7));
    expect(currentPeriodStart([{ at: d(2) }, { at: d(12) }], d(10))).toEqual(d(2));
  });
});
