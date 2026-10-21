import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { ChipGroup } from "./ChipGroup";

const { home } = messages;
const reactions = [
  { value: "good", label: home.reactionGood },
  { value: "off", label: home.reactionOff },
];
const scale = ["1", "2", "3", "4", "5"].map((n) => ({ value: n, label: n }));
const tags = [
  { value: "tooFast", label: messages.shot.warnings.tooFast },
  { value: "channelling", label: messages.shot.warnings.channelling },
];

function Single() {
  const [value, setValue] = useState<string | null>(null);
  return <ChipGroup label={home.reactionLabel} options={reactions} value={value} onChange={setValue} />;
}

function Scale() {
  const [value, setValue] = useState<string | null>("4");
  return <ChipGroup label={home.reactionLabel} options={scale} value={value} onChange={setValue} />;
}

function Multiple() {
  const [value, setValue] = useState<string[]>([]);
  return <ChipGroup multiple label={home.reactionLabel} options={tags} value={value} onChange={setValue} />;
}

const meta = {
  title: "Components/ChipGroup",
  component: ChipGroup,
  args: { label: home.reactionLabel, options: reactions, value: null, onChange: () => {} },
} satisfies Meta<typeof ChipGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleChoice: Story = {
  render: () => <Single />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const good = canvas.getByRole("radio", { name: home.reactionGood });
    await userEvent.click(good);
    await expect(good).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("radio", { name: home.reactionOff })).toHaveAttribute("aria-checked", "true");
  },
};

export const NumberedScale: Story = { render: () => <Scale /> };

export const MultipleChoice: Story = {
  render: () => <Multiple />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole("button", { name: messages.shot.warnings.channelling });
    await userEvent.click(chip);
    await expect(chip).toHaveAttribute("aria-pressed", "true");
  },
};

export const RightToLeft: Story = { render: () => <Single />, globals: { direction: "rtl" } };
