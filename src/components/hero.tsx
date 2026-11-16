"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, Play } from "lucide-react";

import { links } from "@/config";
import { games } from "@/data/games";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GithubIcon, PatreonIcon } from "@/components/icons";
import StarCount from "@/components/star-count";
import Osd, { SYM } from "@/components/osd";

const CYCLE_MS = 10000;
const STATIC_MS = 380;

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/**
 * The page opens as if you put the goggles on: a game's FPV feed full-screen,
 * analog noise, a Betaflight-style OSD around the edges. The feed hops
 * between games like switching VTX channels.
 */
export default function Hero({ stars }: { stars: number | null }) {
  const [idx, setIdx] = useState(0);
  const [staticBurst, setStaticBurst] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const switchTo = useCallback((next: number | "next") => {
    setStaticBurst(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setIdx((prev) => (next === "next" ? (prev + 1) % games.length : next));
      setTimeout(() => setStaticBurst(false), 90);
    }, STATIC_MS);
  }, []);

  // channel hopping
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => switchTo("next"), CYCLE_MS);
    return () => clearInterval(id);
  }, [switchTo]);

  // flight timer
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const current = games[idx];
  const start = current.heroStart ?? 0;

  // Clips with a heroStart skip their first seconds, also when they loop.
  const seekToStart = (v: HTMLVideoElement) => {
    if (start > 0 && v.currentTime < start) v.currentTime = start;
  };

  const volts = Math.max(13.8, 16.6 - seconds * 0.004).toFixed(1);
  const speed = 38 + Math.round(Math.sin(seconds / 2) * 14 + 14);
  const alt = 12 + Math.round(Math.cos(seconds / 3) * 6 + 6);

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-black text-white">
      {/* the feed */}
      <div className="absolute inset-0 -z-20">
        <video
          key={current.id}
          className="h-full w-full scale-105 object-cover opacity-70 blur-[1.5px] saturate-[1.15]"
          autoPlay
          muted
          loop={start === 0}
          playsInline
          onLoadedMetadata={(e) => seekToStart(e.currentTarget)}
          onEnded={(e) => {
            e.currentTarget.currentTime = start;
            void e.currentTarget.play();
          }}
          poster={`/games/${current.media}.jpg`}
        >
          <source src={`/games/${current.media}.webm`} type="video/webm" />
          <source src={`/games/${current.media}.mp4`} type="video/mp4" />
        </video>
      </div>

      {/* goggles: noise, scanlines, rolling line, vignette, darkening */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        <div className="scanlines absolute inset-0 opacity-60" />
        <div className="noise absolute -inset-[10%] animate-noise-shift opacity-[0.07] mix-blend-screen" />
        <div className="absolute inset-x-0 top-0 h-10 animate-roll-line bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
        <div className="vignette absolute inset-0" />
        <div
          className={cn(
            "noise absolute -inset-[10%] animate-noise-shift bg-[length:160px_160px] transition-opacity duration-100",
            staticBurst ? "opacity-90" : "opacity-0",
          )}
        />
        <div className={cn("absolute inset-0 bg-white/10 transition-opacity duration-100", staticBurst ? "opacity-100" : "opacity-0")} />
      </div>

      {/* OSD, drawn with Betaflight's own font */}
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none text-[18px] drop-shadow-[0_0_2px_rgba(0,0,0,0.6)] md:text-[27px] xl:text-[36px]">
        <div className="absolute left-4 top-20 flex flex-col gap-1 sm:left-8 lg:left-12">
          <Osd text={`${SYM.LINK_QUALITY}2:99`} />
          <Osd text={`${SYM.RSSI}98`} className="hidden sm:inline-flex" />
        </div>
        <div className="absolute left-1/2 top-20 flex -translate-x-1/2 items-center gap-[0.3em]">
          <span className="inline-block size-[0.5em] animate-blink rounded-full bg-red-500" />
          <Osd text={`REC ${SYM.FLY_M}${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`} />
        </div>
        <div className="absolute right-4 top-20 flex flex-col items-end gap-1 sm:right-8 lg:right-12">
          <Osd text={`${Number(volts) > 15 ? SYM.BATT_FULL : SYM.BATT_5}${volts}${SYM.VOLT}`} />
          <Osd text={`12.4${SYM.AMP}`} className="hidden sm:inline-flex" />
        </div>

        <Osd
          text={`${SYM.SPEED}${speed}${SYM.KPH}`}
          className="absolute left-4 top-1/2 hidden -translate-y-1/2 sm:left-8 md:inline-flex lg:left-12"
        />
        <Osd
          text={`${SYM.ALTITUDE}${alt}.4${SYM.M}`}
          className="absolute right-4 top-1/2 hidden -translate-y-1/2 sm:right-8 md:inline-flex lg:right-12"
        />

        <div className="absolute bottom-6 left-4 flex flex-col gap-1 sm:left-8 lg:left-12">
          <Osd text="ACRO" />
          <Osd text="BF 2025.12" className="hidden sm:inline-flex" />
        </div>
        <div className="absolute bottom-6 right-4 flex flex-col items-end gap-1 sm:right-8 lg:right-12">
          <Osd text={`${SYM.ARROW_NORTH_WEST}${SYM.HOMEFLAG}128${SYM.M}`} />
          <Osd text={`CH ${current.channel}`} className="hidden sm:inline-flex" />
        </div>
      </div>

      {/* title */}
      <div className="container relative flex flex-col items-center px-6 pb-24 pt-36 text-center sm:pt-28">
        <div
          className="relative mb-8 w-[min(72vw,26rem)]
          before:absolute before:inset-x-0 before:top-1/2 before:-z-10 before:h-40 before:-translate-y-1/2 before:rounded-full before:bg-gradient-radial before:from-blue-900/60 before:blur-2xl"
        >
          <Image
            src="/libfpv-logo.svg"
            alt="libfpv"
            width={528}
            height={80}
            priority
            className="h-auto w-full drop-shadow-[0_0_1.25rem_rgba(255,255,255,0.35)] [image-rendering:pixelated]"
          />
        </div>

        <h1 className="max-w-4xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
          FPV drone in{" "}
          <span className="bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">any game</span>
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-base text-white/80 sm:text-lg lg:text-xl">
          Real Betaflight firmware, your own radio, and the games you already love. libfpv drops a
          true-to-life quadcopter into Mario, GTA, Portal and more.{" "}
          <span className="font-semibold text-white">Free and open source.</span>
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
            <a href="#games">
              <Play className="fill-current" />
              Watch it fly
            </a>
          </Button>
          <Button asChild size="lg" variant="glass">
            <a href={links.github} target="_blank" rel="noreferrer">
              <GithubIcon className="size-5" />
              Source on GitHub
              <StarCount stars={stars} className="bg-white/15" />
            </a>
          </Button>
          <Button asChild size="lg" variant="patreon">
            <a href="#support">
              <PatreonIcon />
              Support on Patreon
            </a>
          </Button>
        </div>

        {/* channels */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Game feed">
          {games.map((g, i) => {
            const active = g.id === current.id;
            return (
              <button
                key={g.id}
                role="tab"
                aria-selected={active}
                onClick={() => !active && switchTo(i)}
                className={cn(
                  "rounded-full border px-3 py-1 font-osd text-base uppercase tracking-wider transition",
                  active ? "border-white bg-white text-black" : "border-white/25 bg-black/30 text-white/70 hover:border-white/60 hover:text-white",
                )}
              >
                {g.channel} · {g.title}
              </button>
            );
          })}
        </div>
      </div>

      <a
        href="#games"
        aria-label="Scroll to games"
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 animate-float text-white/60 transition hover:text-white sm:block md:bottom-8"
      >
        <ArrowDown className="size-6" />
      </a>

    </section>
  );
}

