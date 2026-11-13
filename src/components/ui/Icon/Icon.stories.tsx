import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { Icon, type IconName } from "./Icon";

const names: IconName[] = ["chevron", "back", "check", "plus", "close", "arrow"];

const meta = {
  title: "Components/Icon",
  component: Icon,
  args: { name: "chevron" },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => (
    <div className="flex items-center gap-6 text-ink">
      {names.map((name) => (
        <Icon key={name} name={name} size={24} />
      ))}
    </div>
  ),
};

/** Standing alone, an icon needs its own accessible name. */
export const Labelled: Story = {
  args: { name: "close", label: messages.actions.cancel, size: 24 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: messages.actions.cancel })).toBeInTheDocument();
  },
};

/** The chevron points to the inline end: right here, left in right-to-left. */
export const ChevronRightToLeft: Story = {
  args: { name: "chevron", size: 24 },
  globals: { direction: "rtl" },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg")!;
    // Tailwind v4 mirrors with the CSS scale property.
    await expect(getComputedStyle(svg).scale.startsWith("-1")).toBe(true);
  },
};

export const ChevronLeftToRight: Story = {
  args: { name: "chevron", size: 24 },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg")!;
    await expect(getComputedStyle(svg).scale.startsWith("-1")).toBe(false);
  },
};
