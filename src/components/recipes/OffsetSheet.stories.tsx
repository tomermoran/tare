import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { OffsetSheet, type OffsetPreviewRow } from "./OffsetSheet";

const t = createTranslator({ locale: "en", messages });
const { offset, actions } = messages;
const labels = { title: offset.title, close: actions.close, shift: offset.shift, preview: offset.preview, to: offset.to };

const rows: OffsetPreviewRow[] = [
  { label: t("offset.previewRow", { coffee: "House Blend", drink: messages.drinks.latte }), from: "15", to: "12" },
  { label: t("offset.previewRow", { coffee: "Second Coffee", drink: messages.drinks.espresso }), from: "18.5", to: "15.5" },
  { label: t("offset.previewRow", { coffee: "Third Coffee", drink: messages.drinks.espresso }), from: "14", to: "11" },
];

/** The proposal after a re-dial, with its own wheel state. */
function Propose({ aged = true, more = true, failed = false, onConfirm = fn(), onDecline = fn() }) {
  const [shift, setShift] = useState(-3);
  const words = shift === 0 ? offset.noChange : t(shift < 0 ? "offset.finer" : "offset.coarser", { count: Math.abs(shift) });
  return (
    <OffsetSheet
      open
      onClose={fn()}
      labels={labels}
      line={t("offset.line", { coffee: "House Blend", was: "15", now: "12" })}
      wheel={{ value: shift, onChange: setShift, min: -25, max: 25, step: 1 }}
      words={words}
      agedNote={aged ? t("offset.agedNote", { amount: "0.5" }) : null}
      preview={{ rows, more: more ? t("offset.more", { count: 4 }) : undefined, none: offset.noOthers }}
      primary={{ label: offset.confirm, onClick: () => onConfirm(shift) }}
      secondary={{ label: offset.decline, onClick: onDecline }}
      failure={failed ? { message: messages.states.saveFailed, retryLabel: actions.retry, onRetry: fn() } : undefined}
    />
  );
}

async function opened() {
  const dialog = await within(document.body).findByRole("dialog", { name: offset.title });
  await waitFor(() => expect(dialog).toBeVisible());
  return within(dialog);
}

const meta = {
  title: "Recipes/OffsetSheet",
  component: OffsetSheet,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof OffsetSheet>;

export default meta;
type Story = StoryObj<typeof meta>;
const args = {} as Story["args"];

/** The evidence, the shift with its words, ageing taken off, and three recipes it changes (STORY-04-03-01 AC 1–3, 04-03-02 AC 1). */
export const Proposal: Story = {
  args,
  render: () => <Propose />,
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByText("Your recipe for House Blend was 15 and is now 12.")).toBeVisible();
    await expect(sheet.getByText("3 steps finer")).toBeVisible();
    await expect(sheet.getByText("0.5 of that was the beans ageing, taken off first.")).toBeVisible();
    await expect(sheet.getAllByRole("listitem")).toHaveLength(3);
    await expect(sheet.getByText("and 4 more")).toBeVisible();
  },
};

/** Changing the shift before confirming: the words follow, and confirm saves the edited value (04-03-02 AC 2). */
export const EditBeforeConfirming: Story = {
  args,
  render: () => <Propose onConfirm={fn()} />,
  play: async () => {
    const sheet = await opened();
    const slider = sheet.getByRole("slider", { name: offset.shift });
    slider.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(sheet.getByText("2 steps finer")).toBeVisible();
  },
};

export const NoAgeingNoMore: Story = { args, render: () => <Propose aged={false} more={false} /> };

/** A failed save keeps the sheet, with a retry (04-03-02 AC 4). */
export const SaveFailed: Story = {
  args,
  render: () => <Propose failed />,
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByText(messages.states.saveFailed)).toBeVisible();
    await expect(sheet.getByRole("button", { name: actions.retry })).toBeVisible();
  },
};

/** No recipe from before the servicing: says why and offers another coffee (04-03-01 AC 4). */
export const NoBaseline: Story = {
  args,
  render: () => <OffsetSheet open onClose={fn()} labels={labels} message={offset.noBaseline} primary={{ label: offset.pickAnother, onClick: fn() }} />,
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByText(offset.noBaseline)).toBeVisible();
    await expect(sheet.queryByRole("slider")).toBeNull();
  },
};

/** From the grinder's screen: where the shift came from, save or remove (STORY-04-03-05 AC 2). */
export const EditFromGrinder: Story = {
  args,
  render: () => (
    <OffsetSheet
      open
      onClose={fn()}
      labels={labels}
      line={t("offset.editFrom", { coffee: "House Blend", date: "9 October" })}
      wheel={{ value: -3, onChange: fn(), min: -25, max: 25, step: 1 }}
      words={t("offset.finer", { count: 3 })}
      preview={{ rows: rows.slice(0, 1), none: offset.noOthers }}
      primary={{ label: offset.save, onClick: fn() }}
      secondary={{ label: offset.remove, onClick: fn() }}
    />
  ),
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByText("From your re-dial of House Blend on 9 October.")).toBeVisible();
    await expect(sheet.getByRole("button", { name: offset.remove })).toBeVisible();
  },
};

/** Without the grinder's direction, no words: only the signed number on the wheel (04-03-01 AC 3). */
export const DirectionUnknown: Story = {
  args,
  render: () => (
    <OffsetSheet
      open
      onClose={fn()}
      labels={labels}
      line={t("offset.line", { coffee: "House Blend", was: "15", now: "17" })}
      wheel={{ value: 2, onChange: fn(), min: -25, max: 25, step: 1 }}
      preview={{ rows: [], none: offset.noOthers }}
      primary={{ label: offset.confirm, onClick: fn() }}
      secondary={{ label: offset.decline, onClick: fn() }}
    />
  ),
  play: async () => {
    const sheet = await opened();
    await expect(sheet.queryByText(/finer|coarser/)).toBeNull();
    await expect(sheet.getByText(offset.noOthers)).toBeVisible();
  },
};

export const RightToLeft: Story = { args, render: () => <Propose />, globals: { direction: "rtl" } };
