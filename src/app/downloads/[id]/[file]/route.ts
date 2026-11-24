import { getGame } from "@/data/games";
import { isDownload, openHostedFile } from "@/lib/downloads";
import { addDownload } from "@/lib/stats";

/**
 * /downloads/<id>/<file>: every game's download link (lib/releases.ts). It
 * counts the download (lib/stats.ts), then serves a hosted game's ZIP
 * (lib/downloads.ts) or redirects to the file on the mod's latest GitHub
 * release. Only a file the game lists in `downloads` is ever counted or opened.
 *
 * nginx must proxy this path to the app rather than serve the ZIPs itself,
 * or hosted downloads aren't counted.
 */
export const dynamic = "force-dynamic";

const notFound = () => new Response("Not found", { status: 404, headers: { "Content-Type": "text/plain" } });

/**
 * A request for the file's start: a resumed or split download (Range from a
 * later byte) is the same download, counted once already.
 */
function isStart(req: Request) {
  const range = req.headers.get("range");
  return !range || /^bytes=0-/.test(range.trim());
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string; file: string }> }) {
  const { id, file } = await params;
  const game = getGame(id);
  if (!game || !isDownload(game, file)) return notFound();

  if (!game.hosted) {
    if (!game.repo) return notFound();
    await addDownload(game, file);
    return new Response(null, {
      status: 302,
      headers: { Location: `${game.repo}/releases/latest/download/${file}`, "Cache-Control": "no-store" },
    });
  }

  const opened = await openHostedFile(game, file);
  if (!opened) return notFound();
  if (isStart(req)) await addDownload(game, file);
  return new Response(opened.stream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": String(opened.size),
      "Content-Disposition": `attachment; filename="${file}"`,
      "Last-Modified": opened.mtime.toUTCString(),
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
