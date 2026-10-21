import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { Toggle } from "./Toggle";

function Interactive() {
  const [on, setOn] = useState(false);
  return (
    <div className="w-[342px]">
      <Toggle label={messages.log.sweetened} checked={on} onChange={setOn} />
    </div>
  );
}

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  args: { label: messages.log.sweetened, checked: false, onChange: () => {} },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Interactive />,
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole("switch", { name: messages.log.sweetened });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "true");
  },
};

export const RightToLeft: Story = { render: () => <Interactive />, globals: { direction: "rtl" } };
