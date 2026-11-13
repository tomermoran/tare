import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "@/components/ui/Button/Button";
import messages from "@/i18n/messages/en.json";
import { exampleNow, exampleShots } from "../fixtures";
import type { RecentItem } from "./RecentShotsScreen";
import { createTranslator } from "next-intl";

const t = createTranslator({ locale: "en", messages });
const milk = t("shot.milkLine", { milk: messages.milks.oat, amount: new Intl.NumberFormat("en", { style: "unit", unit: "milliliter" }).format(180) });
import { PhoneFrame } from "../PhoneFrame";
import { RecentShotsScreen } from "./RecentShotsScreen";

const meta = {
  title: "Screens/Recent shots",
  component: RecentShotsScreen,
  parameters: { layout: "centered" },
  args: { items: exampleShots, now: exampleNow, onOpen: () => {} },
  decorators: [
    (Story) => (
      <PhoneFrame>
        <Story />
      </PhoneFrame>
    ),
  ],
} satisfies Meta<typeof RecentShotsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: messages.journal.today })).toBeInTheDocument();
    await expect(canvas.getAllByText(messages.journal.oneTap)).toHaveLength(2);
    await expect(canvas.getByText(messages.shot.warnings.channelling)).toBeInTheDocument();
  },
};

/** No shots yet: says so and offers to dial in (AC 4). */
export const Empty: Story = {
  args: { items: [], emptyAction: { label: messages.home.dialIn, href: "/log" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: messages.journal.emptyTitle })).toBeVisible();
    await expect(canvas.getByRole("link", { name: messages.home.dialIn })).toHaveAttribute("href", "/log");
  },
};

/** Day keys from the server, milk on milk drinks, the frozen marker in words (AC 1, AC 2). */
export const ServerDaysAndMarkers: Story = {
  args: {
    items: [
      { ...(exampleShots[0] as Extract<RecentItem, { kind: "shot" }>), day: "2026-10-18", reaction: undefined, milk, fromFrozen: true },
      { ...(exampleShots[1] as Extract<RecentItem, { kind: "shot" }>), day: "2026-10-12", channelling: false },
    ],
    dayLabel: (day: string) => (day === "2026-10-18" ? messages.journal.today : "12 October"),
    onOpen: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: messages.journal.today })).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "12 October" })).toBeVisible();
    await expect(canvas.getByText(new RegExp(milk))).toBeVisible();
    await expect(canvas.getByText(messages.bag.fromFrozen)).toBeVisible();
    await expect(canvas.getByText(messages.journal.oneTap)).toBeVisible();
    await userEvent.click(canvas.getAllByRole("button")[0]);
    await expect(args.onOpen).toHaveBeenCalledWith(exampleShots[0].id);
  },
};

/** Older shots exist past the 30 days: the list ends with "show older" (AC 3). */
export const ShowOlder: Story = {
  args: { footer: <Button variant="ghost" fullWidth>{messages.journal.showOlder}</Button> },
};

export const Loading: Story = { args: { state: "loading", items: [] } };
export const RightToLeft: Story = { globals: { direction: "rtl" } };
