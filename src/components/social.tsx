import { ArrowUpRight } from "lucide-react";

import { links } from "@/config";
import { cn } from "@/lib/utils";
import Reveal from "@/components/reveal";
import GameVideo from "@/components/game-video";
import SectionHeading from "@/components/section-heading";
import { InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/icons";

const channels = [
  {
    name: "YouTube",
    handle: "@hammerill",
    href: links.social.youtube,
    icon: YoutubeIcon,
    media: "gtasa",
    game: "GTA San Andreas",
    cta: "Subscribe",
    badge: "bg-[#FF0000]",
    glow: "shadow-[0_2rem_5rem_-2rem_rgba(255,0,0,0.45)]",
  },
  {
    name: "Instagram",
    handle: "@hammerill_",
    href: links.social.instagram,
    icon: InstagramIcon,
    media: "sm64",
    game: "Super Mario 64",
    cta: "Follow",
    badge: "bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5]",
    glow: "shadow-[0_2rem_5rem_-2rem_rgba(214,41,118,0.5)]",
  },
  {
    name: "TikTok",
    handle: "@hammerill_",
    href: links.social.tiktok,
    icon: TiktokIcon,
    media: "portal2",
    game: "Portal 2",
    cta: "Follow",
    badge: "bg-black ring-1 ring-white/20 [box-shadow:-2px_-2px_0_#25F4EE,2px_2px_0_#FE2C55]",
    glow: "shadow-[0_2rem_5rem_-2rem_rgba(37,244,238,0.4)]",
  },
];

export default function Social() {
  return (
    <section id="social" className="relative scroll-mt-16 overflow-hidden py-24 lg:py-32">
      <div className="glow-blob left-1/2 top-40 h-[30rem] w-[50rem] -translate-x-1/2 opacity-60" />
      <div className="container">
        <SectionHeading
          eyebrow="Watch the flights"
          title="Short clips from every game."
          description="New mods, new tricks, and a lot of crashes into famous buildings. Short videos of libfpv in games go up on YouTube, Instagram and TikTok first."
        />

        <div className="-mx-4 mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[15%] pb-8 pt-8 [scrollbar-width:none] sm:mx-auto sm:grid sm:max-w-5xl sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:gap-10">
          {channels.map((c, i) => (
            <Reveal key={c.name} delay={i * 120} className={cn("w-[70%] shrink-0 snap-center sm:w-auto", i === 1 && "sm:-translate-y-6")}>
              <a href={c.href} target="_blank" rel="noreferrer" className="group block" aria-label={`${c.name}: ${c.handle}`}>
                {/* phone */}
                <div
                  className={cn(
                    "relative mx-auto aspect-[9/16] max-w-[17rem] overflow-hidden rounded-[2rem] border-[6px] border-neutral-900 bg-black transition duration-500 group-hover:-translate-y-2 dark:border-neutral-800",
                    c.glow,
                  )}
                >
                  <GameVideo media={c.media} title={c.game} className="transition duration-700 group-hover:scale-105" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />
                  <div aria-hidden className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />

                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <div className="flex items-center gap-2">
                      <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-full text-white", c.badge)}>
                        <c.icon className="size-[18px]" />
                      </div>
                      <div className="min-w-0 leading-tight">
                        <div className="truncate text-sm font-bold">{c.handle}</div>
                        <div className="truncate text-xs text-white/70">{c.game} · libfpv</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-white py-2 text-sm font-semibold text-black transition group-hover:bg-white/90">
                      <span className="whitespace-nowrap">
                        {c.cta}
                        <span className="hidden lg:inline"> on {c.name}</span>
                      </span>
                      <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
