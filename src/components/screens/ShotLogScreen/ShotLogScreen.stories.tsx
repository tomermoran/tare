import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Notice } from "@/components/ui/Notice/Notice";
import messages from "@/i18n/messages/en.json";
import { exampleCoffee, exampleRecipe, exampleSetup } from "../fixtures";
import { PhoneFrame } from "../PhoneFrame";
import { ShotLogScreen } from "./ShotLogScreen";

const { log, shot } = messages;

const meta = {
  title: "Screens/Shot log",
  component: ShotLogScreen,
  parameters: { layout: "centered" },
  args: {
    mode: "dialIn",
    setup: exampleSetup,
    drink: messages.drinks.latte,
    coffee: exampleCoffee.bean,
    start: exampleRecipe,
    onSave: fn(),
  },
  decorators: [
    (Story) => (
      <PhoneFrame>
        <Story />
      </PhoneFrame>
    ),
  ],
} satisfies Meta<typeof ShotLogScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Dial in from the recipe: change one value, save. Time is saved in ms. */
export const DialIn: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: /Time/ }));
    const wheel = canvas.getByRole("slider", { name: shot.time });
    wheel.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    await userEvent.click(canvas.getByRole("button", { name: log.save }));
    await expect(args.onSave).toHaveBeenCalledWith({ ...exampleRecipe, timeMs: 27_800 }, false);
  },
};

/** Nothing set up yet: the fields say what to add and open the add tasks (AC 5). */
export const MissingContext: Story = {
  args: {
    mode: "new",
    setup: log.missingSetup,
    coffee: log.missingCoffee,
    onPick: fn(),
    notice: <Notice urgent>{log.missingSetupNote}</Notice>,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: new RegExp(log.missingSetup) }));
    await expect(args.onPick).toHaveBeenCalledWith("setup");
    await userEvent.click(canvas.getByRole("button", { name: new RegExp(log.missingCoffee) }));
    await expect(args.onPick).toHaveBeenCalledWith("coffee");
    await expect(canvas.getByText(log.missingSetupNote)).toBeVisible();
  },
};

/** Milestone 1: one setup, so its field is shown but can't be changed. */
export const SetupReadOnly: Story = {
  args: { mode: "new", readOnly: ["setup"] },
  play: async ({ canvasElement }) => {
    const context = within(within(canvasElement).getByTestId("log-context"));
    await expect(context.getAllByRole("button")).toHaveLength(2);
  },
};

export const FixAnOffShot: Story = { args: { mode: "fix" } };
export const RightToLeft: Story = { globals: { direction: "rtl" } };

/** On a short screen the log scrolls; nothing gets squashed or clipped. */
export const ShortScreen: Story = {
  decorators: [
    (Story) => (
      <div className="flex h-[480px] w-[390px] flex-col overflow-hidden rounded-[28px] border border-line bg-paper">
        <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-5 pb-6">
          <Story />
        </div>
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const context = within(canvasElement).getByTestId("log-context");
    await expect(context.clientHeight).toBe(context.scrollHeight);
  },
};
