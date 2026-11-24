import { constants } from "node:fs";
import { open } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

import type { Game } from "@/data/games";

/**
 * Downloads libfpv.com hosts itself (games with `hosted: true`).
 *
 * A mod's release pipeline uploads three files to <dir>/<game id>/:
 * - the ZIPs named in the game's `downloads` (rdr2-fpv.zip),
 * - INSTALL.md, the player's install guide (Markdown, rendered at /games/<id>/install),
 * - release.json, written last: { build, date, mod, libfpv, files: [{ file, size, sha256 }] }.
 *
 * <dir> is LIBFPV_DOWNLOADS_DIR, default ./data/downloads (gitignored). In
 * production it is the VPS's /srv/www/libfpv-downloads, mounted read-only into
 * the container. The route in app/downloads serves the ZIPs at
 * /downloads/<id>/<file>, counting each download (lib/stats.ts).
 *
 * Everything read here is checked before use: only the game's own listed files
 * (regular files, never symlinks)
 * are ever opened, and release.json's fields must have the expected shape.
 */

export type HostedFile = { file: string; size: number; sha256: string };

export type HostedRelease = {
  build: number;
  date: string;
  /** The mod's commit the build came from. */
  mod: string;
  /** libfpv's commit: the GPL parts' source is github.com/hammerill/libfpv at this commit. */
  libfpv: string;
  files: HostedFile[];
};

const MAX_GUIDE_BYTES = 256 * 1024;
const MAX_RELEASE_BYTES = 64 * 1024;

function root() {
  return path.resolve(/* turbopackIgnore: true */ process.env.LIBFPV_DOWNLOADS_DIR || path.join(/* turbopackIgnore: true */ process.cwd(), "data", "downloads"));
}

/** The game's folder; ids are our own constants, checked anyway. */
function gameDir(game: Game) {
  if (!/^[a-z0-9]+$/.test(game.id)) throw new Error(`bad game id ${game.id}`);
  return path.join(/* turbopackIgnore: true */ root(), game.id);
}

/** A file is served only if the game lists it among its downloads. */
export function isListedFile(game: Game, file: string) {
  return Boolean(game.hosted && game.downloads?.some((d) => d.file === file));
}

const hex = (n: number) => new RegExp(`^[0-9a-f]{${n}}$`);

function parseRelease(game: Game, raw: unknown): HostedRelease | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!Number.isSafeInteger(r.build) || (r.build as number) < 1) return null;
  if (typeof r.date !== "string" || Number.isNaN(Date.parse(r.date))) return null;
  if (typeof r.mod !== "string" || !hex(40).test(r.mod)) return null;
  if (typeof r.libfpv !== "string" || !hex(40).test(r.libfpv)) return null;
  if (!Array.isArray(r.files)) return null;
  const files: HostedFile[] = [];
  for (const f of r.files as unknown[]) {
    if (!f || typeof f !== "object") return null;
    const { file, size, sha256 } = f as Record<string, unknown>;
    if (typeof file !== "string" || !isListedFile(game, file)) continue;
    if (!Number.isSafeInteger(size) || (size as number) <= 0) return null;
    if (typeof sha256 !== "string" || !hex(64).test(sha256)) return null;
    files.push({ file, size: size as number, sha256 });
  }
  return {
    build: r.build as number,
    date: new Date(r.date).toISOString(),
    mod: r.mod,
    libfpv: r.libfpv,
    files,
  };
}

/**
 * Opens a regular file for reading, never through a symlink (O_NOFOLLOW on the
 * open itself, so nothing can be swapped in between a check and the read).
 */
async function openRegular(file: string) {
  const fh = await open(file, constants.O_RDONLY | constants.O_NOFOLLOW);
  const s = await fh.stat();
  if (!s.isFile()) {
    await fh.close();
    return null;
  }
  return { fh, size: s.size, mtime: s.mtime };
}

async function readSmall(file: string, max: number) {
  const f = await openRegular(file);
  if (!f) return null;
  try {
    return f.size > max ? null : await f.fh.readFile("utf8");
  } finally {
    await f.fh.close();
  }
}

/** The latest hosted build, or null if none is uploaded yet (or it's malformed). */
export async function getHostedRelease(game: Game): Promise<HostedRelease | null> {
  if (!game.hosted) return null;
  try {
    const text = await readSmall(path.join(/* turbopackIgnore: true */ gameDir(game), "release.json"), MAX_RELEASE_BYTES);
    return text ? parseRelease(game, JSON.parse(text)) : null;
  } catch {
    return null;
  }
}

/** The install guide's Markdown, or null. */
export async function getInstallGuide(game: Game): Promise<string | null> {
  if (!game.hosted) return null;
  try {
    return await readSmall(path.join(/* turbopackIgnore: true */ gameDir(game), "INSTALL.md"), MAX_GUIDE_BYTES);
  } catch {
    return null;
  }
}

/** A listed download as a web stream with its size, or null. */
export async function openHostedFile(game: Game, file: string) {
  if (!isListedFile(game, file)) return null;
  try {
    const f = await openRegular(path.join(/* turbopackIgnore: true */ gameDir(game), file));
    if (!f) return null;
    // The stream owns the handle and closes it when done or cancelled.
    const stream = Readable.toWeb(f.fh.createReadStream()) as ReadableStream<Uint8Array>;
    return { stream, size: f.size, mtime: f.mtime };
  } catch {
    return null;
  }
}

/**
 * Where players download a game's file, hosted or not: the route in
 * app/downloads counts the download, then serves the file or sends the player
 * on to the GitHub release.
 */
export function downloadUrl(game: Game, file: string) {
  return `/downloads/${game.id}/${file}`;
}

/** A listed download of a game, hosted or not. */
export function isDownload(game: Game, file: string) {
  return Boolean(game.downloads?.some((d) => d.file === file));
}
