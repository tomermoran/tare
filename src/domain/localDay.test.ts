import { describe, expect, it } from "vitest";
import { daysBetween, isValidDayKey, localDayKey, localNoon, startOfLocalDay } from "./localDay";

const at = (iso: string) => new Date(iso);

describe("localDayKey", () => {
  it("puts a late-evening shot on the local day, not the UTC one", () => {
    // 23:30 in New York is already the next day in UTC.
    expect(localDayKey(at("2026-03-03T04:30:00Z"), "America/New_York")).toBe("2026-03-02");
    expect(localDayKey(at("2026-03-03T04:30:00Z"), "UTC")).toBe("2026-03-03");
  });

  it("handles zones ahead of UTC", () => {
    expect(localDayKey(at("2026-03-02T22:30:00Z"), "Asia/Jerusalem")).toBe("2026-03-03");
  });
});

describe("startOfLocalDay", () => {
  it("returns local midnight", () => {
    expect(startOfLocalDay(at("2026-01-15T14:00:00Z"), "Europe/London").toISOString()).toBe(
      "2026-01-15T00:00:00.000Z",
    );
    expect(startOfLocalDay(at("2026-07-15T14:00:00Z"), "Europe/London").toISOString()).toBe(
      "2026-07-14T23:00:00.000Z",
    );
  });

  it("is right on the day clocks go forward", () => {
    // UK clocks go forward at 01:00 UTC on 29 March 2026; midnight is still GMT.
    expect(startOfLocalDay(at("2026-03-29T12:00:00Z"), "Europe/London").toISOString()).toBe(
      "2026-03-29T00:00:00.000Z",
    );
  });

  it("is right on the day clocks go back", () => {
    // US clocks go back on 1 November 2026; midnight is still daylight time.
    expect(startOfLocalDay(at("2026-11-01T18:00:00Z"), "America/New_York").toISOString()).toBe(
      "2026-11-01T04:00:00.000Z",
    );
  });

  it("starts at 01:00 where midnight itself is skipped", () => {
    // Chile's clocks jump from 00:00 to 01:00 on 6 September 2026.
    const start = startOfLocalDay(at("2026-09-06T15:00:00Z"), "America/Santiago");
    expect(localDayKey(start, "America/Santiago")).toBe("2026-09-06");
    expect(start.toISOString()).toBe("2026-09-06T04:00:00.000Z");
  });

  it("gives every instant of a day the same start", () => {
    const zone = "Europe/London";
    const a = startOfLocalDay(at("2026-03-29T00:30:00Z"), zone);
    const b = startOfLocalDay(at("2026-03-29T22:59:00Z"), zone);
    expect(a.getTime()).toBe(b.getTime());
  });
});

describe("localNoon", () => {
  it("is noon local time, in winter and summer", () => {
    expect(localNoon("2026-01-15", "Europe/London").toISOString()).toBe("2026-01-15T12:00:00.000Z");
    expect(localNoon("2026-07-15", "Europe/London").toISOString()).toBe("2026-07-15T11:00:00.000Z");
  });

  it("round-trips to the same local day across a clock change", () => {
    for (const day of ["2026-03-29", "2026-10-25"]) {
      expect(localDayKey(localNoon(day, "Europe/London"), "Europe/London")).toBe(day);
    }
  });
});

describe("isValidDayKey", () => {
  it.each(["2026-01-15", "2024-02-29"])("accepts %s", (v) => {
    expect(isValidDayKey(v)).toBe(true);
  });
  it.each(["", "2026-1-15", "2026-02-30", "2025-02-29", "15/01/2026", "2026-13-01", "2026-01-15T00:00"])(
    "rejects %s",
    (v) => {
      expect(isValidDayKey(v)).toBe(false);
    },
  );
});

describe("daysBetween", () => {
  it("counts calendar days, across months and a daylight-saving change", () => {
    expect(daysBetween("2026-11-13", "2026-11-13")).toBe(0);
    expect(daysBetween("2026-10-30", "2026-11-02")).toBe(3);
    expect(daysBetween("2026-03-28", "2026-03-30")).toBe(2);
  });
});
