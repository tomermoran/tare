import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { CapabilitySummary } from "@/components/catalog/CapabilitySummary";
import { UnitScreen, type UnitFact } from "@/components/screens/UnitScreen/UnitScreen";
import { setupLabel } from "@/domain/setupName";
import { SETUP_PATH } from "@/lib/setupRoutes";
import { getPart } from "@/server/dal/parts";
import { NotFoundError, unlessSignedOut } from "@/server/dal/scope";
import { getSetups } from "@/server/dal/setups";
import { getTimeZone } from "@/server/time";

/** SCR-UNIT: one part, with the setups it's in (STORY-01-02-02 AC 5). */
export default async function PartPage({ params }: PageProps<"/setup/parts/[unitId]">) {
  const { unitId } = await params;
  const [t, format, timeZone] = await Promise.all([getTranslations(), getFormatter(), getTimeZone()]);
  const found = await unlessSignedOut(Promise.all([getPart(unitId), getSetups()])).catch((e) => {
    if (e instanceof NotFoundError) notFound();
    throw e;
  });
  if (!found) return null;
  const [part, setups] = found;

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
        back: t("setup.title"),
        details: t("unit.details"),
        capabilities: t("unit.aboutModel"),
        inSetups: t("unit.inSetups"),
        notInSetup: t("unit.notInSetup"),
        current: t("setup.current"),
      }}
      backHref={SETUP_PATH}
      title={part.nickname ?? part.model}
      subtitle={t("setup.partName", { maker: part.maker, model: part.model })}
      facts={facts}
      capabilities={<CapabilitySummary kind={part.kind} capabilities={part.capabilities} />}
      setups={setups
        .filter((s) => s.parts.some((p) => p.id === part.id))
        .map((s) => ({ id: s.id, name: setupLabel(s, setups, list), current: s.current }))}
    />
  );
}
