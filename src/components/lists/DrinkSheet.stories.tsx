import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { DrinkSheet } from "./DrinkSheet";

const { drinks, drinkList, actions, states } = messages;
const labels = {
  editTitle: drinkList.editTitle,
  addTitle: drinkList.addTitle,
  close: actions.close,
  name: drinkList.name,
  resetName: drinkList.resetName,
  nameRequired: drinkList.nameRequired,
  nameTaken: drinkList.nameTaken,
  usualMilk: drinkList.usualMilk,
  hasMilk: drinkList.hasMilk,
  hasMilkLine: drinkList.hasMilkLine,
  noMilkLine: drinkList.noMilkLine,
  hasMilkFixed: drinkList.hasMilkFixed,
  hasMilkHint: drinkList.hasMilkHint,
  show: drinkList.show,
  keepOne: drinkList.keepOne,
  save: actions.save,
  saveFailed: states.saveFailed,
  retry: actions.retry,
  discardTitle: drinkList.discardTitle,
  discardBody: drinkList.discardBody,
  discard: actions.discard,
  keepEditing: actions.keepEditing,
};
const latte = { name: drinks.latte, originalName: null, hasMilk: true, typicalMilkMl: 180, hidden: false, canHide: true };
const body = () => within(document.body);

const meta = {
  title: "Lists/Drink sheet",
  component: DrinkSheet,
  args: { open: true, labels, drink: latte, onSave: fn(), onClose: fn() },
} satisfies Meta<typeof DrinkSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Edit a milk drink: name, its milk as a plain line, the usual amount, shown (STORY-02-05-06 AC 1). */
export const EditMilkDrink: Story = {
  play: async ({ args }) => {
    await waitFor(() => expect(body().getByRole("dialog", { name: drinkList.editTitle })).toBeVisible());
    await expect(body().getByText(drinkList.hasMilkLine)).toBeVisible();
    // Nothing offers to change whether it has milk (STORY-02-05-03 AC 3).
    await expect(body().queryByRole("switch", { name: drinkList.hasMilk })).toBeNull();
    await expect(body().getByRole("slider", { name: drinkList.usualMilk })).toBeVisible();
    const name = body().getByLabelText(drinkList.name);
    await userEvent.clear(name);
    await userEvent.type(name, "Morning latte");
    await userEvent.click(body().getByRole("button", { name: actions.save }));
    await expect(args.onSave).toHaveBeenCalledWith({ name: "Morning latte", hasMilk: true, typicalMilkMl: 180, hidden: false });
  },
};

/** A drink without milk asks no amount (STORY-02-05-06 AC 2). */
export const EditNoMilk: Story = {
  args: { drink: { ...latte, name: drinks.espresso, hasMilk: false, typicalMilkMl: null } },
  play: async () => {
    await waitFor(() => expect(body().getByText(drinkList.noMilkLine)).toBeVisible());
    await expect(body().queryByRole("slider")).toBeNull();
  },
};

/** A renamed starter offers its original name back (STORY-02-05-01 AC 2). */
export const ResetName: Story = {
  args: { drink: { ...latte, name: "Morning latte", originalName: drinks.latte } },
  play: async ({ args }) => {
    await waitFor(() => expect(body().getByRole("button", { name: drinkList.resetName })).toBeVisible());
    await userEvent.click(body().getByRole("button", { name: drinkList.resetName }));
    await expect(body().getByLabelText(drinkList.name)).toHaveValue(drinks.latte);
    await userEvent.click(body().getByRole("button", { name: actions.save }));
    await expect(args.onSave).toHaveBeenCalledWith(expect.objectContaining({ name: null }));
  },
};

/** A name in use is explained in words under the field, nothing saved (STORY-02-05-01 AC 3). */
export const NameTaken: Story = {
  args: { error: "nameTaken", drink: { ...latte, name: drinks.espresso } },
  play: async () => {
    await waitFor(() => expect(body().getByText(drinkList.nameTaken)).toBeVisible());
    await expect(body().getByLabelText(drinkList.name)).toHaveAttribute("aria-invalid", "true");
  },
};

export const NameRequired: Story = { args: { error: "nameRequired", drink: { ...latte, name: "" } } };

