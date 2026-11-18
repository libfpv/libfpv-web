import { getRequestConfig } from "next-intl/server";

import { routing, type Locale } from "@/navigation";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as Locale)) locale = routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../dicts/${locale}.json`)).default,
  };
});
