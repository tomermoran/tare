import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { useState, type ComponentProps } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { Button } from "../Button/Button";
import { SelectSheet, type SelectOption } from "./SelectSheet";

const { actions, drinks, home, log, portion } = messages;
const t = createTranslator({ locale: "en", messages });
const day = new Intl.DateTimeFormat("en", { day: "numeric", month: "short" });

/** A trigger and its sheet, so choosing really changes the value. */
function WithTrigger({
  initialValue,
  onChoose,
  ...props
}: Omit<ComponentProps<typeof SelectSheet>, "open" | "onClose" | "value"> & { initialValue: string | null }) {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{props.title}</Button>
      <SelectSheet
        {...props}
        open={open}
        value={value}
        onClose={() => setOpen(false)}
        onChoose={(id) => {
          setValue(id);
          onChoose(id);
          setOpen(false);
        }}
      />
    </>
  );
}

const drinkOptions: SelectOption[] = [
  { id: "espresso", primary: drinks.espresso, marker: home.usual },
  { id: "ristretto", primary: drinks.ristretto },
  { id: "cortado", primary: drinks.cortado },
  { id: "flatWhite", primary: drinks.flatWhite },
  { id: "latte", primary: drinks.latte },
];

// Fictional coffees.
const line = (roaster: string, bag: string, state: string) => t("log.portionLine", { roaster, bag, state });
const portionOptions: SelectOption[] = [
  {
    id: "p1",
    primary: "Morning Blend",
    secondary: line("Example Roasters", t("log.bagRoasted", { date: day.format(new Date(2026, 9, 28)) }), t("portion.openFor", { days: 6 })),
  },
  {
    id: "p2",
    primary: "Hill Farm Washed",
    secondary: line("Sample Coffee Co.", t("log.bagRoasted", { date: day.format(new Date(2026, 10, 5)) }), portion.state.unopened),
  },
  {
    id: "p3",
    primary: "Morning Blend",
    marker: portion.state.frozen,
    secondary: line("Example Roasters", t("log.bagAdded", { date: day.format(new Date(2026, 8, 30)) }), portion.state.frozen),
  },
];

const meta = {
  title: "Components/SelectSheet",
  component: WithTrigger,
  args: {
    title: log.drink,
    closeLabel: actions.close,
    options: drinkOptions,
    initialValue: "espresso",
    onChoose: fn(),
  },
} satisfies Meta<typeof WithTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Drinks, with the usual one marked. Choosing by keyboard picks and closes. */
export const Drinks: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole("dialog", { name: log.drink });
    await waitFor(() => expect(dialog).toBeVisible());
    const current = within(dialog).getByRole("button", { current: true });
    await expect(current).toHaveTextContent(drinks.espresso);
    await expect(current).toHaveTextContent(home.usual);

    const latte = within(dialog).getByRole("button", { name: drinks.latte });
    latte.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onChoose).toHaveBeenCalledWith("latte");
    await waitFor(() => expect(dialog).not.toBeVisible());
  },
};

/** Portions: bean first, then roaster, bag and state; frozen last and marked. */
export const Portions: Story = {
  args: {
    title: log.coffee,
    options: portionOptions,
    initialValue: "p1",
    footerRow: { label: log.addBag, onClick: fn() },
  },
  play: async ({ canvasElement, args }) => {
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("dialog", { name: log.coffee });
    const rows = within(dialog).getAllByRole("button").filter((b) => b.closest("li"));
    await expect(rows.at(-2)).toHaveTextContent(portion.state.frozen);
    await userEvent.click(within(dialog).getByRole("button", { name: log.addBag }));
    await expect(args.footerRow!.onClick).toHaveBeenCalled();
  },
};

export const RightToLeft: Story = {
  args: { title: log.coffee, options: portionOptions, initialValue: "p2" },
  globals: { direction: "rtl" },
};
