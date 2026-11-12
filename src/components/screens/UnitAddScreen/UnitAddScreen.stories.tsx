import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CapabilitySummary } from "@/components/catalog/CapabilitySummary";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { UnitAddScreen, type UnitAddLabels } from "./UnitAddScreen";

const { unit, setup, actions, states } = messages;

const labels: UnitAddLabels = {
  title: unit.addTitle,
  cancel: actions.cancel,
  kindLabel: unit.kindLabel,
  kinds: setup.kind,
  model: unit.model,
  chooseModel: unit.chooseModel,
  changeModel: unit.changeModel,
  modelMissing: unit.modelMissing,
  nickname: unit.nickname,
  nicknameHint: unit.nicknameHint,
  acquired: unit.acquired,
  acquiredHint: unit.acquiredHint,
  aboutModel: unit.aboutModel,
  save: unit.save,
  saveFailedTitle: unit.saveFailedTitle,
  saveFailed: states.saveFailed,
};

// Fictional models.
const machine = { model: "Model One", maker: "Example Espresso Co." };
const basket = { model: "54mm Double Shot Basket", maker: "Example Espresso Co." };

const meta = {
  title: "Screens/Add a part",
  component: UnitAddScreen,
  parameters: { layout: "centered" },
  decorators: [(Story) => <PhoneFrame><Story /></PhoneFrame>],
  args: {
    labels,
    kind: "machine",
    onKindChange: fn(),
    model: null,
    onChooseModel: fn(),
    nickname: "",
    onNicknameChange: fn(),
    acquired: "",
    onAcquiredChange: fn(),
    maxDate: "2026-01-15",
    onSave: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof UnitAddScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing picked yet: only the three kinds are offered (AC 1). */
export const ChooseKind: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const kinds = canvas.getAllByRole("radio").map((r) => r.textContent);
    await expect(kinds).toEqual([setup.kind.machine, setup.kind.grinder, setup.kind.basket]);
    await userEvent.click(canvas.getByRole("radio", { name: setup.kind.grinder }));
    await expect(args.onKindChange).toHaveBeenCalledWith("grinder");
    await userEvent.click(canvas.getByRole("button", { name: unit.chooseModel }));
    await expect(args.onChooseModel).toHaveBeenCalledOnce();
  },
};

/** A machine picked: what it can control shows before saving (AC 3). */
export const MachinePicked: Story = {
  args: {
    model: machine,
    capabilities: (
      <CapabilitySummary
        kind="machine"
        capabilities={{
          temperature: { control: "exact", unit: "C", min: 86, max: 96, step: 1 },
          pressure: { control: "none", gauge: true },
        }}
      />
    ),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(machine.model)).toBeVisible();
    await expect(canvas.getByText(machine.maker)).toBeVisible();
    await expect(canvas.getByText("Temperature: 86°C to 96°C, in steps of 1°C")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: unit.save }));
    await expect(args.onSave).toHaveBeenCalledOnce();
  },
};

/** A basket shows the dose it's made for (AC 3). */
export const BasketPicked: Story = {
  args: {
    kind: "basket",
    model: basket,
    capabilities: <CapabilitySummary kind="basket" capabilities={{ dose: { min: 16, max: 18 } }} />,
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Made for 16g to 18g of coffee")).toBeVisible();
  },
};

/** Nickname and date filled in; both stay optional (AC 2). */
export const WithDetails: Story = {
  args: { model: machine, nickname: "Kitchen", acquired: "2025-06-01" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(unit.nickname)).toHaveValue("Kitchen");
    await expect(canvas.getByLabelText(unit.acquired)).toHaveValue("2025-06-01");
  },
};

/** Saving without a model says why; the button never greys out. */
export const ModelMissing: Story = {
  args: { modelMissing: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent(unit.modelMissing);
    await expect(canvas.getByRole("button", { name: unit.save })).toBeEnabled();
  },
};

export const Saving: Story = {
  args: { model: machine, state: "saving" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: unit.save })).toBeDisabled();
  },
};

/** The values stay, with a notice to try again. */
export const SaveFailed: Story = {
  args: { model: machine, nickname: "Kitchen", state: "failed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent(unit.saveFailedTitle);
    await expect(canvas.getByLabelText(unit.nickname)).toHaveValue("Kitchen");
  },
};

export const RightToLeft: Story = {
  args: { model: machine },
  globals: { direction: "rtl" },
};
