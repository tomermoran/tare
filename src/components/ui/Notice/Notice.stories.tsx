import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { Notice } from "./Notice";

const { states, shot, actions } = messages;
const retry = fn();

// Stories render JSX: the tone props are a union that story args can't type.
const meta = {
  title: "Components/Notice",
  excludeStories: /^_/,
  decorators: [(Story) => <div className="w-[358px]"><Story /></div>],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  render: () => <Notice title={states.loadFailedTitle}>{states.loadFailed}</Notice>,
};

export const NeutralWithRetry: Story = {
  render: () => (
    <Notice title={states.loadFailedTitle} urgent action={{ label: actions.retry, onClick: retry }}>
      {states.loadFailed}
    </Notice>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: actions.retry }));
    await expect(retry).toHaveBeenCalled();
  },
};

/** Signal on signal-subtle: the only place the signal colour is used. */
export const ShotWarning: Story = {
  render: () => (
    <Notice tone="warning" warning="channelling">
      {shot.warnings.channelling}
    </Notice>
  ),
};

export const ShotWarningInline: Story = {
  render: () => (
    <Notice tone="warning" warning="channelling" size="inline">
      {shot.warnings.channelling}
    </Notice>
  ),
};

export const NeutralInline: Story = {
  render: () => <Notice size="inline">{states.saveFailed}</Notice>,
};

export const RightToLeft: Story = {
  render: () => (
    <Notice title={states.loadFailedTitle} action={{ label: actions.retry, onClick: retry }}>
      {states.loadFailed}
    </Notice>
  ),
  globals: { direction: "rtl" },
};

// Compile-time rule: the warning tone needs a shot-warning kind. tsc fails
// if this ever type-checks.
export function _warningNeedsAKind() {
  // @ts-expect-error a warning without a shot-warning kind
  return <Notice tone="warning">{states.saveFailed}</Notice>;
}
