import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { mediaAspect, type Game } from "@/data/games";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";
import { tags } from "@/lib/rich";
import GameCounters from "@/components/game-counters";
import GameVideo from "@/components/game-video";

/** A game's clip in a goggle frame: channel, LIVE and the mod's name on the OSD. */
export function Screen({ game, className }: { game: Game; className?: string }) {
  return (
    <div className={cn("group relative", className)}>
      <div className="glow-blob inset-x-8 -bottom-6 top-6 opacity-60 dark:opacity-80" />
      <div
        className="relative overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-black/10 dark:ring-white/10"
        style={{ aspectRatio: mediaAspect(game) }}
      >
        <GameVideo media={game.media} title={game.title} className="transition duration-700 group-hover:scale-[1.03]" />
        <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-30" />
        <div aria-hidden className="vignette pointer-events-none absolute inset-0 opacity-50" />
        <div aria-hidden className="osd-text pointer-events-none absolute left-3 top-2 text-lg sm:text-xl">
          CH {game.channel}
        </div>
        <div aria-hidden className="osd-text pointer-events-none absolute right-3 top-2 text-lg sm:text-xl">
          <span className="animate-blink text-red-400">●</span> LIVE
        </div>
        <div aria-hidden className="osd-text pointer-events-none absolute bottom-2 left-3 text-lg sm:text-xl">
          {game.repoName}
        </div>
      </div>
    </div>
  );
}

/** "Playable" / "In development". */
export function StatusBadge({ game, className }: { game: Game; className?: string }) {
  const t = useTranslations("games");
  return (
    <span
      className={cn(
        "rounded-full px-3 py-0.5 text-xs font-semibold",
        game.status === "playable"
          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
          : "bg-bf/15 text-amber-700 dark:text-bf",
        className,
      )}
    >
      {game.status === "playable" ? t("playable") : t("inDevelopment")}
    </span>
  );
}

/** Translated platform name ("Web" → "Веб"), or the name as is. */
export function usePlatformName() {
  const t = useTranslations("games");
  return (p: string) => (t.has(`platforms.${p}`) ? t(`platforms.${p}`) : p);
}

/** The platform pills and the status badge. `dark` is for pills over a video. */
export function GameTags({ game, dark, className }: { game: Game; dark?: boolean; className?: string }) {
  const platform = usePlatformName();
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {game.platforms.map((p) => (
        <span
          key={p}
          className={cn(
            "rounded-full border px-3 py-0.5 text-xs font-medium",
            dark ? "border-white/25 bg-black/30 text-white/80" : "text-muted-foreground",
          )}
        >
          {platform(p)}
        </span>
      ))}
      <StatusBadge game={game} className={cn(dark && game.status === "playable" && "text-emerald-300")} />
    </div>
  );
}

/**
 * The goggles behind a page's hero: a blurred game feed (or none), scanlines,
 * analog noise and a vignette, like the home page's hero but calmer.
 */
export function FeedBackdrop({ media }: { media?: string }) {
  return (
    <>
      {media && (
        <div className="absolute inset-0 -z-20">
          <video
            className="h-full w-full scale-105 object-cover opacity-45 blur-[3px] saturate-[1.15]"
            autoPlay
            muted
            loop
            playsInline
            poster={`/games/${media}.jpg`}
          >
            <source src={`/games/${media}.webm`} type="video/webm" />
            <source src={`/games/${media}.mp4`} type="video/mp4" />
          </video>
        </div>
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
        <div className="scanlines absolute inset-0 opacity-60" />
        <div className="noise absolute -inset-[10%] animate-noise-shift opacity-[0.06] mix-blend-screen" />
        <div className="absolute left-1/2 top-1/3 h-80 w-[48rem] max-w-full -translate-x-1/2 rounded-full bg-blue-900/40 blur-3xl" />
        <div className="vignette absolute inset-0" />
      </div>
    </>
  );
}

/** A game in a list: its clip, name, tagline and platforms, linking to its page. */
export function GameCard({ game, className }: { game: Game; className?: string }) {
  const td = useTranslations(`gameData.${game.id}`);
  // The card is 16:9 so the cards line up; a narrower clip isn't cropped to fit.
  const narrow = mediaAspect(game) < 16 / 9 - 0.01;
  return (
    <Link
      href={`/games/${game.id}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border bg-card/70 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:border-white/20",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        {narrow && (
          // The whole clip, pillarboxed over a blurred, darkened fill of itself.
          // eslint-disable-next-line @next/next/no-img-element -- a small poster, blurred
          <img
            src={`/games/${game.media}.jpg`}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-xl"
          />
        )}
        <GameVideo
          media={game.media}
          title={game.title}
          className={cn("relative transition duration-700 group-hover:scale-[1.04]", narrow && "object-contain")}
        />
        <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-30" />
        <div aria-hidden className="vignette pointer-events-none absolute inset-0 opacity-50" />
        <div aria-hidden className="osd-text pointer-events-none absolute left-3 top-2 text-lg">CH {game.channel}</div>
        <div aria-hidden className="osd-text pointer-events-none absolute bottom-2 left-3 text-lg">{game.repoName}</div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">{game.title}</h3>
            <p className="mt-0.5 text-sm font-medium text-bf">{td.rich("subtitle", tags)}</p>
          </div>
          <ArrowRight className="mt-1.5 size-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
          <GameTags game={game} />
          <GameCounters id={game.id} />
        </div>
      </div>
    </Link>
  );
}
