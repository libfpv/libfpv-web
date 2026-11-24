import { getGame } from "@/data/games";
import { addView } from "@/lib/stats";

/**
 * POST /api/games/<id>/view: a game page was loaded (components/game-counters.tsx).
 * Counts the view and answers with the game's counters: { views, downloads }.
 */
export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json(await addView(game), { headers: { "Cache-Control": "no-store" } });
}
