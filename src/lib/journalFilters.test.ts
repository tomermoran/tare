import { describe, expect, it } from "vitest";
import type { JournalFilters } from "@/server/dal/journal";
import { journalHref, JOURNAL_PATH, readJournalFilters } from "./journalFilters";

/*
 * The Journal's filters live in its URL (STORY-02-06-04, 02-06-05): links
 * from the tab bar and the coffee screen set them, and back from a shot
 * returns to the same URL, so the same filters.
 */

const roundTrip = (filters: JournalFilters) =>
  readJournalFilters(Object.fromEntries(new URL(journalHref(filters), "http://tare.test").searchParams));

describe("readJournalFilters", () => {
  it("reads drink, coffee and setup", () => {
    expect(readJournalFilters({ drinkId: "d1", beanId: "b1", setupId: "s1" })).toEqual({ drinkId: "d1", beanId: "b1", setupId: "s1" });
  });

  it("ignores unknown, empty and repeated params", () => {
    expect(readJournalFilters({ drinkId: "", beanId: ["b1", "b2"], milkId: "m1", setupId: undefined })).toEqual({});
  });
});

describe("journalHref", () => {
  it("is the plain Journal with no filters (first run, STORY-02-06-05 AC 2)", () => {
    expect(journalHref()).toBe(JOURNAL_PATH);
    expect(journalHref({})).toBe(JOURNAL_PATH);
  });

  it("sets only the filters given, in a fixed order", () => {
    expect(journalHref({ beanId: "b1", drinkId: "d1" })).toBe("/journal?drinkId=d1&beanId=b1");
    expect(journalHref({ beanId: "b1" })).toBe("/journal?beanId=b1");
  });

  it.each<JournalFilters>([{}, { drinkId: "d1" }, { drinkId: "d1", beanId: "b1" }, { drinkId: "d 1&x", beanId: "b/1", setupId: "s?1" }])(
    "reads back what it wrote: %o",
    (filters) => {
      expect(roundTrip(filters)).toEqual(filters);
    },
  );
});
