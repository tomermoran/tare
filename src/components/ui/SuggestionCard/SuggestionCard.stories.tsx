import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createFormatter, createTranslator } from "next-intl";
import { expect, fn, userEvent, within } from "storybook/test";
import type { Change, ReasonPart, Suggestion } from "@/domain/suggest";
import messages from "@/i18n/messages/en.json";
import { suggestionWords } from "@/lib/suggestionWords";
import { SuggestionCard } from "./SuggestionCard";

const { suggest } = messages;
const t = createTranslator({ locale: "en", messages });
const format = createFormatter({ locale: "en" });
const labels = { title: suggest.title, dismiss: suggest.dismiss, to: suggest.to };
const noClocks = { roasting: null, opened: null };

/** The card's words, made the way the app makes them. */
const words = (s: Suggestion, clocks: Parameters<typeof suggestionWords>[1]["clocks"] = noClocks, milkDrink = false) => {
  const w = suggestionWords(s, { milkDrink, clocks }, t, format)!;
  return { change: w.change, values: w.values, reason: w.reason, freshness: w.freshness };
};
const sour: ReasonPart = { kind: "answer", question: "balance", value: -2 };
const lever = (change: Change, reason: ReasonPart[] = [sour]): Suggestion => ({ change, reason, freshness: null });

const meta = {
  title: "Components/SuggestionCard",
  component: SuggestionCard,
  args: { labels, onDismiss: fn() },
  decorators: [(Story) => <div className="w-[358px]"><Story /></div>],
} satisfies Meta<typeof SuggestionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** "Much too sour and ran fast": 2 steps finer, 15 to 13. */
export const Grind: Story = {
  args: words(lever({ lever: "grind", direction: "finer", steps: 2, from: 15, to: 13 }, [sour, { kind: "time", ran: "fast" }])),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(t("suggest.change.grindFiner", { steps: 2 }))).toBeVisible();
    await expect(canvas.getByRole("status")).toBeInTheDocument();
    // Advice, never a warning: no signal anywhere on the card.
    await expect(canvasElement.querySelector("[class*='signal']")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: suggest.dismiss }));
    await expect(args.onDismiss).toHaveBeenCalled();
  },
};

export const PuckPrep: Story = {
  args: words(lever({ lever: "prep", tool: "wdt" }, [{ kind: "tag", tag: "channelling" }])),
};

export const PrepAlreadyUsed: Story = {
  args: words(lever({ lever: "prep", tool: "checkDistribution" }, [{ kind: "tag", tag: "sourAndBitter" }])),
};

export const Yield: Story = {
  args: words(lever({ lever: "yield", direction: "less", from: 36, to: 34 }, [{ kind: "answer", question: "strength", value: -1 }])),
};

export const Dose: Story = {
  args: words(lever({ lever: "dose", direction: "more", from: 18, to: 18.5 }, [{ kind: "answer", question: "body", value: -1 }])),
};

export const Milk: Story = {
  args: words(lever({ lever: "milk", direction: "less", from: 150, to: 120 }, [{ kind: "answer", question: "strength", value: -2 }]), noClocks, true),
};

export const Temperature: Story = {
  args: words(lever({ lever: "temperature", direction: "more", from: 93, to: 94 }, [{ kind: "answer", question: "balance", value: -1 }])),
};

/** The grinder's direction is "not sure": words only, and a way to tell Tare. */
export const DirectionUnknown: Story = {
  args: {
    ...words(lever({ lever: "grind", direction: "finer", steps: 2, from: null, to: null })),
    link: { label: suggest.directionUnknown, href: "#" },
  },
};

/** No change, only why the shot may have run as it did. */
export const FreshnessOnly: Story = {
  args: words({ change: null, reason: [], freshness: "pastPeakRoasted" }, { roasting: { kind: "roasted", days: 36, frozenDays: 0 }, opened: null }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(t("suggest.fresh.pastPeakRoasted", { days: 36, from: "roasted" }))).toBeVisible();
    await expect(canvas.queryByRole("img", { name: suggest.to })).toBeNull();
  },
};

export const WithFreshness: Story = {
  args: words(
    { change: { lever: "grind", direction: "finer", steps: 1, from: 15, to: 14 }, reason: [{ kind: "answer", question: "balance", value: -1 }], freshness: "veryFresh" },
    { roasting: { kind: "roasted", days: 3, frozenDays: 0 }, opened: null },
  ),
};

export const RightToLeft: Story = { ...Grind, play: undefined, globals: { direction: "rtl" } };
