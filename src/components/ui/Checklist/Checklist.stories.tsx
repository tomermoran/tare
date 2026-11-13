import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { Checklist, type ChecklistStep } from "./Checklist";

const { firstRun } = messages.home;

const steps = (done: number): ChecklistStep[] =>
  [
    { id: "parts", title: firstRun.parts, hint: firstRun.partsHint, action: { label: firstRun.addParts, href: "/setup/add-part" } },
    { id: "bag", title: firstRun.bag, hint: firstRun.bagHint, action: { label: firstRun.addBag, href: "/beans/add" } },
    { id: "shot", title: firstRun.shot, hint: firstRun.shotHint, action: { label: firstRun.logShot, href: "/log" } },
  ].map((s, i) => ({ ...s, state: i < done ? "done" : i === done ? "next" : "later" }));

const meta = {
  title: "Components/Checklist",
  component: Checklist,
  decorators: [(Story) => <div className="w-[342px]"><Story /></div>],
  args: { steps: steps(0), doneLabel: firstRun.done },
} satisfies Meta<typeof Checklist>;

export default meta;
type Story = StoryObj<typeof meta>;

const primaries = (el: HTMLElement) => [...el.querySelectorAll("a")].filter((a) => a.className.includes("bg-action"));

/** Nothing done: three steps, the first is the only primary (STORY-01-01-07 AC 1). */
export const NoneDone: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
    await expect(primaries(canvasElement).map((a) => a.textContent)).toEqual([firstRun.addParts]);
  },
};

/** One step done: marked done, the next one offered (AC 3). */
export const OneDone: Story = {
  args: { steps: steps(1) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(`, ${firstRun.done}`)).toBeInTheDocument();
    await expect(primaries(canvasElement).map((a) => a.textContent)).toEqual([firstRun.addBag]);
    await expect(canvas.getAllByRole("listitem")[1]).toHaveAttribute("aria-current", "step");
  },
};

export const TwoDone: Story = {
  args: { steps: steps(2) },
  play: async ({ canvasElement }) => {
    await expect(primaries(canvasElement).map((a) => a.textContent)).toEqual([firstRun.logShot]);
  },
};

/** A detail in place of the next step's action, e.g. the setup offer (AC 4). */
export const WithDetail: Story = {
  args: { steps: steps(0).map((s, i) => (i === 0 ? { ...s, detail: <p className="text-body text-ink">{messages.setup.suggestTitle}</p> } : s)) },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(messages.setup.suggestTitle)).toBeVisible();
    await expect(primaries(canvasElement)).toHaveLength(0);
  },
};

export const RightToLeft: Story = { args: { steps: steps(1) }, globals: { direction: "rtl" } };
