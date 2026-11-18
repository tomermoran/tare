import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, fn, userEvent, within } from "storybook/test";
import { HomeScreen } from "@/components/screens/HomeScreen/HomeScreen";
import { exampleCoffee, exampleRecipe, exampleSetup } from "@/components/screens/fixtures";
import { PhoneFrame } from "@/components/screens/PhoneFrame";
import { Button } from "@/components/ui/Button/Button";
import messages from "@/i18n/messages/en.json";
import { RedialCard } from "./RedialCard";

const t = createTranslator({ locale: "en", messages });
const { home } = messages;
const labels = { title: home.redial.title, body: home.redial.body, start: home.redial.start, later: home.redial.later };

const meta = {
  title: "Home/Re-dial card",
  component: RedialCard,
  args: { labels, onStart: fn(), onLater: fn() },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RedialCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One calm card: re-dial a coffee, or not now (STORY-04-03-04 AC 2, AC 3). */
export const OneGrinder: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: home.redial.title })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: home.redial.start }));
    await expect(args.onStart).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: home.redial.later }));
    await expect(args.onLater).toHaveBeenCalled();
  },
};

/** With two grinders, the card names the serviced one. */
export const TwoGrinders: Story = {
  args: { labels: { ...labels, title: t("home.redial.titleNamed", { grinder: "Example Grinder" }) } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("heading", { name: "Your Example Grinder was serviced" })).toBeVisible();
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };

/** On a 375 x 667 phone, Pull and Dial in stay in view with the card (AC 2). */
export const OnBrewSmallPhone: Story = {
  render: (args) => (
    <PhoneFrame small>
      <HomeScreen
        drink={messages.drinks.espresso}
        coffee={home.coffeeLine.replace("{bean}", exampleCoffee.bean).replace("{roaster}", exampleCoffee.roaster)}
        values={exampleRecipe}
        setup={exampleSetup}
        actions={
          <>
            <Button variant="primary" fullWidth>
              {home.pull}
            </Button>
            <Button variant="ghost" fullWidth>
              {home.dialIn}
            </Button>
          </>
        }
        labels={{ changeDrink: home.changeDrink, changeCoffee: home.changeCoffee }}
        onChangeDrink={fn()}
      />
      <div className="mt-8">
        <RedialCard {...args} />
      </div>
    </PhoneFrame>
  ),
  decorators: [(Story) => <Story />],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId("phone-frame").getBoundingClientRect();
    const pull = canvas.getByRole("button", { name: home.pull }).getBoundingClientRect();
    await expect(pull.bottom).toBeLessThanOrEqual(frame.bottom);
    await expect(canvas.getByRole("heading", { name: home.redial.title })).toBeInTheDocument();
  },
};
