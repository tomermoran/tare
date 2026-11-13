import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClass } from "@/components/ui/Button/Button";
import { getFormatter, getTranslations } from "next-intl/server";
import { ShotDetailScreen, type ShotFact } from "@/components/screens/ShotDetailScreen/ShotDetailScreen";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { milkLabel, type MilkKey } from "@/domain/milkName";
import { PinAction } from "@/components/recipes/PinAction";
import { ReactionChips } from "@/components/shot/ReactionChips";
import { ShotWarnings } from "@/components/shot/ShotWarnings";
import { shotSetupName } from "@/domain/shotSetupName";
import { shotWarnings } from "@/domain/shotWarnings";
import { tastePhraseKeys } from "@/domain/tastePhrase";
import { getShot } from "@/server/dal/journal";
import { NotFoundError, unlessSignedOut } from "@/server/dal/scope";
import { getTimeZone } from "@/server/time";

/**
 * SCR-SHOT: one shot. Edit is primary on a one-tap shot and a quiet ghost
 * on a measured one, where "pin as recipe" is the primary (STORY-02-06-03
 * AC 3); one-tap shots can't be pinned. Dial in from this joins later.
 */
export default async function ShotPage({ params }: PageProps<"/journal/[shotId]">) {
  const { shotId } = await params;
  const [t, format, timeZone] = await Promise.all([getTranslations(), getFormatter(), getTimeZone()]);
  const shot = await unlessSignedOut(getShot(shotId)).catch((e) => {
    if (e instanceof NotFoundError) notFound();
    throw e;
  });
  if (!shot) return null;

  const milk = shot.milk
    ? shot.milk.ml !== null
      ? t("shot.milkLine", {
          milk: milkLabel(shot.milk, (key: MilkKey) => t(key)),
          amount: format.number(shot.milk.ml, { style: "unit", unit: "milliliter", unitDisplay: "short" }),
        })
      : milkLabel(shot.milk, (key: MilkKey) => t(key))
    : null;
  const prep = [shot.prep.wdt && t("log.prepWdt"), shot.prep.puckScreen && t("log.prepPuckScreen")].filter(
    (p): p is string => !!p,
  );

  const facts: ShotFact[] = [
    { label: t("shot.coffee"), value: format.list([shot.coffee.name, shot.coffee.roasterName], { type: "unit" }) },
    ...(shot.setup.name ? [{ label: t("log.setup"), value: shot.setup.name }] : []),
    ...shot.setup.parts.map((p) => ({
      label: t(`setup.kind.${p.kind}`),
      value: t("setup.partName", { maker: p.maker, model: p.model }),
    })),
    ...(milk ? [{ label: t("shot.milk"), value: milk }] : []),
    ...(prep.length ? [{ label: t("log.prep"), value: format.list(prep, { type: "conjunction" }) }] : []),
    { label: t("log.sweetened"), value: t(shot.sweetened ? "shot.sweetenedYes" : "shot.sweetenedNo") },
    ...(shot.fromFrozen ? [{ label: t("bag.fromFrozen"), value: t("shot.fromFrozen") }] : []),
  ];

  const phrases = tastePhraseKeys(shot.taste, shot.milkDrink).map((key) => t(key));
  const rating = shot.rating !== null ? { label: t("shot.rating"), value: t("shot.ratingValue", { rating: shot.rating }) } : undefined;
  // A one-tap shot's reaction is its chips, so it can be changed (STORY-02-03-01 AC 4).
  const oneTap = shot.entryMode === "one-tap";
  const reaction = shot.reaction && !oneTap ? { label: t("shot.reaction"), value: t(`journal.${shot.reaction}`) } : undefined;
  const noticed = shot.tags.length
    ? { label: t("shot.noticed"), value: format.list(shot.tags.map((tag) => t(`taste.tags.${tag}`)), { type: "conjunction" }) }
    : undefined;

  const drink = drinkLabel(shot.drink, (key: DrinkKey) => t(key));
  const setup = shotSetupName(shot.setup, (items) => format.list(items, { type: "conjunction" }));
  const pinTitle = t("recipe.pinTitle", { drink, coffee: shot.coffee.name, setup });

  return (
    <ShotDetailScreen
      labels={{ back: t("journal.title"), details: t("shot.details"), taste: t("shot.taste") }}
      backHref="/journal"
      drink={drink}
      when={t("shot.dateTime", {
        date: format.dateTime(shot.at, { dateStyle: "medium", timeZone }),
        time: format.dateTime(shot.at, { timeStyle: "short", timeZone }),
      })}
      values={shot.values}
      note={shot.entryMode === "one-tap" ? t("shot.copiedFromRecipe") : undefined}
      facts={facts}
      taste={rating || reaction || noticed || phrases.length ? { rating, reaction, phrases, noticed } : undefined}
      actions={
        <>
          {oneTap && <ReactionChips shotId={shot.id} initial={shot.reaction} />}
          {shot.entryMode === "measured" && <PinAction shotId={shot.id} title={pinTitle} label={t("recipe.pin")} />}
          <Link
            href={`/log?mode=edit&shotId=${shot.id}`}
            className={
              shot.entryMode === "one-tap"
                ? buttonClass({ variant: "primary", fullWidth: true })
                : `${buttonClass({ variant: "ghost", size: "sm" })} -ms-4 self-start`
            }
          >
            {t("actions.edit")}
          </Link>
        </>
      }
      warning={<ShotWarnings warnings={shotWarnings(shot.tags)} labels={{ channelling: t("shot.warnings.channelling") }} />}
    />
  );
}
