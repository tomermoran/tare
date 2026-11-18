import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { MaintenanceSection } from "./MaintenanceSection";

const t = createTranslator({ locale: "en", messages });
const { maintenance } = messages;

const meta = {
  title: "Screens/Part/Maintenance",
  component: MaintenanceSection,
  decorators: [(Story) => <div className="w-[358px]"><Story /></div>],
  args: {
    labels: { title: maintenance.title, none: maintenance.none, add: maintenance.add, recalibration: maintenance.recalibration },
    events: [],
    onAdd: fn(),
  },
} satisfies Meta<typeof MaintenanceSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing logged: says so and offers to add (STORY-04-01-01 AC 5). */
export const Empty: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(maintenance.none)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: maintenance.add }));
    await expect(args.onAdd).toHaveBeenCalled();
  },
};

/** A grinder with no events: all its shots are one period (STORY-04-01-03 AC 2). */
export const GrinderNoEvents: Story = { args: { period: { line: maintenance.periodAll } } };

/**
 * A grinder's events newest first, with the current period above them
 * (AC 1); the recalibration said in words (STORY-04-01-02 AC 3).
 */
export const GrinderEvents: Story = {
  args: {
    period: {
      line: t("maintenance.periodSince", { date: "3 October" }),
      shots: t("maintenance.periodShots", { count: 14 }),
    },
    events: [
      { id: "e2", kind: maintenance.kind.rezero, date: "3 October", note: null, recalibration: true },
      { id: "e1", kind: maintenance.kind.clean, date: "12 September", note: "Brushed out the chamber and the chute after a dark roast.", recalibration: false },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(t("maintenance.periodSince", { date: "3 October" }))).toBeVisible();
    const rows = canvas.getAllByRole("listitem");
    await expect(rows[0]).toHaveTextContent(maintenance.kind.rezero);
    await expect(rows[0]).toHaveTextContent(maintenance.recalibration);
    await expect(rows[1]).not.toHaveTextContent(maintenance.recalibration);
  },
};

export const GrinderEventsRightToLeft: Story = { ...GrinderEvents, globals: { direction: "rtl" } };

/** A recalibrating event with recipes before it: the status above the events, offering one re-dial (STORY-04-03-04 AC 1). */
export const AwaitingRedial: Story = {
  args: {
    ...GrinderEvents.args,
    status: (
      <div className="flex flex-col items-start gap-3 pt-1 pb-3">
        <p className="text-body text-ink">{maintenance.redialAwaiting}</p>
        <button type="button" className="text-body text-ink underline" onClick={fn()}>
          {maintenance.redialStart}
        </button>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(maintenance.redialAwaiting)).toBeVisible();
    await expect(canvas.getByRole("button", { name: maintenance.redialStart })).toBeVisible();
  },
};

/** A grinder's events with their state in words; those that can have a shift open it (STORY-04-03-05 AC 1). */
export const EventStates: Story = {
  args: {
    events: [
      { id: "e4", kind: maintenance.kind.burrs, date: "18 November", note: null, recalibration: true, state: maintenance.state.awaiting, onOpen: fn() },
      { id: "e3", kind: maintenance.kind.rezero, date: "9 October", note: null, recalibration: true, state: t("maintenance.state.shift", { value: "−3" }), onOpen: fn() },
      { id: "e2", kind: maintenance.kind.burrs, date: "2 August", note: null, recalibration: true, state: maintenance.state.noAdjustment, onOpen: fn() },
      { id: "e1", kind: maintenance.kind.rezero, date: "1 June", note: null, recalibration: true, state: maintenance.state.nothingToMap },
    ],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const awaiting = canvas.getByRole("button", { name: new RegExp(maintenance.state.awaiting) });
    await userEvent.click(awaiting);
    await expect(args.events[0].onOpen).toHaveBeenCalled();
    await expect(canvas.getByText("Shift −3")).toBeVisible();
    await expect(canvas.getAllByRole("button").filter((b) => b.textContent?.includes(maintenance.state.nothingToMap))).toHaveLength(0);
  },
};

export const EventStatesRightToLeft: Story = { ...EventStates, play: undefined, globals: { direction: "rtl" } };
