import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { PinSheet, type PinRecipeView } from "./PinSheet";

const t = createTranslator({ locale: "en", messages });
const { recipe, actions, states, log } = messages;

// Fictional coffee and setup.
const title = t("recipe.pinTitle", { drink: "Flat white", coffee: "Morning Blend", setup: "Kitchen" });
const labels = {
  title,
  close: actions.close,
  newRecipe: recipe.newRecipe,
  replaces: recipe.replaces,
  changes: recipe.changes,
  confirm: recipe.confirmPin,
};
const milkLine = t("shot.milkLine", { milk: messages.milks.oat, amount: "120 ml" });
const next: PinRecipeView = { values: { grind: 14, dose: 18, yield: 38, timeMs: 29_000 }, lines: [milkLine, log.prepWdt] };
const old: PinRecipeView = { values: { grind: 15, dose: 18, yield: 36, timeMs: 28_000 }, lines: [milkLine] };
const changes = [
  t("recipe.change", { field: messages.shot.grind, from: "15", to: "14" }),
  t("recipe.change", { field: messages.shot.yield, from: "36 g", to: "38 g" }),
  t("recipe.change", { field: log.prepWdt, from: recipe.no, to: recipe.yes }),
];

const meta = {
  title: "Recipes/Pin sheet",
  component: PinSheet,
  args: { open: true, onClose: fn(), labels, recipe: next, replaces: null, changes: [], onConfirm: fn() },
} satisfies Meta<typeof PinSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A first recipe: what it's for, its values with milk and prep, one primary (STORY-02-01-01 AC 1). */
export const New: Story = {
  play: async ({ args }) => {
    const canvas = within(document.body);
    await waitFor(() => expect(canvas.getByRole("heading", { name: title })).toBeVisible());
    await expect(canvas.getByText(milkLine)).toBeVisible();
    await expect(canvas.getByText(log.prepWdt)).toBeVisible();
    await expect(canvas.queryByText(recipe.replaces)).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: recipe.confirmPin }));
    await expect(args.onConfirm).toHaveBeenCalled();
  },
};

/** Replacing a recipe: the old one above, quieter, and what changes, prep included. */
export const Replaces: Story = {
  args: { replaces: old, changes },
  play: async () => {
    const canvas = within(document.body);
    await waitFor(() => expect(canvas.getByText(recipe.replaces)).toBeVisible());
    for (const c of changes) await expect(canvas.getByText(c)).toBeVisible();
  },
};

/** A failed pin keeps the sheet, with a retry (AC 6). */
export const Failed: Story = {
  args: { failure: { message: states.saveFailed, retryLabel: actions.retry, onRetry: fn() } },
  play: async ({ args }) => {
    const canvas = within(document.body);
    await waitFor(() => expect(canvas.getByText(states.saveFailed)).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: actions.retry }));
    await expect(args.failure!.onRetry).toHaveBeenCalled();
  },
};

export const RightToLeft: Story = { args: { replaces: old, changes }, globals: { direction: "rtl" } };
