import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, within } from "storybook/test";
import { CapabilitySummary } from "@/components/catalog/CapabilitySummary";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { UnitScreen } from "./UnitScreen";

const t = createTranslator({ locale: "en", messages });
const { setup, unit } = messages;

// Fictional models and setups.
const machineCaps = {
  temperature: { control: "exact", unit: "C", min: 88, max: 96, step: 1 },
  pressure: { control: "none", gauge: true },
};
const grinderCaps = { grind: { type: "stepped", min: 0, max: 50, step: 1, coarser: "higher" } };
const basketCaps = { dose: { min: 17, max: 19 } };
const setups = [
  { id: "s1", name: "Weekday", current: true },
  { id: "s2", name: new Intl.ListFormat("en").format(["Lever One", "Flat 64", "Single Basket"]) },
];

const meta = {
  title: "Screens/Part",
  component: UnitScreen,
  parameters: { layout: "centered" },
  args: {
    labels: {
      back: setup.title,
      details: unit.details,
      capabilities: unit.aboutModel,
      inSetups: unit.inSetups,
      notInSetup: unit.notInSetup,
      current: setup.current,
    },
    backHref: "/setup",
    title: "Lever One",
    subtitle: t("setup.partName", { maker: "Example Works", model: "Lever One" }),
    facts: [{ label: unit.acquired, value: "12 March 2025" }],
    capabilities: <CapabilitySummary kind="machine" capabilities={machineCaps} />,
    setups: [setups[0]],
  },
  decorators: [
    (Story) => (
      <PhoneFrame>
        <Story />
      </PhoneFrame>
    ),
  ],
} satisfies Meta<typeof UnitScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A machine: what it can control, and its setup. There is no retire control. */
export const Machine: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Lever One" })).toBeVisible();
    await expect(canvas.getByText(/Temperature: 88/)).toBeVisible();
    await expect(canvas.queryByRole("button", { name: /retire/i })).toBeNull();
  },
};

/** A nicknamed grinder: the nickname is the title, maker and model under it. */
export const Grinder: Story = {
  args: {
    title: "Kitchen grinder",
    subtitle: t("setup.partName", { maker: "Example Works", model: "Flat 64" }),
    facts: [
      { label: unit.nickname, value: "Kitchen grinder" },
      { label: unit.acquired, value: "2 June 2024" },
    ],
    capabilities: <CapabilitySummary kind="grinder" capabilities={grinderCaps} />,
  },
};

/** A basket: the dose range it's made for. */
export const Basket: Story = {
  args: {
    title: "18 g Basket",
    subtitle: t("setup.partName", { maker: "Example Works", model: "18 g Basket" }),
    facts: [],
    capabilities: <CapabilitySummary kind="basket" capabilities={basketCaps} />,
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(/Made for 17/)).toBeVisible();
  },
};

/** In two setups, the current one marked (AC 5). */
export const InTwoSetups: Story = {
  args: { setups },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole("heading", { name: unit.inSetups }).nextElementSibling as HTMLElement;
    await expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    await expect(within(list).getByText(setup.current)).toBeVisible();
  },
};

/** A part not in any setup yet. */
export const NotInASetup: Story = {
  args: { setups: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(unit.notInSetup)).toBeVisible();
  },
};

export const RightToLeft: Story = { args: { setups }, globals: { direction: "rtl" } };
