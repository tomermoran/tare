import { describe, expect, it } from "vitest";
import { loggedShare, runOut, type RunOutInput, type RunOutPortion } from "./runOut";
import { inUnit, runOutSpan } from "./runOutSpan";

/*
 * The run-out rules (EPIC-03-05) against hand-worked households.
 */

const day = (n: number) => new Date(Date.UTC(2026, 0, 1 + n, 8));
let seq = 0;
const portion = (p: Partial<RunOutPortion> = {}): RunOutPortion => ({
  id: `p${++seq}`,
  weight: 250,
  frozenAt: null,
  thawedAt: null,
  openedAt: null,
  finishedAt: null,
  createdAt: day(0),
  purchasedAt: null,
  ...p,
});

/** Two 18 g doses a day on a portion, from `from` for `days` days. */
const twiceDaily = (portionId: string, from: number, days: number) =>
  Array.from({ length: days * 2 }, (_, i) => ({ portionId, grams: 18, at: new Date(day(from + Math.floor(i / 2)).getTime() + (i % 2) * 3_600_000) }));

/** Three 250 g portions used one after another, a week each, then one open. */
function steady(): RunOutInput {
  const done = [0, 7, 14].map((d) => portion({ openedAt: day(d), finishedAt: day(d + 7) }));
  const open = portion({ openedAt: day(21) });
  return {
    portions: [...done, open],
    doses: [...done.flatMap((p, i) => twiceDaily(p.id, i * 7, 6)), ...twiceDaily(open.id, 21, 2)],
    stockChecks: [],
    now: day(23),
  };
}

describe("the usage rate (STORY-03-05-01)", () => {
  it("is the finished portions' weight over the stretch they were used in (AC 1)", () => {
    const r = runOut(steady());
    // 750 g over 21 days is 250 g a week; 250 - 4 × 18 = 178 g left.
    expect(r).toMatchObject({ kind: "estimate", weeklyGrams: 250, finished: 3, weeks: 3, onHand: { grams: 178, frozenGrams: 0 } });
  });

  it("gives the same answer for the same inputs", () => {
    const input = steady();
    expect(runOut(input)).toEqual(runOut(input));
  });

  it("works for a quiet household with long gaps", () => {
    // Three 250 g bags over 15 weeks: 50 g a week.
    const done = [0, 35, 70].map((d) => portion({ openedAt: day(d), finishedAt: day(d + 35) }));
    const open = portion({ openedAt: day(105) });
    const r = runOut({ portions: [...done, open], doses: [{ portionId: open.id, grams: 15, at: day(106) }], stockChecks: [], now: day(110) });
    expect(r).toMatchObject({ kind: "estimate", weeklyGrams: 50, weeks: 15, onHand: { grams: 235 } });
  });

  it("works for a busy one with portions open at once", () => {
    // Two 1 kg bags and a 500 g one, overlapping, all used in 4 weeks: 625 g a week.
    const done = [
      portion({ weight: 1000, openedAt: day(0), finishedAt: day(20) }),
      portion({ weight: 1000, openedAt: day(5), finishedAt: day(28) }),
      portion({ weight: 500, openedAt: day(10), finishedAt: day(14) }),
    ];
    const r = runOut({ portions: [...done, portion({ openedAt: day(28) })], doses: [], stockChecks: [], now: day(29) });
    expect(r).toMatchObject({ kind: "estimate", weeklyGrams: 625, weeks: 4 });
  });

  it("counts one-tap shots like any other: the rate rests on finished weight, not on what was logged", () => {
    const input = steady();
    const fewer = { ...input, doses: input.doses.filter((_, i) => i % 3 === 0 || input.doses[i].portionId === input.portions[3].id) };
    expect(runOut(fewer)).toMatchObject({ kind: "estimate", weeklyGrams: 250 });
  });

  it("follows new finished portions (AC 3)", () => {
    const input = steady();
    const more = { ...input, portions: input.portions.map((p, i) => (i === 3 ? { ...p, finishedAt: day(24) } : p)).concat(portion()), now: day(24) };
    // 1000 g over 24 days.
    expect(runOut(more)).toMatchObject({ kind: "estimate", finished: 4, weeklyGrams: 291.7 });
  });

  it("is learning with fewer than three finished portions, and says how many so far (AC 2)", () => {
    const p = portion({ openedAt: day(0), finishedAt: day(7) });
    const r = runOut({ portions: [p, portion({ openedAt: day(7) })], doses: [{ portionId: p.id, grams: 18, at: day(1) }], stockChecks: [], now: day(8) });
    expect(r).toMatchObject({ kind: "learning", finished: 1, needed: 3, onHand: { grams: 250 } });
  });

  it("is learning for a household with no history yet, not stale", () => {
    expect(runOut({ portions: [portion()], doses: [], stockChecks: [], now: day(90) })).toMatchObject({ kind: "learning", finished: 0 });
  });

  it("is stale after a month with no brewing, so there's no line (AC 4)", () => {
    expect(runOut({ ...steady(), now: day(23 + 31) }).kind).toBe("stale");
    expect(runOut({ ...steady(), now: day(23 + 29) }).kind).toBe("estimate");
  });

  it("is nothing when nothing is on hand", () => {
    const input = steady();
    const used = { ...input, portions: input.portions.slice(0, 3) };
    expect(runOut(used)).toMatchObject({ kind: "nothing", onHand: { grams: 0 } });
  });

  it("rests on at least a week when a portion was finished the day it was opened", () => {
    const done = [0, 0, 0].map(() => portion({ weight: 100, openedAt: day(0), finishedAt: day(0) }));
    expect(runOut({ portions: [...done, portion()], doses: [], stockChecks: [], now: day(1) })).toMatchObject({ kind: "estimate", weeklyGrams: 300, weeks: 1 });
  });

  it("ignores a purchase date after the portion finished", () => {
    const done = [0, 7, 14].map((d) => portion({ purchasedAt: day(40), finishedAt: day(d + 7) }));
    // Starts clamp to each finish: 7 to 21 is two weeks for 750 g.
    expect(runOut({ portions: [...done, portion({ openedAt: day(21) })], doses: [], stockChecks: [], now: day(22) })).toMatchObject({
      kind: "estimate",
      weeklyGrams: 375,
    });
  });

  it("uses the purchase date for a finished portion never marked opened", () => {
    const done = [0, 7, 14].map((d) => portion({ purchasedAt: day(d), finishedAt: day(d + 7) }));
    expect(runOut({ portions: [...done, portion({ openedAt: day(21) })], doses: [], stockChecks: [], now: day(22) })).toMatchObject({ weeklyGrams: 250 });
  });

  it("takes on hand from a stock check after the last dose", () => {
    const input = steady();
    const open = input.portions[3];
    const r = runOut({ ...input, stockChecks: [{ portionId: open.id, grams: 120, at: day(23) }] });
    expect(r.onHand.grams).toBe(120);
  });

  it("counts frozen coffee on hand, and a thawed portion as not frozen", () => {
    const input = steady();
    const frozen = portion({ weight: 200, frozenAt: day(2) });
    const thawed = portion({ weight: 100, frozenAt: day(2), thawedAt: day(20) });
    expect(runOut({ ...input, portions: [...input.portions, frozen, thawed] }).onHand).toEqual({ grams: 478, frozenGrams: 200 });
  });

  it("treats a zero rate as stale", () => {
    const done = [0, 7, 14].map((d) => portion({ weight: 0, openedAt: day(d), finishedAt: day(d + 7) }));
    expect(runOut({ portions: [...done, portion({ openedAt: day(21) })], doses: [], stockChecks: [], now: day(22) }).kind).toBe("stale");
  });
});

