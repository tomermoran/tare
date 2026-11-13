import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { BeansScreen, type BagCard, type BagGroup, type BeansLabels } from "./BeansScreen";

const { beans, portion, states } = messages;
const grams = new Intl.NumberFormat("en", { style: "unit", unit: "gram", unitDisplay: "narrow" });

const labels: BeansLabels = {
  title: beans.title,
  addBag: beans.addBag,
  onHand: beans.onHand,
  tried: beans.tried,
  emptyTitle: beans.emptyTitle,
  empty: beans.empty,
  onHandEmptyTitle: beans.onHandEmptyTitle,
  onHandEmpty: beans.onHandEmpty,
  triedEmpty: beans.triedEmpty,
  loading: states.loading,
};

// Fictional coffees.
const morning: BagCard = {
  id: "b1",
  href: "/beans/b1",
  bean: "Morning Blend",
  roaster: "Example Roasters",
  portions: [
    { id: "p1", state: portion.state.counter, remaining: grams.format(120) },
    { id: "p2", state: portion.state.frozen, remaining: grams.format(250) },
  ],
};
const hill: BagCard = {
  id: "b2",
  href: "/beans/b2",
  bean: "Hill Farm Washed",
  roaster: "Sample Coffee Co.",
  portions: [{ id: "p3", state: portion.state.unopened, remaining: grams.format(340) }],
};
const winter: BagCard = {
  id: "b3",
  href: "/beans/b3",
  bean: "Winter Lot",
  roaster: "Example Roasters",
  portions: [{ id: "p4", state: portion.state.frozen, remaining: grams.format(200) }],
};
const groups: BagGroup[] = [
  { key: "open", title: beans.groupOpen, bags: [morning] },
  { key: "unopened", title: beans.groupUnopened, bags: [hill] },
  { key: "frozen", title: beans.groupFrozen, bags: [winter] },
];
const tried = (
  <ul>
    <li>
      <ListRow primary="Old Favourite" secondary="Example Roasters" />
    </li>
  </ul>
);

const primaries = (el: HTMLElement) => [...el.querySelectorAll("a, button")].filter((b) => b.className.includes("bg-action"));

const meta = {
  title: "Screens/Beans",
  component: BeansScreen,
  parameters: { layout: "centered" },
  decorators: [(Story) => <PhoneFrame><Story /></PhoneFrame>],
  args: { labels, groups, addBagHref: "/beans/add" },
} satisfies Meta<typeof BeansScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bags on hand in open, unopened and frozen groups; nothing tried yet (AC 1). */
export const OnHand: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headings = canvas.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    await expect(headings).toEqual([beans.groupOpen, beans.groupUnopened, beans.groupFrozen]);
    // A half open, half frozen bag sits once, under open, with both portions (STORY-03-02-05 AC 4).
    const open = within(canvas.getByRole("region", { name: beans.groupOpen }));
    await expect(open.getByRole("link", { name: /Morning Blend/ })).toBeVisible();
    await expect(open.getByText(portion.state.frozen)).toBeVisible();
    await expect(canvas.getAllByRole("link", { name: /Morning Blend/ })).toHaveLength(1);
    await expect(canvas.getByRole("link", { name: /Morning Blend/ })).toHaveAttribute("href", "/beans/b1");
    await expect(canvas.getByText(beans.triedEmpty)).toBeVisible();
    await expect(primaries(canvasElement)).toHaveLength(1);
    await expect(canvas.getByRole("link", { name: beans.addBag })).toBeVisible();
  },
};

/** First run: one empty state, one primary, no sections (AC 4). */
export const FirstRun: Story = {
  args: { groups: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: beans.emptyTitle })).toBeVisible();
    await expect(canvas.queryByRole("heading", { name: beans.onHand })).toBeNull();
    await expect(primaries(canvasElement)).toHaveLength(1);
  },
};

/** Nothing on hand but coffees tried: On hand offers a bag, Tried below (AC 5). */
export const NothingOnHand: Story = {
  args: { groups: [], tried },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: beans.onHandEmptyTitle })).toBeVisible();
    await expect(canvas.getByText("Old Favourite")).toBeVisible();
    await expect(primaries(canvasElement)).toHaveLength(1);
  },
};

/** Only what's left is shown: no open or unopened bags, so only Frozen (STORY-03-02-05 AC 5). */
export const OnlyFrozen: Story = {
  args: { groups: [groups[2]] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: beans.groupFrozen })).toBeVisible();
    await expect(canvas.queryByRole("heading", { name: beans.groupOpen })).toBeNull();
    await expect(canvas.queryByRole("heading", { name: beans.groupUnopened })).toBeNull();
  },
};

export const Loading: Story = {
  args: { state: "loading" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveAttribute("aria-busy", "true");
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };
