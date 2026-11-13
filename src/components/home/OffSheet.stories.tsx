import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { ShotWarnings } from "@/components/shot/ShotWarnings";
import { useLiveSuggestion, type SuggestContextInput } from "@/components/suggest/useLiveSuggestion";
import { TasteQuestions, type TasteAnswerValues } from "@/components/taste/TasteQuestions";
import { TasteTags } from "@/components/taste/TasteTags";
import { useTasteLabels } from "@/components/taste/useTasteLabels";
import { SuggestionCard } from "@/components/ui/SuggestionCard/SuggestionCard";
import { NO_PREP } from "@/domain/prep";
import { shotWarnings } from "@/domain/shotWarnings";
import type { TasteTag } from "@/domain/taste";
import messages from "@/i18n/messages/en.json";
import { OffSheet } from "./OffSheet";

const { actions, off, suggest, taste } = messages;
const labels = { title: off.title, close: actions.close, skip: off.skip, saveFailed: off.saveFailed, retry: actions.retry };

/** A one-tap latte from its recipe: grinder at 15, higher is coarser. */
const context: SuggestContextInput = {
  shot: { grind: 15, dose: 18, yield: 36, timeMs: 28_000, brewTempC: null, prep: NO_PREP, milkMl: 150, milkDrink: true },
  recipe: { timeMs: 28_000 },
  setup: { grind: { type: "stepped", min: 0, max: 30, step: 1, coarser: "higher" }, temperature: false, doseRange: { min: 17, max: 19 } },
  previous: null,
  clocks: { roasting: null, opened: null },
};

function Off({ state, initialTags = [], onFix = fn(), onSkip = fn() }: { state?: "idle" | "failed"; initialTags?: TasteTag[]; onFix?: () => void; onSkip?: () => void }) {
  const words = useTasteLabels(true);
  const [answers, setAnswers] = useState<TasteAnswerValues>({ balance: null, strength: null, body: null, sweetness: null });
  const [tags, setTags] = useState<TasteTag[]>(initialTags);
  const card = useLiveSuggestion(context, answers, tags);
  return (
    <OffSheet
      open
      onClose={fn()}
      labels={labels}
      questions={<TasteQuestions labels={words.questions} value={answers} onChange={(p) => setAnswers((a) => ({ ...a, ...p }))} />}
      tags={<TasteTags labels={words} value={tags} onChange={setTags} />}
      warning={<ShotWarnings warnings={shotWarnings(tags)} labels={{ channelling: messages.shot.warnings.channelling }} />}
      suggestion={card && <SuggestionCard labels={{ title: suggest.title, dismiss: suggest.dismiss, to: suggest.to }} {...card} />}
      primary={{ label: card?.change ? suggest.tryIt : off.fix, onClick: onFix }}
      onSkip={onSkip}
      state={state}
      onRetry={fn()}
    />
  );
}

/** The sheet, once its fade-in has started. */
async function opened() {
  const dialog = await within(document.body).findByRole("dialog", { name: off.title });
  await waitFor(() => expect(dialog).toBeVisible());
  return within(dialog);
}

const meta = {
  title: "Home/OffSheet",
  component: OffSheet,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof OffSheet>;

export default meta;
type Story = StoryObj<typeof meta>;
const args = {} as Story["args"];

/** Nothing answered: the rows and tags, no rating, "fix it" and "skip" (AC 1). */
export const NoAnswer: Story = {
  args,
  render: () => <Off />,
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByRole("heading", { name: off.title })).toBeVisible();
    await expect(sheet.queryByRole("radiogroup", { name: taste.rating })).toBeNull();
    await expect(sheet.getByRole("button", { name: off.fix })).toBeVisible();
    await expect(sheet.getByRole("button", { name: off.skip })).toBeVisible();
  },
};

/** An answer gives a lever: the card appears and the primary becomes "dial in with this change" (AC 3). */
export const WithSuggestion: Story = {
  args,
  render: () => <Off />,
  play: async () => {
    const sheet = await opened();
    const strength = sheet.getByRole("radiogroup", { name: taste.question.strength });
    await userEvent.click(within(strength).getByRole("radio", { name: taste.strengthMilk.muchLess }));
    await expect(sheet.getByText(suggest.title)).toBeVisible();
    await expect(sheet.getByRole("button", { name: suggest.tryIt })).toBeVisible();
    await expect(sheet.queryByRole("button", { name: off.fix })).toBeNull();
  },
};

/** Channelling seen shows the warning under the tags (AC 5). */
export const Channelling: Story = {
  args,
  render: () => <Off />,
  play: async () => {
    const sheet = await opened();
    await userEvent.click(sheet.getByRole("button", { name: taste.tags.channelling }));
    await expect(sheet.getByText(messages.shot.warnings.channelling)).toBeVisible();
    await expect(sheet.getByText(suggest.change.wdt)).toBeVisible();
  },
};

/** The save failed: retry, and skip still opens the fix (AC 6). */
export const SaveFailed: Story = {
  args,
  render: () => <Off state="failed" />,
  play: async () => {
    const sheet = await opened();
    await expect(sheet.getByText(off.saveFailed)).toBeVisible();
    await expect(sheet.getByRole("button", { name: actions.retry })).toBeVisible();
    await expect(sheet.getByRole("button", { name: off.skip })).toBeEnabled();
  },
};

export const RightToLeft: Story = { args, render: () => <Off initialTags={["flat"]} />, globals: { direction: "rtl" } };
