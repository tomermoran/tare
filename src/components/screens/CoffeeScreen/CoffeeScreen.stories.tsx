import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, fn, userEvent, within } from "storybook/test";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { CoffeeScreen, type CoffeeLabels } from "./CoffeeScreen";

const { coffee, states } = messages;
const t = createTranslator({ locale: "en", messages });
const grams = new Intl.NumberFormat("en", { style: "unit", unit: "gram", unitDisplay: "narrow" });
const day = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", timeZone: "UTC" });
const list = new Intl.ListFormat("en", { type: "conjunction" });

const labels: CoffeeLabels = {
  back: coffee.back,
  addBag: coffee.addBag,
  recipes: coffee.recipes,
  noRecipes: coffee.noRecipes,
  recentShots: coffee.recentShots,
  noShots: coffee.noShots,
  allShots: coffee.allShots,
  bags: coffee.bags,
  loading: coffee.loading,
  loadFailedTitle: states.loadFailedTitle,
  loadFailed: states.loadFailed,
  retry: messages.actions.retry,
};

const values = { grind: 14, dose: 18, yield: 36, timeMs: 27_600 };
const shots = [
  { id: "s1", href: "/journal/s1", primary: t("journal.rowTitle", { drink: messages.drinks.latte, time: "08:12" }), secondary: day.format(new Date("2026-03-04")), values },
  { id: "s2", href: "/journal/s2", primary: t("journal.rowTitle", { drink: messages.drinks.espresso, time: "07:40" }), secondary: day.format(new Date("2026-03-03")), values },
];
const bags = [
  { id: "b1", href: "/beans/b1", primary: t("portion.bagRoasted", { date: day.format(new Date("2026-02-20")) }), secondary: messages.bag.statusOpen, end: grams.format(250) },
  { id: "b2", href: "/beans/b2", primary: t("portion.bagAdded", { date: day.format(new Date("2026-01-10")) }), secondary: messages.bag.statusFinished, end: grams.format(500) },
];

const meta = {
  title: "Screens/Coffee",
  component: CoffeeScreen,
  parameters: { layout: "centered" },
  decorators: [(Story) => <PhoneFrame><Story /></PhoneFrame>],
  args: {
    labels,
    backHref: "/beans",
    name: "Old Favourite",
    roaster: "Example Roasters",
    details: t("coffee.details", { roast: messages.catalog.roast.Medium, notes: list.format(["cocoa", "plum"]) }),
    summary: messages.beans.summary.mostlyGood,
    addBag: { href: "/beans/add?beanId=old-favourite", primary: false },
    recipes: (
      <ul>
        <li>
          <ListRow primary={t("recipe.row", { drink: messages.drinks.latte, setup: "Home setup" })} secondary={t("recipe.pinnedOn", { date: day.format(new Date("2026-03-01")) })} />
        </li>
      </ul>
    ),
    shots,
    allShotsHref: "/journal?beanId=old-favourite",
    bags,
  },
} satisfies Meta<typeof CoffeeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Details, summary, recipes, recent shots with "all shots", and bags (AC 1 to AC 4). */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Old Favourite" })).toBeVisible();
    await expect(canvas.getByText(messages.beans.summary.mostlyGood)).toBeVisible();
    await expect(canvas.getByRole("link", { name: coffee.allShots })).toHaveAttribute("href", "/journal?beanId=old-favourite");
    await expect(canvas.getByRole("link", { name: /Roasted/ })).toHaveAttribute("href", "/beans/b1");
    // A bag is on hand: adding another is offered, but not as the primary (STORY-03-06-04 AC 3).
    const add = canvas.getByRole("link", { name: coffee.addBag });
    await expect(add).toHaveAttribute("href", "/beans/add?beanId=old-favourite");
    await expect(add.className).not.toContain("bg-action");
  },
};

/** Nothing on hand: "add a bag of this" is the main action (STORY-03-06-04 AC 3). */
export const NoneOnHand: Story = {
  args: { addBag: { href: "/beans/add?beanId=old-favourite", primary: true }, bags: [bags[1]] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: coffee.addBag }).className).toContain("bg-action");
  },
};

/** Each empty section says so in one line (AC 5). */
export const EmptySections: Story = {
  args: { recipes: undefined, shots: [], summary: undefined, details: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(coffee.noRecipes)).toBeVisible();
    await expect(canvas.getByText(coffee.noShots)).toBeVisible();
    await expect(canvas.queryByRole("link", { name: coffee.allShots })).toBeNull();
  },
};

export const Loading: Story = { args: { state: "loading" } };

/** Failing to load says so, with retry (AC 6). */
export const LoadFailed: Story = {
  args: { state: "failed", onRetry: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(states.loadFailedTitle)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: messages.actions.retry }));
    await expect(args.onRetry).toHaveBeenCalled();
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };
