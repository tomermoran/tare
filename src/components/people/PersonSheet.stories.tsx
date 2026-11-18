import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { PersonSheet } from "./PersonSheet";

/* SH-PERSON with placeholder names. */

const t = createTranslator({ locale: "en", messages });
const { people, actions, states } = messages;
const labels = {
  addTitle: people.addTitle,
  editTitle: people.editTitle,
  close: actions.close,
  name: people.name,
  nameHint: people.nameHint,
  nameRequired: people.nameRequired,
  nameTaken: people.nameTaken,
  save: actions.save,
  saveFailed: states.saveFailed,
  remove: people.remove,
  removeTitle: people.removeTitle,
  removeBody: people.removeBody,
  removeConfirm: people.removeConfirm,
  cancel: actions.cancel,
};

const meta = {
  title: "People/Person sheet",
  component: PersonSheet,
  args: { open: true, labels, onSave: fn(), onRemove: fn(), onClose: fn() },
} satisfies Meta<typeof PersonSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const dialog = async (name: string) => {
  const d = await within(document.body).findByRole("dialog", { name });
  await waitFor(() => expect(d).toBeVisible());
  return within(d);
};

/** Adding asks for a name only, with the nickname hint (STORY-05-01-01 AC 1, AC 5). */
export const Add: Story = {
  play: async ({ args }) => {
    const sheet = await dialog(people.addTitle);
    await expect(sheet.getByText(people.nameHint)).toBeVisible();
    await userEvent.type(sheet.getByLabelText(people.name), "Person C");
    await userEvent.click(sheet.getByRole("button", { name: actions.save }));
    await expect(args.onSave).toHaveBeenCalledWith("Person C");
    await userEvent.type(sheet.getByLabelText(people.name), "{Enter}");
    await expect(args.onSave).toHaveBeenCalledTimes(2);
  },
};

/** Empty and taken names are said in ink under the field (AC 3). */
export const NameTaken: Story = {
  args: { error: "nameTaken" },
  play: async () => {
    await expect((await dialog(people.addTitle)).getByText(people.nameTaken)).toBeVisible();
  },
};

export const NameRequired: Story = { args: { error: "nameRequired" } };

/** A failed save keeps the name (STORY-05-01-01 AC 5). */
export const SaveFailed: Story = {
  args: { error: "saveFailed", person: { name: "Person A", removable: false } },
  play: async () => {
    const sheet = await dialog(people.editTitle);
    await expect(sheet.getByLabelText(people.name)).toHaveValue("Person A");
    await expect(sheet.getByText(states.saveFailed)).toBeVisible();
  },
};

/** An empty profile can be removed, after one confirmation (STORY-05-01-02 AC 2). */
export const Removable: Story = {
  args: { person: { name: "Person B", removable: true } },
  play: async ({ args }) => {
    const sheet = await dialog(people.editTitle);
    await userEvent.click(sheet.getByRole("button", { name: people.remove }));
    const confirm = await dialog(people.removeTitle);
    await userEvent.click(confirm.getByRole("button", { name: people.removeConfirm }));
    await expect(args.onRemove).toHaveBeenCalled();
  },
};

/** A profile with history stays, and says why; rename still works (AC 3). */
export const InUse: Story = {
  args: { person: { name: "Person A", removable: false, cantRemove: t("people.cantRemove", { shots: 12, recipes: 2 }) } },
  play: async () => {
    const sheet = await dialog(people.editTitle);
    await expect(sheet.queryByRole("button", { name: people.remove })).toBeNull();
    await expect(sheet.getByText("12 shots and 2 recipes belong to this profile, so it stays. You can rename it.")).toBeVisible();
  },
};

/** The main profile has no remove (AC 4). */
export const MainProfile: Story = {
  args: { person: { name: "", removable: false } },
  play: async () => {
    await expect((await dialog(people.editTitle)).queryByRole("button", { name: people.remove })).toBeNull();
  },
};

/** A profile with no login can be invited for, by any member (STORY-05-02-01 AC 3). */
export const CanInvite: Story = {
  args: { person: { name: "Guest", removable: false, invite: { label: t("people.invite", { name: "Guest" }), onClick: fn() } } },
  play: async ({ args }) => {
    const sheet = await dialog(people.editTitle);
    await userEvent.click(sheet.getByRole("button", { name: "Invite Guest to take over" }));
    await expect(args.person!.invite!.onClick).toHaveBeenCalled();
  },
};

/** A pending invite says so, and shows the link again (STORY-05-02-06 AC 2). */
export const InvitePending: Story = {
  args: { person: { name: "Guest", removable: false, status: people.invitePending, invite: { label: people.showInvite, onClick: fn() } } },
  play: async () => {
    const sheet = await dialog(people.editTitle);
    await expect(sheet.getByText(people.invitePending)).toBeVisible();
    await expect(sheet.getByRole("button", { name: people.showInvite })).toBeVisible();
  },
};

/** A claimed profile has its own login and nothing to invite (STORY-05-02-01 AC 4). */
export const Claimed: Story = {
  args: { person: { name: "Person A", removable: false, status: people.claimed } },
  play: async () => {
    const sheet = await dialog(people.editTitle);
    await expect(sheet.getByText(people.claimed)).toBeVisible();
    await expect(sheet.queryByRole("button", { name: /Invite/ })).toBeNull();
  },
};

export const RightToLeft: Story = { args: Removable.args, globals: { direction: "rtl" } };
