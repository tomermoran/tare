import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "@/components/ui/Button/Button";
import { createTranslator } from "next-intl";
import messages from "@/i18n/messages/en.json";
import { exampleCoffee, exampleRecipe, exampleSetup } from "../fixtures";
import { PhoneFrame } from "../PhoneFrame";
import { HomeScreen } from "./HomeScreen";

const { home } = messages;
const t = createTranslator({ locale: "en", messages });
const unit = (n: number, u: string) => new Intl.NumberFormat("en", { style: "unit", unit: u, unitDisplay: "short" }).format(n);
const coffeeLine = home.coffeeLine.replace("{bean}", exampleCoffee.bean).replace("{roaster}", exampleCoffee.roaster);

const buttons = (primary: string, secondary?: string) => (
  <>
    <Button variant="primary" fullWidth>
      {primary}
    </Button>
    {secondary && (
      <Button variant="ghost" fullWidth>
        {secondary}
      </Button>
    )}
  </>
);

const meta = {
  title: "Screens/Home",
  component: HomeScreen,
  parameters: { layout: "centered" },
  args: {
    drink: messages.drinks.latte,
    coffee: coffeeLine,
    clocks: t("home.coffeeClocks", { roasting: t("bag.daysSinceRoast", { days: 12 }), opened: t("portion.openFor", { days: 3 }) }),
    values: exampleRecipe,
    lines: [
      messages.shot.milkLine.replace("{milk}", messages.milks.oat).replace("{amount}", unit(150, "milliliter")),
      home.prep.replace("{tools}", messages.log.prepWdt),
    ],
    setup: exampleSetup,
    actions: buttons(home.pull, home.dialIn),
    footnote: home.remaining.replace("{amount}", unit(142, "gram")),
    labels: { changeDrink: home.changeDrink, changeCoffee: home.changeCoffee },
    onChangeDrink: fn(),
    onChangeCoffee: fn(),
  },
  decorators: [
    (Story) => (
      <PhoneFrame>
        <Story />
      </PhoneFrame>
    ),
  ],
} satisfies Meta<typeof HomeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The daily driver: recipe, milk and prep lines, setup, one primary. */
export const Recipe: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("button", { name: home.pull })).toHaveLength(1);
    await expect(canvas.getByText(exampleSetup)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: new RegExp(home.changeCoffee) }));
    await expect(args.onChangeCoffee).toHaveBeenCalled();
  },
};

export const NoRecipe: Story = {
  args: { values: undefined, lines: [], message: home.noRecipe, actions: buttons(home.dialIn) },
};

export const NoRecipeOnSetup: Story = {
  args: {
    values: undefined,
    lines: [],
    message: home.noRecipeOnSetup,
    note: home.startsFrom.replace("{setup}", "Weekend setup"),
    actions: buttons(home.dialIn),
  },
};

/** The recipe stays, quietly; choose another coffee or add a bag. */
export const Finished: Story = {
  args: { quiet: true, message: home.coffeeFinished, footnote: undefined, actions: buttons(home.chooseCoffee, home.addBag) },
};

export const NoCoffee: Story = {
  args: { coffee: null, values: undefined, lines: [], message: home.noCoffee, footnote: undefined, actions: buttons(home.addBag) },
};

/** Both clocks on one line, worded so they can't be confused (STORY-03-03-04 AC 4). */
export const Clocks: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("12 days since roast · open 3 days")).toBeVisible();
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };
