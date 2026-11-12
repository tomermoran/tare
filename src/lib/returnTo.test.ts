import { describe, expect, it } from "vitest";
import { returnWithSelection, safeReturnTo, withReturnTo } from "./returnTo";

describe("safeReturnTo", () => {
  it.each([
    ["/log", "/log"],
    ["/log?drink=abc", "/log?drink=abc"],
    ["/setup#parts", "/setup#parts"],
  ])("keeps the site path %s", (value, expected) => {
    expect(safeReturnTo(value, "/")).toBe(expected);
  });

  it.each([
    ["missing", null],
    ["empty", ""],
    ["another site", "https://example.com/log"],
    ["protocol-relative", "//example.com/log"],
    ["backslash trick", "/\\example.com"],
    ["no leading slash", "log"],
    ["javascript", "javascript:alert(1)"],
  ])("falls back for %s", (_label, value) => {
    expect(safeReturnTo(value, "/")).toBe("/");
  });
});

describe("withReturnTo and returnWithSelection", () => {
  it("round-trips the log through adding a bag, coming back with the bag chosen", () => {
    const link = withReturnTo("/beans/new", "/log?drink=d1&coffee=c1");
    const url = new URL(link, "https://x.invalid");
    expect(url.pathname).toBe("/beans/new");
    const back = safeReturnTo(url.searchParams.get("returnTo"), "/");
    expect(back).toBe("/log?drink=d1&coffee=c1");

    const done = new URL(returnWithSelection(back, "bag-42"), "https://x.invalid");
    expect(done.pathname).toBe("/log");
    expect(done.searchParams.get("drink")).toBe("d1");
    expect(done.searchParams.get("coffee")).toBe("c1");
    expect(done.searchParams.get("selected")).toBe("bag-42");
  });

  it("replaces an earlier selection rather than adding a second", () => {
    const done = returnWithSelection("/log?selected=old", "new");
    expect(new URL(done, "https://x.invalid").searchParams.getAll("selected")).toEqual(["new"]);
  });
});
