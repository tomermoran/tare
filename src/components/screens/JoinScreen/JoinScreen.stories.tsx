import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { JoinScreen, type JoinView } from "./JoinScreen";

/* SCR-JOIN with a placeholder profile; the app holds no personal data. */

const t = createTranslator({ locale: "en", messages });
const { app, join, claim, actions } = messages;

const labels = {
  wordmark: app.wordmark,
  title: join.title,
  sharesIntro: join.sharesIntro,
  shares: Object.values(join.shares),
  signIn: join.signIn,
  notNow: join.notNow,
  loading: join.loading,
  invalidTitle: join.invalidTitle,
  invalid: join.invalid,
  openTare: join.openTare,
  retry: actions.retry,
};

const summary = {
  title: t("join.summaryTitle", { name: "Guest" }),
  lines: [t("join.shots", { count: 24 }), t("join.drinks", { drinks: "Latte and Cortado" }), t("join.lastBrewed", { when: "yesterday" })],
};

const claimLabels = {
  title: t("claim.title", { name: "Guest" }),
  lines: [claim.becomesYours, claim.othersBrew],
  consent: claim.consent,
  confirm: claim.confirm,
  cancel: claim.cancel,
  final: claim.final,
};

const landing: JoinView = { kind: "landing", summary };

const meta = {
  title: "Screens/Join",
  component: JoinScreen,
  parameters: { layout: "centered" },
  decorators: [(Story) => <PhoneFrame><Story /></PhoneFrame>],
  args: { view: landing, labels, homeHref: "/", onSignIn: fn(), onNotNow: fn(), onConfirm: fn(), onCancel: fn() },
} satisfies Meta<typeof JoinScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The invited profile's history and what joining shares, before any account (STORY-05-02-05 AC 1). */
export const Landing: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: join.title })).toBeVisible();
    await expect(canvas.getByText("24 shots")).toBeVisible();
    await expect(canvas.getByText(join.shares.household)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: join.notNow }));
    await expect(args.onNotNow).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: join.signIn }));
    await expect(args.onSignIn).toHaveBeenCalled();
  },
};

/** A profile never brewed for yet. */
export const NoShotsYet: Story = {
  args: { view: { kind: "landing", summary: { title: summary.title, lines: [t("join.shots", { count: 0 })] } } },
};

/** A placeholder of the page's shape while it loads (AC 5). */
export const Loading: Story = {
  args: { view: { kind: "loading" } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status", { name: join.loading })).toHaveAttribute("aria-busy", "true");
  },
};

/** Used, withdrawn, expired or claimed: one plain line and no reason (AC 4). */
export const Invalid: Story = {
  args: { view: { kind: "invalid" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: join.invalidTitle })).toBeVisible();
    await expect(canvas.getByRole("link", { name: join.openTare })).toHaveAttribute("href", "/");
    await expect(canvas.queryByRole("button", { name: join.signIn })).toBeNull();
  },
};

/** The signed-in account already has history: nothing is merged or lost (STORY-05-02-02 AC 5). */
export const HasHistory: Story = {
  args: { view: { ...landing, blocked: join.hasHistory } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(join.hasHistory);
  },
};

/** Sign-in or joining failed: said, with a retry, and nothing joined (STORY-05-02-02 AC 3). */
export const SignInFailed: Story = {
  args: { view: { ...landing, failure: join.failed } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("alert")).toHaveTextContent(join.failed);
  },
};

/** After sign-in: what taking over means, private shots, and that it is final (STORY-05-02-03 AC 1, AC 5; 05-02-04 AC 3). */
export const Confirm: Story = {
  args: { view: { kind: "confirm", claim: claimLabels } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Take over Guest's profile?" })).toBeVisible();
    await expect(canvas.getByText(claim.consent)).toBeVisible();
    await expect(canvas.getByText(claim.final)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: claim.cancel }));
    await expect(args.onCancel).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: claim.confirm }));
    await expect(args.onConfirm).toHaveBeenCalled();
  },
};

/** The claim failed: the confirmation stays, with a retry (STORY-05-02-03). */
export const ClaimFailed: Story = { args: { view: { kind: "confirm", claim: claimLabels, failure: join.failed } } };

export const LandingRightToLeft: Story = { globals: { direction: "rtl" } };
export const ConfirmRightToLeft: Story = { args: { view: { kind: "confirm", claim: claimLabels } }, globals: { direction: "rtl" } };
export const InvalidRightToLeft: Story = { args: { view: { kind: "invalid" } }, globals: { direction: "rtl" } };
