import { links } from "@/config";

/**
 * The libfpv repo's star count, refreshed at most once an hour (ISR).
 * Returns null if GitHub can't be reached, and the buttons then show no count.
 */
export async function getStars(): Promise<number | null> {
  const repo = links.github.replace("https://github.com/", "");
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export function formatStars(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`;
}
