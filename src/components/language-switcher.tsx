"use client";

import { useTransition } from "react";
import { Check, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { locales, localeNames, usePathname, useRouter, type Locale } from "@/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * The URL never carries the locale, so switching keeps the same link: the
 * router writes the NEXT_LOCALE cookie, then the page is re-rendered by the
 * server, whose middleware now picks the new locale from that cookie.
 */
export default function LanguageSwitcher() {
  const t = useTranslations("header");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next, scroll: false });
      router.refresh();
    });
  };

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("language")} disabled={pending}>
          <Languages />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-40 overflow-hidden rounded-xl border bg-card p-1 text-card-foreground shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          {locales.map((l) => (
            <DropdownMenu.Item
              key={l}
              lang={l}
              onSelect={() => switchTo(l)}
              className={cn(
                "flex cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
                l === locale && "font-semibold",
              )}
            >
              {localeNames[l]}
              {l === locale && <Check className="size-4 text-bf" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
