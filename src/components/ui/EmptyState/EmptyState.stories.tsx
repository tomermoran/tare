import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { EmptyState } from "./EmptyState";

const { journal, beans, home } = messages;

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  excludeStories: /^_/,
  decorators: [(Story) => <div className="w-[358px]"><Story /></div>],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interim tab state: no action until its target exists (DES-01-01-06). */
export const WithoutAction: Story = {
  args: { title: journal.emptyTitle, children: journal.empty },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: journal.emptyTitle })).toBeVisible();
    await expect(canvas.queryByRole("button")).toBeNull();
    await expect(canvas.queryByRole("link")).toBeNull();
  },
};

export const WithLink: Story = {
  args: {
    title: beans.emptyTitle,
    children: beans.empty,
    action: { label: home.firstRun.bag, href: "/beans/new" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: home.firstRun.bag })).toHaveAttribute(
      "href",
      "/beans/new",
    );
  },
};

export const WithButton: Story = {
  args: {
    title: home.interimTitle,
    children: home.interim,
    action: { label: home.firstRun.addMachine, onClick: fn() },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: home.firstRun.addMachine }));
    await expect(args.action?.onClick).toHaveBeenCalled();
    // At most one action.
    await expect(canvas.getAllByRole("button")).toHaveLength(1);
  },
};

export const RightToLeft: Story = {
  ...WithLink,
  globals: { direction: "rtl" },
};

/** Compile-time check: an action is a link or a button, never both. */
export function _oneActionKind() {
  return (
    // @ts-expect-error href and onClick together
    <EmptyState title="" action={{ label: "", href: "/", onClick: () => {} }}>
      {""}
    </EmptyState>
  );
}
