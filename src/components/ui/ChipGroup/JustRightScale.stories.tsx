import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { JustRightScale, type JustRightLabels } from "./JustRightScale";

const { taste } = messages;

const balance: JustRightLabels = {
  label: taste.question.balance,
  justRight: taste.justRight,
  start: taste.ends.balance.start,
  end: taste.ends.balance.end,
  names: { "-2": taste.balance.muchLess, "-1": taste.balance.less, "0": taste.balance.right, "1": taste.balance.more, "2": taste.balance.muchMore },
};
const sweetness: JustRightLabels = {
  label: taste.question.sweetness,
  justRight: taste.justRight,
  start: taste.ends.sweetness.start,
  names: { "-2": taste.sweetness.muchLess, "-1": taste.sweetness.less, "0": taste.sweetness.right },
};

function Scale({ labels, oneSided }: { labels: JustRightLabels; oneSided?: boolean }) {
  const [value, setValue] = useState<number | null>(null);
  return <JustRightScale labels={labels} oneSided={oneSided} value={value} onChange={setValue} />;
}

const meta = {
  title: "Components/JustRightScale",
  component: JustRightScale,
  args: { labels: balance, value: null, onChange: () => {} },
} satisfies Meta<typeof JustRightScale>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Five points, nothing chosen until tapped; tapping again clears (AC 1, AC 5). */
export const FivePoint: Story = {
  render: () => <Scale labels={balance} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("radiogroup", { name: taste.question.balance });
    await expect(within(group).getAllByRole("radio")).toHaveLength(5);
    await expect(within(group).queryByRole("radio", { checked: true })).toBeNull();
    const bit = canvas.getByRole("radio", { name: taste.balance.less });
    await userEvent.click(bit);
    await expect(bit).toHaveAttribute("aria-checked", "true");
    await userEvent.click(bit);
    await expect(bit).toHaveAttribute("aria-checked", "false");
  },
};

/** Arrow keys move, space chooses (AC 5). */
export const Keyboard: Story = {
  render: () => <Scale labels={balance} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    const centre = canvas.getByRole("radio", { name: taste.justRight });
    await expect(centre).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    const more = canvas.getByRole("radio", { name: taste.balance.more });
    await expect(more).toHaveFocus();
    await expect(more).toHaveAttribute("aria-checked", "false");
    await userEvent.keyboard(" ");
    await expect(more).toHaveAttribute("aria-checked", "true");
  },
};

/** Sweetness is one-sided: three points, from much to just right. */
export const OneSided: Story = {
  render: () => <Scale labels={sweetness} oneSided />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("radio")).toHaveLength(3);
    await expect(canvas.getByRole("radio", { name: taste.sweetness.muchLess })).toBeVisible();
  },
};

/** At 375 px the row stays on one line. */
export const Narrow: Story = {
  render: () => (
    <div style={{ inlineSize: 343 }}>
      <Scale labels={balance} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const radios = within(canvasElement).getAllByRole("radio");
    const tops = new Set(radios.map((r) => Math.round(r.getBoundingClientRect().top)));
    await expect(tops.size).toBe(1);
    await expect(radios.at(-1)!.getBoundingClientRect().right).toBeLessThanOrEqual(canvasElement.getBoundingClientRect().left + 343 + 32);
  },
};

/** The sour end stays at the inline start, so it mirrors. */
export const RightToLeft: Story = { render: () => <Scale labels={balance} />, globals: { direction: "rtl" } };
