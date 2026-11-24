import { getGame } from "@/data/games";
import { openHostedFile } from "@/lib/downloads";

/**
 * /downloads/<id>/<file>: a hosted game's ZIP (lib/downloads.ts). In production
 * nginx serves these straight from the downloads folder and this route is
 * never reached; it makes the links work with `npm run dev` and `next start`.
 * Only a file the game lists in `downloads` is ever opened.
 */
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string; file: string }> }) {
  const { id, file } = await params;
  const game = getGame(id);
  const opened = game ? await openHostedFile(game, file) : null;
  if (!opened) return new Response("Not found", { status: 404, headers: { "Content-Type": "text/plain" } });
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
