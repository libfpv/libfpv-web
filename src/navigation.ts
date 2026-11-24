import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "fr", "uk"] as const;
export type Locale = (typeof locales)[number];

/** Names shown in the language switcher, each in its own language. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  uk: "Українська",
};

/**
 * The locale never shows in the URL: libfpv.com/ is the same link in every
 * language. The proxy (src/proxy.ts) picks the locale from the NEXT_LOCALE cookie
 * (set by the language switcher), then from Accept-Language, and rewrites
 * the request to /[locale] internally.
 */
export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "never",
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
