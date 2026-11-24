import { ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, Download, Gamepad2, Globe, Keyboard, ListChecks, Youtube } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { links } from "@/config";
import { games, mediaAspect, type Game } from "@/data/games";
import { Link } from "@/navigation";
import { cn, youtubeId } from "@/lib/utils";
import { tags } from "@/lib/rich";
import { buildNumber, formatSize, type Release } from "@/lib/releases";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { featuresFor } from "@/components/features";
import { FeedBackdrop, GameCard, GameTags, Screen, usePlatformName } from "@/components/game-bits";
import Gallery, { type GalleryItem } from "@/components/gallery";
import GameCounters, { DownloadLink, FileDownloads } from "@/components/game-counters";
import WebBuild from "@/components/web-build";
import { Button } from "@/components/ui/button";
import { GithubIcon, PatreonIcon } from "@/components/icons";

/** The libfpv features that apply to this game, and how many its mod has already. */
function featureSplit(game: Game) {
  const list = featuresFor(game);
  const missing = list.filter((f) => f.pending?.includes(game.id));
  return { list, missing, have: list.length - missing.length, total: list.length };
}

function Hero({ game, release }: { game: Game; release: Release | null }) {
  const t = useTranslations("gamePage");
  const tg = useTranslations("games");
  const td = useTranslations(`gameData.${game.id}`);
  return (
    <section id="top" className="relative isolate overflow-hidden bg-black text-white">
      <FeedBackdrop media={game.media} />
      <div className="container grid items-center gap-12 pb-16 pt-28 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-36">
        <div>
          <nav aria-label={t("breadcrumb")} className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-white/60">
            <Link href="/games" className="transition hover:text-white">
              {t("allGames")}
            </Link>
            <ChevronRight className="size-4" aria-hidden />
            <span className="text-white/90" aria-current="page">
              {game.short}
            </span>
          </nav>

          <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{game.title}</h1>
          <p className="mt-2 text-xl font-medium text-amber-300">{td.rich("subtitle", tags)}</p>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">{td.rich("pitch", tags)}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <GameTags game={game} dark />
            <GameCounters id={game.id} view dark />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {release ? (
              <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                <a href="#download">
                  <Download />
                  {t("downloadButton")}
                </a>
              </Button>
            ) : (
              game.webBuild && (
                <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                  <a href="#play">
                    <Globe />
                    {t("playBrowser")}
                  </a>
                </Button>
              )
            )}
            {release && game.webBuild && (
              <Button asChild size="lg" variant="glass">
                <a href="#play">
                  <Globe />
                  {t("playBrowser")}
                </a>
              </Button>
            )}
            {game.video && (
              <Button asChild size="lg" variant="glass">
                <a href={game.video} target="_blank" rel="noreferrer">
                  <Youtube />
                  {tg("watchVideo")}
                </a>
              </Button>
            )}
            {game.repo ? (
              <Button asChild size="lg" variant="glass">
                <a href={game.repo} target="_blank" rel="noreferrer">
                  <GithubIcon className="size-5" />
                  {t("source")}
                </a>
              </Button>
            ) : (
              release?.hosted && (
                <Button asChild size="lg" variant="glass">
                  <Link href={release.page}>
                    <BookOpen />
                    {t("download.guide")}
                  </Link>
                </Button>
              )
            )}
          </div>
        </div>

        <Reveal delay={120}>
          <Screen game={game} />
        </Reveal>
      </div>
    </section>
  );
}

