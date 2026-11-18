import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import type { GrindTrailView } from "@/lib/grindTrail";
import { GrindReasonLine, GrindTrailSheet } from "./GrindTrailSheet";
import { exampleTrails } from "./grindTrailFixtures";

/** The reason line, opening the sheet, as on Brew. */
function Trail({ view, onUseRecipe }: { view: GrindTrailView; onUseRecipe?: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex p-4">
      <GrindReasonLine label={view.line} onClick={() => setOpen(true)} />
      <GrindTrailSheet open={open} onClose={() => setOpen(false)} view={view} onUseRecipe={onUseRecipe} />
    </div>
  );
}

async function opened(view: GrindTrailView) {
  const dialog = await within(document.body).findByRole("dialog", { name: view.title });
  await waitFor(() => expect(dialog).toBeVisible());
  return within(dialog);
}

const meta = {
  title: "Recipes/GrindTrailSheet",
  component: GrindTrailSheet,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof GrindTrailSheet>;

export default meta;
type Story = StoryObj<typeof meta>;
const args = {} as Story["args"];

/** Beans have aged: the recipe, one signed row, the grind shown and what it rests on (STORY-04-02-08 AC 1–2). */
export const Aged: Story = {
  args,
  render: () => <Trail view={exampleTrails.aged} onUseRecipe={fn()} />,
  play: async () => {
    const sheet = await opened(exampleTrails.aged);
    await expect(sheet.getByText("Beans have aged, roasted 18 days ago")).toBeVisible();
    await expect(sheet.getByText("0.5 finer")).toBeVisible();
    await expect(sheet.getByText("14.5")).toBeVisible();
    await expect(sheet.getByText("Based on 5 measured shots in the last 3 days.")).toBeVisible();
  },
};

/** "Use my recipe's grind" closes the sheet for this pull only (AC 5). */
export const UseRecipe: Story = {
  args,
  render: () => <Trail view={exampleTrails.aged} onUseRecipe={fn()} />,
  play: async () => {
    const sheet = await opened(exampleTrails.aged);
    await expect(sheet.getByRole("button", { name: exampleTrails.aged.useRecipe })).toBeVisible();
  },
};

export const Bag: Story = { args, render: () => <Trail view={exampleTrails.bag} /> };
export const Both: Story = {
  args,
  render: () => <Trail view={exampleTrails.both} />,
  play: async () => {
    const sheet = await opened(exampleTrails.both);
    await expect(sheet.getAllByRole("listitem").length).toBeGreaterThan(2);
  },
};
export const ReachedBack: Story = {
  args,
  render: () => <Trail view={exampleTrails.reachedBack} />,
  play: async () => {
    const sheet = await opened(exampleTrails.reachedBack);
    await expect(sheet.getByText("Based on 3 measured shots since October 28.")).toBeVisible();
  },
};
/** Pooled shots say only a count, never a name (AC 3). */
export const Pooled: Story = {
  args,
  render: () => <Trail view={exampleTrails.pooled} />,
  play: async () => {
    const sheet = await opened(exampleTrails.pooled);
    await expect(sheet.getByText("Includes shots made for 2 people.")).toBeVisible();
    await expect(sheet.getByText("Applied to your recipe, not to everyone's.")).toBeVisible();
  },
};
export const PrepLeftOut: Story = { args, render: () => <Trail view={exampleTrails.prepLeftOut} /> };
/** Without the grinder's direction, numbers only, no "finer" (AC 4). */
export const DirectionUnknown: Story = {
  args,
  render: () => <Trail view={exampleTrails.directionUnknown} />,
  play: async () => {
    const sheet = await opened(exampleTrails.directionUnknown);
    await expect(sheet.getByText("+1")).toBeVisible();
    await expect(sheet.queryByText(/finer|coarser/)).toBeNull();
  },
};
export const Limited: Story = {
  args,
  render: () => <Trail view={exampleTrails.limited} />,
  play: async () => {
    const sheet = await opened(exampleTrails.limited);
    await expect(sheet.getByText("Limited to 2 steps")).toBeVisible();
  },
};
/** In the log there's no footer: the wheel is right there. */
export const InTheLog: Story = {
  args,
  render: () => <Trail view={exampleTrails.log} />,
  play: async () => {
    const sheet = await opened(exampleTrails.log);
    await expect(sheet.queryByRole("button", { name: /Use my recipe/ })).toBeNull();
    await userEvent.keyboard("{Escape}");
  },
};
export const RightToLeft: Story = { args, render: () => <Trail view={exampleTrails.both} onUseRecipe={fn()} />, globals: { direction: "rtl" } };
