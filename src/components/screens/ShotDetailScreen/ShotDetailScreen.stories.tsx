import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { exampleRecipe } from "../fixtures";
import { PhoneFrame } from "../PhoneFrame";
import { ShotDetailScreen, type ShotFact } from "./ShotDetailScreen";

const t = createTranslator({ locale: "en", messages });
const { drinks, journal, log, setup, shot, taste } = messages;

// Fictional parts and coffee.
const facts: ShotFact[] = [
  { label: shot.coffee, value: "Morning Blend, Example Roasters" },
  { label: setup.kind.machine, value: t("setup.partName", { maker: "Example Works", model: "Lever One" }) },
  { label: setup.kind.grinder, value: t("setup.partName", { maker: "Example Works", model: "Flat 64" }) },
  { label: setup.kind.basket, value: t("setup.partName", { maker: "Example Works", model: "18 g Basket" }) },
  { label: shot.milk, value: t("shot.milkLine", { milk: messages.milks.oat, amount: new Intl.NumberFormat("en", { style: "unit", unit: "milliliter" }).format(180) }) },
  { label: log.prep, value: log.prepWdt },
  { label: log.sweetened, value: shot.sweetenedNo },
];

const meta = {
  title: "Screens/Shot detail",
  component: ShotDetailScreen,
  parameters: { layout: "centered" },
  args: {
    labels: { back: journal.title, details: shot.details, taste: shot.taste },
    backHref: "/journal",
    drink: drinks.latte,
    when: t("shot.dateTime", { date: "18 October", time: "07:42" }),
    values: exampleRecipe,
    facts,
  },
  decorators: [
    (Story) => (
      <PhoneFrame>
        <Story />
      </PhoneFrame>
    ),
  ],
} satisfies Meta<typeof ShotDetailScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A measured shot with taste: rating and just-right phrases, no dead actions (AC 1, AC 2). */
export const Measured: Story = {
  args: {
    taste: {
      rating: { label: shot.rating, value: t("shot.ratingValue", { rating: 4 }) },
      phrases: [taste.balance.less, taste.body.right],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: drinks.latte })).toBeVisible();
    await expect(canvas.getByText(t("setup.partName", { maker: "Example Works", model: "Flat 64" }))).toBeVisible();
    await expect(canvas.getByText(taste.balance.less)).toBeVisible();
    await expect(canvas.getByText(t("shot.ratingValue", { rating: 4 }))).toBeVisible();
    // Read-only in Milestone 1: the only control is the way back.
    await expect(canvas.queryAllByRole("button")).toHaveLength(0);
    await expect(canvas.getAllByRole("link")).toHaveLength(1);
  },
};

/** A one-tap shot says its values were copied from the recipe; no taste section. */
export const OneTap: Story = {
  args: { drink: drinks.espresso, note: shot.copiedFromRecipe, facts: facts.filter((f) => f.label !== shot.milk) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(shot.copiedFromRecipe)).toBeVisible();
    await expect(canvas.queryByRole("heading", { name: shot.taste })).toBeNull();
  },
};

export const RightToLeft: Story = { ...Measured, play: undefined, globals: { direction: "rtl" } };
