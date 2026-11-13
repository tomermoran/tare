import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { PortionRows, type PortionRow } from "./PortionRows";

const t = createTranslator({ locale: "en", messages });
const { portion } = messages;
const g = (n: number) => new Intl.NumberFormat("en", { style: "unit", unit: "gram", unitDisplay: "narrow", maximumFractionDigits: 1 }).format(n);
const row = (id: string, state: string, left: number, of: number, overLogged = false): PortionRow => ({
  id,
  state,
  remaining: t("portion.remaining", { grams: g(left) }),
  meter: { label: portion.meterLabel, value: left, max: of, text: t("portion.meter", { remaining: g(left), total: g(of) }) },
  overLogged: overLogged ? { message: portion.overLogged, action: portion.weigh } : undefined,
});

const onWeigh = fn();
const meta = {
  title: "Beans/Portion rows",
  component: PortionRows,
  decorators: [(Story) => <div className="w-[342px]"><Story /></div>],
  args: {
    portions: [row("p1", portion.state.counter, 120, 250), row("p2", portion.state.frozen, 250, 250)],
    onPortion: fn(),
    onWeigh,
  },
} satisfies Meta<typeof PortionRows>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Grams left first, the meter beside them with the same value as text (STORY-03-04-01 AC 1). */
export const WhatsLeft: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(t("portion.remaining", { grams: g(120) }))).toBeVisible();
    const [first] = canvas.getAllByRole("meter", { name: portion.meterLabel });
    await expect(first).toHaveAttribute("aria-valuetext", t("portion.meter", { remaining: g(120), total: g(250) }));
  },
};

/** More logged than the portion held: zero, never negative, and a neutral offer to weigh (AC 4). */
export const OverLogged: Story = {
  args: { portions: [row("p1", portion.state.counter, 0, 250, true)] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(t("portion.remaining", { grams: g(0) }))).toBeVisible();
    // A neutral status, not a shot warning.
    const notice = canvas.getByRole("status");
    await expect(notice).toHaveTextContent(portion.overLogged);
    await expect(notice).not.toHaveAttribute("data-warning");
    await userEvent.click(canvas.getByRole("button", { name: portion.weigh }));
    await expect(onWeigh).toHaveBeenCalledWith("p1");
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };
