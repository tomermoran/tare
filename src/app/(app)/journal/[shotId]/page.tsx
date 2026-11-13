import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { ShotDetailScreen, type ShotFact } from "@/components/screens/ShotDetailScreen/ShotDetailScreen";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { milkLabel, type MilkKey } from "@/domain/milkName";
import { tastePhraseKeys } from "@/domain/tastePhrase";
import { getShot } from "@/server/dal/journal";
import { NotFoundError, unlessSignedOut } from "@/server/dal/scope";
import { getTimeZone } from "@/server/time";

/**
 * SCR-SHOT: one shot, read-only in Milestone 1. Edit, pin and dial in from
 * this are added to its actions by the tasks that build them.
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

  const phrases = tastePhraseKeys(shot.taste).map((key) => t(key));
  const rating = shot.rating !== null ? { label: t("shot.rating"), value: t("shot.ratingValue", { rating: shot.rating }) } : undefined;

  return (
    <ShotDetailScreen
      labels={{ back: t("journal.title"), details: t("shot.details"), taste: t("shot.taste") }}
      backHref="/journal"
      drink={drinkLabel(shot.drink, (key: DrinkKey) => t(key))}
      when={t("shot.dateTime", {
        date: format.dateTime(shot.at, { dateStyle: "medium", timeZone }),
        time: format.dateTime(shot.at, { timeStyle: "short", timeZone }),
      })}
      values={shot.values}
      note={shot.entryMode === "one-tap" ? t("shot.copiedFromRecipe") : undefined}
      facts={facts}
      taste={rating || phrases.length ? { rating, phrases } : undefined}
    />
  );
}
