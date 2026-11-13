import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createTranslator } from "next-intl";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { BasketQuestions, CapabilitySection } from "@/components/catalog/BasketQuestions";
import { CoffeeDetails } from "@/components/catalog/CoffeeDetails";
import { ROAST_LEVELS } from "@/domain/roast";
import type { DoseAnswer } from "@/domain/capabilityQuestions";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { CatalogAddScreen } from "./CatalogAddScreen";

const t = createTranslator({ locale: "en", messages });
const { actions, catalog, setup, states } = messages;
const g = (n: number) => new Intl.NumberFormat("en", { style: "unit", unit: "gram", unitDisplay: "narrow" }).format(n);

const labels = {
  title: catalog.addTitle.grinder,
  cancel: actions.cancel,
  url: catalog.url,
  urlHint: catalog.urlHint,
  checking: catalog.checking,
  checkFailed: catalog.checkFailed,
  useExisting: catalog.useExisting,
  parent: catalog.maker,
  chooseParent: catalog.chooseMaker,
  parentName: catalog.makerName,
  parentUrl: catalog.makerUrl,
  parentUrlHint: catalog.makerUrlHint,
  name: catalog.model,
  kindLabel: catalog.kind,
  save: catalog.save,
  saveFailedTitle: catalog.saveFailedTitle,
  saveFailed: states.saveFailed,
};
const kinds = (["machine", "grinder", "basket"] as const).map((k) => ({ value: k, label: setup.kind[k] }));

const doseLabels = {
  question: catalog.cap.doseQ,
  presets: {
    "14-16": t("catalog.cap.doseRange", { min: g(14), max: g(16) }),
    "17-19": t("catalog.cap.doseRange", { min: g(17), max: g(19) }),
    "20-22": t("catalog.cap.doseRange", { min: g(20), max: g(22) }),
  },
  other: catalog.cap.other,
  notSure: catalog.cap.notSure,
  min: catalog.cap.doseMin,
  max: catalog.cap.doseMax,
  unit: "g",
};

function Basket({ initial = { choice: null } }: { initial?: DoseAnswer }) {
  const [answer, setAnswer] = useState<DoseAnswer>(initial);
  return (
    <CapabilitySection title={catalog.cap.title} why={catalog.cap.why}>
      <BasketQuestions labels={doseLabels} answer={answer} onChange={setAnswer} />
    </CapabilitySection>
  );
}

const meta = {
  title: "Screens/Catalog add",
  component: CatalogAddScreen,
  parameters: { layout: "centered" },
  args: {
    labels,
    url: "",
    onUrlChange: fn(),
    onUrlBlur: fn(),
    parent: null,
    onChooseParent: fn(),
    name: "Hand Mill 40",
    onNameChange: fn(),
    kinds,
    kind: "grinder",
    onKindChange: fn(),
    onSave: fn(),
    onCancel: fn(),
  },
  decorators: [
    (Story) => (
      <PhoneFrame>
        <Story />
      </PhoneFrame>
    ),
  ],
} satisfies Meta<typeof CatalogAddScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The link comes first, and the search text is already the name (AC 1). */
export const Hardware: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fields = canvas.getAllByRole("textbox");
    await expect(fields[0]).toHaveAccessibleName(catalog.url);
    await expect(canvas.getByLabelText(catalog.model)).toHaveValue("Hand Mill 40");
  },
};

export const Checking: Story = {
  args: { url: "https://example.com/hand-mill-40", check: "checking" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(catalog.checking);
  },
};

/** A match is offered before anything else (STORY-01-06-04 AC 1, AC 4). */
export const DuplicateFound: Story = {
  args: {
    url: "https://example.com/zero",
    duplicate: t("catalog.duplicateFound", { name: "Grinder Zero", maker: "Example Works" }),
    onUseExisting: fn(),
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: catalog.useExisting }));
    await expect(args.onUseExisting).toHaveBeenCalledOnce();
  },
};

/** The check failed: neutral, and saving is still allowed (STORY-01-06-04 AC 5). */
export const CheckFailed: Story = {
  args: { url: "https://example.com/hand-mill-40", check: "failed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(catalog.checkFailed)).toBeVisible();
    await expect(canvas.getByRole("button", { name: catalog.save })).toBeEnabled();
  },
};

/** A new maker, with its own link (AC 3). */
export const NewMaker: Story = {
  args: { parent: catalog.newMaker, newParent: true, parentName: "Example Mills" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByLabelText(catalog.makerUrl)).toBeVisible();
  },
};

/** Saving without a link: asked for one, in ink (AC 5). */
export const MissingLink: Story = {
  args: { errors: { url: catalog.urlMissing, parent: catalog.makerMissing } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(catalog.urlMissing)).toBeVisible();
  },
};

/** A failed save keeps everything (AC 6). */
export const SaveFailed: Story = {
  args: { url: "https://example.com/hand-mill-40", parent: "Example Works", state: "failed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(catalog.saveFailedTitle)).toBeVisible();
    await expect(canvas.getByLabelText(catalog.url)).toHaveValue("https://example.com/hand-mill-40");
  },
};

/** A basket: only the dose range question, "other" opens two fields (AC 4). */
export const BasketDose: Story = {
  args: { kind: "basket", labels: { ...labels, title: catalog.addTitle.basket, nameHint: catalog.modelBasketHint }, name: "18 g Basket", capabilities: <Basket /> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("radiogroup", { name: catalog.cap.doseQ })).toBeVisible();
    await expect(canvas.queryByLabelText(catalog.cap.doseMin)).toBeNull();
    await userEvent.click(canvas.getByRole("radio", { name: catalog.cap.other }));
    await expect(canvas.getByLabelText(catalog.cap.doseMin)).toBeVisible();
    await userEvent.click(canvas.getByRole("radio", { name: catalog.cap.notSure }));
    await expect(canvas.queryByLabelText(catalog.cap.doseMin)).toBeNull();
  },
};

export const RightToLeft: Story = {
  args: { kind: "basket", newParent: true, parent: catalog.newMaker, capabilities: <Basket initial={{ choice: "other", min: "7", max: "10" }} /> },
  globals: { direction: "rtl" },
};

function Coffee() {
  const [roast, setRoast] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  return (
    <CoffeeDetails
      labels={{
        roastLevel: catalog.roastLevel,
        levels: Object.fromEntries(ROAST_LEVELS.map((l) => [l, catalog.roast[l]])) as Record<(typeof ROAST_LEVELS)[number], string>,
        notSure: catalog.cap.notSure,
        notes: catalog.tastingNotes,
        notesHint: catalog.tastingNotesHint,
      }}
      roast={roast}
      onRoastChange={setRoast}
      notes={notes}
      onNotesChange={setNotes}
    />
  );
}

const coffeeLabels = {
  ...labels,
  title: catalog.addTitle.coffee,
  urlHint: catalog.urlCoffeeHint,
  parent: catalog.roaster,
  parentName: catalog.roasterName,
  parentUrl: catalog.roasterUrl,
  parentUrlHint: catalog.roasterUrlHint,
  name: catalog.bean,
  kindLabel: undefined,
};

/** A coffee: roaster, name, and an optional roast level and notes (STORY-01-06-02 AC 3). */
export const CoffeeEntry: Story = {
  args: { labels: coffeeLabels, kinds: undefined, kind: undefined, name: "Morning Blend", capabilities: <Coffee /> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("radiogroup", { name: catalog.kind })).toBeNull();
    await userEvent.click(canvas.getByRole("radio", { name: catalog.roast["Medium-Light"] }));
    await expect(canvas.getByRole("radio", { name: catalog.roast["Medium-Light"] })).toBeChecked();
    await expect(canvas.getByLabelText(catalog.tastingNotes)).toBeVisible();
  },
};

/** A new roaster, with its own link (STORY-01-06-02 AC 2). */
export const NewRoaster: Story = {
  args: { labels: coffeeLabels, kinds: undefined, kind: undefined, parent: catalog.newRoaster, newParent: true, capabilities: <Coffee /> },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByLabelText(catalog.roasterUrl)).toBeVisible();
  },
};
