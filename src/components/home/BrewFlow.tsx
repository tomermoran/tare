"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { HomeScreen } from "@/components/screens/HomeScreen/HomeScreen";
import { Button, buttonClass } from "@/components/ui/Button/Button";
import { Notice } from "@/components/ui/Notice/Notice";
import { PulledState, type Reaction } from "@/components/ui/PulledState/PulledState";
import { SelectSheet, type SelectOption } from "@/components/ui/SelectSheet/SelectSheet";
import { clearBrewChoice, saveBrewChoice, touchBrewChoice } from "@/lib/brewChoiceCookie";
import { rememberBrewSelection } from "@/lib/brewSelection";
import { isSuggestionDismissed } from "@/lib/dismissals";
import { dialInHref, fixHref } from "@/lib/fixRoutes";
import { portionChoicesAction, pullShotAction, undoPullAction } from "@/server/actions/pull";
import { getOffContextAction, setReactionAction } from "@/server/actions/reaction";
import { chooseSetupAction } from "@/server/actions/setups";
import type { PortionChoice } from "@/server/dal/pull";
import type { OffContext } from "@/server/dal/reaction";
import { OffFlow } from "./OffFlow";
import { PortionChooser } from "./PortionChooser";

type Field = "drink" | "coffee" | "setup";

export type BrewAction =
  | { kind: "link"; label: string; href: string }
  | { kind: "chooseCoffee"; label: string }
  | { kind: "pull"; label: string }
  /**
   * Dial in from the recipe (STORY-02-03-03): with no open portion it asks
   * which bag first; with a pending suggestion not dismissed on this device
   * it says so and starts with it (STORY-02-03-07 AC 3).
   */
  | {
      kind: "dialIn";
      label: string;
      suggestedLabel: string;
      drinkId: string;
      beanId: string;
      /** The open portion; null asks first. */
      portionId: string | null;
      /** The shot a pending suggestion comes from. */
      pendingShotId: string | null;
    };

type DialInAction = Extract<BrewAction, { kind: "dialIn" }>;

/** DQ-04: undo is offered this long, then fades with no countdown. */
export const UNDO_MS = 8_000;
/** The card returns to its normal state after this long (design 2.3). */
export const PULLED_MS = 30_000;

type Pulled = { shotId: string | null; undo: boolean; reaction?: Reaction | null; reactionFailed?: Reaction };
/** Which bag: for a pull, or for a dial-in that opens the log with it. */
type Choosing = { portions: PortionChoice[]; dialIn?: DialInAction } | null;

/**
 * Brew's client side. The drink and coffee selects keep the choice in a
 * cookie for the next pull only, never as a setting (DQ-17): a pull clears
 * it, and 30 minutes away from Brew lapses it. "Pull this shot"
 * (STORY-02-02-02) shows the pulled state at once, then records the shot
 * with an ID made here, so a double tap or a retry makes one shot; when none
 * of the coffee is open it asks which bag first (STORY-02-02-03), and undo
 * lasts 8 seconds (STORY-02-02-04).
 */
