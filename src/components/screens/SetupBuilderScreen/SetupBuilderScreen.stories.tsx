import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import messages from "@/i18n/messages/en.json";
import { PhoneFrame } from "../PhoneFrame";
import { SetupBuilderScreen, type BuilderOption, type SetupBuilderLabels } from "./SetupBuilderScreen";

const { setup, actions, states } = messages;
const fill = (template: string, value: string) => template.replace("{name}", value);

const labels: SetupBuilderLabels = {
  title: setup.builderTitle,
  cancel: actions.cancel,
  close: actions.close,
  kinds: setup.kind,
  kindPlural: setup.kindPlural,
  notChosen: setup.notChosen,
  addPart: setup.addPart,
  matchFound: (name) => fill(setup.matchFound, name),
  newSetup: setup.newSetup,
  closest: (name) => fill(setup.closest, name),
  addName: setup.addName,
  name: setup.name,
  nameHint: setup.nameHint,
  useThis: setup.useThis,
  makeThis: setup.makeThis,
  saveFailedTitle: setup.saveFailedTitle,
  saveFailed: states.saveFailed,
};

// Fictional parts.
const option = (id: string, primary: string, maker: string): BuilderOption => ({ id, primary, secondary: `${maker} ${primary}` });
const options = {
  machine: [option("m1", "Model One", "Example Espresso Co.")],
  grinder: [option("g1", "Grinder Zero", "Sample Grinders"), option("g2", "Grinder Two", "Sample Grinders")],
  basket: [option("b1", "54mm Double Shot Basket", "Example Espresso Co.")],
};
const all = { machine: "m1", grinder: "g1", basket: "b1" };

const meta = {
  title: "Screens/Setup builder",
  component: SetupBuilderScreen,
  parameters: { layout: "centered" },
  decorators: [(Story) => <PhoneFrame><Story /></PhoneFrame>],
  args: {
    labels,
    options,
    chosen: all,
    openKind: null,
    onOpenKind: fn(),
    onChoose: fn(),
    onAddPart: fn(),
    match: { kind: "new" },
    nameOpen: false,
    onOpenName: fn(),
    name: "",
    onNameChange: fn(),
    onSave: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof SetupBuilderScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three rows in a fixed order; a new combination can take a name. */
export const NewSetup: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const rows = [...canvasElement.querySelectorAll("[aria-haspopup=dialog]")];
    await expect(rows.map((r) => r.textContent)).toEqual([
      `${setup.kind.machine}Model One`,
      `${setup.kind.grinder}Grinder Zero`,
      `${setup.kind.basket}54mm Double Shot Basket`,
    ]);
    const live = canvasElement.querySelector("[aria-live=polite]");
    await expect(live).toHaveTextContent(setup.newSetup);
    await expect(canvas.getByRole("button", { name: setup.makeThis })).toBeEnabled();
    await userEvent.click(canvas.getByRole("button", { name: setup.addName }));
    await expect(args.onOpenName).toHaveBeenCalledOnce();
  },
};

export const NewWithClosest: Story = {
  args: { match: { kind: "new", closest: "Weekday" }, nameOpen: true, name: "Weekend" },
  play: async ({ canvasElement }) => {
    const live = canvasElement.querySelector("[aria-live=polite]");
    await expect(live).toHaveTextContent(fill(setup.closest, "Weekday"));
    await expect(within(canvasElement).getByLabelText(setup.name)).toHaveValue("Weekend");
  },
};

/** The combination is an existing setup: no name field, "use this". */
export const Existing: Story = {
  args: { match: { kind: "existing", name: "Weekday", recipeCount: new Intl.NumberFormat("en").format(3) } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement.querySelector("[aria-live=polite]")).toHaveTextContent(fill(setup.matchFound, "Weekday"));
    await expect(canvas.getByRole("button", { name: setup.useThis })).toBeVisible();
    await expect(canvas.queryByRole("button", { name: setup.addName })).toBeNull();
  },
};

/** A missing part is named in a neutral notice; the button stays enabled. */
export const MissingPart: Story = {
  args: {
    chosen: { ...all, basket: null },
    match: null,
    missing: setup.missingParts.replace("{kinds}", setup.kindLower.basket),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent(setup.kindLower.basket);
    await expect(canvas.getByRole("button", { name: `${setup.kind.basket} ${setup.notChosen}` })).toBeVisible();
    await expect(canvas.getByRole("button", { name: setup.makeThis })).toBeEnabled();
  },
};

/** A row's list: the household's parts of that kind, then "Add a part". */
export const ChoosingGrinder: Story = {
  args: { openKind: "grinder" },
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole("dialog", { name: setup.kindPlural.grinder });
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(within(dialog).getByRole("button", { name: /Grinder Two/ }));
    await expect(args.onChoose).toHaveBeenCalledWith("grinder", "g2");
    await userEvent.click(within(dialog).getByRole("button", { name: setup.addPart }));
    await expect(args.onAddPart).toHaveBeenCalledWith("grinder");
  },
};

export const RightToLeft: Story = { globals: { direction: "rtl" } };
