"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

/** A muted looping clip that only plays while it is on screen. */
export default function GameVideo({ media, title, className }: { media: string; title: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const t = useTranslations("games");

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      muted
      loop
      playsInline
      preload="metadata"
      poster={`/games/${media}.jpg`}
      aria-label={t("clip", { game: title })}
    >
      <source src={`/games/${media}.webm`} type="video/webm" />
      <source src={`/games/${media}.mp4`} type="video/mp4" />
    </video>
  );
}
