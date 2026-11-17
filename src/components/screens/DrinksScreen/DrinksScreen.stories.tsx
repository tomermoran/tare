import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, fn, userEvent, within } from "storybook/test";
import { ListSkeleton } from "@/components/ui/Skeleton/Skeleton";
import { Notice } from "@/components/ui/Notice/Notice";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { DrinksScreen } from "./DrinksScreen";

const t = createTranslator({ locale: "en", messages });
const { drinks, drinkList, actions } = messages;
const ml = (n: number) => new Intl.NumberFormat("en", { style: "unit", unit: "milliliter", unitDisplay: "short" }).format(n);
const LONG = "A very long name for a weekend flat whit";

const meta = {
  title: "Screens/Drinks",
  component: DrinksScreen,
  parameters: { layout: "centered" },
  args: {
    backHref: "/profile",
    labels: {
      title: drinkList.title,
      back: actions.back,
      intro: drinkList.intro,
      add: drinkList.add,
      reorder: drinkList.reorder,
      done: actions.done,
      hidden: drinkList.hidden,
    },
    reorderLabels: {
      moveUp: (name: string) => t("drinkList.moveUp", { name }),
      moveDown: (name: string) => t("drinkList.moveDown", { name }),
      moved: (name: string, position: number, count: number) => t("drinkList.moved", { name, position, count }),
    },
    rows: [
      { id: "1", name: drinks.espresso, secondary: drinkList.noMilk, hidden: false },
      { id: "2", name: drinks.latte, secondary: t("drinkList.withMilk", { amount: ml(180) }), hidden: false },
      { id: "3", name: drinks.ristretto, secondary: drinkList.noMilk, hidden: true },
      { id: "4", name: LONG, secondary: t("drinkList.withMilk", { amount: ml(30) }), hidden: false },
    ],
    onToggleReorder: fn(),
    onMove: fn(),
    onOpen: fn(),
    onAdd: fn(),
  },
  decorators: [
    (Story) => (
      <PhoneFrame>
        <Story />
      </PhoneFrame>
    ),
  ],
} satisfies Meta<typeof DrinksScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every drink, hidden ones marked; a row opens its drink and the last row adds one (DES-02-05-01). */
export const List: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: drinkList.title })).toBeVisible();
    await expect(canvas.getByText(drinkList.hidden)).toBeVisible();
    // A 40-character name is shown in full (STORY-02-05-01 AC 4).
    await expect(canvas.getByText(LONG)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: new RegExp(drinks.latte) }));
    await expect(args.onOpen).toHaveBeenCalledWith("2");
    await userEvent.click(canvas.getByRole("button", { name: drinkList.add }));
    await expect(args.onAdd).toHaveBeenCalled();
    await expect(canvas.queryByRole("button", { name: actions.save })).toBeNull();
  },
};

/** Reorder mode: move buttons, Done in the header, no add row. */
export const Reordering: Story = {
  args: { reordering: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: actions.done })).toBeVisible();
    await expect(canvas.queryByRole("button", { name: drinkList.add })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: t("drinkList.moveDown", { name: drinks.espresso }) }));
    await expect(args.onMove).toHaveBeenCalledWith("1", 1);
  },
};

/** A failed move: the row is back in place and the notice says so (STORY-02-05-04 AC 3). */
export const MoveFailed: Story = {
  args: {
    reordering: true,
    notice: (
      <Notice urgent action={{ label: actions.retry, onClick: () => {} }}>
        {drinkList.reorderFailed}
      </Notice>
    ),
  },
};

export const Loading: Story = { render: () => <ListSkeleton label={messages.states.loading} rows={6} /> };

export const RightToLeft: Story = { globals: { direction: "rtl" } };

export const ReorderingRightToLeft: Story = { args: { reordering: true }, globals: { direction: "rtl" } };
