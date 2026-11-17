import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import type { BeansFilters } from "@/domain/beansFilter";
import messages from "@/i18n/messages/en.json";
import { readBeansFilters } from "@/lib/beansFilters";
import { BeansFilterRow, type BeansFilterChip } from "./BeansFilterRow";

/*
 * Beans' filter row (STORY-03-07-01 to 03), with fictional coffees. The
 * story follows its own links, as the address would.
 */

const t = createTranslator({ locale: "en", messages });
const { beans, catalog, actions } = messages;
const count = (n: number) => t("beans.filterCount", { count: n });

const chips: BeansFilterChip[] = [
  {
    kind: "roaster",
    title: beans.filterRoaster,
    any: beans.filterAnyRoaster,
    options: [
      { id: "r-ash", primary: "Ash Lane", secondary: count(2) },
      { id: "r-north", primary: "North Roasters", secondary: count(4) },
    ],
  },
  {
    kind: "roast",
    title: beans.filterRoast,
    any: beans.filterAnyRoast,
    options: [
      { id: "Light", primary: catalog.roast.Light, secondary: count(2) },
      { id: "Medium", primary: catalog.roast.Medium, secondary: count(3) },
      { id: "Dark", primary: catalog.roast.Dark, secondary: count(1) },
    ],
  },
  {
    kind: "origin",
    title: beans.filterOrigin,
    any: beans.filterAnyOrigin,
    options: [
      { id: "ET", primary: "Ethiopia", secondary: count(2) },
      { id: "blend", primary: catalog.origin.blend, secondary: count(1) },
      { id: "none", primary: beans.originUnknown, secondary: count(3) },
    ],
  },
  {
    kind: "rating",
    title: beans.filterRating,
    any: beans.filterAnyRating,
    options: [
      { id: "mostlyGood", primary: beans.summary.mostlyGood, secondary: count(3) },
      { id: "noRatings", primary: beans.summary.noRatings, secondary: count(3) },
    ],
  },
];

const labels = {
  row: beans.filters,
  all: beans.filterAll,
  name: (filter: string, value: string) => t("beans.filterName", { filter, value }),
  remove: (filter: string, value: string) => t("beans.removeFilter", { filter, value }),
  close: actions.close,
};

function Row({ initial = {}, only }: { initial?: BeansFilters; only?: BeansFilterChip["kind"][] }) {
  const [filters, setFilters] = useState(initial);
  return (
    <BeansFilterRow
      chips={only ? chips.filter((c) => only.includes(c.kind)) : chips}
      filters={filters}
      onGo={(href) => setFilters(readBeansFilters(Object.fromEntries(new URL(href, "http://x").searchParams)))}
      labels={labels}
    />
  );
}

const meta = {
  title: "Beans/Filter row",
  component: BeansFilterRow,
  args: { chips, filters: {}, onGo: fn(), labels },
  render: () => <Row />,
} satisfies Meta<typeof BeansFilterRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = (el: HTMLElement) => within(within(el).getByRole("group", { name: beans.filters }));

/** No filter: each chip says "any", and there's no "All" (STORY-03-07-02 AC 1). */
export const NoFilter: Story = {
  play: async ({ canvasElement }) => {
    await expect(row(canvasElement).getByRole("button", { name: `${beans.filterRoaster}: ${beans.filterAnyRoaster}` })).toBeVisible();
    await expect(row(canvasElement).queryByRole("button", { name: beans.filterAll })).toBeNull();
  },
};

/** A chip's choices are only the values present, with counts (STORY-03-07-01 AC 2, AC 3). */
export const Choosing: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(row(canvasElement).getByRole("button", { name: `${beans.filterRating}: ${beans.filterAnyRating}` }));
    const dialog = await within(document.body).findByRole("dialog", { name: beans.filterRating });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(within(dialog).getAllByRole("button", { name: /coffees/ }).map((b) => b.textContent)).toEqual([
      `${beans.summary.mostlyGood}${count(3)}`,
      `${beans.summary.noRatings}${count(3)}`,
    ]);
    await userEvent.click(within(dialog).getByRole("button", { name: new RegExp(beans.summary.mostlyGood) }));
    await expect(await row(canvasElement).findByRole("button", { name: `${beans.filterRating}: ${beans.summary.mostlyGood}` })).toBeVisible();
  },
};

/** Several on: each shows its value and can be removed alone; "All" clears every one (STORY-03-07-01 AC 5). */
export const Several: Story = {
  render: () => <Row initial={{ roaster: "r-ash", origin: "none" }} />,
  play: async ({ canvasElement }) => {
    const r = row(canvasElement);
    await userEvent.click(r.getByRole("button", { name: t("beans.removeFilter", { filter: beans.filterRoaster, value: "Ash Lane" }) }));
    await expect(r.getByRole("button", { name: `${beans.filterRoaster}: ${beans.filterAnyRoaster}` })).toBeVisible();
    await expect(r.getByRole("button", { name: `${beans.filterOrigin}: ${beans.originUnknown}` })).toBeVisible();
    await userEvent.click(r.getByRole("button", { name: beans.filterAll }));
    await expect(r.queryByRole("button", { name: beans.filterAll })).toBeNull();
  },
};

/** No coffee has an origin: no origin chip (STORY-03-07-03 AC 2). */
export const NoOrigins: Story = {
  render: () => <Row only={["roaster", "roast", "rating"]} />,
  play: async ({ canvasElement }) => {
    await expect(row(canvasElement).queryByRole("button", { name: new RegExp(`^${beans.filterOrigin}`) })).toBeNull();
  },
};

export const RightToLeft: Story = {
  render: () => <Row initial={{ roast: "Medium" }} />,
  globals: { direction: "rtl" },
};
