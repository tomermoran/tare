import { useTranslations } from "next-intl";

// Placeholder until the first app screen. Phase 1 is the design system only.
export default function Home() {
  const t = useTranslations("app");
  return (
    <main className="flex flex-1 flex-col justify-center gap-4 px-8 py-24 max-w-2xl mx-auto w-full">
      <h1 className="text-display">{t("name")}</h1>
      <p className="text-body text-ink-secondary">{t("tagline")}</p>
    </main>
  );
}
