import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import {
  emptyGrinderAnswers,
  emptyMachineAnswers,
  grinderFromAnswers,
  machineFromAnswers,
  type GrinderAnswers,
  type MachineAnswers,
} from "@/domain/capabilityQuestions";
import messages from "@/i18n/messages/en.json";
import { CapabilitySection } from "./BasketQuestions";
import { GrinderQuestions } from "./GrinderQuestions";
import { MachineQuestions } from "./MachineQuestions";

const { cap } = messages.catalog;
const symbol = (unit: string) =>
  new Intl.NumberFormat("en", { style: "unit", unit, unitDisplay: "narrow" }).formatToParts(1).find((p) => p.type === "unit")!.value;
const common = { notSure: cap.notSure, lowest: cap.lowest, highest: cap.highest, rangeHint: cap.rangeHint };

const machineLabels = {
  ...common,
  yes: cap.yes,
  no: cap.no,
  tempQ: cap.tempQ,
  fewSettings: cap.fewSettings,
  exactNumber: cap.exactNumber,
  howMany: cap.howMany,
  counts: { 2: "2", 3: "3", 4: "4", 5: "5" },
  unitQ: cap.unitQ,
  celsius: symbol("celsius"),
  fahrenheit: symbol("fahrenheit"),
  pressureQ: cap.pressureQ,
  byHand: cap.byHand,
  gaugeQ: cap.gaugeQ,
  bar: messages.unit.barSymbol,
};

const grinderLabels = {
  ...common,
  dialQ: cap.dialQ,
  clicks: cap.clicks,
  smooth: cap.smooth,
  rangeQ: cap.rangeQ,
  stepQ: cap.stepQ,
  coarserQ: cap.coarserQ,
  higher: cap.higher,
  lower: cap.lower,
};

/** Shows what would be saved, so play tests can read it. */
function Saved({ value }: { value: unknown }) {
  return <output data-testid="saved" className="sr-only">{JSON.stringify(value)}</output>;
}

function Machine({ initial = emptyMachineAnswers() }: { initial?: MachineAnswers }) {
  const [answers, setAnswers] = useState(initial);
  return (
    <CapabilitySection title={cap.title} why={cap.why}>
      <MachineQuestions labels={machineLabels} answers={answers} onChange={setAnswers} />
      <Saved value={machineFromAnswers(answers)} />
    </CapabilitySection>
  );
}

function Grinder({ initial = emptyGrinderAnswers() }: { initial?: GrinderAnswers }) {
  const [answers, setAnswers] = useState(initial);
  return (
    <CapabilitySection title={cap.title} why={cap.why}>
      <GrinderQuestions labels={grinderLabels} answers={answers} onChange={setAnswers} />
      <Saved value={grinderFromAnswers(answers)} />
    </CapabilitySection>
  );
}

const meta = {
  title: "Catalog/Capability questions",
  decorators: [(Story) => <div className="flex w-96 flex-col"><Story /></div>],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const saved = (el: HTMLElement) => JSON.parse(within(el).getByTestId("saved").textContent!);

/** No controls: two answers are enough (STORY-01-06-06 AC 3). */
export const MachineNoControls: Story = {
  render: () => <Machine />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const temp = canvas.getByRole("radiogroup", { name: cap.tempQ });
    const pressure = canvas.getByRole("radiogroup", { name: cap.pressureQ });
    await userEvent.click(within(temp).getByRole("radio", { name: cap.no }));
    await userEvent.click(within(pressure).getByRole("radio", { name: cap.no }));
    await expect(canvas.queryByRole("radiogroup", { name: cap.howMany })).toBeNull();
    await expect(saved(canvasElement)).toEqual({ temperature: { control: "none" }, pressure: { control: "none", gauge: false } });
  },
};

/** Each answer asks only its own follow-up, with not sure (AC 1, AC 2). */
export const MachineFollowUps: Story = {
  render: () => <Machine />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const temp = canvas.getByRole("radiogroup", { name: cap.tempQ });
    await userEvent.click(within(temp).getByRole("radio", { name: cap.fewSettings }));
    await expect(canvas.getByRole("radiogroup", { name: cap.howMany })).toBeVisible();
    await userEvent.click(within(temp).getByRole("radio", { name: cap.exactNumber }));
    await expect(canvas.queryByRole("radiogroup", { name: cap.howMany })).toBeNull();
    await userEvent.click(within(canvas.getByRole("radiogroup", { name: cap.unitQ })).getByRole("radio", { name: symbol("celsius") }));
    await userEvent.type(canvas.getByLabelText(cap.lowest), "88");
    await userEvent.type(canvas.getByLabelText(cap.highest), "96");

    const pressure = canvas.getByRole("radiogroup", { name: cap.pressureQ });
    await userEvent.click(within(pressure).getByRole("radio", { name: cap.byHand }));
    const gauge = canvas.getByRole("radiogroup", { name: cap.gaugeQ });
    await expect(within(gauge).getByRole("radio", { name: cap.notSure })).toBeVisible();
    await userEvent.click(within(gauge).getByRole("radio", { name: cap.yes }));
    await expect(saved(canvasElement)).toEqual({
      temperature: { control: "exact", unit: "C", min: 88, max: 96, step: null },
      pressure: { control: "manual", gauge: true },
    });
  },
};

/** Skipped entirely: saves as not sure (AC 4). */
export const MachineSkipped: Story = {
  render: () => <Machine />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(cap.why)).toBeVisible();
    await expect(saved(canvasElement)).toEqual({ temperature: { control: "unknown" }, pressure: { control: "unknown" } });
  },
};

/** The step is asked only for a dial that clicks (STORY-01-06-07 AC 2). */
export const GrinderClicks: Story = {
  render: () => <Grinder />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dial = canvas.getByRole("radiogroup", { name: cap.dialQ });
    await expect(canvas.queryByLabelText(cap.stepQ)).toBeNull();
    await userEvent.click(within(dial).getByRole("radio", { name: cap.clicks }));
    await userEvent.type(canvas.getByLabelText(cap.lowest), "0");
    await userEvent.type(canvas.getByLabelText(cap.highest), "40");
    await userEvent.type(canvas.getByLabelText(cap.stepQ), "1");
    await userEvent.click(within(canvas.getByRole("radiogroup", { name: cap.coarserQ })).getByRole("radio", { name: cap.higher }));
    await expect(saved(canvasElement)).toEqual({ grind: { type: "stepped", min: 0, max: 40, step: 1, coarser: "higher" } });
    await userEvent.click(within(dial).getByRole("radio", { name: cap.smooth }));
    await expect(canvas.queryByLabelText(cap.stepQ)).toBeNull();
    await expect(saved(canvasElement).grind.step).toBeNull();
  },
};

/** Not sure about anything (AC 3). */
export const GrinderNotSure: Story = {
  render: () => <Grinder initial={{ dial: "notSure", min: "", max: "", step: "", coarser: "notSure" }} />,
  play: async ({ canvasElement }) => {
    await expect(saved(canvasElement)).toEqual({ grind: { type: "unknown", min: null, max: null, step: null, coarser: "unknown" } });
  },
};

export const MachineRightToLeft: Story = {
  render: () => (
    <Machine initial={{ temperature: { choice: "exact", count: null, unit: "C", min: "88", max: "96" }, pressure: { choice: "steps", gauge: null, count: 3, min: "", max: "" } }} />
  ),
  globals: { direction: "rtl" },
};

export const GrinderRightToLeft: Story = {
  render: () => <Grinder initial={{ dial: "stepped", min: "0", max: "40", step: "1", coarser: "lower" }} />,
  globals: { direction: "rtl" },
};
