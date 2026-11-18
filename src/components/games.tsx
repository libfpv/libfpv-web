import { ArrowRight, ArrowUpRight, Check, Layers, Plus, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";

import { links } from "@/config";
import { games, type Game } from "@/data/games";
import { cn } from "@/lib/utils";
import Reveal from "@/components/reveal";
import { features } from "@/components/features";
import GameVideo from "@/components/game-video";
import { Button } from "@/components/ui/button";
import { GithubIcon, PatreonIcon } from "@/components/icons";
import SectionHeading from "@/components/section-heading";
import WebBuild from "@/components/web-build";
import { tags } from "@/lib/rich";

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

/**
 * Says outright that libfpv's features aren't this game's alone, and names the
 * ones this mod doesn't have yet, so the list above never reads as the whole story.
 */
function SharedFeatures({ game }: { game: Game }) {
  const t = useTranslations("games");
  const tf = useTranslations("features.items");
  const missing = features.filter((f) => f.pending?.includes(game.id));
  const names = missing.map((f) => tf(`${f.id}.pending`));
  return (
    <div className="mt-5 flex gap-3 rounded-xl border bg-card/50 p-4 text-sm leading-6">
      <Layers className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
      <p className="text-muted-foreground">
        {t.rich("shared", { ...tags, strong: (chunks) => <span className="font-medium text-foreground">{chunks}</span> })}{" "}
        {missing.length > 0 && <>{t.rich("missing", { ...tags, list: names.join(", ") })} </>}
        <a href="#features" className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline">
          {t("everyFeature")}
          <ArrowRight className="size-3.5" />
        </a>
      </p>
    </div>
  );
}

function GameRow({ game, index }: { game: Game; index: number }) {
  const t = useTranslations("games");
  const td = useTranslations(`gameData.${game.id}`);
  const flipped = index % 2 === 1;
  const highlights = td.raw("highlights") as string[];
  const steps = game.webSteps?.map((keys, i) => ({ keys, text: td(`steps.${i}`) }));
  return (
    <article id={`game-${game.id}`} className="scroll-mt-24">
      <div className={cn("grid items-center gap-8 lg:grid-cols-2 lg:gap-16")}>
        <Reveal className={cn(flipped && "lg:order-2")}>
          {game.webBuild ? (
            <WebBuild url={game.webBuild} title={game.title} steps={steps}>
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
                {t.has(`platforms.${p}`) ? t(`platforms.${p}`) : p}
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
              {game.status === "playable" ? t("playable") : t("inDevelopment")}
            </span>
          </div>

          <h3 className="mt-4 text-3xl font-extrabold tracking-tight lg:text-4xl">{game.title}</h3>
          <p className="mt-1 text-lg font-medium text-bf">{td.rich("subtitle", tags)}</p>
          <p className="mt-4 leading-7 text-muted-foreground">{td.rich("pitch", tags)}</p>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("brings", { game: game.short })}
          </p>
          <ul className="mt-3 space-y-2.5">
            {highlights.map((_, i) => (
              <li key={i} className="flex gap-3 leading-6">
                <Check className="mt-0.5 size-5 shrink-0 text-bf" />
                <span>{td.rich(`highlights.${i}`, tags)}</span>
              </li>
            ))}
          </ul>

          <SharedFeatures game={game} />

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="default">
              <a href={game.repo} target="_blank" rel="noreferrer">
                <GithubIcon className="size-4" />
                {t("get", { repo: game.repoName })}
                <ArrowUpRight />
              </a>
            </Button>
            {game.video && (
              <Button asChild variant="outline">
                <a href={game.video} target="_blank" rel="noreferrer">
                  <Youtube />
                  {t("watchVideo")}
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
  const t = useTranslations("games.next");
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-3xl border border-dashed p-8 text-center sm:p-12">
        <div className="glow-blob left-1/2 top-0 h-48 w-2/3 -translate-x-1/2 opacity-70" />
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border bg-card">
          <Plus className="size-7" />
        </div>
        <h3 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl">{t.rich("title", tags)}</h3>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {t.rich("body", tags)}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="patreon">
            <a href={links.patreon} target="_blank" rel="noreferrer">
              <PatreonIcon />
              {t("request")}
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="#modders">{t("modYourself")}</a>
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

export default function Games() {
  const t = useTranslations("games");
  return (
    <section id="games" className="relative scroll-mt-16 py-24 lg:py-32">
      <div className="container">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t.rich("title", {
            ...tags,
            count: games.length,
            muted: (chunks) => <span className="text-muted-foreground">{chunks}</span>,
          })}
          description={t.rich("description", tags)}
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
