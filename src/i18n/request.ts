import { getRequestConfig } from "next-intl/server";
import { defaultLocale } from "./config";

// No locale routing yet: every request uses the default locale.
// Adding a language later means adding a messages file and picking the
// locale here (from a cookie, a header or a URL segment).
export default getRequestConfig(async () => {
  const locale = defaultLocale;
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
