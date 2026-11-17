import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Suspense } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { HomeScreen } from "@/components/screens/HomeScreen/HomeScreen";
import { exampleCoffee, exampleRecipe, exampleSetup } from "@/components/screens/fixtures";
import { PhoneFrame } from "@/components/screens/PhoneFrame";
import { Button } from "@/components/ui/Button/Button";
import messages from "@/i18n/messages/en.json";
import { dismissForGood, isDismissedForGood } from "@/lib/dismissals";
import { LINK_PROMPT, LinkPrompt } from "./LinkPrompt";
import { LinkPromptCard } from "./LinkPromptCard";

const { home } = messages;
const labels = { title: home.linkPrompt.title, body: home.linkPrompt.body, action: home.linkPrompt.action, dismiss: home.linkPrompt.dismiss };

const meta = {
  title: "Home/Link prompt",
  component: LinkPromptCard,
  args: { labels, onLink: fn(), onDismiss: fn() },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LinkPromptCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One sentence, a secondary action and a ghost "not now" (DES-05-03-01). */
export const Shown: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: home.linkPrompt.title })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: home.linkPrompt.action }));
    await expect(args.onLink).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: home.linkPrompt.dismiss }));
    await expect(args.onDismiss).toHaveBeenCalled();
  },
};

export const Linking: Story = {
  args: { busy: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: home.linkPrompt.action })).toBeDisabled();
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };

/** On a 375 x 667 phone with the card shown, Pull is still in view without scrolling (STORY-05-03-03 AC 4). */
export const OnBrewSmallPhone: Story = {
  render: (args) => (
    <PhoneFrame small>
      <HomeScreen
        drink={messages.drinks.latte}
        coffee={home.coffeeLine.replace("{bean}", exampleCoffee.bean).replace("{roaster}", exampleCoffee.roaster)}
        values={exampleRecipe}
        lines={[home.prep.replace("{tools}", messages.log.prepWdt), messages.recipe.sweetenedLine]}
        setup={exampleSetup}
        actions={
          <>
            <Button variant="primary" fullWidth>
              {home.pull}
            </Button>
            <Button variant="ghost" fullWidth>
              {home.dialIn}
            </Button>
          </>
        }
        labels={{ changeDrink: home.changeDrink, changeCoffee: home.changeCoffee }}
        onChangeDrink={fn()}
      />
      <div className="mt-8">
        <LinkPromptCard {...args} />
      </div>
    </PhoneFrame>
  ),
  decorators: [(Story) => <Story />],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId("phone-frame").getBoundingClientRect();
    const pull = canvas.getByRole("button", { name: home.pull }).getBoundingClientRect();
    await expect(pull.bottom).toBeLessThanOrEqual(frame.bottom);
    await expect(canvas.getByRole("heading", { name: home.linkPrompt.title })).toBeInTheDocument();
  },
};

// Made once: use() needs the same promise across renders, under Suspense.
const never = new Promise<never>(() => {});
const due = Promise.resolve(true);
const notDue = Promise.resolve(false);
const fakeDeps = (linked = fn()) => ({
  link: async () => {
    linked();
    return { kind: "linked" as const };
  },
  completeRedirect: async () => null,
  canSwitch: async () => true,
  switchTo: async () => {},
});

/** Due and not dismissed: shown; "not now" hides it for good on this device (AC 1, AC 2). */
export const DismissedForGood: Story = {
  render: () => (
    <Suspense>
      <LinkPrompt due={due} deps={fakeDeps()} />
    </Suspense>
  ),
  play: async ({ canvasElement }) => {
    localStorage.removeItem("tare:dismissedForGood");
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("heading", { name: home.linkPrompt.title })).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: home.linkPrompt.dismiss }));
    await expect(canvas.queryByRole("heading", { name: home.linkPrompt.title })).toBeNull();
    await expect(isDismissedForGood(LINK_PROMPT)).toBe(true);
    localStorage.removeItem("tare:dismissedForGood");
  },
};

/** Once dismissed on this device, it never comes back. */
export const StaysDismissed: Story = {
  render: () => (
    <Suspense>
      <LinkPrompt due={due} deps={fakeDeps()} />
    </Suspense>
  ),
  beforeEach: () => {
    dismissForGood(LINK_PROMPT);
    return () => localStorage.removeItem("tare:dismissedForGood");
  },
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    await expect(within(canvasElement).queryByRole("heading", { name: home.linkPrompt.title })).toBeNull();
  },
};

/** Not due (no recipe, under ten shots, or linked): nothing, and Brew isn't held up while it's worked out. */
export const NotDue: Story = {
  render: () => (
    <>
      <Suspense>
        <LinkPrompt due={notDue} deps={fakeDeps()} />
      </Suspense>
      <Suspense>
        <LinkPrompt due={never} deps={fakeDeps()} />
      </Suspense>
    </>
  ),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    await expect(within(canvasElement).queryByRole("heading", { name: home.linkPrompt.title })).toBeNull();
  },
};

/** Accepting runs the same link as Profile, then the card goes (AC 5). */
export const Accepted: Story = {
  args: { onLink: fn() },
  render: (args) => (
    <Suspense>
      <LinkPrompt due={due} deps={fakeDeps(args.onLink as ReturnType<typeof fn>)} />
    </Suspense>
  ),
  play: async ({ canvasElement, args }) => {
    localStorage.removeItem("tare:dismissedForGood");
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("heading", { name: home.linkPrompt.title })).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: home.linkPrompt.action }));
    await expect(args.onLink).toHaveBeenCalled();
    await waitFor(() => expect(canvas.queryByRole("heading", { name: home.linkPrompt.title })).toBeNull());
  },
};
