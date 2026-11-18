import { describe, expect, it } from "vitest";
import { fitOffset, stretchFactor, stretchPercent } from "./offsetFit";

describe("fitOffset (STORY-04-04-01)", () => {
  it("is a plain shift with one re-dial (AC 2)", () => {
    expect(fitOffset([{ old: 15, new: 12 }], 1)).toEqual({ shift: -3, stretchPercent: 0, shiftAlone: -3, uncertain: false, tooClose: false, coffees: 1 });
  });

  it("fits two exact points: each step 10% larger, then a shift (AC 1)", () => {
    // new = old x 1.1 - 3
    const f = fitOffset([{ old: 10, new: 8 }, { old: 30, new: 30 }], 0.5);
    expect(f).toMatchObject({ stretchPercent: 10, shift: -3, uncertain: false, coffees: 2 });
  });

  it("fits three or more with a little noise, and counts them", () => {
    const f = fitOffset([{ old: 10, new: 8.1 }, { old: 20, new: 18.9 }, { old: 30, new: 30.1 }], 0.5);
    expect(f).toMatchObject({ stretchPercent: 10, coffees: 3, uncertain: false });
  });

  it("flags re-dials that disagree as a guess, values still given (AC 3)", () => {
    const f = fitOffset([{ old: 10, new: 6 }, { old: 20, new: 25 }, { old: 30, new: 26 }], 0.5);
    expect(f.uncertain).toBe(true);
    expect(Number.isFinite(f.shift)).toBe(true);
  });

  it("flags a stretch beyond the wheel's ±30% as a guess, limited", () => {
    const f = fitOffset([{ old: 10, new: 5 }, { old: 20, new: 25 }], 1);
    expect(f).toMatchObject({ stretchPercent: 30, uncertain: true });
  });

  it("keeps no stretch when the old grinds are within two steps (AC 4)", () => {
    expect(fitOffset([{ old: 15, new: 12 }, { old: 15.5, new: 12.5 }], 0.5)).toMatchObject({ stretchPercent: 0, tooClose: true, shift: -3 });
  });

  it("stores percent as a factor and back", () => {
    expect(stretchFactor(10)).toBe(1.1);
    expect(stretchFactor(-30)).toBe(0.7);
    expect(stretchPercent(1.1)).toBe(10);
    expect(stretchPercent(null)).toBe(0);
  });
});
