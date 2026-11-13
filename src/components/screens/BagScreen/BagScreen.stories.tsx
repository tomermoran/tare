import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { BagScreen, type BagLabels } from "./BagScreen";

const { bag, portion } = messages;
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Morning Blend" })).toBeVisible();
    await expect(canvas.getAllByRole("term").map((t) => t.textContent)).toEqual(facts.map((f) => f.label));
    await expect(within(canvas.getByRole("region", { name: messages.beans.portions })).getAllByRole("listitem")).toHaveLength(1);
    await expect(canvas.getByText(bag.noRecipes)).toBeVisible();
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

export const Finished: Story = {
  args: { portions: [{ id: "p1", state: portion.state.finished, remaining: grams.format(0) }] },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };
