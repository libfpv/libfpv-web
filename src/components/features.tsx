import {
  Cpu,
  Gamepad2,
  Wind,
  Boxes,
  Tv,
  Globe,
  Orbit,
  Volume2,
  MapPin,
  UserRound,
  Footprints,
  Flame,
  RadioTower,
  FolderSync,
  type LucideIcon,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { games, type Game } from "@/data/games";
import { cn } from "@/lib/utils";
import { joinList, tags } from "@/lib/rich";

/**
 * libfpv's features. They belong to libfpv, not to one game: every mod gets
 * them. A few need the mod to wire them up, and some older mods haven't yet:
 * `pending` names those games, so the page never claims more than they do.
 * Drop a game's id from `pending` once its mod catches up.
 *
 * Each feature's title and body are features.items.<id> in dicts/<locale>.json,
 * and when it has `pending`, so is what's missing, lowercase ("the video feed").
 */
export type Feature = {
  id: string;
  icon: LucideIcon;
  wide?: boolean;
  /** Mods that don't have this yet (game ids). */
  pending?: string[];
  /**
   * Only for some games, because the others can't have it at all (no web
   * build without the game's source, no portals outside Portal 2). A game's
   * page leaves it out instead of listing it as included or "not yet".
   */
  only?: (game: Game) => boolean;
};

/** The features a game's page lists: all but the ones that can't apply to it. */
export function featuresFor(game: Game) {
  return features.filter((f) => !f.only || f.only(game));
}

export const features: Feature[] = [
  { id: "betaflight", icon: Cpu, wide: true },
  { id: "radio", icon: Gamepad2 },
  { id: "stand-in", icon: UserRound, wide: true, pending: ["gtaiv"] },
  { id: "pilot-view", icon: Footprints, pending: ["gtaiv", "revc"] },
  { id: "video", icon: Tv, wide: true, pending: ["gtaiv", "revc", "portal2"] },
  { id: "wind", icon: Wind, pending: ["gtaiv", "revc"] },
  { id: "damage", icon: Flame, pending: ["gtaiv", "revc"] },
  { id: "presets", icon: Boxes },
  { id: "osd", icon: MapPin },
  { id: "sound", icon: Volume2, pending: ["gtaiv", "revc"] },
  { id: "rc-link", icon: RadioTower },
  { id: "shared", icon: FolderSync, pending: ["gtaiv"] },
  { id: "portals", icon: Orbit, only: (g) => g.id === "portal2" },
  { id: "web", icon: Globe, wide: true, only: (g) => Boolean(g.webBuild) },
];

type T = Awaited<ReturnType<typeof getTranslations>>;

/** "The video feed: not in GTA IV, Vice City and Portal 2 yet". */
function pendingText(t: T, locale: string, f: Feature) {
  if (!f.pending) return null;
  const names = f.pending.map((id) => games.find((g) => g.id === id)?.short ?? id);
  const text = t("pending", { what: t(`items.${f.id}.pending`), games: joinList(locale, names) });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default async function Features() {
  const t = await getTranslations("features");
  const locale = await getLocale();

  return (
    <section id="features" className="relative scroll-mt-16 overflow-hidden py-24 lg:py-32">
      <div className="glow-blob left-[-10%] top-20 h-[30rem] w-[30rem] opacity-60" />
      <div className="glow-blob bottom-0 right-[-10%] h-[30rem] w-[30rem] opacity-50" />
      <div className="container">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t.rich("title", tags)}
          description={t.rich("description", tags)}
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal
              key={f.id}
              delay={(i % 3) * 80}
              className={cn(f.wide && "lg:col-span-2")}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border bg-card/70 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:border-white/20">
                <div className="flex size-11 items-center justify-center rounded-xl border bg-background">
                  <f.icon className="size-5 text-bf" />
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight">{t.rich(`items.${f.id}.title`, tags)}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{t.rich(`items.${f.id}.body`, tags)}</p>
                {f.pending && (
                  <p className="mt-3 text-xs font-medium text-muted-foreground/80">{pendingText(t, locale, f)}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
