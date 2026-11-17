import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createFormatter, createTranslator } from "next-intl";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { runOutContent } from "@/lib/runOutContent";
import type { RunOutView } from "@/server/dal/runOut";
import { RunOutLine, RunOutLineSkeleton } from "./RunOutLine";
import { RunOutSheet } from "./RunOutSheet";

/*
 * The run-out line and SH-RUNOUT (EPIC-03-05), worded by the same function
 * as the Beans page, from en.json.
 */

const t = createTranslator({ locale: "en", messages });
const format = createFormatter({ locale: "en", timeZone: "UTC" });
const words = (view: RunOutView) => runOutContent(view, { t, format, timeZone: "UTC" });
const { beans, actions, states } = messages;
const labels = { title: beans.runOutTitle, close: actions.close, loadFailed: states.loadFailed, retry: actions.retry };

const steady: RunOutView = {
  kind: "estimate",
  weeklyGrams: 85,
  finished: 6,
  weeks: 11,
  onHand: { grams: 425, frozenGrams: 170 },
  logged: { share: 0.78, overLogged: false },
  span: { kind: "span", unit: "week", value: 5, frozen: 2, until: new Date(Date.UTC(2026, 11, 14, 8)) },
};
const learning: RunOutView = { kind: "learning", finished: 1, needed: 3, onHand: { grams: 250, frozenGrams: 0 }, logged: null, span: null };

const meta = {
  title: "Beans/Run-out",
  component: RunOutLine,
  args: { content: words(steady), labels, onRetry: fn() },
  decorators: [(Story) => <div className="max-w-md">{Story()}</div>],
} satisfies Meta<typeof RunOutLine>;

export default meta;
type Story = StoryObj<typeof meta>;

const body = () => within(document.body);
const noSignal = async (root: HTMLElement) => {
  // Calm information: never the warning colour (STORY-03-05-02 AC 6).
  await expect(root.querySelector("[class*='signal']")).toBeNull();
};

/** One line with the span and the freezer's part; it opens the sheet with its inputs (AC 1, AC 3). */
export const Steady: Story = {
  play: async ({ canvasElement }) => {
    const line = within(canvasElement).getByRole("button", { name: "About 5 weeks of coffee, 2 of them in the freezer" });
    await noSignal(canvasElement);
    await userEvent.click(line);
    const dialog = await body().findByRole("dialog", { name: beans.runOutTitle });
    await waitFor(() => expect(dialog).toBeVisible());
    const sheet = within(dialog);
    await expect(sheet.getByText("Around December 14")).toBeVisible();
    await expect(sheet.getByText("5 weeks")).toBeVisible();
    await expect(sheet.getByText("About 85g a week")).toBeVisible();
    await expect(sheet.getByText("6 finished portions over 11 weeks")).toBeVisible();
    await expect(sheet.getByText("78% of finished coffee")).toBeVisible();
    await expect(sheet.getByText(beans.coverage.meaning)).toBeVisible();
    await noSignal(dialog);
  },
};

/** Too little history: a quieter line, and progress with no figure (STORY-03-05-01 AC 2; STORY-03-05-03 AC 3). */
export const Learning: Story = {
  args: { content: words(learning) },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: beans.learning }));
    const dialog = await body().findByRole("dialog", { name: beans.runOutTitle });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(within(dialog).getByText("Tare needs a few finished bags to work this out. 1 of 3 so far.")).toBeVisible();
    await expect(within(dialog).getByText(beans.coverage.unavailable)).toBeVisible();
    await expect(within(dialog).queryByText(/a week/)).toBeNull();
  },
};

/** More than six months on hand. */
export const Long: Story = {
  args: { content: words({ ...steady, span: { kind: "long", months: 6, until: new Date(Date.UTC(2027, 7, 1)) } }) },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "More than 6 months of coffee" })).toBeVisible();
  },
};

/** Any Beans filter on, or no content (nothing on hand, stale, a failed read): no line (STORY-03-05-02 AC 4). */
export const FilterOn: Story = {
  args: { filtersActive: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("button")).toBeNull();
  },
};

export const Absent: Story = {
  args: { content: null },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("button")).toBeNull();
  },
};

/** The sheet couldn't work the figures out: it offers a retry (STORY-03-05-01 AC 5). */
export const SheetFailed: Story = {
  render: () => <RunOutSheet open onClose={fn()} content={null} onRetry={fn()} labels={labels} />,
  play: async () => {
    const dialog = await body().findByRole("dialog", { name: beans.runOutTitle });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(within(dialog).getByText(states.loadFailed)).toBeVisible();
    await expect(within(dialog).getByRole("button", { name: actions.retry })).toBeVisible();
  },
};

export const Loading: Story = { render: () => <RunOutLineSkeleton label={states.loading} /> };

export const RightToLeft: Story = { globals: { direction: "rtl" } };
