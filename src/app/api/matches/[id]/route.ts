import { NextRequest, NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/redis";
import {
  fetchFixtureById,
  fetchFixtureEvents,
  fetchFixtureStats,
  fetchFixtureLineups,
} from "@/lib/apifootball";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Each piece is cached separately so live stats refresh while lineups stay cached.
  const matchKey   = `af:match:fixture:${id}`;
  const eventsKey  = `af:match:events:${id}`;
  const statsKey   = `af:match:stats:${id}`;
  const lineupsKey = `af:match:lineups:${id}`;

  // Try to pull everything from cache first.
  const [cachedMatch, cachedEvents, cachedStats, cachedLineups] = await Promise.all([
    getCached<Awaited<ReturnType<typeof fetchFixtureById>>>(matchKey),
    getCached<Awaited<ReturnType<typeof fetchFixtureEvents>>>(eventsKey),
    getCached<Awaited<ReturnType<typeof fetchFixtureStats>>>(statsKey),
    getCached<Awaited<ReturnType<typeof fetchFixtureLineups>>>(lineupsKey),
  ]);

  // Fetch only what's missing.
  const [match, events, stats, lineups] = await Promise.all([
    cachedMatch  ?? fetchFixtureById(id),
    cachedEvents ?? fetchFixtureEvents(id),
    cachedStats  ?? fetchFixtureStats(id),
    cachedLineups ?? fetchFixtureLineups(id),
  ]);

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const isLive     = match.status === "live";
  const isFinished = match.status === "finished";

  // TTL strategy:
  //  - Finished: all data is final → 24 h
  //  - Live: short TTL to keep stats/events fresh → 30 s
  //  - Upcoming: lineups may not exist yet, check again in 10 min
  const matchTtl   = isFinished ? 86_400 : isLive ? 30 : 600;
  const eventsTtl  = isFinished ? 86_400 : 30;
  const statsTtl   = isFinished ? 86_400 : 30;
  const lineupsTtl = isFinished ? 86_400 : isLive ? 600 : 600;

  // Persist only newly fetched items. Never cache empty arrays — if the API
  // hasn't populated data yet we want the next request to hit the API again
  // immediately rather than serving a stale empty result for the full TTL.
  await Promise.all([
    cachedMatch   ? null : setCached(matchKey,   match,   matchTtl),
    cachedEvents  ? null : (events.length  > 0 ? setCached(eventsKey,  events,  eventsTtl)  : null),
    cachedStats   ? null : (stats.length   > 0 ? setCached(statsKey,   stats,   statsTtl)   : null),
    cachedLineups ? null : (lineups.length > 0 ? setCached(lineupsKey, lineups, lineupsTtl) : null),
  ]);

  return NextResponse.json(
    { match, events, stats, lineups },
    { headers: { "Cache-Control": `public, s-maxage=${matchTtl}` } }
  );
}
