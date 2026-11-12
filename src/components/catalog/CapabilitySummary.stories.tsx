import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { CapabilitySummary } from "./CapabilitySummary";

const meta = {
  title: "Catalog/Capability summary",
  component: CapabilitySummary,
  decorators: [(Story) => <div className="w-80"><Story /></div>],
} satisfies Meta<typeof CapabilitySummary>;

export default meta;
type Story = StoryObj<typeof meta>;

const lines = (el: HTMLElement) => within(el).getAllByRole("listitem").map((li) => li.textContent);

/** A machine with no settings: the seeded Bambino Plus. */
export const MachineNone: Story = {
  args: {
    kind: "machine",
    capabilities: { temperature: { control: "none" }, pressure: { control: "none", gauge: false } },
  },
  play: async ({ canvasElement }) => {
    await expect(lines(canvasElement)).toEqual(["No temperature setting", "Fixed pressure, no gauge"]);
  },
};

export const MachineExactCelsius: Story = {
  args: {
    kind: "machine",
    capabilities: {
      temperature: { control: "exact", unit: "C", min: 86, max: 96, step: 1 },
      pressure: { control: "exact", min: 3, max: 10, step: 0.5 },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(lines(canvasElement)).toEqual([
      "Temperature: 86°C to 96°C, in steps of 1°C",
      "Pressure: 3 bar to 10 bar, in steps of 0.5 bar",
    ]);
  },
};

export const MachineExactFahrenheit: Story = {
  args: {
    kind: "machine",
    capabilities: {
      temperature: { control: "exact", unit: "F", min: 190, max: 205, step: 1 },
      pressure: { control: "manual", gauge: true },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(lines(canvasElement)).toEqual([
      "Temperature: 190°F to 205°F, in steps of 1°F",
      "Pressure by hand (lever or paddle), with a gauge",
    ]);
  },
};

export const MachineSteps: Story = {
  args: {
    kind: "machine",
    capabilities: { temperature: { control: "steps", count: 3 }, pressure: { control: "steps", count: 2 } },
  },
};

/** A household's own entry: every unknown reads "not sure". */
export const MachineNotSure: Story = {
  args: {
    kind: "machine",
    capabilities: {
      temperature: { control: "exact", unit: null, min: null, max: 96, step: null },
      pressure: { control: "none", gauge: null },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(lines(canvasElement)).toEqual([
      "Temperature: not sure to 96, in steps of not sure",
      "Fixed pressure, gauge not sure",
    ]);
  },
};

export const GrinderStepless: Story = {
  args: {
    kind: "grinder",
    capabilities: { grind: { type: "stepless", min: 0, max: 50, step: 0.5, coarser: "higher" } },
  },
  play: async ({ canvasElement }) => {
    await expect(lines(canvasElement)).toEqual([
      "Stepless grind dial, 0 to 50, set in steps of 0.5",
      "Higher numbers are coarser",
    ]);
  },
};

export const GrinderStepped: Story = {
  args: {
    kind: "grinder",
    capabilities: { grind: { type: "stepped", min: 1, max: 40, step: 1, coarser: "lower" } },
  },
};

export const GrinderUnknown: Story = {
  args: {
    kind: "grinder",
    capabilities: { grind: { type: "unknown", min: null, max: null, step: null, coarser: "unknown" } },
  },
};

export const BasketRange: Story = {
  args: { kind: "basket", capabilities: { dose: { min: 16, max: 18 } } },
  play: async ({ canvasElement }) => {
    await expect(lines(canvasElement)).toEqual(["Made for 16g to 18g of coffee"]);
  },
};

/** Malformed data shows nothing rather than a broken line. */
export const Invalid: Story = {
  args: { kind: "basket", capabilities: { dose: { min: 20, max: 10 } } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole("listitem")).toHaveLength(0);
  },
};

export const RightToLeft: Story = { ...BasketRange, globals: { direction: "rtl" } };
