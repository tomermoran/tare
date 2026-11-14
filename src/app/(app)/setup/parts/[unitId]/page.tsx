import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getFormatter, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AnswerLater } from "@/components/catalog/AnswerLater";
import { CapabilitySummary } from "@/components/catalog/CapabilitySummary";
import { MaintenanceFlow } from "@/components/maintenance/MaintenanceFlow";
import { UnitScreen, type UnitFact } from "@/components/screens/UnitScreen/UnitScreen";
import { localDayKey } from "@/domain/localDay";
import { setupLabel } from "@/domain/setupName";
import { safeReturnTo } from "@/lib/returnTo";
import { SETUP_PATH } from "@/lib/setupRoutes";
import { getGrindPeriod, listMaintenance } from "@/server/dal/maintenance";
import { getPart } from "@/server/dal/parts";
import { NotFoundError, unlessSignedOut } from "@/server/dal/scope";
import { getSetups } from "@/server/dal/setups";
import { getTimeZone } from "@/server/time";

/**
 * SCR-UNIT: one part, with the setups it's in (STORY-01-02-02 AC 5).
 * `returnTo` brings the user back to where they came from, such as the log.
 */
export default function PartPage({ params, searchParams }: PageProps<"/setup/parts/[unitId]">) {
  return (
    <Suspense fallback={null}>
      <Part params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Part({ params, searchParams }: PageProps<"/setup/parts/[unitId]">) {
  const { unitId } = await params;
  const returnParam = (await searchParams).returnTo;
  const returnTo = typeof returnParam === "string" ? safeReturnTo(returnParam, SETUP_PATH) : null;
  const [t, format, timeZone] = await Promise.all([getTranslations(), getFormatter(), getTimeZone()]);
  // Today and the grind period depend on the request time.
  await connection();
  const now = new Date();
  const found = await unlessSignedOut(
    Promise.all([getPart(unitId), getSetups(), listMaintenance(unitId)]).then(async ([part, setups, events]) => ({
      part,
      setups,
      events,
      period: part.kind === "grinder" ? await getGrindPeriod(unitId, now) : null,
    })),
  ).catch((e) => {
    if (e instanceof NotFoundError) notFound();
    throw e;
  });
  if (!found) return null;
  const { part, setups, events, period } = found;
  const date = (at: Date) => format.dateTime(at, { day: "numeric", month: "long", timeZone });

  const list = (items: string[]) => format.list(items, { type: "conjunction" });
  const facts: UnitFact[] = [
    ...(part.nickname ? [{ label: t("unit.nickname"), value: part.nickname }] : []),
    ...(part.acquiredAt
      ? [{ label: t("unit.acquired"), value: format.dateTime(part.acquiredAt, { dateStyle: "long", timeZone }) }]
      : []),
  ];

  return (
    <UnitScreen
      labels={{
        back: returnTo ? t("actions.back") : t("setup.title"),
        details: t("unit.details"),
        capabilities: t("unit.aboutModel"),
        inSetups: t("unit.inSetups"),
        notInSetup: t("unit.notInSetup"),
        current: t("setup.current"),
      }}
      backHref={returnTo ?? SETUP_PATH}
      title={part.nickname ?? part.model}
      subtitle={t("setup.partName", { maker: part.maker, model: part.model })}
      facts={facts}
      capabilities={<CapabilitySummary kind={part.kind} capabilities={part.capabilities} />}
      answerLater={
        part.capabilitiesEditable ? (
          <AnswerLater hardwareId={part.hardwareId} kind={part.kind} capabilities={part.capabilities} />
        ) : undefined
      }
      setups={setups
        .filter((s) => s.parts.some((p) => p.id === part.id))
        .map((s) => ({ id: s.id, name: setupLabel(s, setups, list), current: s.current }))}
      maintenance={
        <MaintenanceFlow
          partId={part.id}
          partKind={part.kind}
          today={localDayKey(now, timeZone)}
          events={events.map((e) => ({
            id: e.id,
            kind: t(`maintenance.kind.${e.kind}`),
            date: date(e.at),
            note: e.note,
            recalibration: e.isRecalibration,
          }))}
          period={
            period
              ? period.since
                ? {
                    line: t("maintenance.periodSince", { date: date(period.since) }),
                    shots: t("maintenance.periodShots", { count: period.shotCount }),
                  }
                : { line: t("maintenance.periodAll") }
              : undefined
          }
        />
      }
    />
  );
}
