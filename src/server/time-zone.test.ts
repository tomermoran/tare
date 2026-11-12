import { describe, expect, it } from "vitest";
import { validTimeZone } from "./time-zone";

describe("validTimeZone", () => {
  it.each([
    ["Europe/London", "Europe/London"],
    ["Asia/Jerusalem", "Asia/Jerusalem"],
    ["UTC", "UTC"],
    [undefined, "UTC"],
    ["", "UTC"],
    ["Mars/Olympus_Mons", "UTC"],
    ["Europe/London; drop table users", "UTC"],
  ])("reads %j as %s", (cookie, zone) => {
    expect(validTimeZone(cookie)).toBe(zone);
  });
});
