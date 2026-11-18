import { describe, expect, it } from "vitest";
import * as constants from "./constants";
import { runScenario, scenarios } from "./scenarios";

/* All drift scenarios pass before release (STORY-04-02-09 AC 1, AC 2). */

describe("drift scenarios", () => {
  it("has at least 24, across every situation the story names", () => {
    expect(scenarios.length).toBeGreaterThanOrEqual(24);
    expect(new Set(scenarios.map((s) => s.group))).toEqual(new Set(["ageing", "bag", "household", "prep", "low volume", "servicing", "baskets"]));
  });

  it.each(scenarios.map((s) => [s.name, s] as const))("%s", (_, s) => {
    const result = runScenario(s);
    expect(result.got, `${s.name}: expected ${s.expect.direction} ${s.expect.steps?.join("-") ?? ""}`).toSatisfy(() => result.pass);
  });

  // A changed number fails here until the scenarios are re-run and this snapshot updated (AC 2).
  it("runs against these constants", () => {
    expect({ ...constants }).toMatchInlineSnapshot(`
      {
        "BAG_FRACTION_PER_STEP": 0.1,
        "BAG_MIN_SHOTS": 2,
        "CAP_MIN_STEPS": 2,
        "CAP_RANGE_FRACTION": 0.06,
        "CLEAN_STARTS_PERIOD": true,
        "HALF_LIFE_DAYS": 3,
        "MAX_SHOTS": 10,
        "MIN_SHOTS": 3,
        "OPENED_WEIGHT": 0.25,
        "POOL_WITHIN_BASKET": false,
        "WINDOW_DAYS": 3,
      }
    `);
  });
});
