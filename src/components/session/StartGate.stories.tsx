import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { StartFlow } from "./StartGate";

const { start, actions } = messages;

const never = () => new Promise<void>(() => {});
let startCalls = 0;

const meta = {
  title: "Session/StartGate",
  component: StartFlow,
  parameters: { layout: "fullscreen" },
  args: { start: never, onStarted: fn() },
} satisfies Meta<typeof StartFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Still waiting after the slow threshold: the quiet line appears (AC 3). */
export const TurnsSlow: Story = {
  args: { start: never, slowAfterMs: 50 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("");
    await waitFor(() => expect(canvas.getByRole("status")).toHaveTextContent(start.slow));
  },
};

/** Offline on first open, then back online: retry starts a new attempt (AC 4). */
export const FailsThenRetries: Story = {
  args: {
    // Storybook resets mocks before each story, which keeps only the
    // implementation passed to fn(), so the first-call failure lives here.
    start: fn(() => (startCalls++ === 0 ? Promise.reject(new Error("offline")) : never())),
  },
  beforeEach: () => {
    startCalls = 0;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const retry = await canvas.findByRole("button", { name: actions.retry });
    await expect(canvas.getByRole("heading", { name: start.failedTitle })).toBeVisible();
    await userEvent.click(retry);
    await waitFor(() => expect(canvas.queryByRole("alert")).toBeNull());
    await expect(args.start).toHaveBeenCalledTimes(2);
    await expect(args.onStarted).not.toHaveBeenCalled();
  },
};

/** Success hands over to the app (the gate refreshes the route). */
export const Starts: Story = {
  args: { start: () => Promise.resolve() },
  play: async ({ args }) => {
    await waitFor(() => expect(args.onStarted).toHaveBeenCalledOnce());
  },
};
