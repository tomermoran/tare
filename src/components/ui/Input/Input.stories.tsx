import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { defaultLocale } from "@/i18n/config";
import messages from "@/i18n/messages/en.json";
import { unitSymbol } from "@/lib/units";
import { Input } from "./Input";

const { shot } = messages;
const grams = unitSymbol(defaultLocale, "gram");

const meta = {
  title: "Components/Input",
  component: Input,
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: { label: shot.bean, placeholder: shot.beanPlaceholder },
};

export const WithUnitAndHint: Story = {
  args: {
    label: shot.dose,
    unit: grams,
    hint: shot.doseHint,
    inputMode: "decimal",
    defaultValue: "18.0",
  },
};

export const WithError: Story = {
  args: {
    label: shot.dose,
    unit: grams,
    hint: shot.doseHint,
    error: shot.doseRequired,
    inputMode: "decimal",
  },
};

export const Disabled: Story = {
  args: { label: shot.bean, defaultValue: shot.beanPlaceholder, disabled: true },
};
