import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { createTranslator } from "next-intl";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { BagScreen, type BagLabels } from "./BagScreen";

const { bag, portion } = messages;
const t = createTranslator({ locale: "en", messages });
const grams = new Intl.NumberFormat("en", { style: "unit", unit: "gram", unitDisplay: "narrow" });
const day = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" });

const labels: BagLabels = { back: bag.back, facts: bag.facts, portions: messages.beans.portions, recipes: bag.recipes, noRecipes: bag.noRecipes };
const facts = [
  { label: bag.roastDate, value: day.format(new Date("2026-01-02")) },
  { label: bag.bestBefore, value: day.format(new Date("2026-07-01")) },
  { label: bag.purchased, value: day.format(new Date("2026-01-05")) },
  { label: bag.bagWeight, value: grams.format(500) },
];

const meta = {
  title: "Screens/Bag",
  component: BagScreen,
  parameters: { layout: "centered" },
  decorators: [(Story) => <PhoneFrame><Story /></PhoneFrame>],
  args: {
    labels,
    backHref: "/beans",
    bean: "Morning Blend",
    roaster: "Example Roasters",
    facts,
    portions: [{ id: "p1", state: portion.state.unopened, remaining: grams.format(500) }],
  },
} satisfies Meta<typeof BagScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A new bag: one portion holding the whole bag, facts once at the top (AC 2). */
export const OnePortion: Story = {
  args: { labels: { ...labels, addRecipe: messages.recipe.add }, addRecipeHref: "/log?mode=recipe&batchId=b1" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Morning Blend" })).toBeVisible();
    await expect(canvas.getAllByRole("term").map((t) => t.textContent)).toEqual(facts.map((f) => f.label));
    await expect(within(canvas.getByRole("region", { name: messages.beans.portions })).getAllByRole("listitem")).toHaveLength(1);
    await expect(canvas.getByText(bag.noRecipes)).toBeVisible();
    // Typing in a recipe opens the log's recipe mode (STORY-02-01-02 AC 1).
    await expect(canvas.getByRole("link", { name: messages.recipe.add })).toHaveAttribute("href", "/log?mode=recipe&batchId=b1");
  },
};

/** Split portions, each its own row; facts aren't repeated per portion. */
export const SplitPortions: Story = {
  args: {
    portions: [
      { id: "p1", state: portion.state.counter, remaining: grams.format(200) },
      { id: "p2", state: portion.state.frozen, remaining: grams.format(250) },
    ],
    onPortion: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText(bag.roastDate)).toHaveLength(1);
    await userEvent.click(canvas.getByRole("button", { name: new RegExp(portion.state.frozen) }));
    await expect(args.onPortion).toHaveBeenCalledWith("p2");
  },
};

/** Every portion finished: the bag says so in words (STORY-03-04-03 AC 2). */
export const Finished: Story = {
  args: { status: bag.statusFinished, portions: [{ id: "p1", state: portion.state.finished, remaining: grams.format(0) }] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(bag.statusFinished)).toBeVisible();
  },
};

/** Open, with the total left across portions (STORY-03-04-03 AC 1, STORY-03-04-01 AC 2). */
export const OpenWithTotal: Story = {
  args: {
    status: bag.statusOpen,
    total: bag.total.replace("{grams}", grams.format(450)),
    portions: [
      { id: "p1", state: portion.state.counter, remaining: grams.format(200) },
      { id: "p2", state: portion.state.frozen, remaining: grams.format(250) },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(bag.statusOpen)).toBeVisible();
    await expect(canvas.getByText(bag.total.replace("{grams}", grams.format(450)))).toBeVisible();
  },
};

/**
 * Both clocks (EPIC-03-03): the bag's one roasting clock, each portion's own
 * opened clock, a frozen portion paused, and the freezer days left out. Text
 * only, no colour.
 */
export const Clocks: Story = {
  args: {
    clocks: <p className="text-body text-ink">{t("bag.daysSinceRoast", { days: 12 })}</p>,
    portions: [
      { id: "p1", state: portion.state.counter, opened: t("portion.openFor", { days: 3 }), remaining: grams.format(200) },
      {
        id: "p2",
        state: portion.state.frozen,
        opened: t("portion.agePaused"),
        frozenDays: t("portion.frozenDays", { days: 9 }),
        remaining: grams.format(250),
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(t("bag.daysSinceRoast", { days: 12 }))).toBeVisible();
    await expect(canvas.getByText(t("portion.openFor", { days: 3 }))).toBeVisible();
    await expect(canvas.getByText(t("portion.agePaused"))).toBeVisible();
    await expect(canvas.getByText(t("portion.frozenDays", { days: 9 }))).toBeVisible();
    await expect(canvasElement.innerHTML).not.toMatch(/signal/);
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };
