import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { exampleNow, exampleShots } from "../fixtures";
import { PhoneFrame } from "../PhoneFrame";
import { RecentShotsScreen } from "./RecentShotsScreen";

const meta = {
  title: "Screens/Recent shots",
  component: RecentShotsScreen,
  parameters: { layout: "centered" },
  args: { items: exampleShots, now: exampleNow, onOpen: () => {} },
  decorators: [
    (Story) => (
      <PhoneFrame>
        <Story />
      </PhoneFrame>
    ),
  ],
} satisfies Meta<typeof RecentShotsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: messages.shots.today })).toBeInTheDocument();
    await expect(canvas.getAllByText(messages.shots.oneTap)).toHaveLength(2);
    await expect(canvas.getByText(messages.shot.warnings.channelling)).toBeInTheDocument();
  },
};

export const Empty: Story = { args: { items: [] } };
export const RightToLeft: Story = { globals: { direction: "rtl" } };
