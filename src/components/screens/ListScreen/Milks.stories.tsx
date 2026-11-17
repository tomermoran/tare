import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { ListScreen } from "./ListScreen";

/* SCR-MILKS (DES-02-05-02): the same list screen as the drinks, with each milk's kind. */

const t = createTranslator({ locale: "en", messages });
const { milks, milkList, actions } = messages;

const meta = {
  title: "Screens/Milks",
  component: ListScreen,
  parameters: { layout: "centered" },
  args: {
    backHref: "/profile",
    labels: {
      title: milkList.title,
      back: actions.back,
      intro: milkList.intro,
      add: milkList.add,
      reorder: milkList.reorder,
      done: actions.done,
      hidden: milkList.hidden,
    },
    reorderLabels: {
      moveUp: (name: string) => t("milkList.moveUp", { name }),
      moveDown: (name: string) => t("milkList.moveDown", { name }),
      moved: (name: string, position: number, count: number) => t("milkList.moved", { name, position, count }),
    },
    rows: [
      { id: "1", name: milks.whole, secondary: milkList.dairy, hidden: false },
      { id: "2", name: "Oat (barista)", secondary: milkList.plant, hidden: false },
      { id: "3", name: milks.skimmed, secondary: milkList.dairy, hidden: true },
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
} satisfies Meta<typeof ListScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every milk with its kind, hidden ones marked; the last row adds one (STORY-02-05-05 AC 1 to AC 3). */
export const List: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: milkList.title })).toBeVisible();
    await expect(canvas.getByText(milkList.hidden)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: milkList.add }));
    await expect(args.onAdd).toHaveBeenCalled();
  },
};

/** Reordering moves a milk (AC 4). */
export const Reordering: Story = {
  args: { reordering: true },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: t("milkList.moveUp", { name: "Oat (barista)" }) }));
    await expect(args.onMove).toHaveBeenCalledWith("2", 0);
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };
