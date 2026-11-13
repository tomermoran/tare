import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { createTranslator } from "next-intl";
import { ConfirmSheet } from "@/components/ui/Sheet/ConfirmSheet";
import messages from "@/i18n/messages/en.json";
import { SetupRenameSheet } from "./SetupRenameSheet";

const { actions, setup, states } = messages;
const t = createTranslator({ locale: "en", messages });

// A fictional setup shown by its parts.
const partsName = new Intl.ListFormat("en").format(["Model One", "Grinder Zero"]);

const labels = {
  title: setup.renameTitle,
  name: setup.name,
  nameHint: setup.nameHint,
  save: actions.save,
  close: actions.close,
  saveFailed: states.saveFailed,
};

function Controlled(props: { initial?: string; state?: "idle" | "saving" | "failed"; onSave: (name: string) => void }) {
  const [value, setValue] = useState(props.initial ?? "");
  return (
    <SetupRenameSheet
      open
      labels={labels}
      value={value}
      placeholder={partsName}
      state={props.state}
      onChange={setValue}
      onSave={() => props.onSave(value)}
      onClose={fn()}
    />
  );
}

const meta = {
  title: "Setup/Rename sheet",
  component: Controlled,
  args: { onSave: fn() },
} satisfies Meta<typeof Controlled>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Naming a setup shown by its parts: the parts name is the placeholder (AC 5). */
export const Rename: Story = {
  play: async ({ args }) => {
    const body = within(document.body);
    const field = await body.findByLabelText(setup.name);
    await expect(field).toHaveAttribute("placeholder", partsName);
    await userEvent.type(field, "Weekday");
    await userEvent.click(body.getByRole("button", { name: actions.save }));
    await expect(args.onSave).toHaveBeenCalledWith("Weekday");
  },
};

/** Enter saves too. */
export const SaveWithEnter: Story = {
  args: { initial: "Weekday" },
  play: async ({ args }) => {
    const body = within(document.body);
    const field = await body.findByLabelText(setup.name);
    await userEvent.clear(field);
    await userEvent.type(field, "Weekend{Enter}");
    await expect(args.onSave).toHaveBeenCalledWith("Weekend");
  },
};

export const Saving: Story = {
  args: { initial: "Weekday", state: "saving" },
  play: async () => {
    await expect(await within(document.body).findByRole("button", { name: actions.save })).toBeDisabled();
  },
};

export const Failed: Story = {
  args: { initial: "Weekday", state: "failed" },
  play: async () => {
    const notice = await within(document.body).findByText(states.saveFailed);
    await waitFor(() => expect(notice).toBeVisible());
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };

/** After adding a part while a setup exists (STORY-01-02-08 AC 5): yes or not now. */
export const UseNewPart: Story = {
  render: function Render(args) {
    return (
      <ConfirmSheet
        open
        title={setup.useNewPartTitle}
        confirmLabel={setup.useNewPartAction}
        cancelLabel={setup.notNow}
        closeLabel={actions.close}
        onConfirm={() => args.onSave("yes")}
        onCancel={() => args.onSave("no")}
      >
        {t("setup.useNewPart", { kind: setup.kindLower.basket })}
      </ConfirmSheet>
    );
  },
  play: async ({ args }) => {
    const body = within(document.body);
    const text = await body.findByText(/basket swapped/);
    await waitFor(() => expect(text).toBeVisible());
    await userEvent.click(body.getByRole("button", { name: setup.notNow }));
    await expect(args.onSave).toHaveBeenCalledWith("no");
    await userEvent.click(body.getByRole("button", { name: setup.useNewPartAction }));
    await expect(args.onSave).toHaveBeenCalledWith("yes");
  },
};
