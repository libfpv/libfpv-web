"use client";

import { Download, Eye } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useSyncExternalStore, type ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Counts = { views: number; downloads: number };
type PageCounts = Counts & { files: Record<string, number> };

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
 * A game page's counters, by game id: what its view (POST /api/games/<id>/view)
 * answered, shared by the hero's pills and the download buttons, and bumped
 * when a download is clicked so both show it at once.
 */
const pages = new Map<string, PageCounts>();
const listeners = new Set<() => void>();

function setPage(id: string, c: PageCounts) {
  pages.set(id, c);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function usePage(id: string) {
  return useSyncExternalStore(
    subscribe,
    () => pages.get(id),
    () => undefined,
  );
}

/** One more download of `file`, as the server counts it when the link is followed. */
function bumpDownload(id: string, file: string) {
  const c = pages.get(id);
  if (!c) return;
  setPage(id, { ...c, downloads: c.downloads + 1, files: { ...c.files, [file]: (c.files[file] ?? 0) + 1 } });
}

const pill = (dark?: boolean) =>
  cn(
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium tabular-nums",
    dark ? "border-white/25 bg-black/30 text-white/80" : "text-muted-foreground",
  );

function useShort() {
  const format = useFormatter();
  return (n: number) => format.number(n, { notation: "compact", maximumFractionDigits: 1 });
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
  const short = useShort();
  const [card, setCard] = useState<Counts | null>(null);
  const page = usePage(id);
  const counts = view ? page : card;
  // Once per page load, even when React runs the effect twice (Strict Mode).
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    if (view) {
      fetch(`/api/games/${id}/view`, { method: "POST", keepalive: true })
        .then((res) => (res.ok ? (res.json() as Promise<PageCounts>) : null))
        .catch(() => null)
        .then((c) => c && setPage(id, { ...c, files: c.files ?? {} }));
    } else {
      fetchAll().then((r) => r?.[id] && setCard(r[id]));
    }
  }, [id, view]);

  const items = [
    { icon: Eye, n: counts?.views, label: (n: number) => t("views", { count: n }) },
    { icon: Download, n: counts?.downloads, label: (n: number) => t("downloads", { count: n }) },
  ];

  return (
    <div role="group" aria-label={t("label")} className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map(({ icon: Icon, n, label }, i) => (
        <span key={i} title={n === undefined ? undefined : label(n)} className={pill(dark)}>
          <Icon className="size-3.5" aria-hidden />
          {n === undefined ? "—" : <span aria-label={label(n)}>{short(n)}</span>}
        </span>
      ))}
    </div>
  );
}

/**
 * A download link on the game's page: following it bumps the page's counters
 * (the hero's total and this file's FileDownloads) right away.
 */
export function DownloadLink({ id, file, onClick, ...props }: ComponentProps<"a"> & { id: string; file: string }) {
  return (
    <a
      {...props}
      onClick={(e) => {
        onClick?.(e);
        bumpDownload(id, file);
      }}
    />
  );
}

/**
 * "⬇ 31": one file's downloads, from the game page's view (GameCounters with
 * `view` must be on the page). A dash until it answers.
 */
export function FileDownloads({ id, file, className }: { id: string; file: string; className?: string }) {
  const t = useTranslations("counters");
  const short = useShort();
  const n = usePage(id)?.files[file];
  return (
    <span title={n === undefined ? undefined : t("downloads", { count: n })} className={cn(pill(), className)}>
      <Download className="size-3.5" aria-hidden />
      {n === undefined ? "—" : <span aria-label={t("downloads", { count: n })}>{short(n)}</span>}
    </span>
  );
}
