import { NextRequest, NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/redis";
import { fetchMatchById, fetchMatchStats } from "@/lib/sportsdb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const cacheKey = `match_detail_${id}`;

  const cached = await getCached<object>(cacheKey);
  if (cached) {
    return NextResponse.json(cached, { headers: { "X-Cache": "HIT" } });
  }

  const [match, stats] = await Promise.all([
    fetchMatchById(id),
    fetchMatchStats(id),
  ]);

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const payload = { match, stats };
  const ttl = match.status === "finished" ? 300 : 30;
  await setCached(cacheKey, payload, ttl);

  return NextResponse.json(payload, { headers: { "X-Cache": "MISS" } });
}
