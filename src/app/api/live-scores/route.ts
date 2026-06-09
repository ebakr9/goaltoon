import { NextRequest, NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/redis";
import { fetchMatchesByDate, NormalizedMatch } from "@/lib/sportsdb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const today = new Date().toISOString().split("T")[0];
  const date = searchParams.get("date") ?? today;
  const leagueId = searchParams.get("leagueId") ?? "all";

  const cacheKey = `matches_${date}_${leagueId}`;
  const isToday = date === today;

  const cached = await getCached<{
    live: NormalizedMatch[];
    upcoming: NormalizedMatch[];
    finished: NormalizedMatch[];
    date: string;
    leagueId: string;
    fetchedAt: number;
  }>(cacheKey);

  if (cached) {
    return NextResponse.json(cached, {
      headers: { "X-Cache": "HIT", "Cache-Control": "public, s-maxage=60" },
    });
  }

  const matches = await fetchMatchesByDate(date, leagueId);

  const payload = {
    live: matches.filter((m) => m.status === "live"),
    upcoming: matches.filter((m) => m.status === "upcoming"),
    finished: matches.filter((m) => m.status === "finished"),
    date,
    leagueId,
    fetchedAt: Date.now(),
  };

  // Past dates: cache 1 hour. Today: cache 60s
  const ttl = isToday ? 60 : 3600;
  await setCached(cacheKey, payload, ttl);

  return NextResponse.json(payload, {
    headers: { "X-Cache": "MISS", "Cache-Control": `public, s-maxage=${ttl}` },
  });
}
