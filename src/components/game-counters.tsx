"use client";

import { Download, Eye } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Counts = { views: number; downloads: number };

/**
 * Every game's counters for the cards, fetched once per page load however many
 * cards show (GET /api/stats). A failed fetch is forgotten, so the next mount
 * tries again.
 */
let all: Promise<Record<string, Counts> | null> | null = null;
function fetchAll() {
  all ??= fetch("/api/stats")
    .then((res) => (res.ok ? (res.json() as Promise<Record<string, Counts>>) : null))
    .catch(() => null)
    .then((r) => {
      if (!r) all = null;
      return r;
    });
  return all;
}

/**
 * A game's "👁 1.2K · ⬇ 340". On the game's own page (`view`), loading it
 * counts a view (POST /api/games/<id>/view, which answers with the counters);
 * on a card it only reads them. Pages are static, so this runs in the browser;
 * until the answer comes, the pills hold their place with a dash.
 */
export default function GameCounters({
  id,
  view,
  dark,
  className,
}: {
  id: string;
  /** Count a view: only the game's own page. */
  view?: boolean;
  /** On the dark hero, like GameTags. */
  dark?: boolean;
  className?: string;
}) {
  const t = useTranslations("counters");
  const format = useFormatter();
  const [counts, setCounts] = useState<Counts | null>(null);
  // Once per page load, even when React runs the effect twice (Strict Mode).
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    const got = view
      ? fetch(`/api/games/${id}/view`, { method: "POST", keepalive: true })
          .then((res) => (res.ok ? (res.json() as Promise<Counts>) : null))
          .catch(() => null)
      : fetchAll().then((r) => r?.[id] ?? null);
    got.then((c) => c && setCounts(c));
  }, [id, view]);

  const short = (n: number) => format.number(n, { notation: "compact", maximumFractionDigits: 1 });
  const items = [
    { icon: Eye, n: counts?.views, label: (n: number) => t("views", { count: n }) },
    { icon: Download, n: counts?.downloads, label: (n: number) => t("downloads", { count: n }) },
  ];

  return (
    <div role="group" aria-label={t("label")} className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map(({ icon: Icon, n, label }, i) => (
        <span
          key={i}
          title={n === undefined ? undefined : label(n)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium tabular-nums",
            dark ? "border-white/25 bg-black/30 text-white/80" : "text-muted-foreground",
          )}
        >
          <Icon className="size-3.5" aria-hidden />
          {n === undefined ? "—" : <span aria-label={label(n)}>{short(n)}</span>}
        </span>
      ))}
    </div>
  );
}