/** A failed save keeps the typed name, with a retry (STORY-02-05-01 AC 6). */
export const SaveFailed: Story = {
  args: { error: "saveFailed", drink: { ...latte, name: "Morning latte" } },
  play: async ({ args }) => {
    await waitFor(() => expect(body().getByText(states.saveFailed)).toBeVisible());
    await expect(body().getByLabelText(drinkList.name)).toHaveValue("Morning latte");
    await userEvent.click(body().getByRole("button", { name: actions.retry }));
    await expect(args.onSave).toHaveBeenCalled();
  },
};

/** The last shown drink can't be hidden, and says why (STORY-02-05-02 AC 5). */
export const KeepOne: Story = {
  args: { drink: { ...latte, canHide: false } },
  play: async () => {
    await waitFor(() => expect(body().getByRole("switch", { name: drinkList.show })).toBeDisabled());
    await waitFor(() => expect(body().getByText(drinkList.keepOne)).toBeVisible());
  },
};

/** Hiding: switch off, save (STORY-02-05-02 AC 1). */
export const Hide: Story = {
  play: async ({ args }) => {
    await waitFor(() => expect(body().getByRole("switch", { name: drinkList.show })).toBeEnabled());
    await userEvent.click(body().getByRole("switch", { name: drinkList.show }));
    await userEvent.click(body().getByRole("button", { name: actions.save }));
    await expect(args.onSave).toHaveBeenCalledWith(expect.objectContaining({ hidden: true }));
  },
};

/** Add: milk off to start, said to be fixed; on, the usual amount starts at 120 ml (STORY-02-05-03 AC 1 to AC 3). */
export const Add: Story = {
  args: { drink: undefined },
  play: async ({ args }) => {
    await waitFor(() => expect(body().getByRole("dialog", { name: drinkList.addTitle })).toBeVisible());
    const milk = body().getByRole("switch", { name: drinkList.hasMilk });
    await expect(milk).not.toBeChecked();
    await expect(milk).toHaveAccessibleDescription(new RegExp(drinkList.hasMilkFixed.replace(/[.']/g, ".")));
    await expect(body().queryByRole("slider")).toBeNull();
    await expect(body().queryByRole("switch", { name: drinkList.show })).toBeNull();
    await userEvent.type(body().getByLabelText(drinkList.name), "Americano with froth");
    await userEvent.click(milk);
    await expect(body().getByRole("slider", { name: drinkList.usualMilk })).toHaveAttribute("aria-valuenow", "120");
    await userEvent.click(body().getByRole("button", { name: actions.save }));
    await expect(args.onSave).toHaveBeenCalledWith({ name: "Americano with froth", hasMilk: true, typicalMilkMl: 120, hidden: false });
  },
};

/** A refused add keeps everything entered (STORY-02-05-03 AC 5, AC 6). */
export const AddFailedKeepsInput: Story = {
  args: { drink: undefined, error: "saveFailed" },
  play: async () => {
    await waitFor(() => expect(body().getByLabelText(drinkList.name)).toBeVisible());
    await userEvent.type(body().getByLabelText(drinkList.name), "Cold brew");
    await expect(body().getByLabelText(drinkList.name)).toHaveValue("Cold brew");
    await expect(body().getByText(states.saveFailed)).toBeVisible();
  },
};

/** Closing with changes asks once; keeping editing keeps them. */
export const CloseWithChanges: Story = {
  play: async ({ args }) => {
    await waitFor(() => expect(body().getByLabelText(drinkList.name)).toBeVisible());
    await userEvent.type(body().getByLabelText(drinkList.name), "!");
    await userEvent.click(body().getByRole("button", { name: actions.close }));
    await waitFor(() => expect(body().getByRole("dialog", { name: drinkList.discardTitle })).toBeVisible());
    await userEvent.click(body().getByRole("button", { name: actions.keepEditing }));
    await waitFor(() => expect(body().getByLabelText(drinkList.name)).toHaveValue(`${drinks.latte}!`));
    await expect(args.onClose).not.toHaveBeenCalled();
  },
};

export const RightToLeft: Story = { args: { drink: { ...latte, canHide: false } }, globals: { direction: "rtl" } };
