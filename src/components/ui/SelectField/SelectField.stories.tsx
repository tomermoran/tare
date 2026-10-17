import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import messages from "@/i18n/messages/en.json";
import { SelectField } from "./SelectField";

const meta = {
  title: "Components/SelectField",
  component: SelectField,
  args: { value: messages.drinks.latte, onClick: () => {} },
  decorators: [
    (Story) => (
      <div className="w-[342px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Field: Story = {
  args: { label: messages.log.drink },
  decorators: [
    (Story) => (
      <div className="overflow-hidden rounded-md">
        <Story />
      </div>
    ),
  ],
};

export const Quiet: Story = {
  args: {
    look: "quiet",
    valueClassName: "text-h1",
    hiddenLabel: messages.home.changeDrink,
  },
};

export const QuietRightToLeft: Story = { ...Quiet, globals: { direction: "rtl" } };
