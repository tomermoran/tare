import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { InviteSheet } from "./InviteSheet";

/* SH-INVITE with a placeholder name and an example link. */

const t = createTranslator({ locale: "en", messages });
const { invite, actions, states } = messages;
const title = t("invite.title", { name: "Guest" });
const labels = {
  title,
  close: actions.close,
  sharesIntro: invite.sharesIntro,
  shares: Object.values(invite.shares),
  create: invite.create,
  link: invite.link,
  copy: invite.copy,
  copied: invite.copied,
  share: invite.share,
  sendYourself: invite.sendYourself,
  withdraw: invite.withdraw,
  retry: actions.retry,
};
const link = "https://tare.example/join/an-example-token";
const valid = t("invite.valid", { date: "November 25" });

const meta = {
  title: "People/Invite sheet",
  component: InviteSheet,
  args: { open: true, labels, link: null, onClose: fn(), onCreate: fn() },
} satisfies Meta<typeof InviteSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const dialog = async () => {
  const d = await within(document.body).findByRole("dialog", { name: title });
  await waitFor(() => expect(d).toBeVisible());
  return within(d);
};

/** Before any link: what they would share, said to the inviter first (STORY-05-02-01 AC 1). */
export const Before: Story = {
  play: async ({ args }) => {
    const sheet = await dialog();
    await expect(sheet.getByText(invite.shares.household)).toBeVisible();
    await expect(sheet.queryByLabelText(invite.link)).toBeNull();
    await userEvent.click(sheet.getByRole("button", { name: invite.create }));
    await expect(args.onCreate).toHaveBeenCalled();
  },
};

/** Made: the link to copy, how long it works, and that Tare sends nothing (AC 2). */
export const Created: Story = {
  args: { link, valid },
  play: async () => {
    const sheet = await dialog();
    await expect(sheet.getByLabelText(invite.link)).toHaveValue(link);
    await expect(sheet.getByText(valid)).toBeVisible();
    await expect(sheet.getByText(invite.sendYourself)).toBeVisible();
    await expect(sheet.queryByRole("button", { name: invite.share })).toBeNull();
  },
};

/** Where the device offers sharing (AC 2). */
export const ShareAvailable: Story = {
  args: { link, valid, onShare: fn() },
  play: async ({ args }) => {
    const sheet = await dialog();
    await userEvent.click(sheet.getByRole("button", { name: invite.share }));
    await expect(args.onShare).toHaveBeenCalled();
  },
};

/** A pending link shown again, with withdraw (STORY-05-02-06 AC 2). */
export const Pending: Story = {
  args: { link, valid, onWithdraw: fn() },
  play: async ({ args }) => {
    const sheet = await dialog();
    await userEvent.click(sheet.getByRole("button", { name: invite.withdraw }));
    await expect(args.onWithdraw).toHaveBeenCalled();
  },
};

/** Creating failed: said, with a retry (STORY-05-02-01 AC 6). */
export const Failed: Story = {
  args: { failure: { message: states.saveFailed, onRetry: fn() } },
  play: async () => {
    const sheet = await dialog();
    await expect(sheet.getByRole("alert")).toHaveTextContent(states.saveFailed);
    await expect(sheet.getByRole("button", { name: actions.retry })).toBeVisible();
  },
};

/** Withdrawing failed: the link stays pending, with a retry (STORY-05-02-06 AC 4). */
export const WithdrawFailed: Story = {
  args: { link, valid, onWithdraw: fn(), failure: { message: invite.withdrawFailed, onRetry: fn() } },
};

export const RightToLeft: Story = { args: { link, valid, onShare: fn(), onWithdraw: fn() }, globals: { direction: "rtl" } };
