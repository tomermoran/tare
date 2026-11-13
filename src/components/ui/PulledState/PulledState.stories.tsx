import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Notice } from "@/components/ui/Notice/Notice";
import messages from "@/i18n/messages/en.json";
import { PulledState } from "./PulledState";

const { home, states } = messages;

const meta = {
  title: "Components/PulledState",
  component: PulledState,
  args: {
    labels: { pulled: home.pulled, undo: home.undo, reaction: { label: home.reactionLabel, good: home.reactionGood, off: home.reactionOff } },
    undoAvailable: true,
    onUndo: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PulledState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const JustPulled: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(home.pulled)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: home.undo }));
    await expect(args.onUndo).toHaveBeenCalled();
  },
};

/** The window has passed: undo is gone, the shot stays. */
export const AfterTheWindow: Story = {
  args: { undoAvailable: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("button", { name: home.undo })).toBeNull();
  },
};

export const WithReactions: Story = { args: { onReaction: fn(), reaction: "good" } };

export const WithNotice: Story = {
  args: { undoAvailable: false, notice: <Notice tone="neutral">{states.saveFailed}</Notice> },
};

export const RightToLeft: Story = { args: { onReaction: fn() }, globals: { direction: "rtl" } };
