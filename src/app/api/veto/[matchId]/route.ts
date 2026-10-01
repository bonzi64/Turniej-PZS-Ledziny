import { buildSnapshot } from "@/lib/veto/service";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, ctx: RouteContext<"/api/veto/[matchId]">) {
  const { matchId } = await ctx.params;
  const snapshot = await buildSnapshot(matchId);
  if (!snapshot) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json(snapshot, { headers: { "Cache-Control": "no-store" } });
}
