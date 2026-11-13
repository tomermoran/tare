import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { ShotWarnings } from "@/components/shot/ShotWarnings";
import { exampleRecipe } from "../fixtures";
import { PhoneFrame } from "../PhoneFrame";
import { ShotDetailScreen, type ShotFact } from "./ShotDetailScreen";

const t = createTranslator({ locale: "en", messages });
const { actions, drinks, journal, log, setup, shot, taste } = messages;

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

/** Channelling seen: the block warning under the values, and the tags in words (STORY-01-05-04 AC 2). */
export const Channelling: Story = {
  args: {
    drink: drinks.espresso,
    facts: facts.filter((f) => f.label !== shot.milk),
    warning: <ShotWarnings warnings={["channelling"]} labels={{ channelling: shot.warnings.channelling }} />,
    taste: {
      rating: { label: shot.rating, value: t("shot.ratingValue", { rating: 2 }) },
      phrases: [taste.balance.muchLess],
      noticed: { label: shot.noticed, value: `${taste.tags.dryFinish} and ${taste.tags.channelling}` },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent(shot.warnings.channelling);
    await expect(canvas.getByText(shot.noticed)).toBeVisible();
    await expect(canvas.getByText(new RegExp(taste.tags.channelling))).toBeVisible();
  },
};

/** A one-tap shot marked good: the reaction in words, no rating. */
export const OneTapWithReaction: Story = {
  args: {
    drink: drinks.espresso,
    note: shot.copiedFromRecipe,
    facts: facts.filter((f) => f.label !== shot.milk),
    taste: { reaction: { label: shot.reaction, value: journal.good }, phrases: [] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: shot.taste })).toBeVisible();
    await expect(canvas.getByText(journal.good)).toBeVisible();
    await expect(canvas.queryByText(shot.rating)).toBeNull();
    await expect(canvas.queryByRole("status")).toBeNull();
  },
};

/** Edit is two taps from the Journal: a quiet ghost on a measured shot (STORY-02-06-03 AC 3). */
export const MeasuredWithEdit: Story = {
  args: {
    actions: (
      <a href="/log?mode=edit&shotId=s1" className="self-start">
        {actions.edit}
      </a>
    ),
  },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: actions.edit });
    await expect(link).toHaveAttribute("href", "/log?mode=edit&shotId=s1");
  },
};

export const RightToLeft: Story = { ...Measured, play: undefined, globals: { direction: "rtl" } };
