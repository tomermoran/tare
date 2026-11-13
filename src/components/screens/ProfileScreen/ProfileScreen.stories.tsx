import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
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
  deviceTitle: profile.deviceTitle,
  device: profile.device,
  about: profile.about,
  appName: app.name,
  version: t("profile.version", { version: "0.1.0" }),
};

function Controlled(props: { initial: string; status?: "idle" | "saved" | "failed"; pending?: boolean; onSave: (name: string) => void }) {
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

/** The device sentence is calm: ink body text, never the signal colour (AC 5). */
export const DeviceNotice: Story = {
  play: async ({ canvasElement }) => {
    const sentence = within(canvasElement).getByText(profile.device);
    await expect(sentence.className).toContain("text-ink");
    await expect(sentence.className).not.toContain("signal");
    await expect(within(canvasElement).getByText(labels.version)).toBeVisible();
  },
};

export const Saving: Story = {
  args: { initial: "Sam", pending: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: profile.save })).toBeDisabled();
  },
};

export const RightToLeft: Story = { args: { initial: "Sam" }, globals: { direction: "rtl" } };
