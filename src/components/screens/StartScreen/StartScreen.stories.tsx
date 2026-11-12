import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { StartScreen } from "./StartScreen";

const { app, start, actions } = messages;

const meta = {
  title: "Screens/Start",
  component: StartScreen,
  parameters: { layout: "fullscreen" },
  args: {
    state: "starting",
    wordmark: app.wordmark,
    slow: start.slow,
    failedTitle: start.failedTitle,
    failed: start.failed,
    retryLabel: actions.retry,
    onRetry: fn(),
  },
} satisfies Meta<typeof StartScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The wordmark alone: no sign-in, consent or survey (AC 1). */
export const Starting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: app.wordmark })).toBeVisible();
    await expect(canvas.queryByRole("button")).toBeNull();
    await expect(canvas.queryByRole("textbox")).toBeNull();
    await expect(canvas.queryByRole("checkbox")).toBeNull();
    await expect(canvas.getByRole("main")).toHaveAttribute("aria-busy", "true");
  },
};

/** After 3 seconds (AC 3). */
export const Slow: Story = {
  args: { state: "slow" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent(start.slow);
    await expect(canvas.queryByRole("button")).toBeNull();
  },
};

/** Failed: heading, one sentence, retry, and nothing partial (AC 4). */
export const Failed: Story = {
  args: { state: "failed" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByRole("alert");
    await expect(within(alert).getByRole("heading", { name: start.failedTitle })).toBeVisible();
    await userEvent.click(within(alert).getByRole("button", { name: actions.retry }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
    await expect(canvas.getAllByRole("button")).toHaveLength(1);
    await expect(canvas.queryByRole("navigation")).toBeNull();
  },
};

export const RightToLeft: Story = {
  ...Failed,
  globals: { direction: "rtl" },
};
