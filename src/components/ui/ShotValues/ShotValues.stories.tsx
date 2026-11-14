import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { exampleRecipe } from "@/components/screens/fixtures";
import { ShotValues } from "./ShotValues";

const t = createTranslator({ locale: "en", messages });
const list = (items: string[]) => new Intl.ListFormat("en", { type: "conjunction" }).format(items);
const value = (field: string, v: string) => t("recipe.valueLine", { field, value: v });

// The optional lines, worded as Home words them (recipeLines).
const prep = t("home.prep", { tools: list([t("log.prepWdt"), t("log.prepPuckScreen")]) });
const temperatureC = value(t("shot.temperature"), new Intl.NumberFormat("en", { style: "unit", unit: "celsius" }).format(93));
const temperatureStep = value(t("shot.temperature"), t("recipe.step", { step: 2 }));
const pressure = value(t("shot.pressure"), t("shot.units.barValue", { value: "9" }));

const meta = {
  title: "Components/ShotValues",
  component: ShotValues,
  args: { values: exampleRecipe },
  decorators: [
    (Story) => (
      <div className="w-[342px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ShotValues>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The core four only: nothing optional was set, so no lines. */
export const Large: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(new RegExp(t("shot.temperature")))).toBeNull();
    await expect(canvas.queryByText(new RegExp(t("shot.pressure")))).toBeNull();
  },
};
export const Compact: Story = { args: { size: "compact" } };
export const LargeRightToLeft: Story = { globals: { direction: "rtl" } };

/** Puck prep, an exact temperature and pressure: one quiet line each, under the ratio (NC-08). */
export const LargeWithEverything: Story = {
  args: { lines: [prep, temperatureC, pressure] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const line of [prep, temperatureC, pressure]) await expect(canvas.getByText(line)).toBeVisible();
  },
};

/** A machine with temperature steps records the step, never degrees. */
export const LargeTemperatureStep: Story = {
  args: { lines: [temperatureStep] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(temperatureStep)).toBeVisible();
    await expect(canvas.queryByText(/°/)).toBeNull();
  },
};

/** Puck prep alone: no temperature or pressure line. */
export const LargePrepOnly: Story = {
  args: { lines: [prep] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(prep)).toBeVisible();
    await expect(canvas.queryByText(new RegExp(t("shot.temperature")))).toBeNull();
  },
};

/** Compact, with puck prep, temperature and pressure under the two short lines. */
export const CompactWithEverything: Story = {
  args: { size: "compact", lines: [prep, temperatureC, pressure] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const line of [prep, temperatureC, pressure]) await expect(canvas.getByText(line)).toBeVisible();
  },
};

export const LargeWithEverythingRightToLeft: Story = { args: { lines: [prep, temperatureC, pressure] }, globals: { direction: "rtl" } };
