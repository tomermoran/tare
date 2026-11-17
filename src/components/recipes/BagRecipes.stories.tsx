import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { BagRecipes } from "./BagRecipes";
import type { RecipeRow } from "./RecipeRows";

/* A bag's recipes (STORY-02-04-03, STORY-02-04-04): its own first, then the coffee's, and going back to the coffee's. */

const { recipe, actions, drinks, states } = messages;
const row = (drink: string) => recipe.row.replace("{drink}", drink).replace("{setup}", "Daily espresso");
const at = (date: string) => recipe.pinnedOn.replace("{date}", date);
const own: RecipeRow = {
  id: "own",
  title: row(drinks.espresso),
  values: { grind: 16, dose: 18, yield: 38, timeMs: 29_000 },
  lines: [],
  date: at("14 Mar 2026"),
  dialInHref: "/log?drinkId=espresso",
  changeHref: "/log?mode=recipe&batchId=b&drinkId=espresso",
  setupId: "s",
  drinkTypeId: "espresso",
};
const coffee: RecipeRow = { ...own, id: "coffee", values: { grind: 14, dose: 18, yield: 36, timeMs: 28_000 }, date: at("2 Mar 2026") };
const body = () => within(document.body);

const meta = {
  title: "Recipes/Bag recipes",
  component: BagRecipes,
  args: {
    own: [own],
    coffee: [coffee],
    labels: { dialIn: recipe.dialIn, change: recipe.changeRecipe, close: actions.close, thisBagOnly: recipe.thisBagOnly, coffeeDefault: recipe.coffeeDefault },
    remove: {
      labels: {
        action: recipe.bagRemove,
        title: recipe.bagRemoveTitle,
        body: recipe.bagRemoveBody,
        confirm: recipe.bagRemoveConfirm,
        cancel: actions.cancel,
        failed: states.saveFailed,
        retry: actions.retry,
      },
      onRemove: fn(async () => true),
    },
  },
} satisfies Meta<typeof BagRecipes>;

export default meta;
type Story = StoryObj<typeof meta>;

const openOwn = async (el: HTMLElement) => {
  const section = within(el).getByRole("region", { name: recipe.thisBagOnly });
  await userEvent.click(within(section).getByRole("button", { name: new RegExp(drinks.espresso) }));
  await waitFor(() => expect(body().getByRole("button", { name: recipe.bagRemove })).toBeVisible());
};

/** The bag's own recipe first under "For this bag only", the coffee's under "Other bags use" (AC 2). */
export const Both: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headings = canvas.getAllByRole("heading").map((h) => h.textContent);
    await expect(headings).toEqual([recipe.thisBagOnly, recipe.coffeeDefault]);
  },
};

/** Without its own recipe, the coffee's show as before, with no heading. */
export const CoffeeOnly: Story = {
  args: { own: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("heading")).toBeNull();
  },
};

/** Going back to the coffee's recipe is asked once, then done (STORY-02-04-04 AC 1). */
export const Remove: Story = {
  play: async ({ canvasElement, args }) => {
    await openOwn(canvasElement);
    await userEvent.click(body().getByRole("button", { name: recipe.bagRemove }));
    await waitFor(() => expect(body().getByRole("dialog", { name: recipe.bagRemoveTitle })).toBeVisible());
    await userEvent.click(body().getByRole("button", { name: recipe.bagRemoveConfirm }));
    await waitFor(() => expect(args.remove.onRemove).toHaveBeenCalledWith(expect.objectContaining({ id: "own" })));
    await waitFor(() => expect(body().queryByRole("dialog", { name: recipe.bagRemoveTitle })).toBeNull());
  },
};

/** Not confirming changes nothing (AC 3). */
export const RemoveCancelled: Story = {
  play: async ({ canvasElement, args }) => {
    await openOwn(canvasElement);
    await userEvent.click(body().getByRole("button", { name: recipe.bagRemove }));
    await waitFor(() => expect(body().getByRole("dialog", { name: recipe.bagRemoveTitle })).toBeVisible());
    await userEvent.click(body().getByRole("button", { name: actions.cancel }));
    await expect(args.remove.onRemove).not.toHaveBeenCalled();
  },
};

/** A failure keeps the sheet with a retry (AC 4). */
export const RemoveFails: Story = {
  args: { remove: { ...meta.args.remove, onRemove: fn(async () => false) } },
  play: async ({ canvasElement, args }) => {
    await openOwn(canvasElement);
    await userEvent.click(body().getByRole("button", { name: recipe.bagRemove }));
    await waitFor(() => expect(body().getByRole("button", { name: recipe.bagRemoveConfirm })).toBeVisible());
    await userEvent.click(body().getByRole("button", { name: recipe.bagRemoveConfirm }));
    await waitFor(() => expect(body().getByText(states.saveFailed)).toBeVisible());
    await userEvent.click(body().getByRole("button", { name: actions.retry }));
    await waitFor(() => expect(args.remove.onRemove).toHaveBeenCalledTimes(2));
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };
