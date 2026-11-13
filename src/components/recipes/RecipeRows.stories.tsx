import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { RecipeRows } from "./RecipeRows";

const { recipe, actions, drinks, milks, shot, log, home } = messages;
const ml = (n: number) => new Intl.NumberFormat("en", { style: "unit", unit: "milliliter", unitDisplay: "short" }).format(n);
const row = (drink: string) => recipe.row.replace("{drink}", drink).replace("{setup}", "Daily espresso");

const meta = {
  title: "Recipes/RecipeRows",
  component: RecipeRows,
  args: {
    rows: [
      {
        id: "latte",
        title: row(drinks.latte),
        values: { grind: 14.5, dose: 18, yield: 38, timeMs: 27_600 },
        lines: [shot.milkLine.replace("{milk}", milks.oat).replace("{amount}", ml(150)), home.prep.replace("{tools}", log.prepWdt)],
        date: recipe.pinnedOn.replace("{date}", "12 Mar 2026"),
        dialInHref: "/log?drinkId=latte",
        changeHref: "/log?mode=recipe&batchId=b&drinkId=latte",
      },
      {
        id: "espresso",
        title: row(drinks.espresso),
        values: { grind: 14, dose: 18, yield: 36, timeMs: 28_000 },
        lines: [],
        date: recipe.pinnedOn.replace("{date}", "9 Mar 2026"),
        dialInHref: "/log?drinkId=espresso",
        changeHref: "/log?mode=recipe&batchId=b&drinkId=espresso",
      },
    ],
    labels: { dialIn: recipe.dialIn, change: recipe.changeRecipe, close: actions.close },
  },
} satisfies Meta<typeof RecipeRows>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rows show values, prep, milk and date; opening one offers dial in and change. */
export const Rows: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: new RegExp(drinks.latte) }));
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByRole("link", { name: recipe.dialIn })).toBeVisible());
    await expect(body.getByRole("link", { name: recipe.changeRecipe })).toHaveAttribute("href", "/log?mode=recipe&batchId=b&drinkId=latte");
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };
