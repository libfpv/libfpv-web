import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { games, type Game } from "@/data/games";

/**
 * View and download counters for each game, kept in <dir>/counters.json:
 *
 *   { "rdr2": { "views": 120, "downloads": 31, "files": { "rdr2-fpv.zip": 31 } }, ... }
 *
 * <dir> is LIBFPV_STATS_DIR, default ./data/stats (gitignored); in the
 * container it's a writable bind mount (docker-compose.yml).
 *
 * The counters live in memory and are written back at most once a second,
 * atomically (a temp file renamed over the old one). There is one server
 * process, so nothing else writes the file while it runs. If the folder can't
 * be written, counting goes on in memory and the error is logged once.
 */

export type GameStats = { views: number; downloads: number; files: Record<string, number> };
export type Counts = { views: number; downloads: number };

const FLUSH_MS = 1000;

type Store = {
  data: Record<string, GameStats>;
  loaded: Promise<void> | null;
  timer: ReturnType<typeof setTimeout> | null;
  writing: Promise<void>;
  warned: boolean;
};

// Route handlers are bundled separately and may each get their own copy of
// this module: keep the one store on globalThis so they all share it.
const g = globalThis as typeof globalThis & { __libfpvStats?: Store };
const store: Store = (g.__libfpvStats ??= {
  data: {},
  loaded: null,
  timer: null,
  writing: Promise.resolve(),
  warned: false,
});

function dir() {
  return path.resolve(/* turbopackIgnore: true */ process.env.LIBFPV_STATS_DIR || path.join(/* turbopackIgnore: true */ process.cwd(), "data", "stats"));
}

const file = () => path.join(/* turbopackIgnore: true */ dir(), "counters.json");

const count = (n: unknown) => (Number.isSafeInteger(n) && (n as number) >= 0 ? (n as number) : 0);

/** Reads the file once; unknown games and malformed values are dropped. */
function load() {
  store.loaded ??= (async () => {
    let raw: unknown;
    try {
      raw = JSON.parse(await readFile(file(), "utf8"));
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "ENOENT") console.error("stats: can't read counters.json:", e);
      return;
    }
    if (!raw || typeof raw !== "object") return;
    for (const game of games) {
      const s = (raw as Record<string, unknown>)[game.id] as Record<string, unknown> | undefined;
      if (!s || typeof s !== "object") continue;
      const files: Record<string, number> = {};
      if (s.files && typeof s.files === "object") {
        for (const d of game.downloads ?? []) files[d.file] = count((s.files as Record<string, unknown>)[d.file]);
      }
      store.data[game.id] = { views: count(s.views), downloads: count(s.downloads), files };
    }
  })();
  return store.loaded;
}

function flush() {
  store.timer = null;
  const json = JSON.stringify(store.data, null, 2) + "\n";
  store.writing = store.writing.then(async () => {
    try {
      await mkdir(dir(), { recursive: true });
      const tmp = `${file()}.tmp`;
      await writeFile(tmp, json);
      await rename(tmp, file());
    } catch (e) {
      if (!store.warned) console.error("stats: can't write counters.json, counting in memory only:", e);
      store.warned = true;
    }
  });
}

function entry(game: Game) {
  return (store.data[game.id] ??= { views: 0, downloads: 0, files: {} });
}

function changed() {
  store.timer ??= setTimeout(flush, FLUSH_MS);
}

const counts = (s: GameStats): Counts => ({ views: s.views, downloads: s.downloads });

/** Every game's counters, by id (games never viewed or downloaded have zeros). */
export async function getAllCounts(): Promise<Record<string, Counts>> {
  await load();
  return Object.fromEntries(games.map((game) => [game.id, store.data[game.id] ? counts(store.data[game.id]) : { views: 0, downloads: 0 }]));
}

/** Counts a page view; returns the counters after it. */
export async function addView(game: Game): Promise<Counts> {
  await load();
  const s = entry(game);
  s.views++;
  changed();
  return counts(s);
}

/** Counts a download of one of the game's listed files. */
export async function addDownload(game: Game, file: string) {
  await load();
  const s = entry(game);
  s.downloads++;
  s.files[file] = (s.files[file] ?? 0) + 1;
  changed();
}
