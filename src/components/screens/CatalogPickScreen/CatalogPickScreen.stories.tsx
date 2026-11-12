import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { CatalogPickScreen, type CatalogPickLabels, type PickGroup } from "./CatalogPickScreen";

const { catalog, actions, states, setup } = messages;

const labels = (title: string, hint = catalog.searchHint, query = ""): CatalogPickLabels => ({
  title,
  search: catalog.search,
  searchHint: hint,
  addedByYou: catalog.addedByYou,
  alsoKnownAs: (alias) => catalog.alsoKnownAs.replace("{alias}", alias),
  cantFind: catalog.cantFind,
  noMatch: catalog.noMatch.replace("{query}", query),
  loading: states.loading,
  cancel: actions.cancel,
  back: catalog.allMakers,
  loadFailedTitle: states.loadFailedTitle,
  loadFailed: states.loadFailed,
  retry: actions.retry,
});

// Fictional catalog rows.
const makers: PickGroup[] = [
  {
    label: catalog.makers,
    rows: [
      { id: "m1", primary: "Example Espresso Co.", drillIn: true },
      { id: "m2", primary: "Sample Grinders", drillIn: true },
      { id: "m3", primary: "Workshop Twelve", drillIn: true, addedByYou: true },
    ],
  },
];

const baskets: PickGroup[] = [
  {
    label: setup.stockBaskets,
    rows: [
      { id: "b1", primary: "54mm Double Shot Basket", secondary: "Example Espresso Co." },
      { id: "b2", primary: "54mm Single Shot Basket", secondary: "Example Espresso Co." },
    ],
  },
  {
    label: catalog.results,
    rows: [{ id: "b3", primary: "54mm Double Shot Basket", secondary: "Sample Baskets" }],
  },
];

const meta = {
  title: "Screens/Catalog pick",
  component: CatalogPickScreen,
  parameters: { layout: "centered" },
  decorators: [(Story) => <PhoneFrame><Story /></PhoneFrame>],
  args: {
    labels: labels(catalog.pickTitle.grinder),
    query: "",
    onQueryChange: fn(),
    state: "ready",
    groups: makers,
    onPick: fn(),
    onCantFind: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof CatalogPickScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No query: makers, alphabetical, with the household's own marked by text. */
export const Browse: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(catalog.addedByYou)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: /Sample Grinders/ }));
    await expect(args.onPick).toHaveBeenCalledWith(expect.objectContaining({ id: "m2" }));
    // The add-it row ends the list.
    const rows = canvas.getAllByRole("button").filter((b) => b.closest("li") || b.textContent === catalog.cantFind);
    await expect(rows.at(-1)).toHaveTextContent(catalog.cantFind);
  },
};

/** Baskets: the household machine maker's first, every row by maker and model. */
export const Baskets: Story = {
  args: { labels: labels(catalog.pickTitle.basket), groups: baskets, query: "54mm" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: setup.stockBaskets })).toBeVisible();
    await expect(canvas.getAllByText("Example Espresso Co.")).toHaveLength(2);
  },
};

export const MatchedByAlias: Story = {
  args: {
    query: "ex-500",
    labels: labels(catalog.pickTitle.machine),
    groups: [{ rows: [{ id: "x", primary: "Model One", secondary: "Example Espresso Co.", alias: "EX-500" }] }],
  },
};

/** One maker's models, with a way back to all makers. */
export const MakerModels: Story = {
  args: {
    onBack: fn(),
    groups: [{ label: "Sample Grinders", rows: [{ id: "g1", primary: "Grinder 64", secondary: "Sample Grinders" }] }],
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: catalog.allMakers }));
    await expect(args.onBack).toHaveBeenCalled();
  },
};

export const Loading: Story = {
  args: { state: "loading", query: "zer" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status", { name: states.loading })).toHaveAttribute("aria-busy", "true");
  },
};

/** No match: the query is echoed, and adding it is one tap. */
export const NoMatch: Story = {
  args: { query: "Imaginary 9000", labels: labels(catalog.pickTitle.grinder, catalog.searchHint, "Imaginary 9000"), groups: [] },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("Imaginary 9000");
    await userEvent.click(canvas.getByRole("button", { name: catalog.cantFind }));
    await expect(args.onCantFind).toHaveBeenCalled();
  },
};

/** The search couldn't run: neutral notice and retry, the field keeps the query. */
export const Failed: Story = {
  args: { state: "failed", query: "zer", onRetry: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(within(canvas.getByRole("alert")).getByRole("button", { name: actions.retry }));
    await expect(args.onRetry).toHaveBeenCalled();
    await expect(canvas.getByRole("searchbox")).toHaveValue("zer");
  },
};

export const Coffee: Story = {
  args: {
    labels: labels(catalog.pickTitle.coffee, catalog.searchCoffeeHint),
    groups: [{ label: catalog.roasters, rows: [{ id: "r1", primary: "Example Roasters", drillIn: true }] }],
  },
};

export const RightToLeft: Story = {
  ...MakerModels,
  globals: { direction: "rtl" },
};
