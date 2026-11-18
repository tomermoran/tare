import { describe, expect, it } from "vitest";
import { ageTerm } from "./age";
import { bagSignal, bagTerm } from "./bag";
import { eligible } from "./eligible";
import { adjustGrind, type DriftInput } from "./index";
import { recipeInForce } from "./recipeInForce";
import type { DriftPin, DriftShot } from "./types";
import { pickWindow } from "./window";

/* The drift engine's pieces (TASK-04-02-01..07-BE1, QA1). */

const DAY = 86_400_000;
const NOW = new Date("2026-05-10T12:00:00Z");
const ago = (days: number) => new Date(NOW.getTime() - days * DAY);
const NO_PREP = { wdt: false, puckScreen: false };

const pin = (over: Partial<DriftPin> = {}): DriftPin => ({
  id: "pin",
  personaId: "me",
  setupId: "s1",
  drinkTypeId: "espresso",
  batchId: null,
  pinnedAt: ago(30),
  removedAt: null,
  grind: 15,
  timeMs: 28_000,
  prep: NO_PREP,
  ...over,
});
let n = 0;
const shot = (days: number, over: Partial<DriftShot> = {}): DriftShot => ({
  id: `shot-${String(++n).padStart(3, "0")}`,
  at: ago(days),
  entryMode: "measured",
  reaction: null,
  personaId: "me",
  setupId: "s1",
  drinkTypeId: "espresso",
  batchId: "bag1",
  grind: 15,
  timeMs: 28_000,
  prep: NO_PREP,
  roastDays: 20 - days,
  openedDays: null,
  ...over,
});

describe("the window (STORY-04-02-04)", () => {
  it("takes the last 3 days, at most 10, the newest", () => {
    const shots = Array.from({ length: 14 }, (_, i) => shot(i * 0.2));
    const w = pickWindow(shots, NOW)!;
    expect(w.shots).toHaveLength(10);
    expect(w.reachedBack).toBeNull();
    expect(w.shots[0].at.getTime()).toBe(NOW.getTime());
  });

  it("reaches back to 3 shots, and gives none with fewer (AC 2)", () => {
    const w = pickWindow([shot(1), shot(5), shot(9), shot(12)], NOW)!;
    expect(w.shots.map((s) => s.at)).toEqual([ago(1), ago(5), ago(9)]);
    expect(w.reachedBack).toEqual(ago(9));
    expect(pickWindow([shot(1), shot(5)], NOW)).toBeNull();
  });

  it("weighs today about twice a 3-day-old shot (AC 3)", () => {
    const w = pickWindow([shot(0), shot(1.5), shot(3)], NOW)!;
    expect(w.shots[0].weight / w.shots[2].weight).toBeCloseTo(2);
  });

  it("is the same twice, ties settled by ID (AC 4)", () => {
    const same = [shot(1, { id: "b" }), shot(1, { id: "a" }), shot(2, { id: "c" })];
    expect(pickWindow(same, NOW)).toEqual(pickWindow([...same].reverse(), NOW));
  });
});

describe("the recipe in force (TD-2, STORY-04-02-02 AC 5, AC 6)", () => {
  const s = shot(2);
  it("is the newest pin at or before the shot, never a later one", () => {
    const pins = [pin({ id: "old", grind: 14, pinnedAt: ago(10) }), pin({ id: "mid", grind: 15, pinnedAt: ago(2.5) }), pin({ id: "late", pinnedAt: ago(1) })];
    expect(recipeInForce(s, pins)?.id).toBe("mid");
  });
  it("prefers the bag's own recipe, even one removed after the shot", () => {
    const pins = [pin({ id: "coffee" }), pin({ id: "bag", batchId: "bag1", pinnedAt: ago(20), removedAt: ago(1) })];
    expect(recipeInForce(s, pins)?.id).toBe("bag");
    expect(recipeInForce(s, [pins[0], { ...pins[1], removedAt: ago(3) }])?.id).toBe("coffee");
  });
  it("never matches another persona's pin, and is null with none", () => {
    expect(recipeInForce(s, [pin({ personaId: "guest" })])).toBeNull();
    expect(recipeInForce(s, [])).toBeNull();
  });
});

describe("which shots count (STORY-04-02-03)", () => {
  it("keeps measured shots with the recipe's prep, counting the rest", () => {
    const out = eligible(
      [shot(1), shot(1, { entryMode: "one-tap" }), shot(1, { prep: { wdt: true, puckScreen: false } }), shot(1, { setupId: "other" })],
      [pin()],
    );
    expect([out.kept.length, out.oneTap.length, out.leftOutPrep.length, out.leftOutNoRecipe.length]).toEqual([1, 1, 1, 1]);
  });
});

