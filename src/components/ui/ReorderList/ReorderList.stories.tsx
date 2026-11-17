import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { ReorderList, type ReorderItem } from "./ReorderList";

const t = createTranslator({ locale: "en", messages });
const { drinks, drinkList } = messages;
const labels = {
  moveUp: (name: string) => t("drinkList.moveUp", { name }),
  moveDown: (name: string) => t("drinkList.moveDown", { name }),
  moved: (name: string, position: number, count: number) => t("drinkList.moved", { name, position, count }),
};
const start = [drinks.espresso, drinks.latte, drinks.flatWhite, "A very long name for a weekend flat whit"].map((name, i) => ({
  id: String(i),
  name,
  primary: name,
  secondary: i === 1 ? drinkList.hidden : undefined,
  quiet: i === 1,
}));

function Harness({ reordering, onOpen }: { reordering: boolean; onOpen: (id: string) => void }) {
  const [items, setItems] = useState<ReorderItem[]>(start.map((i) => ({ ...i, onClick: () => onOpen(i.id) })));
  const [said, setSaid] = useState("");
  return (
    <div className="w-[342px]">
      <ReorderList
        items={items}
        reordering={reordering}
        labels={labels}
        announcement={said}
        onMove={(id, to) =>
          setItems((list) => {
            const next = list.filter((i) => i.id !== id);
            const moved = list.find((i) => i.id === id)!;
            next.splice(to, 0, moved);
            setSaid(labels.moved(moved.name, to + 1, next.length));
            return next;
          })
        }
      />
    </div>
  );
}

const meta = {
  title: "Components/ReorderList",
  component: Harness,
  args: { reordering: false, onOpen: fn() },
} satisfies Meta<typeof Harness>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Out of reorder mode: rows open on tap; long names wrap. */
export const List: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: new RegExp(drinks.latte) }));
    await expect(args.onOpen).toHaveBeenCalledWith("1");
  },
};

/** Reorder mode: up and down per row; the first can't go up and the last can't go down. */
export const Reordering: Story = {
  args: { reordering: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: labels.moveUp(drinks.espresso) })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: labels.moveDown(drinks.espresso) })).toBeEnabled();
    await expect(canvas.getByRole("button", { name: labels.moveDown(start[3].name) })).toBeDisabled();
  },
};

/** With a keyboard: each move is announced and focus follows the row (STORY-02-05-04 AC 2). */
export const Keyboard: Story = {
  args: { reordering: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole("button", { name: labels.moveDown(drinks.espresso) }).focus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("status")).toHaveTextContent(labels.moved(drinks.espresso, 2, 4));
    await expect(document.activeElement).toBe(canvas.getByRole("button", { name: labels.moveDown(drinks.espresso) }));
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("status")).toHaveTextContent(labels.moved(drinks.espresso, 4, 4));
    // Now last: "down" is disabled, so focus moved to "up".
    await expect(document.activeElement).toBe(canvas.getByRole("button", { name: labels.moveUp(drinks.espresso) }));
    const rows = canvas.getAllByRole("listitem").map((li) => li.textContent);
    await expect(rows.at(-1)).toContain(drinks.espresso);
  },
};

export const RightToLeft: Story = { args: { reordering: true }, globals: { direction: "rtl" } };
