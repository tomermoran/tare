import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { FilterChips, type FilterChip } from "./FilterChips";

const t = createTranslator({ locale: "en", messages });
const { journal } = messages;

type Values = { drink: string | null; coffee: string | null; setup: string | null };
const kinds = [
  { id: "drink", filter: journal.filterDrink, any: journal.filterAnyDrink },
  { id: "coffee", filter: journal.filterCoffee, any: journal.filterAnyCoffee },
  { id: "setup", filter: journal.filterSetup, any: journal.filterAnySetup },
] as const;

const chipsFor = (v: Values): FilterChip[] =>
  kinds.map(({ id, filter, any }) => {
    const value = v[id];
    return value
      ? { id, text: value, name: t("journal.filterName", { filter, value }), remove: t("journal.removeFilter", { filter, value }) }
      : { id, text: any, name: t("journal.filterName", { filter, value: any }) };
  });

const none: Values = { drink: null, coffee: null, setup: null };
const set: Values = { drink: "Flat white", coffee: "Example Blend", setup: null };

function Row({ initial, onOpen }: { initial: Values; onOpen?: (id: string) => void }) {
  const [v, setV] = useState(initial);
  return (
    <FilterChips
      label={journal.filters}
      chips={chipsFor(v)}
      all={journal.filterAll}
      onOpen={onOpen ?? (() => {})}
      onRemove={(id) => setV((x) => ({ ...x, [id]: null }))}
      onClearAll={() => setV(none)}
    />
  );
}

const meta = {
  title: "Components/FilterChips",
  component: FilterChips,
  args: { label: journal.filters, chips: chipsFor(none), all: journal.filterAll, onOpen: fn(), onRemove: fn(), onClearAll: fn() },
} satisfies Meta<typeof FilterChips>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No filter: every chip says "Any …", and there's no "All". */
export const Off: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("button", { name: journal.filterAll })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: t("journal.filterName", { filter: journal.filterDrink, value: journal.filterAnyDrink }) }));
    await expect(args.onOpen).toHaveBeenCalledWith("drink");
  },
};

/** Each active filter is named with its value and removed on its own; "All" clears the rest (AC 2, AC 5). */
export const Active: Story = {
  render: () => <Row initial={set} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const removeDrink = canvas.getByRole("button", { name: t("journal.removeFilter", { filter: journal.filterDrink, value: "Flat white" }) });
    // By keyboard: tab to the remove control and press enter.
    removeDrink.focus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.queryByRole("button", { name: t("journal.filterName", { filter: journal.filterDrink, value: "Flat white" }) })).toBeNull();
    await expect(canvas.getByRole("button", { name: t("journal.filterName", { filter: journal.filterCoffee, value: "Example Blend" }) })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: journal.filterAll }));
    await expect(canvas.queryByRole("button", { name: journal.filterAll })).toBeNull();
    await expect(canvas.getByRole("button", { name: t("journal.filterName", { filter: journal.filterCoffee, value: journal.filterAnyCoffee }) })).toBeVisible();
  },
};

export const RightToLeft: Story = { render: () => <Row initial={set} />, globals: { direction: "rtl" } };
