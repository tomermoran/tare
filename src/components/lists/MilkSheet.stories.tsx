import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { MilkSheet } from "./MilkSheet";

const { milks, milkList, actions, states } = messages;
const labels = {
  editTitle: milkList.editTitle,
  addTitle: milkList.addTitle,
  close: actions.close,
  name: milkList.name,
  resetName: milkList.resetName,
  nameRequired: milkList.nameRequired,
  nameTaken: milkList.nameTaken,
  kind: milkList.kind,
  dairy: milkList.dairy,
  plant: milkList.plant,
  kindFixed: milkList.kindFixed,
  kindRequired: milkList.kindRequired,
  show: milkList.show,
  keepOne: milkList.keepOne,
  save: actions.save,
  saveFailed: states.saveFailed,
  retry: actions.retry,
  discardTitle: milkList.discardTitle,
  discardBody: milkList.discardBody,
  discard: actions.discard,
  keepEditing: actions.keepEditing,
};
const oat = { name: milks.oat, originalName: null, kind: "plant" as const, hidden: false, canHide: true };
const body = () => within(document.body);

const meta = {
  title: "Lists/Milk sheet",
  component: MilkSheet,
  args: { open: true, labels, milk: oat, onSave: fn(), onClose: fn() },
} satisfies Meta<typeof MilkSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Edit: the name, the kind as a plain line, shown; nothing deletes (STORY-02-05-05 AC 1, AC 5). */
export const Edit: Story = {
  play: async ({ args }) => {
    await waitFor(() => expect(body().getByRole("dialog", { name: milkList.editTitle })).toBeVisible());
    await expect(body().getByText(milkList.plant)).toBeVisible();
    await expect(body().queryByRole("radiogroup", { name: milkList.kind })).toBeNull();
    await expect(body().queryByRole("button", { name: /delete|remove/i })).toBeNull();
    const name = body().getByLabelText(milkList.name);
    await userEvent.clear(name);
    await userEvent.type(name, "Oat (barista)");
    await userEvent.click(body().getByRole("button", { name: actions.save }));
    await expect(args.onSave).toHaveBeenCalledWith({ name: "Oat (barista)", kind: "plant", hidden: false });
  },
};

/** A renamed starter offers its original name back. */
export const ResetName: Story = {
  args: { milk: { ...oat, name: "Oat (barista)", originalName: milks.oat } },
  play: async ({ args }) => {
    await waitFor(() => expect(body().getByRole("button", { name: milkList.resetName })).toBeVisible());
    await userEvent.click(body().getByRole("button", { name: milkList.resetName }));
    await userEvent.click(body().getByRole("button", { name: actions.save }));
    await expect(args.onSave).toHaveBeenCalledWith(expect.objectContaining({ name: null }));
  },
};

/** A name in use is said under the field (AC 1). */
export const NameTaken: Story = {
  args: { error: "nameTaken", milk: { ...oat, name: milks.whole } },
  play: async () => {
    await waitFor(() => expect(body().getByText(milkList.nameTaken)).toBeVisible());
  },
};

/** The last shown milk can't be hidden, and says why (AC 2). */
export const KeepOne: Story = {
  args: { milk: { ...oat, canHide: false } },
  play: async () => {
    await waitFor(() => expect(body().getByRole("switch", { name: milkList.show })).toBeDisabled());
    await waitFor(() => expect(body().getByText(milkList.keepOne)).toBeVisible());
  },
};

/** Add: a name and a kind, which is required and said to be fixed (AC 3). */
export const Add: Story = {
  args: { milk: undefined },
  play: async ({ args }) => {
    await waitFor(() => expect(body().getByRole("dialog", { name: milkList.addTitle })).toBeVisible());
    await expect(body().getByText(milkList.kindFixed)).toBeVisible();
    await userEvent.type(body().getByLabelText(milkList.name), "Hazelnut");
    await userEvent.click(body().getByRole("button", { name: actions.save }));
    await waitFor(() => expect(body().getByText(milkList.kindRequired)).toBeVisible());
    await expect(args.onSave).not.toHaveBeenCalled();
    await userEvent.click(body().getByRole("radio", { name: milkList.plant }));
    await userEvent.click(body().getByRole("button", { name: actions.save }));
    await expect(args.onSave).toHaveBeenCalledWith({ name: "Hazelnut", kind: "plant", hidden: false });
  },
};

/** A failed save keeps the typed name, with a retry (AC 6). */
export const SaveFailed: Story = {
  args: { error: "saveFailed", milk: { ...oat, name: "Oat (barista)" } },
  play: async () => {
    await waitFor(() => expect(body().getByText(states.saveFailed)).toBeVisible());
    await expect(body().getByLabelText(milkList.name)).toHaveValue("Oat (barista)");
  },
};

export const RightToLeft: Story = { args: { milk: undefined }, globals: { direction: "rtl" } };
