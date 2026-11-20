"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { links } from "@/config";
import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons";
import ThemeToggle from "@/components/theme-toggle";
import StarCount from "@/components/star-count";
import LanguageSwitcher from "@/components/language-switcher";

// Sections of the home page, reachable from every page. Off the home page,
// "Games" opens the games page instead of the home page's games section.
const nav = [
  { href: "/#games", away: "/games", label: "games" },
  { href: "/#features", label: "features" },
  { href: "/#modders", label: "modders" },
  { href: "/#support", label: "support" },
] as const;

export default function Header({ stars }: { stars: number | null }) {
  const t = useTranslations("header");
  const pathname = usePathname();
  const home = pathname === "/";
  // Every page opens on a dark hero: the header floats transparent on it and
  // gets its blurred background once the page scrolls. The home hero has the
  // big logo, so there the small one waits for the scroll too.
  const [scrolled, setScrolled] = useState(false);
  const showLogo = scrolled || !home;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300 print:hidden",
        scrolled ? "border-b bg-background/80 backdrop-blur-lg" : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href={home ? "/#top" : "/"}
          className={cn("flex items-center transition-opacity duration-300", !showLogo && "pointer-events-none opacity-0")}
          aria-label={t("home")}
          aria-hidden={!showLogo}
          tabIndex={showLogo ? undefined : -1}
        >
          <Image
            src="/libfpv-logo.svg"
            alt="libfpv"
            width={132}
            height={20}
            className="h-5 w-auto [image-rendering:pixelated] dark:drop-shadow-[0_0_0.5rem_rgba(255,255,255,0.25)]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const href = !home && "away" in item ? item.away : item.href;
            const active = href !== item.href && (pathname === href || pathname.startsWith(`${href}/`));
            return (
              <Link
                key={item.label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  scrolled
                    ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                  active && (scrolled ? "bg-accent text-foreground" : "bg-white/10 text-white"),
                )}
              >
                {t(item.label)}
              </Link>
            );
          })}
        </nav>

        <div className={cn("flex items-center gap-1", !scrolled && "text-white")}>
          <Button
            asChild
            variant="ghost"
            aria-label={t("github")}
            className={cn("h-10 gap-1.5 px-3", !scrolled && "hover:bg-white/10 hover:text-white")}
          >
            <a href={links.github} target="_blank" rel="noreferrer">
              <GithubIcon className="size-5" />
              <StarCount stars={stars} className={cn("ml-0", !scrolled && "bg-white/15")} />
            </a>
          </Button>
          <div className={cn("flex items-center gap-1", !scrolled && "[&_button:hover]:bg-white/10 [&_button:hover]:text-white")}>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
