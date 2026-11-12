import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { TabBar } from "./TabBar";

const { nav } = messages;
const tabs = [
  { id: "brew", label: nav.brew },
  { id: "journal", label: nav.journal },
  { id: "beans", label: nav.beans },
  { id: "setup", label: nav.setup },
];

function Interactive() {
  const [current, setCurrent] = useState("brew");
  return (
    <div className="w-[390px]">
      <TabBar label={nav.label} tabs={tabs} current={current} onSelect={setCurrent} />
    </div>
  );
}

const meta = {
  title: "Components/TabBar",
  component: TabBar,
  args: { label: nav.label, tabs, current: "brew", onSelect: () => {} },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Interactive />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: nav.journal }));
    await expect(canvas.getByRole("button", { name: nav.journal })).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByRole("button", { name: nav.brew })).not.toHaveAttribute("aria-current");
  },
};

export const RightToLeft: Story = { render: () => <Interactive />, globals: { direction: "rtl" } };

/** In the app each tab is a link to its route. */
export const Links: Story = {
  args: {
    current: "journal",
    tabs: tabs.map((t) => ({ ...t, href: t.id === "brew" ? "/" : `/${t.id}` })),
  },
  decorators: [(Story) => <div className="w-[390px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const journal = canvas.getByRole("link", { name: nav.journal });
    await expect(journal).toHaveAttribute("href", "/journal");
    await expect(journal).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByRole("link", { name: nav.brew })).toHaveAttribute("href", "/");
  },
};

/**
 * A test-only pseudo language: accented and about 40% longer, like German
 * or Finnish labels. Stands in for TQ-08's test locale.
 */
const ACCENTS: Record<string, string> = { a: "á", e: "é", i: "í", o: "ö", u: "ü", r: "ř", w: "ŵ", n: "ñ" };
function pseudo(s: string) {
  const accented = [...s].map((c) => ACCENTS[c] ?? c).join("");
  return `${accented}${"·".repeat(Math.ceil(s.length * 0.4))}`;
}
const longTabs = tabs.map((t) => ({ ...t, label: pseudo(t.label) }));

/** Every tab is a 44 px target or more, and the labels are shown in full. */
async function checkFits(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const nav = canvas.getByRole("navigation").getBoundingClientRect();
  const frame = canvasElement.querySelector(".w-\\[320px\\]")!.getBoundingClientRect();
  // The bar itself stays within the 320 px frame (grid columns can grow).
  await expect(nav.width).toBeLessThanOrEqual(frame.width + 0.5);
  const buttons = canvas.getAllByRole("button");
  await expect(buttons).toHaveLength(4);
  for (const b of buttons) {
    await expect(b.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    // Not clipped or ellipsed, and one line tall (bidi runs can split the
    // text into several rects on the same line, so height is the check).
    await expect(b.scrollWidth).toBeLessThanOrEqual(b.clientWidth);
    const r = b.getBoundingClientRect();
    await expect(r.left).toBeGreaterThanOrEqual(frame.left - 0.5);
    await expect(r.right).toBeLessThanOrEqual(frame.right + 0.5);
    const lineHeight = parseFloat(getComputedStyle(b).lineHeight);
    const text = b.firstChild as Node;
    const range = document.createRange();
    range.selectNodeContents(text);
    await expect(range.getBoundingClientRect().height).toBeLessThanOrEqual(lineHeight + 1);
  }
}

/** The narrowest phone we support, in a longer language (QA1). */
export const Narrow320LongLabels: Story = {
  args: { tabs: longTabs, current: "journal" },
  decorators: [(Story) => <div className="w-[320px]"><Story /></div>],
  play: async ({ canvasElement }) => checkFits(canvasElement),
};

export const Narrow320LongLabelsRtl: Story = {
  ...Narrow320LongLabels,
  globals: { direction: "rtl" },
};

export const Narrow320English: Story = {
  args: { current: "brew" },
  decorators: [(Story) => <div className="w-[320px]"><Story /></div>],
  play: async ({ canvasElement }) => checkFits(canvasElement),
};
