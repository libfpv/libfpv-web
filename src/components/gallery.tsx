"use client";
/* eslint-disable @next/next/no-img-element -- small stills and YouTube thumbnails, shown as is */

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Expand, Play, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import GameVideo from "@/components/game-video";

export type GalleryItem =
  | { kind: "clip"; media: string }
  | { kind: "image"; src: string }
  | { kind: "youtube"; id: string };

function Thumb({ item, title }: { item: GalleryItem; title: string }) {
  if (item.kind === "clip") return <GameVideo media={item.media} title={title} />;
  if (item.kind === "image") return <img src={item.src} alt="" loading="lazy" className="h-full w-full object-cover" />;
  return (
    <>
      <img src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-white text-black shadow-2xl transition duration-300 group-hover:scale-110">
          <Play className="ml-0.5 size-6 fill-current" />
        </span>
      </span>
    </>
  );
}

function Full({ item, label }: { item: GalleryItem; label: string }) {
  if (item.kind === "clip")
    return (
      <video className="h-full w-full object-contain" autoPlay muted loop playsInline poster={`/games/${item.media}.jpg`} aria-label={label}>
        <source src={`/games/${item.media}.webm`} type="video/webm" />
        <source src={`/games/${item.media}.mp4`} type="video/mp4" />
      </video>
    );
  if (item.kind === "image") return <img src={item.src} alt={label} className="h-full w-full object-contain" />;
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0`}
      title={label}
      className="h-full w-full"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
    />
  );
}

/**
 * The game's clip, video and stills in a grid; any of them opens full size,
 * with arrow keys and Escape. The clip leads, larger than the rest.
 */
/**
 * `aspect` is the shape of the game's clip and stills (Game.aspect): the tiles
 * and the full-size view take it, so nothing is cropped. YouTube stays 16:9.
 */
export default function Gallery({ items, game, aspect = 16 / 9 }: { items: GalleryItem[]; game: string; aspect?: number }) {
  const t = useTranslations("gallery");
  const [open, setOpen] = useState<number | null>(null);
  const hasVideo = items.some((x) => x.kind === "youtube");

  const label = (item: GalleryItem, i: number) =>
    item.kind === "clip"
      ? t("clip", { game })
      : item.kind === "youtube"
        ? t("video", { game })
        : t("still", { game, n: items.slice(0, i + 1).filter((x) => x.kind === "image").length });

  const step = useCallback(
    (d: number) => setOpen((o) => (o === null ? o : (o + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, step]);

  return (
    <div style={{ "--media-aspect": aspect } as CSSProperties}>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={t("open", { item: label(item, i) })}
            className={cn(
              "group relative overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-black/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl dark:ring-white/10",
              // The clip leads at double size. With a video next to it, both
              // take a half row each, and the stills line up below.
              i === 0 && (hasVideo ? "col-span-2" : "col-span-2 lg:row-span-2 lg:aspect-auto lg:h-full"),
              item.kind === "youtube" ? "col-span-2 aspect-video" : "aspect-[var(--media-aspect)]",
            )}
          >
            <Thumb item={item} title={game} />
            <span aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-25" />
            <span aria-hidden className="vignette pointer-events-none absolute inset-0 opacity-40" />
            {item.kind !== "youtube" && (
              <span className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                <Expand className="size-4" />
              </span>
            )}
            <span aria-hidden className="osd-text pointer-events-none absolute bottom-1.5 left-2.5 text-base sm:text-lg">
              {item.kind === "clip" ? "● LIVE" : item.kind === "youtube" ? "VIDEO" : `IMG ${String(i).padStart(2, "0")}`}
            </span>
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("dialog", { game })}
          className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white backdrop-blur-sm animate-in fade-in-0"
          onClick={() => setOpen(null)}
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <span className="osd-text text-xl">
              {game} · {open + 1}/{items.length}
            </span>
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label={t("close")}
              className="flex size-10 items-center justify-center rounded-full transition hover:bg-white/10"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
            <div
              className={cn(
                "max-h-full w-full max-w-5xl overflow-hidden rounded-xl bg-black",
                items[open].kind === "youtube" ? "aspect-video" : "aspect-[var(--media-aspect)]",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Full key={open} item={items[open]} label={label(items[open], open)} />
            </div>
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label={t("prev")}
                  className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 sm:left-5"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label={t("next")}
                  className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 sm:right-5"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
