import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { ProfileFlow } from "@/components/profile/ProfileFlow";
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
  const [t, profile] = await Promise.all([getTranslations(), unlessSignedOut(getProfile())]);
  if (!profile) return null;
  return (
    <ProfileFlow
      backHref="/"
      initialName={profile.name ?? ""}
      labels={{
        back: t("nav.brew"),
        title: t("profile.title"),
        name: t("profile.name"),
        nameHint: t("profile.nameHint", { role: t("profile.defaultName") }),
        save: t("profile.save"),
        saved: t("profile.saved"),
        saveFailed: t("profile.saveFailed"),
        deviceTitle: t("profile.deviceTitle"),
        device: t("profile.device"),
        about: t("profile.about"),
        appName: t("app.name"),
        version: t("profile.version", { version: pkg.version }),
      }}
    />
  );
}
