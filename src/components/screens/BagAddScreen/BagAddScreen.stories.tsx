import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { BagAddScreen, OTHER_WEIGHT, type BagAddLabels, type BagFields } from "./BagAddScreen";

const { bag, actions, states } = messages;
const grams = new Intl.NumberFormat("en", { style: "unit", unit: "gram", unitDisplay: "narrow" });

const labels: BagAddLabels = {
  title: bag.addTitle,
  cancel: actions.cancel,
  coffee: bag.coffee,
  chooseCoffee: bag.chooseCoffee,
  change: bag.change,
  coffeeMissing: bag.coffeeMissing,
  weight: bag.weight,
  sizes: [250, 340, 500, 1000].map((g) => ({ value: String(g), label: grams.format(g) })),
  otherWeight: bag.otherWeight,
  otherWeightLabel: bag.otherWeightLabel,
  gramUnit: "g",
  weightRequired: bag.weightRequired,
  roastDate: bag.roastDate,
  roastDateHint: bag.roastDateHint,
  otherDates: bag.otherDates,
  packedDate: bag.packedDate,
  bestBefore: bag.bestBefore,
  datesHint: bag.datesHint,
  more: bag.more,
  lot: bag.lot,
  purchased: bag.purchased,
  save: bag.save,
  saveFailedTitle: bag.saveFailedTitle,
  saveFailed: states.saveFailed,
};

const empty: BagFields = { size: "", otherWeight: "", roastDate: "", packedAt: "", bestBefore: "", lotCode: "", purchasedAt: "2026-01-15" };
// Fictional coffee.
const coffee = { name: "Morning Blend", roaster: "Example Roasters" };

const meta = {
  title: "Screens/Add a bag",
  component: BagAddScreen,
  parameters: { layout: "centered" },
  decorators: [(Story) => <PhoneFrame><Story /></PhoneFrame>],
  args: {
    labels,
    coffee,
    onChooseCoffee: fn(),
    fields: empty,
    onChange: fn(),
    otherDatesOpen: false,
    onOpenOtherDates: fn(),
    moreOpen: false,
    onOpenMore: fn(),
    today: "2026-01-15",
    onSave: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof BagAddScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Common sizes as one tap; the roast date first, with the dates hint (AC 1, AC 3). */
export const Details: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const sizes = canvas.getAllByRole("radio").map((r) => r.textContent);
    await expect(sizes).toEqual(["250g", "340g", "500g", "1,000g", bag.otherWeight]);
    await userEvent.click(canvas.getByRole("radio", { name: "340g" }));
    await expect(args.onChange).toHaveBeenCalledWith({ size: "340" });
    await expect(canvas.getByText(bag.datesHint)).toBeVisible();
    await expect(canvas.getByLabelText(bag.roastDate)).toHaveAttribute("type", "date");
    await expect(canvas.queryByLabelText(bag.packedDate)).toBeNull();
  },
};

/** The packing and best-before dates behind a disclosure, none required (AC 2). */
export const OtherDates: Story = {
  args: { otherDatesOpen: true, fields: { ...empty, size: "250", packedAt: "2026-01-03", bestBefore: "2026-07-01" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(bag.packedDate)).toHaveValue("2026-01-03");
    await expect(canvas.getByLabelText(bag.bestBefore)).toHaveValue("2026-07-01");
    await expect(canvas.getByRole("button", { name: bag.save })).toBeEnabled();
  },
};

/** Lot and purchase date, the purchase date starting as today (AC 4). */
export const MoreDetails: Story = {
  args: { moreOpen: true, fields: { ...empty, size: "250", lotCode: "L-042" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(bag.purchased)).toHaveValue("2026-01-15");
    await expect(canvas.getByLabelText(bag.lot)).toHaveValue("L-042");
  },
};

/** Another weight in grams. */
export const OtherWeight: Story = {
  args: { fields: { ...empty, size: OTHER_WEIGHT, otherWeight: "750" } },
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByLabelText(bag.otherWeightLabel);
    await expect(field).toHaveValue("750");
    await expect(field).toHaveAttribute("inputmode", "decimal");
  },
};

/** No weight: asked for it, in ink; the button stays enabled (AC 5). */
export const WeightMissing: Story = {
  args: { weightMissing: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent(bag.weightRequired);
    await expect(canvas.getByRole("alert").className).not.toContain("signal");
    await expect(canvas.getByRole("button", { name: bag.save })).toBeEnabled();
  },
};

export const NoCoffeeYet: Story = {
  args: { coffee: null, coffeeMissing: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent(bag.coffeeMissing);
    await expect(canvas.getByRole("button", { name: bag.chooseCoffee })).toBeVisible();
  },
};

export const SaveFailed: Story = {
  args: { state: "failed", fields: { ...empty, size: "250" } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("alert")).toHaveTextContent(bag.saveFailedTitle);
  },
};

export const RightToLeft: Story = { args: { otherDatesOpen: true }, globals: { direction: "rtl" } };
