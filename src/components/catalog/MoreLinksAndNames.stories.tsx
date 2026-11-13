import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { MoreLinksAndNames, type ExtraKind, type ExtraRow } from "./MoreLinksAndNames";

const t = createTranslator({ locale: "en", messages });
const { catalog } = messages;
const regions = new Intl.DisplayNames(["en"], { type: "region" });

const labels = {
  more: catalog.more,
  moreHint: catalog.moreHint,
  link: (number: number) => t("catalog.extraLink", { number }),
  name: (number: number) => t("catalog.extraName", { number }),
  market: catalog.market,
  marketFor: (item: string) => t("catalog.marketFor", { item }),
  marketName: (m: string | null) => (m ? (regions.of(m) ?? m) : catalog.anyMarket),
  addLink: catalog.addLink,
  addName: catalog.addName,
  remove: (item: string) => t("catalog.remove", { item }),
  useExisting: catalog.useExisting,
};

/** Stateful, so adding and removing rows can be tried. */
function Live({ initialLinks = [], initialNames = [], startOpen = true }: { initialLinks?: ExtraRow[]; initialNames?: ExtraRow[]; startOpen?: boolean }) {
  const [open, setOpen] = useState(startOpen);
  const [rows, setRows] = useState<Record<ExtraKind, ExtraRow[]>>({ links: initialLinks, names: initialNames });
  return (
    <MoreLinksAndNames
      labels={labels}
      open={open}
      onOpen={() => setOpen(true)}
      links={rows.links}
      names={rows.names}
      onChange={(kind, index, value) =>
        setRows((r) => ({ ...r, [kind]: r[kind].map((row, i) => (i === index ? { ...row, value } : row)) }))
      }
      onChooseMarket={fn()}
      onAdd={(kind) => setRows((r) => ({ ...r, [kind]: [...r[kind], { value: "", market: null }] }))}
      onRemove={(kind, index) => setRows((r) => ({ ...r, [kind]: r[kind].filter((_, i) => i !== index) }))}
    />
  );
}

const meta = {
  title: "Catalog/More links and names",
  component: MoreLinksAndNames,
  decorators: [(Story) => <div className="flex w-80 flex-col"><Story /></div>],
  args: {
    labels,
    open: true,
    onOpen: fn(),
    links: [],
    names: [],
    onChange: fn(),
    onChooseMarket: fn(),
    onAdd: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof MoreLinksAndNames>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Closed: one quiet disclosure under the form. */
export const Closed: Story = {
  args: { open: false },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: catalog.more }));
    await expect(args.onOpen).toHaveBeenCalledOnce();
  },
};

/** Links with their market, or everywhere; names likewise (AC 1, AC 2). */
export const Filled: Story = {
  args: {
    links: [
      { value: "https://example.co.uk/hand-mill-40", market: "GB" },
      { value: "https://example.com/hand-mill-40", market: null },
    ],
    names: [{ value: "HM-40", market: "US" }],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(t("catalog.extraLink", { number: 2 }))).toHaveValue("https://example.com/hand-mill-40");
    const market = canvas.getByRole("button", { name: `${t("catalog.marketFor", { item: t("catalog.extraLink", { number: 1 }) })}: ${regions.of("GB")}` });
    await userEvent.click(market);
    await expect(args.onChooseMarket).toHaveBeenCalledWith("links", 0);
  },
};

/** Rows are added and removed; each remove button names its row. */
export const AddAndRemove: Story = {
  render: () => <Live />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: catalog.addName }));
    await userEvent.type(canvas.getByLabelText(t("catalog.extraName", { number: 1 })), "Mill Forty");
    const item = t("catalog.extraName", { number: 1 });
    await userEvent.click(canvas.getByRole("button", { name: t("catalog.remove", { item }) }));
    await expect(canvas.queryByLabelText(item)).toBeNull();
  },
};

/** An extra link that's already in the catalog is offered (AC 4). */
export const ExtraLinkDuplicate: Story = {
  args: {
    links: [{ value: "https://example.com/zero", market: null }],
    linkDuplicates: [t("catalog.duplicateFound", { name: "Grinder Zero", maker: "Example Works" })],
    onUseExisting: fn(),
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: catalog.useExisting }));
    await expect(args.onUseExisting).toHaveBeenCalledWith(0);
  },
};

export const RightToLeft: Story = {
  render: () => <Live initialLinks={[{ value: "https://example.com/a", market: "IL" }]} initialNames={[{ value: "Alias", market: null }]} />,
  globals: { direction: "rtl" },
};
