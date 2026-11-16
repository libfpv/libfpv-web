import { ArrowUpRight, Check, Plus, Youtube } from "lucide-react";

import { links } from "@/config";
import { games, type Game } from "@/data/games";
import { cn } from "@/lib/utils";
import Reveal from "@/components/reveal";
import GameVideo from "@/components/game-video";
import { Button } from "@/components/ui/button";
import { GithubIcon, PatreonIcon } from "@/components/icons";
import SectionHeading from "@/components/section-heading";
import WebBuild from "@/components/web-build";

function Screen({ game }: { game: Game }) {
  return (
    <div className="group relative">
      <div className="glow-blob inset-x-8 -bottom-6 top-6 opacity-60 dark:opacity-80" />
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
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

function GameRow({ game, index }: { game: Game; index: number }) {
  const flipped = index % 2 === 1;
  return (
    <article id={`game-${game.id}`} className="scroll-mt-24">
      <div className={cn("grid items-center gap-8 lg:grid-cols-2 lg:gap-16")}>
        <Reveal className={cn(flipped && "lg:order-2")}>
          {game.webBuild ? (
            <WebBuild url={game.webBuild} title={game.title}>
              <Screen game={game} />
            </WebBuild>
          ) : (
            <Screen game={game} />
          )}
        </Reveal>

        <Reveal delay={120} className={cn(flipped && "lg:order-1")}>
          <div className="flex flex-wrap items-center gap-2">
            {game.platforms.map((p) => (
              <span key={p} className="rounded-full border px-3 py-0.5 text-xs font-medium text-muted-foreground">
                {p}
              </span>
            ))}
            <span
              className={cn(
                "rounded-full px-3 py-0.5 text-xs font-semibold",
                game.status === "playable"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "bg-bf/15 text-amber-700 dark:text-bf",
              )}
            >
              {game.status === "playable" ? "Playable" : "In development"}
            </span>
          </div>

          <h3 className="mt-4 text-3xl font-extrabold tracking-tight lg:text-4xl">{game.title}</h3>
          <p className="mt-1 text-lg font-medium text-bf">{game.subtitle}</p>
          <p className="mt-4 leading-7 text-muted-foreground">{game.pitch}</p>

          <ul className="mt-5 space-y-2.5">
            {game.highlights.map((h) => (
              <li key={h} className="flex gap-3 leading-6">
                <Check className="mt-0.5 size-5 shrink-0 text-bf" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="default">
              <a href={game.repo} target="_blank" rel="noreferrer">
                <GithubIcon className="size-4" />
                Get {game.repoName}
                <ArrowUpRight />
              </a>
            </Button>
            {game.video && (
              <Button asChild variant="outline">
                <a href={game.video} target="_blank" rel="noreferrer">
                  <Youtube />
                  Watch the video
                </a>
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </article>
  );
}

function NextGame() {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-3xl border border-dashed p-8 text-center sm:p-12">
        <div className="glow-blob left-1/2 top-0 h-48 w-2/3 -translate-x-1/2 opacity-70" />
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border bg-card">
          <Plus className="size-7" />
        </div>
        <h3 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl">Your game next?</h3>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Every game here is a mod built on libfpv, and the list keeps growing. Patrons get a place in the
          priority queue for picking which game gets a drone next, and they play it first.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="patreon">
            <a href={links.patreon} target="_blank" rel="noreferrer">
              <PatreonIcon />
              Request a game on Patreon
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="#modders">Or mod it yourself</a>
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

export default function Games() {
  return (
    <section id="games" className="relative scroll-mt-16 py-24 lg:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Compatible games"
          title={
            <>
              {games.length} games. <span className="text-muted-foreground">One real quad.</span>
            </>
          }
          description="The same libfpv drone, with the same Betaflight tune, flies in every one of them. Each mod hooks the game's own world: its collisions, its people, its weather and its police."
        />

        <div className="mt-16 space-y-24 lg:mt-24 lg:space-y-36">
          {games.map((g, i) => (
            <GameRow key={g.id} game={g} index={i} />
          ))}
          <NextGame />
        </div>
      </div>
    </section>
  );
}
