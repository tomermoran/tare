import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { exampleRecipe } from "../fixtures";
import { PhoneFrame } from "../PhoneFrame";
import { TasteScreen } from "./TasteScreen";

const { actions, taste } = messages;

const labels = {
  title: taste.title,
  close: actions.close,
  rating: taste.rating,
  saveFailed: taste.saveFailed,
  retry: actions.retry,
  leaveWithout: taste.leaveWithout,
};

function Rated(props: Partial<ComponentProps<typeof TasteScreen>>) {
  const [rating, setRating] = useState<number | null>(null);
  return (
    <TasteScreen
      labels={labels}
      values={exampleRecipe}
      rating={rating}
      onRatingChange={setRating}
      primary={{ label: taste.done, onClick: fn() }}
      onClose={fn()}
      onRetry={fn()}
      onLeaveWithout={fn()}
      {...props}
    />
  );
}

const meta = {
  title: "Screens/Taste",
  component: TasteScreen,
  parameters: { layout: "centered" },
  args: {
    labels,
    values: exampleRecipe,
    rating: null,
    onRatingChange: fn(),
    primary: { label: taste.done, onClick: fn() },
    onClose: fn(),
    onRetry: fn(),
    onLeaveWithout: fn(),
  },
  decorators: [
    (Story, { parameters }) => (
      <PhoneFrame small={parameters.smallPhone === true}>
        <Story />
      </PhoneFrame>
    ),
  ],
} satisfies Meta<typeof TasteScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The saved values stay in view while rating; tapping the rating again unrates (AC 1, AC 2). */
export const Normal: Story = {
  render: () => <Rated />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: taste.title })).toBeVisible();
    await expect(canvas.getByText(/27\.6/)).toBeVisible();
    const four = canvas.getByRole("radio", { name: "4" });
    await userEvent.click(four);
    await expect(four).toHaveAttribute("aria-checked", "true");
    await userEvent.click(four);
    await expect(four).toHaveAttribute("aria-checked", "false");
    await expect(canvas.getByRole("button", { name: taste.done })).toBeEnabled();
  },
};

/** Keyboard: arrows move without answering; space chooses and chooses again to clear. */
export const Keyboard: Story = {
  render: () => <Rated />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole("radio", { name: "1" }).focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    const three = canvas.getByRole("radio", { name: "3" });
    await expect(three).toHaveFocus();
    await expect(three).toHaveAttribute("aria-checked", "false");
    await userEvent.keyboard(" ");
    await expect(three).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard(" ");
    await expect(three).toHaveAttribute("aria-checked", "false");
  },
};

/** Saving failed on the way out: choices kept, retry or leave without saving (AC 4). */
export const SaveFailed: Story = {
  args: { rating: 4, state: "failed" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent(taste.saveFailed);
    await expect(canvas.getByRole("radio", { name: "4" })).toHaveAttribute("aria-checked", "true");
    await userEvent.click(canvas.getByRole("button", { name: actions.retry }));
    await expect(args.onRetry).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: taste.leaveWithout }));
    await expect(args.onLeaveWithout).toHaveBeenCalled();
  },
};

/** On a 375 x 667 phone the primary stays in view. */
export const SmallPhone: Story = {
  parameters: { smallPhone: true },
  render: () => <Rated />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId("phone-frame").getBoundingClientRect();
    const done = canvas.getByRole("button", { name: taste.done }).getBoundingClientRect();
    await expect(done.bottom).toBeLessThanOrEqual(frame.bottom);
  },
};

export const RightToLeft: Story = { render: () => <Rated />, globals: { direction: "rtl" } };
