import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { exampleRecipe } from "@/components/screens/fixtures";
import { ShotValues } from "./ShotValues";

const meta = {
  title: "Components/ShotValues",
  component: ShotValues,
  args: { values: exampleRecipe },
  decorators: [
    (Story) => (
      <div className="w-[342px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ShotValues>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Large: Story = {};
export const Compact: Story = { args: { size: "compact" } };
export const LargeRightToLeft: Story = { globals: { direction: "rtl" } };
