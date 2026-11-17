import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Checklist } from "@/components/ui/Checklist/Checklist";
import messages from "@/i18n/messages/en.json";
import { FirstRunSignIn } from "./FirstRunSignIn";

const { home } = messages;
const sw = messages.switch;

const meta = {
  title: "Home/First-run sign-in",
  component: FirstRunSignIn,
  args: {
    label: home.firstRun.haveAccount,
    deps: { link: fn(async () => ({ kind: "cancelled" as const })), completeRedirect: async () => null, canSwitch: async () => true, switchTo: async () => {} },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Checklist
          doneLabel={home.firstRun.done}
          steps={[
            { id: "parts", title: home.firstRun.parts, hint: home.firstRun.partsHint, state: "next", action: { label: home.firstRun.addParts, href: "#" } },
            { id: "bag", title: home.firstRun.bag, state: "later" },
            { id: "shot", title: home.firstRun.shot, state: "later" },
          ]}
        />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FirstRunSignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A quiet link under the steps; the first step is still the way in (STORY-05-03-02 AC 3). */
export const UnderTheChecklist: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("button", { name: home.firstRun.haveAccount });
    await expect(canvas.getByRole("link", { name: home.firstRun.addParts })).toBeVisible();
    await userEvent.click(link);
    await expect(args.deps.link).toHaveBeenCalled();
  },
};

/** An account with a history on an empty device: the switch is offered (STORY-05-03-02 AC 7). */
export const FindsAHistory: Story = {
  args: {
    deps: {
      link: async () => ({ kind: "accountTaken" as const, credential: { providerId: "google.com" } as never }),
      completeRedirect: async () => null,
      canSwitch: async () => true,
      switchTo: async () => {},
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: home.firstRun.haveAccount }));
    await waitFor(() => expect(within(document.body).getByRole("dialog", { name: sw.title })).toBeVisible());
    await userEvent.click(within(document.body).getByRole("button", { name: messages.actions.cancel }));
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };
