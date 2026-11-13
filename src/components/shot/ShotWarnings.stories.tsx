import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { ShotWarnings } from "./ShotWarnings";

const labels = { channelling: messages.shot.warnings.channelling };

const meta = {
  title: "Components/ShotWarnings",
  component: ShotWarnings,
  args: { warnings: ["channelling"], labels },
} satisfies Meta<typeof ShotWarnings>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Block: tasting, the shot's detail, edit mode. The words carry the meaning (AC 3). */
export const Block: Story = {
  play: async ({ canvasElement }) => {
    const notice = within(canvasElement).getByRole("status");
    await expect(notice).toHaveTextContent(labels.channelling);
    await expect(notice).toHaveAttribute("data-warning", "channelling");
  },
};

/** Inline: one line in a Journal row. */
export const Inline: Story = { args: { size: "inline" } };

/** No warning, nothing rendered (AC 4). */
export const None: Story = {
  args: { warnings: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("status")).toBeNull();
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };
