import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { msToSeconds } from "@/lib/units";
import { exampleRecipe } from "@/components/screens/fixtures";
import { ShotDial, type DialField } from "./ShotDial";

const { shot, log } = messages;

function dialFields(values: Record<string, number>, start: Record<string, number>): DialField[] {
  return [
    { key: "grind", label: shot.grind, value: values.grind, startValue: start.grind, min: 0, max: 40, step: 0.5, majorEvery: 2 },
    { key: "dose", label: shot.dose, value: values.dose, startValue: start.dose, min: 5, max: 30, step: 0.1, majorEvery: 10, unit: "gram" },
    { key: "yield", label: shot.yield, value: values.yield, startValue: start.yield, min: 10, max: 80, step: 0.1, majorEvery: 10, unit: "gram" },
    { key: "time", label: shot.time, value: values.time, startValue: start.time, min: 0, max: 60, step: 0.1, majorEvery: 10, unit: "second" },
  ];
}

const start = {
  grind: exampleRecipe.grind,
  dose: exampleRecipe.dose,
  yield: exampleRecipe.yield,
  time: msToSeconds(exampleRecipe.timeMs),
};

function Interactive() {
  const [values, setValues] = useState(start);
  const [selected, setSelected] = useState("grind");
  return (
    <div className="w-[342px]">
      <ShotDial
        label={log.values}
        fields={dialFields(values, start)}
        selected={selected}
        onSelect={setSelected}
        onChange={(key, v) => setValues((s) => ({ ...s, [key]: v }))}
      />
    </div>
  );
}

const meta = {
  title: "Components/ShotDial",
  component: ShotDial,
  render: () => <Interactive />,
  args: { label: log.values, fields: dialFields(start, start), selected: "grind", onSelect: () => {}, onChange: () => {} },
} satisfies Meta<typeof ShotDial>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Move one value: its tab shows "was" with the starting value. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: /Dose/ }));
    const wheel = canvas.getByRole("slider", { name: shot.dose });
    wheel.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    await expect(wheel).toHaveAttribute("aria-valuenow", "18.2");
    await expect(canvas.getByRole("tab", { name: /Dose/ })).toHaveTextContent("was 18.0");
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };
