import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { CoffeeOrigin } from "@/components/catalog/CoffeeOrigin";
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

/** A bag with its own recipe says so on its row, in words; the recipes listed are the coffee's (STORY-02-04-03 AC 4). */
export const BagWithOwnRecipe: Story = {
  args: { bags: [{ ...bags[0], note: messages.recipe.bagHasOwn }, ...bags.slice(1)] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByText(messages.recipe.bagHasOwn)).toHaveLength(1);
  },
};

export const BagWithOwnRecipeRightToLeft: Story = { args: BagWithOwnRecipe.args, globals: { direction: "rtl" } };

export const RightToLeft: Story = { globals: { direction: "rtl" } };

const { catalog, actions } = messages;
const originAction = (origin: string | null, onSave = fn(async () => true)) => (
  <CoffeeOrigin
    origin={origin}
    onSave={onSave}
    labels={{
      title: catalog.origin.title,
      close: actions.close,
      notStated: catalog.origin.notStated,
      blend: catalog.origin.blend,
      other: catalog.origin.other,
      otherLabel: catalog.origin.otherLabel,
      otherHint: catalog.origin.otherHint,
      done: catalog.origin.done,
      set: catalog.origin.set,
      change: catalog.origin.change,
      saveFailed: states.saveFailed,
    }}
  />
);

/** The origin leads the details line when stated (STORY-03-07-05 AC 1); a verified coffee offers no change (AC 3). */
export const WithOrigin: Story = {
  args: { details: t("coffee.detailsMore", { first: "Ethiopia", rest: t("coffee.details", { roast: "Light", notes: "jasmine and peach" }) }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Ethiopia · Light · jasmine and peach")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: catalog.origin.change })).toBeNull();
  },
};

/** The household's own unverified coffee: it can set the origin (AC 2). */
export const SetOrigin: Story = {
  args: { originAction: originAction(null) },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: catalog.origin.set }));
    const dialog = await within(document.body).findByRole("dialog", { name: catalog.origin.title });
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(within(dialog).getByRole("button", { name: "Colombia" }));
    await waitFor(() => expect(dialog).not.toBeVisible());
  },
};

/** A failed save keeps the sheet open and says so. */
export const SetOriginFailed: Story = {
  args: { originAction: originAction("CO", fn(async () => false)) },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: catalog.origin.change }));
    const dialog = await within(document.body).findByRole("dialog", { name: catalog.origin.title });
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(within(dialog).getByRole("button", { name: catalog.origin.blend }));
    await expect(await within(dialog).findByText(states.saveFailed)).toBeVisible();
  },
};
