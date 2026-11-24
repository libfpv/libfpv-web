import { unstable_noStore as noStore } from "next/cache";

import type { Game } from "@/data/games";
import { downloadUrl, getHostedRelease } from "@/lib/downloads";

export type ReleaseFile = {
  file: string;
  platform: string;
  url: string;
  /** Bytes, when the release could be read. */
  size?: number;
  /** SHA-256 of the file (hosted builds). */
  sha256?: string;
};

export type Release = {
  /** "build-13" */
  tag?: string;
  /** ISO date of the latest build. */
  date?: string;
  /** The release page, with the install guide. */
  page: string;
  /** The page is on this site (/games/<id>/install), not on GitHub. */
  hosted?: boolean;
  /** Where to see every build; none for hosted games (only the latest is kept). */
  all?: string;
  files: ReleaseFile[];
};

type GithubRelease = {
  tag_name: string;
  published_at: string;
  html_url: string;
  assets: { name: string; size: number; browser_download_url: string }[];
};

/**
 * Where a game's downloads come from: libfpv.com itself for a `hosted` game
 * (lib/downloads.ts, read on every request, so a new build shows at once),
 * otherwise the mod's latest GitHub release, read at most once an hour (ISR),
 * like the star count.
 *
 * Returns null for a mod without downloads (it ships as source). Every file
 * links to /downloads/<id>/<file>, which counts the download and, for a GitHub
 * game, redirects to releases/latest/download/<file>. If GitHub can't be
 * reached, the files are still listed, just without a build number, date or size.
 */
export async function getRelease(game: Game): Promise<Release | null> {
  if (!game.downloads?.length) return null;
  if (game.hosted) return getHosted(game);
  if (!game.repo) return null;

  const latest = `${game.repo}/releases/latest`;
  const fallback: Release = {
    page: latest,
    all: `${game.repo}/releases`,
    files: game.downloads.map((d) => ({ ...d, url: downloadUrl(game, d.file) })),
  };

  const repo = game.repo.replace("https://github.com/", "");
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as GithubRelease;
    return {
      tag: data.tag_name,
      date: data.published_at,
      page: data.html_url,
      all: `${game.repo}/releases`,
      files: game.downloads.map((d) => {
        const asset = data.assets.find((a) => a.name === d.file);
        // Through our own /downloads route, which counts it (app/downloads).
        return { ...d, url: downloadUrl(game, d.file), size: asset?.size };
      }),
    };
  } catch {
    return fallback;
  }
}

/** A hosted game's latest build; null (no download card) until one is uploaded. */
async function getHosted(game: Game): Promise<Release | null> {
  // The files change without a site rebuild: render this page per request.
  noStore();
  const r = await getHostedRelease(game);
  if (!r || !r.files.length) return null;
  return {
    tag: `build-${r.build}`,
    date: r.date,
    page: `/games/${game.id}/install`,
    hosted: true,
    files: game.downloads!.flatMap((d) => {
      const f = r.files.find((x) => x.file === d.file);
      return f ? [{ ...d, url: downloadUrl(game, d.file), size: f.size, sha256: f.sha256 }] : [];
    }),
  };
}

/** "5.1 MB" in the page's language. */
export function formatSize(locale: string, bytes: number) {
  const mb = bytes / (1024 * 1024);
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "megabyte",
    maximumFractionDigits: 1,
  }).format(mb);
}

/** "build-13" → "13", anything else as is. */
export function buildNumber(tag: string) {
  return tag.replace(/^build-/, "");
}
