import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { games } from "@/data/games";
import { Link } from "@/navigation";
import { getStars } from "@/lib/github";
import { plain, tags } from "@/lib/rich";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Reveal from "@/components/reveal";
import { FeedBackdrop, GameCard } from "@/components/game-bits";
import { NextGame } from "@/components/games";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gamesPage" });
  const title = t("metaTitle");
  const description = plain(t.raw("description") as string);
  return {
    title,
    description,
    alternates: { canonical: "/games" },
    openGraph: { title, description, siteName: "libfpv", type: "website", locale, url: "/games" },
  };
}

export default async function GamesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [stars, t, tg] = await Promise.all([
    getStars(),
    getTranslations("gamesPage"),
    getTranslations("games"),
  ]);

  return (
    <>
      <Header stars={stars} />
      <main>
        <section id="top" className="relative isolate overflow-hidden bg-black text-white">
          <FeedBackdrop />
          <div className="container flex flex-col items-center pb-20 pt-32 text-center lg:pb-28 lg:pt-40">
            <p className="font-osd text-xl uppercase tracking-[0.2em] text-amber-300">{tg("eyebrow")}</p>
            <h1 className="mt-3 max-w-4xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {tg.rich("title", {
                ...tags,
                count: games.length,
                muted: (chunks) => <span className="text-white/55">{chunks}</span>,
              })}
            </h1>
            <p className="mt-6 max-w-2xl text-balance text-lg leading-8 text-white/75">{t.rich("description", tags)}</p>
            {/* the dial: every game's channel, straight to its page */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {games.map((g) => (
                <Link
                  key={g.id}
                  href={`/games/${g.id}`}
                  className="rounded-full border border-white/25 bg-black/30 px-3 py-1 font-osd text-base uppercase tracking-wider text-white/70 transition hover:border-white/60 hover:text-white"
                >
                  {g.channel} · {g.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20 lg:py-28">
          <div className="container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {games.map((g, i) => (
                <Reveal key={g.id} delay={(i % 3) * 80}>
                  <GameCard game={g} />
                </Reveal>
              ))}
            </div>
            <div className="mt-16 lg:mt-24">
              <NextGame />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
