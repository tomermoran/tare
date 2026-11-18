import type { Metadata } from "next";
import { connection } from "next/server";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { JoinFlow } from "@/components/join/JoinFlow";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { daysBetween, localDayKey } from "@/domain/localDay";
import { personaLabel } from "@/domain/personaLabel";
import { lastHadLabel } from "@/lib/lastHad";
import { getInvitePreview } from "@/server/dal/invitePreview";
import { getTimeZone } from "@/server/time";

export const metadata: Metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" };

/**
 * SCR-JOIN (STORY-05-02-05): what an invitation is for, read signed out.
 * Opening it writes nothing; Firebase loads only once the person chooses
 * to sign in.
 */
export default function JoinPage({ params }: PageProps<"/join/[token]">) {
  return (
    <Suspense fallback={<JoinFlow token="" view={{ kind: "loading" }} />}>
      <Join params={params} />
    </Suspense>
  );
}

async function Join({ params }: Pick<PageProps<"/join/[token]">, "params">) {
  // Each open reads the invite as it is now.
  await connection();
  const [{ token }, t, locale, timeZone] = await Promise.all([params, getTranslations(), getLocale(), getTimeZone()]);
  const preview = await getInvitePreview(token);
  if (preview.kind === "invalid") return <JoinFlow token={token} view={{ kind: "invalid" }} />;
  const name = personaLabel(preview, t("profile.defaultName"));
  const drinks = preview.drinks.map((d) => drinkLabel(d, (key: DrinkKey) => t(key)));
  const lines = [
    t("join.shots", { count: preview.shots }),
    ...(drinks.length ? [t("join.drinks", { drinks: new Intl.ListFormat(locale, { type: "conjunction" }).format(drinks) })] : []),
    ...(preview.lastBrewedAt
      ? [t("join.lastBrewed", { when: lastHadLabel(daysBetween(localDayKey(preview.lastBrewedAt, timeZone), localDayKey(new Date(), timeZone)), locale) })]
      : []),
  ];
  return <JoinFlow token={token} name={name} view={{ kind: "landing", summary: { title: t("join.summaryTitle", { name }), lines } }} />;
}
