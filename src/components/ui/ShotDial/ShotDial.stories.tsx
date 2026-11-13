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

const optional = (addLabel: string, addValue: number) => ({ addLabel, clearLabel: log.clear, hint: log.unsetHint, addValue });

/** A machine with temperature steps and an exact pressure: six tabs, both unset at first. */
function WithBrew({ fahrenheit = false, peak = false }: { fahrenheit?: boolean; peak?: boolean }) {
  const [values, setValues] = useState<Record<string, number | null>>({ ...start, temperature: null, pressure: null });
  const [selected, setSelected] = useState("temperature");
  const core = dialFields(values as Record<string, number>, start);
  const temperature: DialField = fahrenheit
    ? { key: "temperature", label: shot.temperature, value: values.temperature, startValue: null, min: 186, max: 205, step: 1, majorEvery: 5, unit: "fahrenheit", optional: optional(log.addTemperature, 199) }
    : { key: "temperature", label: shot.temperature, kind: "steps", count: 3, value: values.temperature, startValue: null, optional: optional(log.addTemperature, 2) };
  const pressure: DialField = {
    key: "pressure",
    label: peak ? log.peakPressure : shot.pressure,
    value: values.pressure,
    startValue: null,
    min: 0,
    max: 12,
    step: 0.5,
    majorEvery: 4,
    unitLabel: { symbol: shot.units.bar, valueText: (value) => `${value} ${shot.units.bar}` },
    optional: optional(log.addPressure, 9),
  };
  return (
    <div className="w-[343px]">
      <ShotDial
        label={log.values}
        fields={[...core, temperature, pressure]}
        selected={selected}
        onSelect={setSelected}
        onChange={(key, v) => setValues((s) => ({ ...s, [key]: v }))}
      />
    </div>
  );
}

/** Unset shows an em dash; add reveals the settings; clear unsets it again (STORY-01-04-01 AC 2, AC 3). */
export const TemperatureSteps: Story = {
  render: () => <WithBrew />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tab = canvas.getByRole("tab", { name: /Temperature/ });
    await expect(tab).toHaveTextContent(log.notSet);
    await userEvent.click(canvas.getByRole("button", { name: log.addTemperature }));
    const chips = canvas.getByRole("radiogroup", { name: shot.temperature });
    await expect(within(chips).getAllByRole("radio")).toHaveLength(3);
    await userEvent.click(within(chips).getByRole("radio", { name: "3" }));
    await expect(tab).toHaveTextContent("3");
    await expect(tab).not.toHaveTextContent("°");
    await userEvent.click(canvas.getByRole("button", { name: log.clear }));
    await expect(tab).toHaveTextContent(log.notSet);
  },
};

/** A machine that shows Fahrenheit: the wheel is in °F (AC 5). */
export const TemperatureFahrenheit: Story = {
  render: () => <WithBrew fahrenheit />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: log.addTemperature }));
    const wheel = canvas.getByRole("slider", { name: shot.temperature });
    await expect(wheel).toHaveAttribute("aria-valuenow", "199");
    await expect(wheel.getAttribute("aria-valuetext")).toMatch(/Fahrenheit/i);
  },
};

/** A lever with a gauge records the peak it read (STORY-01-04-02 AC 5). */
export const PeakPressure: Story = {
  render: () => <WithBrew peak />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: new RegExp(log.peakPressure) }));
    await userEvent.click(canvas.getByRole("button", { name: log.addPressure }));
    await expect(canvas.getByRole("slider", { name: log.peakPressure })).toHaveAttribute("aria-valuenow", "9");
  },
};

export const SixTabsRightToLeft: Story = { render: () => <WithBrew />, globals: { direction: "rtl" } };
