import { createFormatter, createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import messages from "@/i18n/messages/en.json";
import type { RunOutView } from "@/server/dal/runOut";
import { runOutContent } from "./runOutContent";

/*
 * The run-out line and sheet in words (TASK-03-05-02-QA1, 03-QA1): span
 * formats at each break and in a second locale, the share and its meaning.
 */

const intl = (locale: "en" = "en") => ({
  t: createTranslator({ locale, messages }),
  format: createFormatter({ locale, timeZone: "UTC" }),
  timeZone: "UTC",
});
const until = new Date(Date.UTC(2026, 11, 14, 8));

const estimate = (span: RunOutView["span"], over: Partial<RunOutView> = {}): RunOutView =>
  ({
    kind: "estimate",
    weeklyGrams: 85.4,
    finished: 6,
    weeks: 11,
    onHand: { grams: 425, frozenGrams: 0 },
    logged: { share: 0.78, overLogged: false },
    span,
    ...over,
  }) as RunOutView;

describe("the run-out line (STORY-03-05-02)", () => {
  it.each([
    [{ kind: "span", unit: "day", value: 1, frozen: 0, until }, "About 1 day of coffee"],
    [{ kind: "span", unit: "day", value: 13, frozen: 0, until }, "About 13 days of coffee"],
    [{ kind: "span", unit: "week", value: 5, frozen: 2, until }, "About 5 weeks of coffee, 2 of them in the freezer"],
    [{ kind: "span", unit: "month", value: 6, frozen: 0, until }, "About 6 months of coffee"],
    [{ kind: "long", months: 6, until }, "More than 6 months of coffee"],
  ] as const)("%o reads %s (AC 1, AC 2)", (span, words) => {
    expect(runOutContent(estimate(span), intl())?.line).toBe(words);
  });

  it("formats the span in another locale", () => {
    const c = runOutContent(estimate({ kind: "span", unit: "week", value: 5, frozen: 0, until }), { ...intl(), format: createFormatter({ locale: "de" as "en", timeZone: "UTC" }) });
    expect(c?.span).toBe("5 Wochen");
    expect(c?.by).toBe("Around 14. Dezember");
  });

  it("is absent when nothing is on hand, use is stale or the read failed (AC 4)", () => {
    expect(runOutContent(null, intl())).toBeNull();
    expect(runOutContent({ ...estimate(null), kind: "nothing" } as RunOutView, intl())).toBeNull();
    expect(runOutContent({ ...estimate(null), kind: "stale" } as RunOutView, intl())).toBeNull();
  });
});

describe("the run-out sheet (STORY-03-05-01, 03)", () => {
  it("shows the span with an around date, and its inputs (AC 1, AC 3)", () => {
    const c = runOutContent(estimate({ kind: "span", unit: "week", value: 5, frozen: 2, until }, { onHand: { grams: 425, frozenGrams: 170 } }), intl());
    expect(c).toMatchObject({ learning: false, span: "5 weeks", by: "Around December 14" });
    expect(c?.rows).toEqual([
      { label: "Coffee on hand", value: "425g, 170g in the freezer" },
      { label: "How much you use", value: "About 85g a week" },
      { label: "Based on", value: "6 finished portions over 11 weeks" },
      { label: "Logged in shots", value: "78% of finished coffee" },
    ]);
    expect(c?.meaning).toBe("We drink more than we log, so coffee runs out sooner than shown.");
  });

  it("says nothing about the share when it's high", () => {
    expect(runOutContent(estimate({ kind: "long", months: 6, until }, { logged: { share: 0.92, overLogged: false } }), intl())?.meaning).toBeUndefined();
  });

  it("caps an over-logged share at 100 %", () => {
    const c = runOutContent(estimate({ kind: "long", months: 6, until }, { logged: { share: 1.2, overLogged: true } }), intl());
    expect(c?.rows.at(-1)?.value).toBe("100% of finished coffee");
  });

  it("while learning, gives progress and no figure (STORY-03-05-01 AC 2, STORY-03-05-03 AC 3)", () => {
    const view = { kind: "learning", finished: 1, needed: 3, onHand: { grams: 250, frozenGrams: 0 }, logged: null, span: null } as RunOutView;
    expect(runOutContent(view, intl())).toEqual({
      line: "Still learning how fast you use coffee",
      learning: true,
      progress: "Tare needs a few finished bags to work this out. 1 of 3 so far.",
      rows: [
        { label: "Coffee on hand", value: "250g" },
        { label: "Logged in shots", value: "Not available yet" },
      ],
      meaning: undefined,
    });
  });
});
