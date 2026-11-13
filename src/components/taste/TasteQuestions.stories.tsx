import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { TasteQuestions, type TasteAnswerValues } from "./TasteQuestions";
import { TasteTags } from "./TasteTags";
import { useTasteLabels } from "./useTasteLabels";
import type { TasteTag } from "@/domain/taste";

const { taste } = messages;
const NONE: TasteAnswerValues = { balance: null, strength: null, body: null, sweetness: null };

function Questions({ milkDrink = false }: { milkDrink?: boolean }) {
  const words = useTasteLabels(milkDrink);
  const [value, setValue] = useState(NONE);
  return (
    <div style={{ inlineSize: 343 }}>
      <TasteQuestions labels={words.questions} value={value} onChange={(p) => setValue((v) => ({ ...v, ...p }))} />
    </div>
  );
}

function Tags() {
  const words = useTasteLabels(false);
  const [value, setValue] = useState<TasteTag[]>([]);
  return <TasteTags labels={words} value={value} onChange={setValue} />;
}

const meta = {
  title: "Taste/Questions",
  component: TasteQuestions,
} satisfies Meta<typeof TasteQuestions>;

export default meta;
type Story = StoryObj<typeof meta>;

const noArgs = { labels: { allJustRight: "", rows: {} as never }, value: NONE, onChange: () => {} };

/** Four rows with their end words; nothing chosen until tapped (AC 1, AC 3). */
export const FourQuestions: Story = {
  args: noArgs,
  render: () => <Questions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const q of ["balance", "strength", "body", "sweetness"] as const) {
      await expect(canvas.getByRole("radiogroup", { name: taste.question[q] })).toBeVisible();
    }
    await expect(canvas.getByText(taste.ends.balance.start)).toBeVisible();
    await expect(canvas.getByText(taste.ends.strength.end)).toBeVisible();
    await expect(canvas.getByText(taste.ends.body.start)).toBeVisible();
    await expect(canvas.getByText(taste.ends.sweetness.start)).toBeVisible();
    await expect(canvas.queryByRole("radio", { checked: true })).toBeNull();
  },
};

/** All just right sets all four in one tap, and each can still change (AC 4). */
export const AllJustRight: Story = {
  args: noArgs,
  render: () => <Questions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: taste.allJustRight }));
    await expect(canvas.getAllByRole("radio", { checked: true })).toHaveLength(4);
    await userEvent.click(canvas.getByRole("radio", { name: taste.body.more }));
    await expect(canvas.getByRole("radio", { name: taste.body.more })).toHaveAttribute("aria-checked", "true");
    await expect(canvas.getAllByRole("radio", { checked: true })).toHaveLength(4);
  },
};

/** A milk drink's strength reads lost in the milk to overpowering (AC 2). */
export const MilkDrink: Story = {
  args: noArgs,
  render: () => <Questions milkDrink />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(taste.ends.strengthMilk.start)).toBeVisible();
    await expect(canvas.getByText(taste.ends.strengthMilk.end)).toBeVisible();
    await expect(canvas.queryByText(taste.ends.strength.start)).toBeNull();
    await expect(canvas.getByRole("radio", { name: taste.strengthMilk.muchLess })).toBeVisible();
  },
};

export const RightToLeft: Story = { args: noArgs, render: () => <Questions />, globals: { direction: "rtl" } };

/** Tags: several, none, and tap again to untick (STORY-01-05-03 AC 1 to AC 3). */
export const ObservationTags: Story = {
  args: noArgs,
  render: () => <Tags />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("group", { name: taste.observed });
    await expect(within(group).getAllByRole("button")).toHaveLength(6);
    await expect(within(group).queryAllByRole("button", { pressed: true })).toHaveLength(0);
    const dry = canvas.getByRole("button", { name: taste.tags.dryFinish });
    const crema = canvas.getByRole("button", { name: taste.tags.littleCrema });
    await userEvent.click(dry);
    await userEvent.click(crema);
    await expect(within(group).getAllByRole("button", { pressed: true })).toHaveLength(2);
    await userEvent.click(dry);
    await expect(dry).toHaveAttribute("aria-pressed", "false");
    await expect(crema).toHaveAttribute("aria-pressed", "true");
  },
};
