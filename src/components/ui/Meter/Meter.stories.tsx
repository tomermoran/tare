import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { Meter } from "./Meter";

const grams = new Intl.NumberFormat("en", { style: "unit", unit: "gram", unitDisplay: "narrow" });
const text = (left: number, of: number) =>
  messages.portion.meter.replace("{remaining}", grams.format(left)).replace("{total}", grams.format(of));

const meta = {
  title: "Components/Meter",
  component: Meter,
  decorators: [(Story) => <div className="w-[342px]"><Story /></div>],
  args: { label: messages.portion.meterLabel, value: 120, max: 250, valueText: text(120, 250) },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

const fill = (el: HTMLElement) => el.querySelector<HTMLElement>("[role=meter] > div")!;

/** Partly used: the fill and the text agree. */
export const Partial: Story = {
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole("meter", { name: messages.portion.meterLabel });
    await expect(meter).toHaveAttribute("aria-valuetext", text(120, 250));
    await expect(fill(canvasElement).style.width).toBe("48%");
  },
};

export const Full: Story = {
  args: { value: 250, valueText: text(250, 250) },
  play: async ({ canvasElement }) => {
    await expect(fill(canvasElement).style.width).toBe("100%");
  },
};

/** Nothing left, or more logged than there was: never below zero. */
export const Empty: Story = {
  args: { value: -20, valueText: text(0, 250) },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("meter")).toHaveAttribute("aria-valuenow", "0");
    await expect(fill(canvasElement).style.width).toBe("0%");
  },
};

/** The fill grows from the inline start, so on the right in RTL. */
export const RightToLeft: Story = {
  globals: { direction: "rtl" },
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole("meter");
    const track = meter.getBoundingClientRect();
    const bar = fill(canvasElement).getBoundingClientRect();
    await expect(Math.round(bar.right)).toBe(Math.round(track.right));
  },
};
