import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Notice } from "@/components/ui/Notice/Notice";
import messages from "@/i18n/messages/en.json";
import { exampleCoffee, exampleRecipe, exampleSetup } from "../fixtures";
import { PhoneFrame } from "../PhoneFrame";
import { ShotLogScreen } from "./ShotLogScreen";

const { actions, log, shot, states } = messages;

/** Temperature and pressure, untouched on a machine without them. */
const unset = { temperature: null, pressure: null };

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
    await expect(args.onSave).toHaveBeenCalledWith({ ...exampleRecipe, timeMs: 27_800 }, false, unset);
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

/**
 * A stepped grinder that goes coarser with lower numbers: grind snaps to its
 * steps, captions point the right way, and the ratio follows dose and yield.
 */
export const SteppedGrinder: Story = {
  args: { mode: "new", grind: { min: 1, max: 30, step: 1, majorEvery: 5, coarser: "lower" }, start: { ...exampleRecipe, grind: 12 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [start, end] = canvas.getByTestId("end-captions").children;
    await expect(start).toHaveTextContent(shot.coarser);
    await expect(end).toHaveTextContent(shot.finer);
    const wheel = canvas.getByRole("slider", { name: shot.grind });
    wheel.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(wheel).toHaveAttribute("aria-valuenow", "13");

    await userEvent.click(canvas.getByRole("tab", { name: /Yield/ }));
    const yieldWheel = canvas.getByRole("slider", { name: shot.yield });
    yieldWheel.focus();
    await userEvent.keyboard("{End}");
    await expect(canvas.getByText(/^1 : /)).toHaveTextContent(`1 : ${(100 / exampleRecipe.dose).toFixed(1)}`);
  },
};

/** Time is shown in seconds with one decimal and saved in milliseconds. */
export const TimeInSeconds: Story = {
  args: { mode: "new", start: { ...exampleRecipe, timeMs: 27_600 } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("tab", { name: /Time/ })).toHaveTextContent("27.6");
    await userEvent.click(canvas.getByRole("button", { name: log.save }));
    await expect(args.onSave).toHaveBeenCalledWith(expect.objectContaining({ timeMs: 27_600 }), false, unset);
  },
};

/** Saving failed: the values stay, and the notice offers to try again (AC 4). */
export const SaveFailed: Story = {
  args: {
    mode: "new",
    start: { ...exampleRecipe, timeMs: 31_200 },
    notice: (
      <Notice urgent title={log.saveFailedTitle} action={{ label: actions.retry, onClick: fn() }}>
        {states.saveFailed}
      </Notice>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent(log.saveFailedTitle);
    await expect(canvas.getByRole("tab", { name: /Time/ })).toHaveTextContent("31.2");
    await expect(canvas.getByRole("button", { name: actions.retry })).toBeVisible();
  },
};

/** While saving, Save is busy and can't be pressed twice. */
export const Saving: Story = {
  args: { mode: "new", saving: true },
  play: async ({ canvasElement }) => {
    const save = within(canvasElement).getByRole("button", { name: log.save });
    await expect(save).toBeDisabled();
    await expect(save).toHaveAttribute("aria-busy", "true");
  },
};

/** Sweetened starts off for any drink and is passed on save (STORY-01-03-04). */
export const Sweetened: Story = {
  args: { mode: "new", drink: messages.drinks.espresso },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch", { name: log.sweetened });
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await userEvent.click(canvas.getByRole("button", { name: log.save }));
    await expect(args.onSave).toHaveBeenCalledWith(expect.anything(), true, unset);
  },
};

/** German numbers: commas on screen, canonical grams and ms saved (STORY-01-03-05). */
export const GermanNumbers: Story = {
  args: { mode: "new", start: { ...exampleRecipe, dose: 18.5, timeMs: 27_600 } },
  globals: { locale: "de-DE" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("tab", { name: /Dose/ })).toHaveTextContent("18,5");
    await expect(canvas.getByRole("tab", { name: /Time/ })).toHaveTextContent("27,6");
    await userEvent.click(canvas.getByRole("button", { name: log.save }));
    await expect(args.onSave).toHaveBeenCalledWith(expect.objectContaining({ dose: 18.5, timeMs: 27_600 }), false, unset);
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
    const canvas = within(canvasElement);
    const context = canvas.getByTestId("log-context");
    await expect(context.clientHeight).toBe(context.scrollHeight);
    // Save stays pinned inside the visible area, even though the log scrolls.
    const save = canvas.getByRole("button", { name: log.save }).getBoundingClientRect();
    const frame = canvas.getByTestId("log-save").closest(".overflow-y-auto")!.getBoundingClientRect();
    await expect(save.bottom).toBeLessThanOrEqual(frame.bottom);
  },
};

/** A machine with temperature steps and exact pressure: six tabs, both unset (STORY-01-04-01 AC 2). */
export const WithTemperatureAndPressure: Story = {
  args: {
    brew: { temperature: { kind: "steps", count: 3 }, pressure: { kind: "wheel", min: 0, max: 12, step: 0.5, unit: "bar" } },
    brewLast: { temperature: 2, pressure: 9 },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("tab")).toHaveLength(6);
    await userEvent.click(canvas.getByRole("tab", { name: /Temperature/ }));
    await userEvent.click(canvas.getByRole("button", { name: messages.log.addTemperature }));
    await userEvent.click(canvas.getByRole("button", { name: messages.log.save }));
    await expect(args.onSave).toHaveBeenCalledWith(expect.anything(), false, { temperature: 2, pressure: null });
  },
};

/** A machine with no controls shows exactly the four core tabs (AC 1). */
export const FixedMachine: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole("tab")).toHaveLength(4);
  },
};
