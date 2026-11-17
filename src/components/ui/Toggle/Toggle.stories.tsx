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

/** The last shown drink can't be hidden: the switch is disabled and says why in words (STORY-02-05-02 AC 5). */
export const DisabledWithReason: Story = {
  args: { label: messages.drinkList.show, checked: true, disabled: true, hint: messages.drinkList.keepOne },
  decorators: [(Story) => <div className="w-[342px]">{Story()}</div>],
  play: async ({ canvasElement, args }) => {
    const toggle = within(canvasElement).getByRole("switch", { name: messages.drinkList.show });
    await expect(toggle).toBeDisabled();
    await expect(toggle).toHaveAccessibleDescription(messages.drinkList.keepOne);
    await userEvent.click(toggle, { pointerEventsCheck: 0 });
    await expect(toggle).toHaveAttribute("aria-checked", String(args.checked));
  },
};

/** A hint on an enabled switch, e.g. that a choice can't be changed later. */
export const WithHint: Story = {
  args: { label: messages.drinkList.hasMilk, checked: false, hint: messages.drinkList.hasMilkFixed },
  decorators: [(Story) => <div className="w-[342px]">{Story()}</div>],
};

export const DisabledRightToLeft: Story = { ...DisabledWithReason, globals: { direction: "rtl" } };
