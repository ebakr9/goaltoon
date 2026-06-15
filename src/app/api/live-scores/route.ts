import { NextRequest, NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/redis";
import { fetchFixturesByDate, fetchLiveFixtures, NormalizedMatch } from "@/lib/apifootball";
import { LEAGUE_IDS } from "@/lib/leagues";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface MatchPayload {
  live: NormalizedMatch[];
  upcoming: NormalizedMatch[];
  finished: NormalizedMatch[];
  date: string;
  leagueId: string;
  fetchedAt: number;
}

function filterByLeague(matches: NormalizedMatch[], leagueId: string): NormalizedMatch[] {
  if (leagueId === "all") return matches.filter((m) => LEAGUE_IDS.includes(m.leagueId ?? ""));
  return matches.filter((m) => m.leagueId === leagueId);
}

function splitByStatus(matches: NormalizedMatch[]) {
  return {
    live:     matches.filter((m) => m.status === "live"),
    upcoming: matches.filter((m) => m.status === "upcoming"),
    finished: matches.filter((m) => m.status === "finished"),
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const tz        = searchParams.get("tz") ?? "UTC";
  // "today" in the user's local timezone
  const todayLocal = new Date().toLocaleDateString("en-CA", { timeZone: tz });
  const date      = searchParams.get("date") ?? todayLocal;
  const leagueId  = searchParams.get("leagueId") ?? "all";
  const isToday   = date === todayLocal;
  const isPast    = date < todayLocal;

  // ── 1. Try Redis cache ────────────────────────────────────────────────────
  // Cache key includes timezone so UTC and +03:00 users don't share stale entries.
  const dateCacheKey    = `af:fixtures:date:${date}:${tz}`;
  const liveCacheKey    = `af:fixtures:live:${tz}`;

  let allFixtures: NormalizedMatch[] | null = await getCached<NormalizedMatch[]>(dateCacheKey);
  let liveFixtures: NormalizedMatch[] | null = null;

  // For today: also check/fetch live data to get real-time elapsed minutes.
  if (isToday) {
    liveFixtures = await getCached<NormalizedMatch[]>(liveCacheKey);
    if (!liveFixtures) {
      liveFixtures = await fetchLiveFixtures(tz);
      // Live data: short TTL (30 s) regardless of plan
      await setCached(liveCacheKey, liveFixtures, 30);
    }
  }

  if (!allFixtures) {
    allFixtures = await fetchFixturesByDate(date, tz);

    // TTL strategy to protect the 100 req/day free limit:
    //  - Past dates  → fixtures won't change → 24 h
    //  - Today + live matches exist → 60 s
    //  - Today + no live → 5 min
    //  - Future dates → 1 h
    let ttl: number;
    if (isPast)        ttl = 86_400;
    else if (!isToday) ttl = 3_600;
    else               ttl = liveFixtures && liveFixtures.length > 0 ? 60 : 300;

    await setCached(dateCacheKey, allFixtures, ttl);
  }

  // ── 2. Merge live minute/status into the date fixtures ───────────────────
  // The /fixtures?live=all response has real-time elapsed minutes.
  // If a match was "live" in cached date fixtures but is no longer in the live
  // endpoint, it has finished — mark it so rather than serving the stale status.
  if (isToday && liveFixtures) {
    const liveMap = new Map(liveFixtures.map((m) => [m.id, m]));
    allFixtures = allFixtures.map((m) => {
      if (liveMap.has(m.id)) return liveMap.get(m.id)!;
      if (m.status === "live") return { ...m, status: "finished" as const };
      return m;
    });
  }

  // ── 3. Filter by requested league and split ───────────────────────────────
  const filtered = filterByLeague(allFixtures, leagueId);
  const { live, upcoming, finished } = splitByStatus(filtered);

  const payload: MatchPayload = {
    live,
    upcoming,
    finished,
    date,
    leagueId,
    fetchedAt: Date.now(),
  };

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "public, s-maxage=30" },
  });
}
