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
