import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { exampleCoffee, exampleRecipe, exampleRemainingGrams, exampleSetup } from "../fixtures";
import { PhoneFrame } from "../PhoneFrame";
import { HomeScreen } from "./HomeScreen";

const { home } = messages;

const base = {
  state: "recipe" as const,
  drink: messages.drinks.latte,
  coffee: exampleCoffee,
  recipe: exampleRecipe,
  setup: exampleSetup,
  remainingGrams: exampleRemainingGrams,
};

/** Pull, react and undo, with the remaining coffee going down by the dose. */
function Interactive() {
  const [pulled, setPulled] = useState(false);
  const [reaction, setReaction] = useState<"good" | "off" | null>(null);
  const [remaining, setRemaining] = useState(exampleRemainingGrams);
  return (
    <HomeScreen
      {...base}
      remainingGrams={remaining}
      pulled={pulled}
      reaction={reaction}
      onPull={() => {
        setPulled(true);
        setReaction(null);
        setRemaining((g) => g - exampleRecipe.dose);
      }}
      onUndo={() => {
        setPulled(false);
        setRemaining((g) => g + exampleRecipe.dose);
      }}
      onReaction={setReaction}
    />
  );
}

const meta = {
  title: "Screens/Home",
  component: HomeScreen,
  parameters: { layout: "centered" },
  args: base,
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

export const Everyday: Story = {
  render: () => <Interactive />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: home.pull }));
    await expect(canvas.getByRole("radio", { name: home.reactionGood })).toBeInTheDocument();
    await expect(canvas.getByText("124 g left in this bag")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: home.undo }));
    await expect(canvas.getByRole("button", { name: home.pull })).toBeInTheDocument();
    await expect(canvas.getByText("142 g left in this bag")).toBeInTheDocument();
  },
};

export const AfterPull: Story = { args: { pulled: true, reaction: "good" } };
export const NoRecipeYet: Story = { args: { state: "noRecipe", recipe: undefined } };
export const FirstRun: Story = { args: { state: "firstRun" } };
export const RightToLeft: Story = { globals: { direction: "rtl" } };
