import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { TabBar } from "@/components/ui/TabBar/TabBar";
import type { ShotValuesData } from "@/components/ui/ShotValues/ShotValues";
import messages from "@/i18n/messages/en.json";
import { exampleCoffee, exampleNow, exampleRecipe, exampleRemainingGrams, exampleShots, exampleSetup } from "./fixtures";
import { HomeScreen } from "./HomeScreen/HomeScreen";
import { PhoneFrame } from "./PhoneFrame";
import type { RecentItem } from "./RecentShotsScreen/RecentShotsScreen";
import { RecentShotsScreen } from "./RecentShotsScreen/RecentShotsScreen";
import { ShotLogScreen } from "./ShotLogScreen/ShotLogScreen";

const { nav } = messages;
const tabs = [
  { id: "brew", label: nav.brew },
  { id: "shots", label: nav.shots },
  { id: "pantry", label: nav.pantry },
  { id: "setup", label: nav.setup },
];

/**
 * The daily flow, clickable: pull a shot, mark it off, dial in on the shot
 * log, save, and see it in recent shots. Pantry and Setup aren't built yet.
 */
function DailyFlow() {
  const [tab, setTab] = useState("brew");
  const [logMode, setLogMode] = useState<"dialIn" | "fix" | null>(null);
  const [pulled, setPulled] = useState(false);
  const [reaction, setReaction] = useState<"good" | "off" | null>(null);
  const [remaining, setRemaining] = useState(exampleRemainingGrams);
  const [recipe] = useState<ShotValuesData>(exampleRecipe);
  const [shots, setShots] = useState<RecentItem[]>(exampleShots);
  const drink = messages.drinks.latte;

  const addShot = (values: ShotValuesData, oneTap: boolean) => {
    setShots((s) => [
      { kind: "shot", id: `new-${s.length}`, drink, at: exampleNow, coffee: exampleCoffee.bean, values, oneTap },
      ...s,
    ]);
    setRemaining((g) => g - values.dose);
  };

  if (logMode) {
    return (
      <PhoneFrame>
        <ShotLogScreen
          mode={logMode}
          setup={exampleSetup}
          drink={drink}
          coffee={exampleCoffee.bean}
          start={recipe}
          onCancel={() => setLogMode(null)}
          onSave={(values) => {
            addShot(values, false);
            setLogMode(null);
            setTab("shots");
          }}
        />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame
      bottom={
        <TabBar
          label={nav.label}
          tabs={tabs}
          current={tab}
          onSelect={(id) => {
            setTab(id);
            setPulled(false);
          }}
        />
      }
    >
      {tab === "brew" && (
        <HomeScreen
          state="recipe"
          drink={drink}
          coffee={exampleCoffee}
          recipe={recipe}
          setup={exampleSetup}
          remainingGrams={remaining}
          pulled={pulled}
          reaction={reaction}
          onPull={() => {
            addShot(recipe, true);
            setPulled(true);
            setReaction(null);
          }}
          onUndo={() => {
            setShots((s) => s.slice(1));
            setRemaining((g) => g + recipe.dose);
            setPulled(false);
          }}
          onReaction={(r) => {
            setReaction(r);
            if (r === "off") {
              setPulled(false);
              setLogMode("fix");
            }
          }}
          onDialIn={() => setLogMode("dialIn")}
        />
      )}
      {tab === "shots" && <RecentShotsScreen items={shots} now={exampleNow} onOpen={() => {}} />}
      {(tab === "pantry" || tab === "setup") && (
        <p className="m-auto text-center text-body text-ink-secondary">{messages.states.notBuilt}</p>
      )}
    </PhoneFrame>
  );
}

const meta = {
  title: "Screens/Daily flow",
  component: DailyFlow,
  parameters: { layout: "centered" },
} satisfies Meta<typeof DailyFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Clickable: Story = {};
