import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { AuthCredential } from "firebase/auth";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@/components/ui/Button/Button";
import messages from "@/i18n/messages/en.json";
import type { LinkResult } from "@/lib/firebase/google";
import { GoogleLink } from "./GoogleLink";

/*
 * The link-or-switch flow (EPIC-05-03) with Firebase and the server stood
 * in for: link, cancel, fail, offline, an account that already has a history
 * on an empty device and on one with history, decline, and a failed switch.
 */

const { profile, actions } = messages;
const sw = messages.switch;
const credential = { providerId: "google.com" } as AuthCredential;
const taken: LinkResult = { kind: "accountTaken", credential };

type Args = {
  result: LinkResult;
  /** This device has nothing entered; null when the check fails. */
  empty?: boolean | null;
  switchFails?: boolean;
  onLinked: () => void;
  onSwitched: () => void;
  switchTo: (c: AuthCredential) => void;
};

function Harness({ result, empty = true, switchFails = false, onLinked, onSwitched, switchTo }: Args) {
  const [linked, setLinked] = useState(false);
  return (
    <div className="flex w-80 flex-col items-start gap-4">
      <p>{linked ? profile.linked : profile.account}</p>
      <GoogleLink
        deps={{
          link: async () => result,
          completeRedirect: async () => null,
          canSwitch: async () => empty,
          switchTo: async (c) => {
            switchTo(c);
            if (switchFails) throw new Error("offline");
          },
        }}
        onLinked={() => {
          setLinked(true);
          onLinked();
        }}
        onSwitched={onSwitched}
      >
        {({ start, status }) => (
          <Button onClick={start} disabled={status === "linking"}>
            {profile.linkGoogle}
          </Button>
        )}
      </GoogleLink>
    </div>
  );
}

const meta = {
  title: "Account/Link Google",
  component: Harness,
  args: { result: { kind: "linked" }, onLinked: fn(), onSwitched: fn(), switchTo: fn() },
} satisfies Meta<typeof Harness>;

export default meta;
type Story = StoryObj<typeof meta>;

const link = (el: HTMLElement) => userEvent.click(within(el).getByRole("button", { name: profile.linkGoogle }));
const body = () => within(document.body);

/** Linked: the account is kept and the section says so (STORY-05-03-01 AC 2). */
export const Links: Story = {
  play: async ({ canvasElement, args }) => {
    await link(canvasElement);
    await waitFor(() => expect(args.onLinked).toHaveBeenCalled());
    await expect(within(canvasElement).getByText(profile.linked)).toBeVisible();
  },
};

/** Cancelled: back where it was, with no message (AC 3). */
export const Cancelled: Story = {
  args: { result: { kind: "cancelled" } },
  play: async ({ canvasElement, args }) => {
    await link(canvasElement);
    await expect(within(canvasElement).getByRole("button", { name: profile.linkGoogle })).toBeEnabled();
    await expect(within(canvasElement).queryByRole("alert")).toBeNull();
    await expect(args.onLinked).not.toHaveBeenCalled();
  },
};

/** Failed or offline: nothing has changed, and it can be tried again (AC 4). */
export const Failed: Story = {
  args: { result: { kind: "failed" } },
  play: async ({ canvasElement }) => {
    await link(canvasElement);
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(profile.linkFailed)).toBeVisible());
    await expect(canvas.getByRole("button", { name: actions.retry })).toBeVisible();
  },
};

/** This device has history: told it can't be linked, nothing merged (STORY-05-03-04 AC 3). */
export const AccountTakenHere: Story = {
  args: { result: taken, empty: false },
  play: async ({ canvasElement, args }) => {
    await link(canvasElement);
    await waitFor(() => expect(within(canvasElement).getByText(profile.linkTaken)).toBeVisible());
    await expect(body().queryByRole("dialog")).toBeNull();
    await expect(args.switchTo).not.toHaveBeenCalled();
  },
};

/** An empty device is asked once, and switching shows that history (AC 1). */
export const SwitchFromEmptyDevice: Story = {
  args: { result: taken, empty: true },
  play: async ({ canvasElement, args }) => {
    await link(canvasElement);
    await waitFor(() => expect(body().getByRole("dialog", { name: sw.title })).toBeVisible());
    await expect(body().getByText(sw.body)).toBeVisible();
    await userEvent.click(body().getByRole("button", { name: sw.confirm }));
    await waitFor(() => expect(args.onSwitched).toHaveBeenCalled());
    await expect(args.switchTo).toHaveBeenCalledWith(credential);
  },
};

/** Declining changes nothing (AC 2). */
export const DeclineSwitch: Story = {
  args: { result: taken, empty: true },
  play: async ({ canvasElement, args }) => {
    await link(canvasElement);
    await waitFor(() => expect(body().getByRole("dialog", { name: sw.title })).toBeVisible());
    await userEvent.click(body().getByRole("button", { name: actions.cancel }));
    await waitFor(() => expect(body().queryByRole("dialog")).toBeNull());
    await expect(args.switchTo).not.toHaveBeenCalled();
    await expect(args.onSwitched).not.toHaveBeenCalled();
  },
};

/** A failed or offline switch keeps the sheet, says nothing changed, and retries (AC 4, AC 5). */
export const SwitchFails: Story = {
  args: { result: taken, empty: true, switchFails: true },
  play: async ({ canvasElement, args }) => {
    await link(canvasElement);
    await waitFor(() => expect(body().getByRole("dialog", { name: sw.title })).toBeVisible());
    await userEvent.click(body().getByRole("button", { name: sw.confirm }));
    await waitFor(() => expect(body().getByText(sw.failed)).toBeVisible());
    await expect(args.onSwitched).not.toHaveBeenCalled();
    await userEvent.click(body().getByRole("button", { name: actions.retry }));
    await waitFor(() => expect(args.switchTo).toHaveBeenCalledTimes(2));
  },
};

/** When the empty check itself fails, nothing is offered and nothing changes. */
export const CheckFails: Story = {
  args: { result: taken, empty: null },
  play: async ({ canvasElement }) => {
    await link(canvasElement);
    await waitFor(() => expect(within(canvasElement).getByText(profile.linkFailed)).toBeVisible());
    await expect(body().queryByRole("dialog")).toBeNull();
  },
};

export const SwitchSheetRightToLeft: Story = {
  args: { result: taken, empty: true },
  globals: { direction: "rtl" },
  play: async ({ canvasElement }) => {
    await link(canvasElement);
    await waitFor(() => expect(body().getByRole("dialog", { name: sw.title })).toBeVisible());
  },
};
