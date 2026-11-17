import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { ProfileFlow } from "@/components/profile/ProfileFlow";
import { getAccountLink } from "@/server/dal/account";
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
  const [t, profile, account] = await Promise.all([getTranslations(), unlessSignedOut(getProfile()), unlessSignedOut(getAccountLink())]);
  if (!profile || !account) return null;
  return (
    <ProfileFlow
      backHref="/"
      initialName={profile.name ?? ""}
      linked={account.linked}
      linkLabel={t("profile.linkGoogle")}
      labels={{
        back: t("nav.brew"),
        title: t("profile.title"),
        name: t("profile.name"),
        nameHint: t("profile.nameHint", { role: t("profile.defaultName") }),
        save: t("profile.save"),
        saved: t("profile.saved"),
        saveFailed: t("profile.saveFailed"),
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
