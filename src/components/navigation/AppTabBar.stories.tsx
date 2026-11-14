import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { act } from "react";
import { expect, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { rememberBrewSelection } from "@/lib/brewSelection";
import { AppTabBarFallback } from "./AppTabBar";

/*
 * The Journal tab opens on Brew's drink and coffee (STORY-02-06-05): plain
 * on first run, filtered once Brew has a selection, never by setup, and it
 * follows a change made on Brew at once. The fallback bar is the same tab
 * list without the current-route mark, so it needs no router here.
 */

const { nav } = messages;

const meta = {
  title: "Navigation/AppTabBar",
  component: AppTabBarFallback,
  decorators: [(Story) => <div className="w-[390px]"><Story /></div>],
  // Each story starts from a clean session, and leaves one behind.
  beforeEach: () => {
    rememberBrewSelection(null);
    return () => rememberBrewSelection(null);
  },
} satisfies Meta<typeof AppTabBarFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

const journalLink = (canvasElement: HTMLElement) => within(canvasElement).getByRole("link", { name: nav.journal });

/** Nothing on Brew yet: the Journal opens unfiltered (AC 2). */
export const FirstRun: Story = {
  play: async ({ canvasElement }) => {
    await expect(journalLink(canvasElement)).toHaveAttribute("href", "/journal");
  },
};

/** Brew's drink and coffee become the Journal's filters, never its setup (AC 1). */
export const WithSelection: Story = {
  beforeEach: () => {
    rememberBrewSelection({ drinkId: "flat-white", beanId: "house-blend" });
  },
  play: async ({ canvasElement }) => {
    const href = journalLink(canvasElement).getAttribute("href")!;
    expect(href).toBe("/journal?drinkId=flat-white&beanId=house-blend");
    expect(href).not.toContain("setupId");
  },
};

/** A change on Brew moves the link at once, and clearing it returns to plain (AC 1). */
export const FollowsChange: Story = {
  play: async ({ canvasElement }) => {
    await expect(journalLink(canvasElement)).toHaveAttribute("href", "/journal");
    act(() => rememberBrewSelection({ drinkId: "espresso", beanId: "house-blend" }));
    await waitFor(() => expect(journalLink(canvasElement)).toHaveAttribute("href", "/journal?drinkId=espresso&beanId=house-blend"));
    act(() => rememberBrewSelection({ drinkId: "latte", beanId: "single-origin" }));
    await waitFor(() => expect(journalLink(canvasElement)).toHaveAttribute("href", "/journal?drinkId=latte&beanId=single-origin"));
    act(() => rememberBrewSelection(null));
    await waitFor(() => expect(journalLink(canvasElement)).toHaveAttribute("href", "/journal"));
  },
};
