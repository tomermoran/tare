import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { Skeleton, SkeletonBlock } from "./Skeleton";

const { states } = messages;

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  args: { label: states.loading, children: null },
  decorators: [(Story) => <div className="w-[358px]"><Story /></div>],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Brew card while it loads (design 2.3): title, coffee line, values, button. */
export const BrewCard: Story = {
  args: {
    children: (
      <>
        <SkeletonBlock shape="title" />
        <SkeletonBlock shape="line" className="w-1/2" />
        <div className="grid grid-cols-4 gap-3">
          <SkeletonBlock shape="value" />
          <SkeletonBlock shape="value" />
          <SkeletonBlock shape="value" />
          <SkeletonBlock shape="value" />
        </div>
        <SkeletonBlock shape="button" />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole("status", { name: states.loading });
    await expect(region).toHaveAttribute("aria-busy", "true");
    // No spinner: nothing in the region is a progress indicator.
    await expect(canvas.queryByRole("progressbar")).toBeNull();
  },
};

export const List: Story = {
  args: {
    children: (
      <>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2 border-b border-line py-3">
            <SkeletonBlock shape="line" className="w-3/5" />
            <SkeletonBlock shape="line" className="w-2/5" />
          </div>
        ))}
      </>
    ),
  },
};

/** The pulse runs; under reduced motion the global rule and motion-reduce stop it. */
export const Pulse: Story = {
  ...List,
  play: async ({ canvasElement }) => {
    const block = canvasElement.querySelector("[aria-hidden]") as HTMLElement;
    const style = getComputedStyle(block);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    await expect(style.animationName).toBe(reduced ? "none" : "breathe");
  },
};

export const RightToLeft: Story = {
  ...BrewCard,
  globals: { direction: "rtl" },
};
