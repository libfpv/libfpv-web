import { getAllCounts } from "@/lib/stats";

/**
 * GET /api/stats: every game's counters, { <id>: { views, downloads } }, for
 * the game cards (components/game-counters.tsx). Reading counts nothing.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await getAllCounts(), { headers: { "Cache-Control": "no-store" } });
}
