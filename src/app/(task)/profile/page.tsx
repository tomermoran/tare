import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { ProfileFlow } from "@/components/profile/ProfileFlow";
import { DRINKS_PATH, MILKS_PATH, PEOPLE_PATH } from "@/lib/profileRoutes";
import { getAccountLink } from "@/server/dal/account";
import { getLeaveInfo } from "@/server/dal/leaving";
import { getListSummaries } from "@/server/dal/lists";
import { listPersonas } from "@/server/dal/persona";
import { getProfile } from "@/server/dal/profile";
import { unlessSignedOut } from "@/server/dal/scope";
import pkg from "../../../../package.json";

/** SCR-PROFILE, opened from the persona label on Brew (STORY-01-01-03). */
export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <Profile />
    </Suspense>
  );
}

async function Profile() {
  const [t, profile, account, lists, personas, leaveInfo] = await Promise.all([
    getTranslations(),
    unlessSignedOut(getProfile()),
    unlessSignedOut(getAccountLink()),
    unlessSignedOut(getListSummaries()),
    unlessSignedOut(listPersonas()),
    unlessSignedOut(getLeaveInfo()),
  ]);
  if (!profile || !account) return null;
  return (
    <ProfileFlow
      backHref="/"
      initialName={profile.name ?? ""}
      linked={account.linked}
      linkLabel={t("profile.linkGoogle")}
      lists={
        lists
          ? {
              drinks: { href: DRINKS_PATH, summary: t("profile.drinksSummary", lists.drinks) },
              milks: { href: MILKS_PATH, summary: t("profile.milksSummary", lists.milks) },
            }
          : undefined
      }
      leave={
        leaveInfo?.canLeave
          ? {
              row: t("leave.row"),
              onlyOwner: leaveInfo.onlyOwner,
              labels: {
                title: t("leave.title"),
                close: t("actions.close"),
                lines: [t("leave.staysBehind"), t("leave.startFresh"), t("leave.account"), t("leave.canReturn")],
                ownerNote: t("leave.ownerNote"),
                confirm: t("leave.confirm"),
                cancel: t("actions.cancel"),
                failed: t("leave.failed"),
                retry: t("actions.retry"),
                alone: t("leave.alone"),
              },
            }
          : undefined
      }
      people={personas ? { href: PEOPLE_PATH, summary: t("profile.peopleSummary", { count: personas.length }) } : undefined}
      labels={{
        back: t("nav.brew"),
        title: t("profile.title"),
        name: t("profile.name"),
        nameHint: t("profile.nameHint", { role: t("profile.defaultName") }),
        save: t("profile.save"),
        saved: t("profile.saved"),
        saveFailed: t("profile.saveFailed"),
        listsTitle: t("profile.listsTitle"),
        peopleTitle: t("profile.peopleTitle"),
        people: t("profile.people"),
        drinks: t("profile.drinks"),
        milks: t("profile.milks"),
        accountTitle: t("profile.accountTitle"),
        account: t("profile.account"),
        linked: t("profile.linked"),
        linkedBody: t("profile.linkedBody"),
        about: t("profile.about"),
        appName: t("app.name"),
        version: t("profile.version", { version: pkg.version }),
      }}
    />
  );
}
