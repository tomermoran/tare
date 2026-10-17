import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, type ComponentProps } from "react";
import { expect, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { msToSeconds } from "@/lib/units";
import { NumberWheel } from "./NumberWheel";

const { shot } = messages;

/** Stories keep their own state so the wheel can be dragged freely. */
function Controlled(props: ComponentProps<typeof NumberWheel>) {
  const [value, setValue] = useState(props.value);
  return (
    <div className="w-[min(36rem,90vw)]">
      <NumberWheel
        {...props}
        value={value}
        onChange={(v) => {
          setValue(v);
          props.onChange(v);
        }}
      />
    </div>
  );
}

const meta = {
  title: "Components/NumberWheel",
  component: NumberWheel,
  render: (args) => <Controlled {...args} />,
  args: { onChange: () => {} },
} satisfies Meta<typeof NumberWheel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dose: Story = {
  args: {
    label: shot.dose,
    value: 18,
    min: 5,
    max: 30,
    step: 0.1,
    majorEvery: 10,
    unit: "gram",
  },
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole("slider", { name: shot.dose });
    slider.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
    await expect(slider).toHaveAttribute("aria-valuenow", "18.3");
    await expect(slider).toHaveAttribute("aria-valuetext", "18.3 grams");
    await userEvent.keyboard("{PageDown}");
    await expect(slider).toHaveAttribute("aria-valuenow", "17.3");
    await userEvent.keyboard("{End}");
    await expect(slider).toHaveAttribute("aria-valuenow", "30");
  },
};

export const Time: Story = {
  args: {
    label: shot.time,
    value: msToSeconds(27_600),
    min: 0,
    max: 60,
    step: 0.1,
    majorEvery: 10,
    unit: "second",
  },
  /** Type a time read off the scale. Only digits and "." get through. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox", { name: shot.time });
    const slider = canvas.getByRole("slider", { name: shot.time });

    // Letters are dropped and a second decimal digit is blocked.
    await userEvent.click(field);
    await userEvent.keyboard("2a9.35s");
    await expect(field).toHaveValue("29.3");
    await userEvent.keyboard("{Enter}");
    await expect(slider).toHaveAttribute("aria-valuenow", "29.3");

    // Escape cancels without saving.
    await userEvent.click(field);
    await userEvent.keyboard("31{Escape}");
    await expect(slider).toHaveAttribute("aria-valuenow", "29.3");
    await expect(field).toHaveValue("29.3");

    // Out-of-range values clamp to the maximum when the field loses focus.
    await userEvent.click(field);
    await userEvent.keyboard("99");
    await userEvent.click(slider);
    await expect(slider).toHaveAttribute("aria-valuenow", "60");
  },
};

export const Temperature: Story = {
  args: {
    label: shot.temperature,
    value: 93,
    min: 85,
    max: 100,
    step: 0.5,
    majorEvery: 2,
    unit: "celsius",
  },
};

/** Units Intl doesn't know take a translated label instead. */
export const Pressure: Story = {
  args: {
    label: shot.pressure,
    value: 9,
    min: 0,
    max: 12,
    step: 0.5,
    majorEvery: 2,
    unitLabel: shot.units.bar,
  },
};

/** Switch the toolbar to right-to-left: the ruler mirrors. */
export const RightToLeft: Story = {
  ...Dose,
  play: undefined,
  globals: { direction: "rtl" },
};
