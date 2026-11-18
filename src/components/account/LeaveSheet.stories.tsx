import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { LeaveSheet } from "./LeaveSheet";

const { leave, actions } = messages;
const labels = {
  title: leave.title,
  close: actions.close,
  lines: [leave.staysBehind, leave.startFresh, leave.account, leave.canReturn],
  ownerNote: leave.ownerNote,
  confirm: leave.confirm,
  cancel: actions.cancel,
  failed: leave.failed,
  retry: actions.retry,
  alone: leave.alone,
};

const meta = {
  title: "Account/Leave sheet",
  component: LeaveSheet,
  args: { open: true, labels, onConfirm: fn(), onCancel: fn() },
} satisfies Meta<typeof LeaveSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const dialog = async () => {
  const d = await within(document.body).findByRole("dialog", { name: leave.title });
  await waitFor(() => expect(d).toBeVisible());
  return within(d);
};

/** Asked once, with what happens in plain lines (STORY-05-02-07 AC 1, AC 4). */
export const Member: Story = {
  play: async ({ args }) => {
    const sheet = await dialog();
    await expect(sheet.getByText(leave.staysBehind)).toBeVisible();
    await expect(sheet.queryByText(leave.ownerNote)).toBeNull();
    await userEvent.click(sheet.getByRole("button", { name: actions.cancel }));
    await expect(args.onCancel).toHaveBeenCalled();
    await expect(args.onConfirm).not.toHaveBeenCalled();
  },
};

/** The only owner is told who takes over. */
export const OnlyOwner: Story = {
  args: { onlyOwner: true },
  play: async () => {
    await expect((await dialog()).getByText(leave.ownerNote)).toBeVisible();
  },
};

/** Leaving failed: nothing changed, with a retry (AC 5). */
export const Failed: Story = {
  args: { failed: true },
  play: async () => {
    await expect((await dialog()).getByRole("alert")).toHaveTextContent(leave.failed);
  },
};

/** No one else is left: nothing to leave, and no confirm. */
export const Alone: Story = {
  args: { alone: true },
  play: async () => {
    const sheet = await dialog();
    await expect(sheet.getByText(leave.alone)).toBeVisible();
    await expect(sheet.queryByRole("button", { name: leave.confirm })).toBeNull();
  },
};

export const RightToLeft: Story = { args: { onlyOwner: true }, globals: { direction: "rtl" } };
