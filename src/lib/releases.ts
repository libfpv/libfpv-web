import type { Game } from "@/data/games";

export type ReleaseFile = {
  file: string;
  platform: string;
  url: string;
  /** Bytes, when the release could be read. */
  size?: number;
};

export type Release = {
  /** "build-13" */
  tag?: string;
  /** ISO date of the latest build. */
  date?: string;
  /** The release page, with the install guide. */
  page: string;
  files: ReleaseFile[];
};

type GithubRelease = {
  tag_name: string;
  published_at: string;
  html_url: string;
  assets: { name: string; size: number; browser_download_url: string }[];
};

/**
 * Where a game's downloads come from. For now that is the mod's latest GitHub
 * release, read at most once an hour (ISR), like the star count. When libfpv
 * hosts the files itself, only this function has to change.
 *
 * Returns null for a mod without downloads (it ships as source). If GitHub
 * can't be reached, the files still link to releases/latest/download/<file>,
 * just without a build number, date or size.
 */
export async function getRelease(game: Game): Promise<Release | null> {
  if (!game.downloads?.length) return null;

  const latest = `${game.repo}/releases/latest`;
  const fallback: Release = {
    page: latest,
    files: game.downloads.map((d) => ({ ...d, url: `${latest}/download/${d.file}` })),
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
      files: game.downloads.map((d) => {
        const asset = data.assets.find((a) => a.name === d.file);
        return asset
          ? { ...d, url: asset.browser_download_url, size: asset.size }
          : { ...d, url: `${latest}/download/${d.file}` };
      }),
    };
  } catch {
    return fallback;
  }
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