function Stats({ game, release }: { game: Game; release: Release | null }) {
  const t = useTranslations("gamePage.stats");
  const locale = useLocale();
  const { have, total } = featureSplit(game);
  const date = release?.date
    ? new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" }).format(new Date(release.date))
    : null;

  // Values are drawn in the OSD font, which has no Cyrillic: keep them to
  // digits and Latin (a numeric date, no month names).
  const stats = [
    release?.tag
      ? { value: `#${buildNumber(release.tag)}`, label: t("build") }
      : game.webBuild
        ? { value: "WASM", label: t("web") }
        : { value: "SRC", label: t("source") },
    date ? { value: date, label: t("updated") } : { value: `#${games.indexOf(game) + 1}`, label: t("number", { count: games.length }) },
    { value: `${have}/${total}`, label: t("features") },
    { value: "BF 2025.12", label: t("betaflight") },
  ];

  return (
    <section className="relative border-y bg-card/40">
      <div className="container grid grid-cols-2 divide-border py-8 md:grid-cols-4 md:divide-x">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="px-4 py-3 text-center">
            <div className="font-osd text-4xl uppercase tracking-wide">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Play({ game }: { game: Game }) {
  const t = useTranslations("gamePage.play");
  const td = useTranslations(`gameData.${game.id}`);
  if (!game.webBuild) return null;
  const steps = game.webSteps?.map((keys, i) => ({ keys, text: td(`steps.${i}`) }));
  return (
    <section id="play" className="relative scroll-mt-16 py-20 lg:py-28">
      <div className="container">
        <SectionHeading eyebrow={t("eyebrow")} title={t.rich("title", tags)} description={t.rich("description", tags)} />
        <Reveal className="mx-auto mt-12 max-w-4xl">
          <WebBuild url={game.webBuild} title={game.title} steps={steps}>
            <Screen game={game} />
          </WebBuild>
        </Reveal>
      </div>
    </section>
  );
}

function World({ game }: { game: Game }) {
  const t = useTranslations("gamePage.world");
  const td = useTranslations(`gameData.${game.id}`);
  const highlights = td.raw("highlights") as string[];
  return (
    <section className={cn("relative py-20 lg:py-28", !game.webBuild && "pt-24 lg:pt-32")}>
      <div className="container">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t.rich("title", { ...tags, game: game.short })}
          description={t.rich("description", { ...tags, game: game.short })}
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2">
          {highlights.map((_, i) => (
            <Reveal key={i} delay={(i % 2) * 80}>
              <div className="flex h-full gap-4 rounded-2xl border bg-card/70 p-5 shadow-sm backdrop-blur">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background">
                  <Check className="size-5 text-bf" />
                </div>
                <p className="leading-7">{td.rich(`highlights.${i}`, tags)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features({ game }: { game: Game }) {
  const t = useTranslations("gamePage.features");
  const tf = useTranslations("features.items");
  const { list, have, total } = featureSplit(game);
  return (
    <section className="relative overflow-hidden border-y bg-card/40 py-20 lg:py-28">
      <div className="glow-blob left-[-10%] top-10 h-[26rem] w-[26rem] opacity-50" />
      <div className="container">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t.rich("title", tags)}
          description={t.rich(have === total ? "descriptionAll" : "description", {
            ...tags,
            have,
            total,
            game: game.short,
          })}
        />
        <div className="mx-auto mt-12 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((f, i) => {
            const pending = f.pending?.includes(game.id);
            return (
              <Reveal key={f.id} delay={(i % 3) * 60}>
                <div
                  className={cn(
                    "flex h-full items-center gap-3 rounded-xl border bg-background/70 p-3.5",
                    pending && "border-dashed bg-transparent",
                  )}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-card">
                    <f.icon className={cn("size-4", pending ? "text-muted-foreground" : "text-bf")} />
                  </div>
                  <span className={cn("min-w-0 flex-1 text-sm font-semibold leading-5", pending && "text-muted-foreground")}>
                    {tf.rich(`${f.id}.title`, tags)}
                  </span>
                  {pending ? (
                    <span className="shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {t("notYet")}
                    </span>
                  ) : (
                    <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label={t("included")} />
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/#features"
            className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
          >
            {t("every")}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function GallerySection({ game }: { game: Game }) {
  const t = useTranslations("gamePage.gallery");
  const yt = game.video ? youtubeId(game.video) : null;
  const items: GalleryItem[] = [
    { kind: "clip", media: game.media },
    ...(yt ? [{ kind: "youtube" as const, id: yt }] : []),
    ...(game.gallery ?? []).map((f) => ({ kind: "image" as const, src: `/gallery/${game.id}/${f}` })),
  ];
  return (
    <section id="gallery" className="relative scroll-mt-16 py-20 lg:py-28">
      <div className="container">
        <SectionHeading eyebrow={t("eyebrow")} title={t.rich("title", tags)} />
        <Reveal className="mx-auto mt-12 max-w-6xl">
          <Gallery items={items} game={game.title} aspect={mediaAspect(game)} />
        </Reveal>
      </div>
    </section>
  );
}

function DownloadCard({ game, release }: { game: Game; release: Release | null }) {
  const t = useTranslations("gamePage.download");
  const locale = useLocale();
  const platform = usePlatformName();

  if (!release && game.hosted) {
    return (
      <div className="relative h-full overflow-hidden rounded-[2rem] border bg-card p-8 shadow-xl sm:p-10">
        <div className="glow-blob -right-20 -top-20 h-72 w-72 opacity-70" />
        <div className="flex size-12 items-center justify-center rounded-2xl border bg-background">
          <Download className="size-6" />
        </div>
        <h3 className="mt-5 text-2xl font-extrabold tracking-tight">{t.rich("pendingTitle", tags)}</h3>
        <p className="mt-3 leading-7 text-muted-foreground">{t.rich("pendingBody", tags)}</p>
      </div>
    );
  }

  if (!release) {
    return (
      <div className="relative h-full overflow-hidden rounded-[2rem] border bg-card p-8 shadow-xl sm:p-10">
        <div className="glow-blob -right-20 -top-20 h-72 w-72 opacity-70" />
        <div className="flex size-12 items-center justify-center rounded-2xl border bg-background">
          <GithubIcon className="size-6" />
        </div>
        <h3 className="mt-5 text-2xl font-extrabold tracking-tight">{t.rich("sourceTitle", tags)}</h3>
        <p className="mt-3 leading-7 text-muted-foreground">{t.rich("sourceBody", tags)}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          {game.webBuild && (
            <Button asChild size="lg">
              <a href="#play">
                <Globe />
                {t("playBrowser")}
              </a>
            </Button>
          )}
          <Button asChild size="lg" variant="outline">
            <a href={`${game.repo}#building`} target="_blank" rel="noreferrer">
              <BookOpen />
              {t("buildSource")}
              <ArrowUpRight />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const date = release.date
    ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(release.date))
    : null;

  return (
    <div className="relative h-full overflow-hidden rounded-[2rem] border bg-card p-8 shadow-xl sm:p-10">
      <div className="glow-blob -right-20 -top-20 h-72 w-72 opacity-70" />
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-bf text-bf-foreground">
          <Download className="size-6" />
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">
            {release.tag ? t("build", { n: buildNumber(release.tag) }) : t("latest")}
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight">{game.repoName}</h3>
        </div>
        {date && (
          <span className="ml-auto rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
            {t("published", { date })}
          </span>
        )}
      </div>

      <div className="mt-8 grid gap-3">
        {release.files.map((f) => (
          <DownloadLink
            key={f.file}
            id={game.id}
            file={f.file}
            href={f.url}
            className="group flex items-center gap-4 rounded-2xl border bg-background p-4 transition hover:-translate-y-0.5 hover:border-bf/60 hover:shadow-lg"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-card">
              <Download className="size-5 text-bf transition group-hover:translate-y-0.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{t("for", { platform: platform(f.platform) })}</div>
              <div className="truncate font-mono text-xs text-muted-foreground">
                {f.file}
                {f.size !== undefined && ` · ${formatSize(locale, f.size)}`}
              </div>
              {f.sha256 && (
                <div className="truncate font-mono text-[11px] text-muted-foreground/80" title={f.sha256}>
                  SHA-256 {f.sha256}
                </div>
              )}
            </div>
            <FileDownloads id={game.id} file={f.file} className="shrink-0" />
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
          </DownloadLink>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="default">
          {release.hosted ? (
            <Link href={release.page}>
              <BookOpen />
              {t("guide")}
              <ArrowRight />
            </Link>
          ) : (
            <a href={release.page} target="_blank" rel="noreferrer">
              <BookOpen />
              {t("guide")}
              <ArrowUpRight />
            </a>
          )}
        </Button>
        {release.all && (
          <Button asChild variant="outline">
            <a href={release.all} target="_blank" rel="noreferrer">
              {t("all")}
            </a>
          </Button>
        )}
      </div>

      <p className="mt-6 text-sm leading-6 text-muted-foreground">{t.rich(release.hosted ? "noteHosted" : "note", tags)}</p>
    </div>
  );
}

function Requirements({ game }: { game: Game }) {
  const t = useTranslations("gamePage.download");
  const td = useTranslations(`gameData.${game.id}`);
  const reqs = td.raw("requirements") as string[];
  return (
    <div className="h-full rounded-[2rem] border bg-background/60 p-8 sm:p-10">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl border bg-card">
          <ListChecks className="size-5 text-bf" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">{t("needs")}</h3>
      </div>
      <ul className="mt-6 space-y-3.5">
        {reqs.map((_, i) => (
          <li key={i} className="flex gap-3 leading-6">
            <Check className="mt-0.5 size-5 shrink-0 text-bf" />
            <span>{td.rich(`requirements.${i}`, tags)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex gap-3 rounded-xl border bg-card/60 p-4 text-sm leading-6">
        <PatreonIcon className="mt-0.5 size-4 shrink-0 text-patreon" />
        <p className="text-muted-foreground">
          {t.rich(game.kamikaze === false ? "patreonNoKamikaze" : "patreon", { ...tags, game: game.short })}{" "}
          <a href={links.patreon} target="_blank" rel="noreferrer" className="font-medium text-foreground underline-offset-4 hover:underline">
            Patreon
          </a>
        </p>
      </div>
    </div>
  );
}

function Controls({ game }: { game: Game }) {
  const t = useTranslations("gamePage.controls");
  const tw = useTranslations("webBuild");
  return (
    <div className="rounded-[2rem] border bg-background/60 p-8 sm:p-10">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl border bg-card">
          <Keyboard className="size-5 text-bf" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">{t("title")}</h3>
      </div>
      <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {game.controls.map((c) => {
          const launch = c.keys.includes("F7");
          return (
            <div key={c.action} className="flex items-center gap-3">
              <dt className="flex w-24 shrink-0 flex-wrap gap-1">
                {c.keys.map((k) => (
                  <kbd
                    key={k}
                    className={cn(
                      "rounded-md border px-2 py-0.5 font-mono text-xs text-foreground shadow-[0_2px_0_hsl(var(--border))]",
                      launch ? "border-bf/60 bg-bf/15 font-bold" : "bg-card font-semibold",
                    )}
                  >
                    {tw.has(`keys.${k}`) ? tw(`keys.${k}`) : k}
                  </kbd>
                ))}
              </dt>
              <dd className={cn("text-sm leading-6", launch ? "font-semibold" : "text-muted-foreground")}>
                {t.rich(`actions.${c.action}`, { ...tags, pilot: game.pilot })}
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="mt-6 flex gap-2 text-sm leading-6 text-muted-foreground">
        <Gamepad2 className="mt-0.5 size-4 shrink-0" />
        <span>{t.rich("radio", tags)}</span>
      </p>
    </div>
  );
}

function DownloadSection({ game, release }: { game: Game; release: Release | null }) {
  const t = useTranslations("gamePage.download");
  return (
    <section id="download" className="relative scroll-mt-16 overflow-hidden border-y bg-card/40 py-20 lg:py-28">
      <div className="glow-blob left-1/2 top-24 h-[30rem] w-[50rem] -translate-x-1/2 opacity-60" />
      <div className="container">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t.rich(release || game.hosted ? "title" : "titleSource", { ...tags, game: game.short })}
          description={t.rich(game.hosted ? "descriptionHosted" : "description", tags)}
        />
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <DownloadCard game={game} release={release} />
          </Reveal>
          <Reveal delay={120}>
            <Requirements game={game} />
          </Reveal>
          <Reveal className="lg:col-span-2">
            <Controls game={game} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MoreGames({ game }: { game: Game }) {
  const t = useTranslations("gamePage.more");
  // The next games on the dial, wrapping around: always the same three, in the games' order.
  const i = games.findIndex((g) => g.id === game.id);
  const others = [1, 2, 3].map((d) => games[(i + d) % games.length]).filter((g) => g.id !== game.id);
  return (
    <section className="relative py-20 lg:py-28">
      <div className="container">
        <SectionHeading eyebrow={t("eyebrow")} title={t.rich("title", tags)} />
        <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
          {others.map((g, j) => (
            <Reveal key={g.id} delay={j * 80}>
              <GameCard game={g} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/games">
              {t("all", { count: games.length })}
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function GamePage({ game, release }: { game: Game; release: Release | null }) {
  return (
    <>
      <Hero game={game} release={release} />
      <Stats game={game} release={release} />
      <Play game={game} />
      <World game={game} />
      <Features game={game} />
      <GallerySection game={game} />
      <DownloadSection game={game} release={release} />
      <MoreGames game={game} />
    </>
  );
}
