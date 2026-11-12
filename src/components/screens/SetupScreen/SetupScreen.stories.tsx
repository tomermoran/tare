import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Card } from "@/components/ui/Card/Card";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { SetupScreen, type PartRow, type SetupLabels } from "./SetupScreen";

const { setup } = messages;

const labels: SetupLabels = {
  title: setup.title,
  addPart: setup.addPart,
  setups: setup.setups,
  parts: setup.parts,
  kindPlural: setup.kindPlural,
  emptyTitle: setup.emptyTitle,
  empty: setup.empty,
  addMachine: setup.addMachine,
  loading: setup.partsLoading,
};

// Fictional parts.
const none = { machine: [], grinder: [], basket: [] };
const machine: PartRow = { id: "p1", primary: "Kitchen", secondary: "Example Espresso Co. Model One" };
const grinders: PartRow[] = [
  { id: "p2", primary: "Grinder Zero", secondary: "Sample Grinders Grinder Zero" },
  { id: "p3", primary: "Grinder Zero", secondary: "Sample Grinders Grinder Zero" },
];
const basket: PartRow = { id: "p4", primary: "54mm Double Shot Basket", secondary: "Example Espresso Co. 54mm Double Shot Basket" };

const meta = {
  title: "Screens/Setup",
  component: SetupScreen,
  parameters: { layout: "centered" },
  decorators: [(Story) => <PhoneFrame><Story /></PhoneFrame>],
  args: {
    labels,
    parts: none,
    addPartHref: "/setup/add-part",
    addMachineHref: "/setup/add-part?kind=machine",
  },
} satisfies Meta<typeof SetupScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const primaries = (el: HTMLElement) =>
  [...el.querySelectorAll("a, button")].filter((b) => b.className.includes("bg-action"));

/** No parts: the only action is adding the machine (AC 6). */
export const Empty: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: setup.addMachine })).toHaveAttribute(
      "href",
      "/setup/add-part?kind=machine",
    );
    await expect(canvas.queryByRole("link", { name: setup.addPart })).toBeNull();
    await expect(primaries(canvasElement)).toHaveLength(1);
  },
};

/** Parts grouped by kind, two of one model kept apart (AC 1, AC 4). */
export const PartsByKind: Story = {
  args: { parts: { machine: [machine], grinder: grinders, basket: [basket] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const groups = canvas.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    await expect(groups).toEqual([setup.kindPlural.machine, setup.kindPlural.grinder, setup.kindPlural.basket]);
    const grinderList = canvas.getByRole("region", { name: setup.kindPlural.grinder });
    await expect(within(grinderList).getAllByRole("listitem")).toHaveLength(2);
    await expect(canvas.getByRole("link", { name: setup.addPart })).toBeVisible();
    await expect(primaries(canvasElement)).toHaveLength(0);
  },
};

/** Only the kinds the household has are shown. */
export const MachineOnly: Story = {
  args: { parts: { ...none, machine: [machine] } },
  play: async ({ canvasElement }) => {
    const groups = within(canvasElement).getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    await expect(groups).toEqual([setup.kindPlural.machine]);
  },
};

/** The setup screens fill these slots; placeholders here. */
export const WithSetupSlots: Story = {
  args: {
    parts: { machine: [machine], grinder: grinders.slice(0, 1), basket: [basket] },
    setups: (
      <Card>
        <p className="text-h3">{machine.primary}</p>
      </Card>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("heading", { name: setup.setups })).toBeVisible();
  },
};

export const Loading: Story = {
  args: { state: "loading" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveAttribute("aria-busy", "true");
  },
};

export const RightToLeft: Story = {
  args: { parts: { machine: [machine], grinder: grinders, basket: [basket] } },
  globals: { direction: "rtl" },
};
