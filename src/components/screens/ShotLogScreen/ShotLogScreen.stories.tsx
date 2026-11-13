import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Notice } from "@/components/ui/Notice/Notice";
import { createTranslator } from "next-intl";
import messages from "@/i18n/messages/en.json";
import { exampleCoffee, exampleRecipe, exampleSetup } from "../fixtures";
import { PhoneFrame } from "../PhoneFrame";
import { ShotLogScreen } from "./ShotLogScreen";

const { actions, log, shot, states } = messages;
const t = createTranslator({ locale: "en", messages });

/** Temperature and pressure, untouched on a machine without them. */
const unset = { temperature: null, pressure: null };
const noPrep = { wdt: false, puckScreen: false };

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
    await expect(args.onSave).toHaveBeenCalledWith({ ...exampleRecipe, timeMs: 27_800 }, false, unset, noPrep);
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
    await expect(args.onSave).toHaveBeenCalledWith(expect.objectContaining({ timeMs: 27_600 }), false, unset, noPrep);
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
    await expect(args.onSave).toHaveBeenCalledWith(expect.anything(), true, unset, noPrep);
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
    await expect(args.onSave).toHaveBeenCalledWith(expect.objectContaining({ dose: 18.5, timeMs: 27_600 }), false, unset, noPrep);
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
    await expect(args.onSave).toHaveBeenCalledWith(expect.anything(), false, { temperature: 2, pressure: null }, noPrep);
  },
};

/** A machine with no controls shows exactly the four core tabs (AC 1). */
export const FixedMachine: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole("tab")).toHaveLength(4);
  },
};

/** WDT and puck screen are separate one-tap ticks, saved with the shot (STORY-01-03-06 AC 1). */
export const PuckPrep: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: log.prep })).toBeVisible();
    await userEvent.click(canvas.getByRole("switch", { name: log.prepWdt }));
    await userEvent.click(canvas.getByRole("button", { name: log.save }));
    await expect(args.onSave).toHaveBeenCalledWith(expect.anything(), false, unset, { wdt: true, puckScreen: false });
  },
};

/** A blank log starts with the last shot's ticks on this setup (AC 3). */
export const PrepFromLastShot: Story = {
  args: { prep: { wdt: true, puckScreen: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("switch", { name: log.prepWdt })).toBeChecked();
    await expect(canvas.getByRole("switch", { name: log.prepPuckScreen })).toBeChecked();
  },
};

/** A milk drink: a milk field under the drink and an amount tab, set by dragging (STORY-01-03-07 AC 1). */
export const MilkDrink: Story = {
  args: { drink: messages.drinks.latte, milk: { name: messages.milks.oat, startMl: 180 }, onPick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: new RegExp(messages.milks.oat) }));
    await expect(args.onPick).toHaveBeenCalledWith("milk");
    await userEvent.click(canvas.getByRole("tab", { name: new RegExp(log.milkAmount) }));
    const wheel = canvas.getByRole("slider", { name: log.milkAmount });
    await expect(wheel).toHaveAttribute("aria-valuenow", "180");
    wheel.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(wheel).toHaveAttribute("aria-valuenow", "190");
  },
};

/** An espresso asks no milk (AC 2). */
export const NoMilkForEspresso: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(log.milk)).toBeNull();
    await expect(canvas.queryByRole("tab", { name: new RegExp(log.milkAmount) })).toBeNull();
  },
};

/**
 * Everything "not sure" (STORY-01-06-08): a wide grind wheel with no finer or
 * coarser captions, no temperature or pressure tabs, nothing shown as a
 * warning, and one quiet link to tell Tare more (AC 1, AC 3, AC 4, AC 6).
 */
export const NotSureSetup: Story = {
  args: {
    grind: { min: 0, max: 100, step: 0.1, majorEvery: 10, coarser: null },
    capLink: { label: t("log.capUnknown", { kind: "grinder" }), onClick: fn() },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("tab")).toHaveLength(4);
    const wheel = canvas.getByRole("slider", { name: shot.grind });
    await expect(wheel).toHaveAttribute("aria-valuemax", "100");
    await expect(canvas.queryByText(shot.finer)).toBeNull();
    await expect(canvas.queryByText(shot.coarser)).toBeNull();
    const links = canvas.getAllByRole("button", { name: t("log.capUnknown", { kind: "grinder" }) });
    await expect(links).toHaveLength(1);
    await userEvent.click(links[0]);
    await expect(args.capLink!.onClick).toHaveBeenCalledOnce();
  },
};

/** Everything known: no link (AC 6). */
export const NoLinkWhenKnown: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("button", { name: /Tell us about/ })).toBeNull();
  },
};

/**
 * Edit mode (STORY-02-06-02): context read-only, taste on the same screen,
 * saved with "save changes".
 */
export const EditMode: Story = {
  args: {
    mode: "edit",
    readOnly: ["setup", "drink", "coffee"],
    onPick: fn(),
    taste: <Notice tone="warning" warning="channelling">{shot.warnings.channelling}</Notice>,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: log.titleEdit })).toBeVisible();
    await expect(canvas.queryByRole("button", { name: new RegExp(log.setup) })).toBeNull();
    await expect(canvas.getByText(shot.warnings.channelling)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: log.saveChanges }));
    await expect(args.onSave).toHaveBeenCalled();
    await expect(args.onPick).not.toHaveBeenCalled();
  },
};

/**
 * A stored grind outside today's range widens the wheel to show it, and it
 * saves unchanged; never clamped silently (STORY-01-06-09 AC 4).
 */
export const EditKeepsAnOldValue: Story = {
  args: {
    mode: "edit",
    readOnly: ["setup", "drink", "coffee"],
    start: { ...exampleRecipe, grind: 44 },
    grind: { min: 0, max: 40, step: 0.5, majorEvery: 2, coarser: "higher" },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const wheel = canvas.getByRole("slider", { name: shot.grind });
    await expect(wheel).toHaveAttribute("aria-valuenow", "44");
    await expect(Number(wheel.getAttribute("aria-valuemax"))).toBeGreaterThanOrEqual(44);
    await userEvent.click(canvas.getByRole("button", { name: log.saveChanges }));
    await expect(args.onSave).toHaveBeenCalledWith({ ...exampleRecipe, grind: 44 }, false, unset, noPrep);
  },
};