export function BrewFlow({
  screen,
  primary,
  secondary,
  pull,
  drinks,
  coffees,
  setups,
  drinkId,
  beanId,
  setupId,
  changePartHref,
  addBagHref,
}: {
  screen: Omit<ComponentProps<typeof HomeScreen>, "actions" | "onChangeDrink" | "onChangeCoffee">;
  primary: BrewAction;
  secondary?: BrewAction;
  /** Present when the primary is the one-tap pull. */
  pull?: { drinkTypeId: string; beanId: string };
  drinks: SelectOption[];
  coffees: SelectOption[];
  /** The household's setups, current first and marked. */
  setups: SelectOption[];
  drinkId: string;
  beanId: string | null;
  setupId: string;
  /** The builder from the current setup, coming back to Brew (STORY-02-02-07 AC 3). */
  changePartHref: string;
  addBagHref: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [picking, setPicking] = useState<Field | null>(null);
  const [pulled, setPulled] = useState<Pulled | null>(null);
  const [choosing, setChoosing] = useState<Choosing>(null);
  const [failed, setFailed] = useState(false);
  const [said, setSaid] = useState("");
  const [off, setOff] = useState<{ shotId: string; context: OffContext } | null>(null);
  const [dismissedShot, setDismissedShot] = useState<string | null>(null);
  const pendingShotId = [primary, secondary].find((a): a is DialInAction => a?.kind === "dialIn")?.pendingShotId ?? null;
  // Dismissals live on this device, so they're read after hydration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the device store on mount
    if (pendingShotId && isSuggestionDismissed(pendingShotId)) setDismissedShot(pendingShotId);
  }, [pendingShotId]);
  // One ID per intended shot: retries and a second tap reuse it.
  const clientId = useRef<string | null>(null);
  const busy = useRef(false);

  // Undo fades after 8 s; the card returns after 30 s.
  useEffect(() => {
    if (!pulled?.shotId) return;
    const fade = setTimeout(() => setPulled((p) => p && { ...p, undo: false }), UNDO_MS);
    const back = setTimeout(() => setPulled(null), PULLED_MS);
    return () => {
      clearTimeout(fade);
      clearTimeout(back);
    };
  }, [pulled?.shotId]);

  // The Journal tab opens on what's shown here (STORY-02-06-05 AC 1).
  useEffect(() => {
    rememberBrewSelection(beanId ? { drinkId, beanId } : null);
  }, [drinkId, beanId]);

  // The 30 minutes away count from when Brew was last on screen (AC 6).
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") touchBrewChoice();
      else if (!touchBrewChoice()) router.refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      touchBrewChoice();
    };
  }, [router]);

  // For the next pull only, never a setting (DQ-17). Changing ends the pulled state.
  const choose = async (field: Field, id: string) => {
    setPicking(null);
    setPulled(null);
    if (field === "setup") {
      // A setup is physical, so choosing one makes it current (DQ-18).
      if (id !== setupId) await chooseSetupAction(id);
    } else {
      saveBrewChoice(field === "drink" ? { drinkId: id } : { beanId: id });
    }
    router.refresh();
  };

  const doPull = async (portionId?: string) => {
    if (!pull || busy.current) return;
    busy.current = true;
    clientId.current ??= crypto.randomUUID();
    setFailed(false);
    setChoosing(null);
    // Optimistic: the buttons give way at once (AC 1, AC 4).
    setPulled({ shotId: null, undo: true });
    setSaid(t("home.pulled"));
    const result = await pullShotAction({ clientId: clientId.current, ...pull, portionId });
    busy.current = false;
    if (!result.ok) {
      setPulled(null);
      setSaid("");
      setFailed(true);
      return;
    }
    const outcome = result.data;
    if (outcome.kind !== "pulled") {
      setPulled(null);
      setSaid("");
      setChoosing({ portions: outcome.kind === "needsPortion" ? outcome.portions : [] });
      return;
    }
    clientId.current = null;
    // What was pulled becomes the usual through history (AC 5).
    clearBrewChoice();
    setPulled({ shotId: outcome.shotId, undo: true });
    router.refresh();
  };

  const undo = async () => {
    const shotId = pulled?.shotId;
    if (!shotId) return;
    const result = await undoPullAction(shotId);
    if (!result.ok) {
      setPulled((p) => p && { ...p, undo: false });
      return;
    }
    setPulled(null);
    setSaid(t("home.undone"));
    router.refresh();
  };

  // Good saves and that's all; off saves, then asks what was off (STORY-02-03-01).
  const react = async (reaction: Reaction) => {
    const shotId = pulled?.shotId;
    if (!shotId) return;
    const before = pulled.reaction ?? null;
    setPulled((p) => p && { ...p, reaction, reactionFailed: undefined });
    const result = await setReactionAction(shotId, reaction);
    if (!result.ok) {
      // Not recorded: the chip goes back, and off can still go on to the fix (AC 5).
      setPulled((p) => p && { ...p, reaction: before, reactionFailed: reaction });
      return;
    }
    if (reaction !== "off") return;
    const context = await getOffContextAction(shotId);
    if (context.ok) setOff({ shotId, context: context.data });
    else router.push(fixHref(shotId));
  };

  const suggestedFor = (a: DialInAction) => (a.pendingShotId && a.pendingShotId !== dismissedShot ? a.pendingShotId : null);
  const dialIn = async (a: DialInAction) => {
    const open = (portionId: string | null) =>
      router.push(dialInHref({ drinkId: a.drinkId, beanId: a.beanId, portionId, suggested: suggestedFor(a) }));
    if (a.portionId) return open(a.portionId);
    const choices = await portionChoicesAction(a.beanId);
    // Unknown: let the log choose, as it would for a new shot.
    if (!choices.ok) return open(null);
    setChoosing({ portions: choices.data, dialIn: a });
  };

  const action = (a: BrewAction, variant: "primary" | "ghost") => {
    if (a.kind === "dialIn")
      return (
        <Button key="dialIn" variant={variant} fullWidth onClick={() => void dialIn(a)}>
          {suggestedFor(a) ? a.suggestedLabel : a.label}
        </Button>
      );
    if (a.kind === "link")
      return (
        <Link key={a.label} href={a.href} className={buttonClass({ variant, fullWidth: true })}>
          {a.label}
        </Link>
      );
    const onClick = a.kind === "pull" ? () => void doPull() : () => setPicking("coffee");
    return (
      <Button key={a.label} variant={variant} fullWidth onClick={onClick}>
        {a.label}
      </Button>
    );
  };

  const sheets = {
    drink: { title: t("log.drink"), options: drinks, value: drinkId },
    coffee: { title: t("shot.coffee"), options: coffees, value: beanId },
    setup: { title: t("log.setup"), options: setups, value: setupId },
  };
  const sheet = sheets[picking ?? "drink"];
  return (
    <>
      <HomeScreen
        {...screen}
        onChangeDrink={() => setPicking("drink")}
        onChangeCoffee={coffees.length ? () => setPicking("coffee") : undefined}
        onChangeSetup={() => setPicking("setup")}
        actions={
          <>
            <p className="sr-only" role="status">
              {said}
            </p>
            {pulled ? (
              <PulledState
                labels={{
                  pulled: t("home.pulled"),
                  undo: t("home.undo"),
                  reaction: { label: t("home.reactionLabel"), good: t("home.reactionGood"), off: t("home.reactionOff") },
                }}
                undoAvailable={!!pulled.shotId && pulled.undo}
                onUndo={() => void undo()}
                reaction={pulled.reaction ?? null}
                onReaction={pulled.shotId ? (r) => void react(r) : undefined}
                notice={
                  pulled.reactionFailed && (
                    <Notice
                      action={
                        pulled.reactionFailed === "off" && pulled.shotId
                          ? { label: t("off.fix"), onClick: () => router.push(fixHref(pulled.shotId!)) }
                          : undefined
                      }
                    >
                      {t("home.reactionFailed")}
                    </Notice>
                  )
                }
              />
            ) : (
              <>
                {failed && (
                  <Notice action={{ label: t("actions.retry"), onClick: () => void doPull() }}>{t("home.pullFailed")}</Notice>
                )}
                {action(primary, "primary")}
                {secondary && action(secondary, "ghost")}
              </>
            )}
          </>
        }
      />
      <SelectSheet
        open={picking !== null}
        onClose={() => setPicking(null)}
        title={sheet.title}
        closeLabel={t("actions.close")}
        options={sheet.options}
        value={sheet.value}
        onChoose={(id) => picking && void choose(picking, id)}
        footerRow={picking === "setup" ? { label: t("setup.changePart"), onClick: () => router.push(changePartHref) } : undefined}
      />
      {off && <OffFlow shotId={off.shotId} context={off.context} onClose={() => setOff(null)} />}
      <PortionChooser
        portions={choosing?.portions ?? null}
        onClose={() => {
          // Cancel records nothing (STORY-02-02-03 AC 5).
          setChoosing(null);
          clientId.current = null;
        }}
        onChoose={(id) => {
          const forDialIn = choosing?.dialIn;
          if (!forDialIn) return void doPull(id);
          setChoosing(null);
          router.push(dialInHref({ drinkId: forDialIn.drinkId, beanId: forDialIn.beanId, portionId: id, suggested: suggestedFor(forDialIn) }));
        }}
        addBagHref={addBagHref}
      />
    </>
  );
}
