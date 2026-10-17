import type messages from "./messages/en.json";
import type { Locale } from "./config";

// Makes message keys type-checked: t("app.nmae") is a compile error.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