describe("the age term (STORY-04-02-01)", () => {
  const p = (roastDays: number, delta: number) => ({ roastDays, openedDays: null, delta, weight: 1 });
  it("follows the line to today's age", () => {
    expect(ageTerm([p(10, 0), p(12, -0.5), p(14, -1)], { roastDays: 16, openedDays: null })).toBeCloseTo(-1.5);
  });
  it("is none with too few shots or one age (AC 2)", () => {
    expect(ageTerm([p(10, 0), p(12, -1)], { roastDays: 16, openedDays: null })).toBeNull();
    expect(ageTerm([p(10, 0), p(10, -1), p(10, -1)], { roastDays: 16, openedDays: null })).toBeNull();
    expect(ageTerm([p(10, 0), p(12, -1), p(14, -1)], { roastDays: null, openedDays: null })).toBeNull();
  });
});

describe("the bag term (STORY-04-02-02)", () => {
  const p = (timeMs: number) => ({ timeMs, recipeTimeMs: 28_000, weight: 1 });
  it("turns running fast into finer, in the grinder's own direction", () => {
    const fast = bagSignal([p(25_200), p(25_200)])!;
    expect(fast).toBeCloseTo(-0.1);
    expect(bagTerm(fast, { step: 1, coarser: "higher" })).toBeCloseTo(-1);
    expect(bagTerm(fast, { step: 1, coarser: "lower" })).toBeCloseTo(1);
  });
  it("is none with one shot or an unknown direction", () => {
    expect(bagSignal([p(25_000)])).toBeNull();
    expect(bagTerm(-0.2, { step: 1, coarser: null })).toBeNull();
  });
});

describe("the composition (TASK-04-02-06-BE1)", () => {
  const input = (over: Partial<DriftInput> = {}): DriftInput => ({
    now: NOW,
    wheel: { min: 0, max: 30, step: 1, coarser: "higher" },
    recipe: { grind: 15 },
    batchId: "bag1",
    age: { roastDays: 20, openedDays: null },
    periodStart: null,
    shots: [],
    pins: [pin()],
    ...over,
  });

  it("adds the bag's nudge to the recipe, the rows adding up", () => {
    const out = adjustGrind(input({ shots: [shot(0.2, { timeMs: 24_000 }), shot(1, { timeMs: 24_500 }), shot(2, { timeMs: 24_000 })] }));
    expect(out.kind).toBe("applied");
    if (out.kind === "none") return;
    const a = out.adjustment;
    expect(a.shown).toBe(a.recipeGrind + a.rows.reduce((s, r) => s + r.delta, 0));
    expect(a.rows.map((r) => r.kind)).toEqual(["bag"]);
    expect(a.shown).toBeLessThan(15);
  });

  it("limits a very large adjustment and says so (STORY-04-02-01 AC 5)", () => {
    const out = adjustGrind(input({ shots: [shot(0.2, { timeMs: 10_000 }), shot(1, { timeMs: 10_000 }), shot(2, { timeMs: 10_000 })] }));
    expect(out.kind).toBe("limited");
    if (out.kind === "none") return;
    expect(out.adjustment.shown).toBe(13);
    expect(out.adjustment.rows.at(-1)?.kind).toBe("limit");
    expect(out.adjustment.shown).toBe(15 + out.adjustment.rows.reduce((s, r) => s + r.delta, 0));
  });

  it("stops at the grinder's range (AC 4)", () => {
    const out = adjustGrind(input({ recipe: { grind: 1 }, pins: [pin({ grind: 1 })], shots: [0.2, 1, 2].map((d) => shot(d, { grind: 1, timeMs: 20_000 })) }));
    if (out.kind === "none") throw new Error("expected an adjustment");
    expect(out.adjustment.shown).toBe(0);
  });

  it("treats less than a step as none (AC 3)", () => {
    expect(adjustGrind(input({ shots: [0.2, 1, 2].map((d) => shot(d, { timeMs: 27_000 })) }))).toEqual({ kind: "none", reason: "subStep" });
  });

  it("rounds a stepless grinder to its finest increment", () => {
    const out = adjustGrind(
      input({ wheel: { min: 0, max: 10, step: 0.1, coarser: "higher" }, recipe: { grind: 5 }, pins: [pin({ grind: 5 })], shots: [0.2, 1, 2].map((d) => shot(d, { grind: 5, timeMs: 26_600 })) }),
    );
    if (out.kind === "none") throw new Error("expected an adjustment");
    expect(out.adjustment.shown).toBe(4.9);
  });

  it("is moved by nothing when a bag has only one-tap shots (STORY-04-02-03 AC 3)", () => {
    expect(adjustGrind(input({ shots: [0.2, 1, 2].map((d) => shot(d, { entryMode: "one-tap", timeMs: 20_000 })) })).kind).toBe("none");
  });

  it("counts people and setups but never names them (STORY-04-02-07)", () => {
    const pins = [pin(), pin({ id: "g", personaId: "guest" }), pin({ id: "s2", setupId: "s2" })];
    const out = adjustGrind(
      input({ pins, shots: [shot(0.2, { timeMs: 24_000 }), shot(1, { personaId: "guest", timeMs: 24_000 }), shot(2, { setupId: "s2", timeMs: 24_000 })] }),
    );
    if (out.kind === "none") throw new Error("expected an adjustment");
    expect(out.adjustment.evidence).toMatchObject({ people: 2, acrossSetups: true, measured: 3 });
    expect(JSON.stringify(out)).not.toContain("guest");
  });
});
