import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { TabBar } from "./TabBar";

const { nav } = messages;
const tabs = [
  { id: "brew", label: nav.brew },
  { id: "shots", label: nav.shots },
  { id: "pantry", label: nav.pantry },
  { id: "setup", label: nav.setup },
];

function Interactive() {
  const [current, setCurrent] = useState("brew");
  return (
    <div className="w-[390px]">
      <TabBar label={nav.label} tabs={tabs} current={current} onSelect={setCurrent} />
    </div>
  );
}

const meta = {
  title: "Components/TabBar",
  component: TabBar,
  args: { label: nav.label, tabs, current: "brew", onSelect: () => {} },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Interactive />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: nav.shots }));
    await expect(canvas.getByRole("button", { name: nav.shots })).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByRole("button", { name: nav.brew })).not.toHaveAttribute("aria-current");
  },
};

export const RightToLeft: Story = { render: () => <Interactive />, globals: { direction: "rtl" } };