describe("the logged share (STORY-03-05-03)", () => {
  it("is logged doses over finished weight (AC 1)", () => {
    // Six days of two 18 g doses on each 250 g portion: 216 of 250.
    expect(runOut(steady()).logged).toEqual({ share: 216 / 250, overLogged: false });
  });

  it("is null before any portion finishes (AC 3)", () => {
    expect(loggedShare([], [])).toBeNull();
  });

  it("can pass 100 % and says it was over-logged", () => {
    const p = portion({ weight: 30, finishedAt: day(2) });
    expect(loggedShare([p], [{ portionId: p.id, grams: 18, at: day(1) }, { portionId: p.id, grams: 18, at: day(2) }])).toEqual({
      share: 1.2,
      overLogged: true,
    });
  });

  it("is low for a household that logs little", () => {
    const input = steady();
    const few = input.doses.filter((d, i) => i % 4 === 0 && d.portionId !== input.portions[3].id);
    expect(runOut({ ...input, doses: few }).logged!.share).toBeCloseTo(54 / 250);
  });
});

describe("the run-out span (STORY-03-05-02)", () => {
  const now = day(0);
  const at = (days: number) => runOutSpan({ grams: days * 10, frozenGrams: 0, weeklyGrams: 70, now });

  it("is days under two weeks, then weeks (AC 2)", () => {
    expect(at(13)).toMatchObject({ unit: "day", value: 13 });
    expect(at(14)).toMatchObject({ unit: "week", value: 2 });
    expect(at(0.2)).toMatchObject({ unit: "day", value: 1 });
  });

  it("is weeks up to 26, then months, then more than 6 months", () => {
    expect(at(26 * 7)).toMatchObject({ unit: "week", value: 26 });
    expect(at(27 * 7)).toMatchObject({ unit: "month", value: 6 });
    expect(inUnit(6.4 * 30.44)).toEqual({ unit: "month", value: 6 });
    expect(at(6.6 * 30.44)).toMatchObject({ kind: "long", months: 6 });
  });

  it("gives the around date", () => {
    expect(at(35).until).toEqual(day(35));
  });

  it("gives the freezer's part in the same unit", () => {
    expect(runOutSpan({ grams: 350, frozenGrams: 140, weeklyGrams: 70, now })).toMatchObject({ unit: "week", value: 5, frozen: 2 });
    expect(runOutSpan({ grams: 70, frozenGrams: 70, weeklyGrams: 70, now })).toMatchObject({ unit: "day", value: 7, frozen: 7 });
  });

  it("grows when a bag is added (AC 5)", () => {
    const before = runOutSpan({ grams: 178, frozenGrams: 0, weeklyGrams: 250, now });
    const after = runOutSpan({ grams: 428, frozenGrams: 0, weeklyGrams: 250, now });
    expect(after.until.getTime()).toBeGreaterThan(before.until.getTime());
  });
});
