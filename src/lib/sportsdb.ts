const API_KEY = process.env.THESPORTSDB_API_KEY ?? "123";
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

function url(path: string) {
  return `${BASE_URL}${path}`;
}

export interface RawEvent {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  idHomeTeam: string;
  idAwayTeam: string;
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string | null;
  strProgress?: string | null;
  dateEvent: string;
  strTime: string;
  strVenue?: string | null;
  strLeague?: string;
  idLeague?: string;
  strTimestamp?: string | null;
}

export interface RawEventStat {
  strStat: string;
  intHome: string | null;
  intAway: string | null;
}

export interface NormalizedMatch {
  id: string;
  homeTeam: { id: string; name: string; badge?: string };
  awayTeam: { id: string; name: string; badge?: string };
  score: { home: number | null; away: number | null };
  status: "live" | "finished" | "upcoming";
  minute?: string;
  date: string;
  time: string;
  venue?: string;
  league?: string;
  leagueId?: string;
  timestamp?: string;
}

export interface MatchStat {
  name: string;
  home: number | null;
  away: number | null;
}

export const LEAGUES: { id: string; name: string; flag: string; group?: string }[] = [
  { id: "all",  name: "All Soccer",    flag: "⚽",  group: "all" },
  { id: "4429", name: "World Cup",     flag: "🏆",  group: "international" },
  { id: "4328", name: "Premier League",flag: "󠁧󠁢󠁥󠁮󠁧󠁿🏴", group: "domestic" },
  { id: "4335", name: "La Liga",       flag: "🇪🇸", group: "domestic" },
  { id: "4332", name: "Serie A",       flag: "🇮🇹", group: "domestic" },
  { id: "4331", name: "Bundesliga",    flag: "🇩🇪", group: "domestic" },
  { id: "4334", name: "Ligue 1",       flag: "🇫🇷", group: "domestic" },
];

export function normalizeMatch(e: RawEvent): NormalizedMatch {
  const s = e.strStatus?.toUpperCase() ?? "";
  let status: NormalizedMatch["status"] = "upcoming";
  if (["1H", "2H", "HT", "ET", "PEN", "LIVE"].includes(s)) status = "live";
  else if (["FT", "AET", "FT PEN", "AOT"].includes(s)) status = "finished";

  return {
    id: e.idEvent,
    homeTeam: { id: e.idHomeTeam, name: e.strHomeTeam, badge: e.strHomeTeamBadge ?? undefined },
    awayTeam: { id: e.idAwayTeam, name: e.strAwayTeam, badge: e.strAwayTeamBadge ?? undefined },
    score: {
      home: e.intHomeScore !== null && e.intHomeScore !== "" ? Number(e.intHomeScore) : null,
      away: e.intAwayScore !== null && e.intAwayScore !== "" ? Number(e.intAwayScore) : null,
    },
    status,
    minute: e.strProgress ?? undefined,
    date: e.dateEvent,
    time: e.strTime ?? "",
    venue: e.strVenue ?? undefined,
    league: e.strLeague,
    leagueId: e.idLeague,
    timestamp: e.strTimestamp ?? undefined,
  };
}

export async function fetchMatchesByDate(
  date: string,
  leagueId: string = "all"
): Promise<NormalizedMatch[]> {
  const param = leagueId === "all" ? `s=Soccer` : `l=${leagueId}`;
  const res = await fetch(url(`/eventsday.php?d=${date}&${param}`), {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  const events: RawEvent[] = data?.events ?? [];
  return events.map(normalizeMatch);
}

export async function fetchMatchById(id: string): Promise<NormalizedMatch | null> {
  const res = await fetch(url(`/lookupevent.php?id=${id}`), { next: { revalidate: 30 } });
  if (!res.ok) return null;
  const data = await res.json();
  const event: RawEvent | undefined = data?.events?.[0];
  return event ? normalizeMatch(event) : null;
}

export async function fetchMatchStats(id: string): Promise<MatchStat[]> {
  const res = await fetch(url(`/lookupeventstats.php?id=${id}`), { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = await res.json();
  const raw: RawEventStat[] = data?.eventstats ?? [];
  return raw.map((s) => ({
    name: s.strStat,
    home: s.intHome !== null ? Number(s.intHome) : null,
    away: s.intAway !== null ? Number(s.intAway) : null,
  }));
}
