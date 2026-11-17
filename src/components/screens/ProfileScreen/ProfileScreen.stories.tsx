import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { Button } from "@/components/ui/Button/Button";
import { PhoneFrame } from "../PhoneFrame";
import { ProfileScreen } from "./ProfileScreen";

const t = createTranslator({ locale: "en", messages });
const { app, profile } = messages;

const labels = {
  back: messages.nav.brew,
  title: profile.title,
  name: profile.name,
  nameHint: t("profile.nameHint", { role: profile.defaultName }),
  save: profile.save,
  saved: profile.saved,
  saveFailed: profile.saveFailed,
  accountTitle: profile.accountTitle,
  account: profile.account,
  linked: profile.linked,
  linkedBody: profile.linkedBody,
  about: profile.about,
  appName: app.name,
  version: t("profile.version", { version: "0.1.0" }),
};

function Controlled(props: {
  initial: string;
  status?: "idle" | "saved" | "failed";
  pending?: boolean;
  linked?: boolean;
  onSave: (name: string) => void;
  onLink?: () => void;
}) {
  const [name, setName] = useState(props.initial);
  return (
    <ProfileScreen
      labels={labels}
      backHref="/"
      name={name}
      onNameChange={setName}
      action={(form) => props.onSave(String(form.get("name")))}
      status={props.status}
      pending={props.pending}
      linked={props.linked}
      linkAction={<Button onClick={props.onLink}>{profile.linkGoogle}</Button>}
    />
  );
}

const meta = {
  title: "Screens/Profile",
  component: Controlled,
  parameters: { layout: "centered" },
  args: { initial: "", onSave: fn() },
  decorators: [
    (Story) => (
      <PhoneFrame>
        <Story />
      </PhoneFrame>
    ),
  ],
} satisfies Meta<typeof Controlled>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Unnamed: the field is empty and its hint names the role label (AC 1). */
export const Unnamed: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByLabelText(profile.name);
    await expect(field).toHaveValue("");
    await expect(field).not.toHaveAttribute("placeholder");
    await expect(canvas.getByText(labels.nameHint)).toBeVisible();
    await userEvent.type(field, "Sam");
    await userEvent.click(canvas.getByRole("button", { name: profile.save }));
    await expect(args.onSave).toHaveBeenCalledWith("Sam");
  },
};

/** Renamed and just saved. */
export const Renamed: Story = {
  args: { initial: "Sam", status: "saved" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(profile.saved);
  },
};

/** A failed save keeps the typed name and says so, without warning colour (AC 6). */
export const Failed: Story = {
  args: { initial: "Sam", status: "failed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(profile.name)).toHaveValue("Sam");
    await expect(canvas.getByText(profile.saveFailed)).toBeVisible();
  },
};

/**
 * Not linked: the Account section says where the history lives, calmly, and
 * offers a plain text button with no logo (STORY-05-03-01 AC 1).
 */
export const AccountNotLinked: Story = {
  args: { onLink: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: profile.accountTitle })).toBeVisible();
    const sentence = canvas.getByText(profile.account);
    await expect(sentence.className).toContain("text-ink");
    await expect(sentence.className).not.toContain("signal");
    const button = canvas.getByRole("button", { name: profile.linkGoogle });
    await expect(button.querySelector("img, svg")).toBeNull();
    await userEvent.click(button);
    await expect(args.onLink).toHaveBeenCalled();
    await expect(canvas.getByText(labels.version)).toBeVisible();
  },
};

/** Linked: a statement, the label unchanged, and no way to unlink or sign out (AC 2, AC 5). */
export const AccountLinked: Story = {
  args: { initial: "Sam", linked: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(profile.linked)).toBeVisible();
    await expect(canvas.getByText(profile.linkedBody)).toBeVisible();
    await expect(canvas.getByLabelText(profile.name)).toHaveValue("Sam");
    await expect(canvas.queryByRole("button", { name: profile.linkGoogle })).toBeNull();
    // Only the name's own save button: nothing to unlink or sign out.
    await expect(canvas.getAllByRole("button").map((b) => b.textContent)).toEqual([profile.save]);
  },
};

export const Saving: Story = {
  args: { initial: "Sam", pending: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: profile.save })).toBeDisabled();
  },
};

export const RightToLeft: Story = { args: { initial: "Sam" }, globals: { direction: "rtl" } };

export const LinkedRightToLeft: Story = { args: { initial: "Sam", linked: true }, globals: { direction: "rtl" } };
