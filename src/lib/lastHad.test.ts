import { describe, expect, it } from "vitest";
import { lastHadLabel } from "./lastHad";

describe("lastHadLabel", () => {
  it.each([
    [0, "today"],
    [1, "yesterday"],
    [3, "3 days ago"],
    [7, "last week"],
    [21, "3 weeks ago"],
    [65, "2 months ago"],
    [400, "last year"],
  ])("%i days is %s", (days, words) => {
    expect(lastHadLabel(days, "en")).toBe(words);
  });
});
