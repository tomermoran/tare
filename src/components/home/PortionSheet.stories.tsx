import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { PortionSheet } from "./PortionSheet";

const { portion, home, actions } = messages;
const grams = (n: number) => new Intl.NumberFormat("en", { style: "unit", unit: "gram", unitDisplay: "short" }).format(n);
const left = (n: number) => portion.remaining.replace("{grams}", grams(n));
const bag = (date: string) => portion.bagRoasted.replace("{date}", date);

const meta = {
  title: "Home/PortionSheet",
  component: PortionSheet,
  args: {
    open: true,
    onClose: fn(),
    onChoose: fn(),
    addBagHref: "/beans/add?returnTo=%2F",
    portions: [
      { id: "frozen", primary: bag("2 Mar"), secondary: portion.state.frozen, end: left(125), frozen: true },
      { id: "sealed", primary: bag("9 Mar"), secondary: portion.state.unopened, end: left(250), frozen: false },
    ],
    labels: {
      title: portion.chooseTitle,
      body: portion.chooseBody,
      close: actions.close,
      grindFromFrozen: portion.grindFromFrozen,
      noneLeft: portion.noneLeft,
      addBag: home.addBag,
    },
  },
} satisfies Meta<typeof PortionSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Counter first, frozen last and marked; choosing records the shot. */
export const Choose: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);
    const rows = await waitFor(() => body.getAllByRole("button", { name: /Roasted/ }));
    await expect(rows[0]).toHaveTextContent(portion.state.unopened);
    await expect(rows[1]).toHaveTextContent(portion.grindFromFrozen);
    await userEvent.click(rows[1]);
    await expect(args.onChoose).toHaveBeenCalledWith("frozen");
  },
};

export const NoneLeft: Story = {
  args: { portions: [] },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByText(portion.noneLeft)).toBeVisible());
    await expect(body.getByRole("link", { name: home.addBag })).toBeVisible();
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };
