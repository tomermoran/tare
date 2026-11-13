import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { personaLabel } from "@/domain/personaLabel";
import { LOG_PATH } from "@/lib/logRoutes";
import { PROFILE_PATH } from "@/lib/profileRoutes";
import { getProfile } from "@/server/dal/profile";
import { getSetupProgress } from "@/server/dal/progress";
import { unlessSignedOut } from "@/server/dal/scope";
import { FirstRun } from "./FirstRun";

/**
 * Brew (SCR-HOME): the persona label, which opens Profile (STORY-01-01-03),
 * then the first-run checklist until the first shot (STORY-01-01-07).
 * Interim after that until EPIC-02-02 ships; TASK-02-02-01-FE1 keeps the
 * label when it rebuilds Brew.
 */
export default async function BrewPage() {
  const t = await getTranslations();
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex min-h-8 items-center">
        <Suspense fallback={<span className="py-1.5 text-label text-ink-secondary">{t("profile.defaultName")}</span>}>
          <PersonaLink />
        </Suspense>
      </div>
      <Suspense>
        <BrewBody />
      </Suspense>
    </div>
  );
}

async function BrewBody() {
  const [t, progress] = await Promise.all([getTranslations(), unlessSignedOut(getSetupProgress())]);
  if (!progress) return null;
  if (!progress.hasShot) return <FirstRun progress={progress} />;
  return (
    <EmptyState title={t("home.interimTitle")} action={{ label: t("actions.logShot"), href: LOG_PATH }}>
      {t("home.interim")}
    </EmptyState>
  );
}

async function PersonaLink() {
  const [t, profile] = await Promise.all([getTranslations("profile"), unlessSignedOut(getProfile())]);
  return (
    <Link href={PROFILE_PATH} className="py-1.5 text-label text-ink-secondary hover:text-ink">
      {personaLabel({ name: profile?.name ?? null }, t("defaultName"))}
    </Link>
  );
}
