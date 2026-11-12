import { describe, expect, it } from "vitest";
import { tabForPath } from "./appTabs";

describe("tabForPath", () => {
  it.each([
    ["/", "brew"],
    ["/journal", "journal"],
    ["/journal/abc", "journal"],
    ["/beans", "beans"],
    ["/setup/parts/x", "setup"],
    ["/unknown", "brew"],
  ])("puts %s under %s", (path, tab) => {
    expect(tabForPath(path)).toBe(tab);
  });
});
