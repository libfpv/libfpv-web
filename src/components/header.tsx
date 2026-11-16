"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { links } from "@/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GithubIcon, PatreonIcon } from "@/components/icons";
import ThemeToggle from "@/components/theme-toggle";
import StarCount from "@/components/star-count";

const nav = [
  { href: "#games", label: "Games" },
  { href: "#features", label: "Features" },
  { href: "#modders", label: "For modders" },
  { href: "#support", label: "Support" },
];

export default function Header({ stars }: { stars: number | null }) {
  // Over the hero the header floats transparent on the video; it gets its
  // blurred background once the page scrolls.
  const [scrolled, setScrolled] = useState(false);

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
        <a href="#top" className={cn(
            "flex items-center transition-opacity duration-300",
            !scrolled && "pointer-events-none opacity-0",
          )}
          aria-label="libfpv home"
          aria-hidden={!scrolled}
          tabIndex={scrolled ? undefined : -1}>
          <Image
            src="/libfpv-logo.svg"
            alt="libfpv"
            width={132}
            height={20}
            className="h-5 w-auto [image-rendering:pixelated] dark:drop-shadow-[0_0_0.5rem_rgba(255,255,255,0.25)]"
            priority
          />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                scrolled
                  ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={cn("flex items-center gap-1", !scrolled && "text-white")}>
          <Button
            asChild
            variant="ghost"
            aria-label="libfpv on GitHub"
            className={cn("h-10 gap-1.5 px-3", !scrolled && "hover:bg-white/10 hover:text-white")}
          >
            <a href={links.github} target="_blank" rel="noreferrer">
              <GithubIcon className="size-5" />
              <StarCount stars={stars} className={cn("ml-0", !scrolled && "bg-white/15")} />
            </a>
          </Button>
          <div className={cn(!scrolled && "[&_button:hover]:bg-white/10 [&_button:hover]:text-white")}>
            <ThemeToggle />
          </div>
          <Button asChild variant="patreon" size="sm" className="ml-1 hidden sm:inline-flex">
            <a href={links.patreon} target="_blank" rel="noreferrer">
              <PatreonIcon />
              Support
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
