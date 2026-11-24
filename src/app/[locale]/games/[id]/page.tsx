import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { games, getGame } from "@/data/games";
import { getRelease } from "@/lib/releases";
import { getStars } from "@/lib/github";
import { plain } from "@/lib/rich";
import Header from "@/components/header";
import Footer from "@/components/footer";
import GamePage from "@/components/game-page";

type Props = { params: Promise<{ locale: string; id: string }> };

/** One page per game, /games/<id>; any other id is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return games.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const game = getGame(id);
  if (!game) return {};
  const t = await getTranslations({ locale, namespace: "gamePage" });
  const td = await getTranslations({ locale, namespace: `gameData.${id}` });
  const title = t("metaTitle", { game: game.title });
  const description = plain(td.raw("pitch") as string);
  return {
    title,
    description,
    alternates: { canonical: `/games/${id}` },
    openGraph: {
      title,
      description,
      siteName: "libfpv",
      type: "website",
      locale,
      url: `/games/${id}`,
      images: [{ url: `/games/${game.media}.jpg`, alt: game.title }],
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const game = getGame(id);
  if (!game) notFound();
  const [stars, release] = await Promise.all([getStars(), getRelease(game)]);

  return (
    <>
      <Header stars={stars} />
      <main>
        <GamePage game={game} release={release} />
      </main>
      <Footer />
    </>
  );
}
