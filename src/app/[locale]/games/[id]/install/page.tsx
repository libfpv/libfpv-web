import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronRight, Download } from "lucide-react";

import { games, getGame } from "@/data/games";
import { getInstallGuide } from "@/lib/downloads";
import { buildNumber, formatSize, getRelease } from "@/lib/releases";
import { getStars } from "@/lib/github";
import { plain } from "@/lib/rich";
import { Link } from "@/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Markdown from "@/components/markdown";
import { FeedBackdrop } from "@/components/game-bits";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string; id: string }> };

/**
 * /games/<id>/install: the install guide of a game whose downloads libfpv.com
 * hosts. The guide is the INSTALL.md its release pipeline uploaded with the
 * build (lib/downloads.ts), in English, read on every request.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return games.filter((g) => g.hosted).map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const game = getGame(id);
  if (!game?.hosted) return {};
  const t = await getTranslations({ locale, namespace: "installPage" });
  const title = t("metaTitle", { game: game.title });
  const description = plain(t.raw("description") as string).replace("{game}", game.title);
  return {
    title,
    description,
    alternates: { canonical: `/games/${id}/install` },
    openGraph: {
      title,
      description,
      siteName: "libfpv",
      type: "article",
      locale,
      url: `/games/${id}/install`,
      images: [{ url: `/games/${game.media}.jpg`, alt: game.title }],
    },
  };
}

export default async function InstallPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const game = getGame(id);
  if (!game?.hosted) notFound();

  const [stars, release, guide, t, tp, td] = await Promise.all([
    getStars(),
    getRelease(game),
    getInstallGuide(game),
    getTranslations("installPage"),
    getTranslations("gamePage"),
    getTranslations("gamePage.download"),
  ]);
  const date = release?.date ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(release.date)) : null;
  const englishOnly = t("englishOnly");
  // The guide's own "# Install ..." title is already the page's <h1>.
  const body = guide?.replace(/^\uFEFF?\s*# [^\n]*\n+/, "") ?? null;

  return (
    <>
      <Header stars={stars} />
      <main>
        <section id="top" className="relative isolate overflow-hidden bg-black text-white">
          <FeedBackdrop media={game.media} />
          <div className="container pb-14 pt-28 lg:pb-20 lg:pt-36">
            <nav aria-label={tp("breadcrumb")} className="flex flex-wrap items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-white/60">
              <Link href="/games" className="transition hover:text-white">
                {tp("allGames")}
              </Link>
              <ChevronRight className="size-4" aria-hidden />
              <Link href={`/games/${game.id}`} className="transition hover:text-white">
                {game.short}
              </Link>
              <ChevronRight className="size-4" aria-hidden />
              <span className="text-white/90" aria-current="page">
                {t("eyebrow")}
              </span>
            </nav>
            <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">{t("title", { game: game.title })}</h1>

            {release ? (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {release.files.map((f) => (
                  <Button key={f.file} asChild size="lg" className="bg-white text-black hover:bg-white/90">
                    <a href={f.url}>
                      <Download />
                      {f.file}
                      {f.size !== undefined && <span className="font-normal text-black/60">{formatSize(locale, f.size)}</span>}
                    </a>
                  </Button>
                ))}
                <span className="text-sm text-white/70">
                  {release.tag && td("build", { n: buildNumber(release.tag) })}
                  {date && ` · ${td("published", { date })}`}
                </span>
              </div>
            ) : (
              <p className="mt-6 text-lg text-white/75">{t("noBuild")}</p>
            )}
            {release?.files.map(
              (f) =>
                f.sha256 && (
                  <p key={f.file} className="mt-3 break-all font-mono text-xs text-white/50">
                    SHA-256 ({f.file}) {f.sha256}
                  </p>
                ),
            )}
          </div>
        </section>

        <section className="relative py-14 lg:py-20">
          <div className="container max-w-3xl">
            {englishOnly && <p className="mb-8 rounded-xl border bg-card/60 p-4 text-sm text-muted-foreground">{englishOnly}</p>}
            {body ? <Markdown className="text-base" lang="en">{body}</Markdown> : <p className="text-muted-foreground">{t("noBuild")}</p>}
            <div className="mt-14 border-t pt-8">
              <Link href={`/games/${game.id}`} className="text-sm font-medium underline-offset-4 hover:underline">
                ← {t("back", { game: game.short })}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
