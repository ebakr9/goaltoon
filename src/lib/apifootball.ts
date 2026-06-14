// API-Football v3 client
// Docs: https://www.api-football.com/documentation-v3
// Base: https://v3.football.api-sports.io
// Auth header: x-apisports-key

const API_KEY = process.env.API_FOOTBALL_KEY ?? "";
const BASE_URL = "https://v3.football.api-sports.io";

// ─── Raw API types ────────────────────────────────────────────────────────────

interface AFStatus {
  long: string;
  short: string;
  elapsed: number | null;
}

interface AFVenue {
  id: number | null;
  name: string | null;
  city: string | null;
}

interface AFFixtureInfo {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  status: AFStatus;
  venue: AFVenue;
}

interface AFTeam {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

interface AFLeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string | null;
  season: number;
  round: string;
}

interface AFScore {
  home: number | null;
  away: number | null;
}

interface AFFixture {
  fixture: AFFixtureInfo;
  league: AFLeague;
  teams: { home: AFTeam; away: AFTeam };
  goals: AFScore;
  score: {
    halftime: AFScore;
    fulltime: AFScore;
    extratime: AFScore;
    penalty: AFScore;
  };
}

interface AFEventRaw {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: string;
  detail: string;
  comments: string | null;
}

interface AFStatTeam {
  team: { id: number; name: string; logo: string };
  statistics: { type: string; value: string | number | null }[];
}

interface AFLineupPlayer {
  player: {
    id: number;
    name: string;
    number: number;
    pos: string;
    grid: string | null;
  };
}

interface AFLineupRaw {
  team: { id: number; name: string; logo: string };
  formation: string;
  startXI: AFLineupPlayer[];
  substitutes: AFLineupPlayer[];
  coach: { id: number; name: string; photo: string };
}

// ─── Normalized types (used throughout the app) ───────────────────────────────

export interface NormalizedMatch {
  id: string;
  homeTeam: { id: string; name: string; logo?: string; winner?: boolean | null };
  awayTeam: { id: string; name: string; logo?: string; winner?: boolean | null };
  score: { home: number | null; away: number | null };
  halftime: { home: number | null; away: number | null };
  status: "live" | "finished" | "upcoming";
  minute?: number;
  date: string;    // YYYY-MM-DD (UTC)
  time: string;    // HH:MM (UTC)
  venue?: string;
  league?: string;
  leagueId?: string;
  leagueLogo?: string;
  round?: string;
  timestamp: number;
}

export interface MatchEvent {
  minute: number;
  extraMinute?: number | null;
  teamId: string;
  teamName: string;
  type: string;   // "Goal" | "Card" | "subst" | "Var"
  detail: string; // "Normal Goal" | "Yellow Card" | "Red Card" | ...
  player: string;
  assist?: string | null;
}

export interface MatchStat {
  name: string;
  home: number | string | null;
  away: number | string | null;
}

export interface MatchPlayer {
  id: number;
  name: string;
  number: number;
  position: string;
  grid?: string | null;
}

export interface MatchLineup {
  teamId: string;
  teamName: string;
  teamLogo?: string;
  formation: string;
  startXI: MatchPlayer[];
  substitutes: MatchPlayer[];
  coach: string;
}

// ─── HTTP client ──────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T | null> {
  if (!API_KEY) {
    console.warn("[api-football] API_FOOTBALL_KEY not set");
    return null;
  }
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "x-apisports-key": API_KEY },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[api-football] ${res.status} for ${path}`);
      return null;
    }
    const json = await res.json();
    // API returns errors in errors field
    if (json?.errors && Object.keys(json.errors).length > 0) {
      console.error("[api-football] API error:", json.errors);
      return null;
    }
    return (json?.response ?? null) as T | null;
  } catch (err) {
    console.error("[api-football] fetch error:", err);
    return null;
  }
}

// ─── Normalization ────────────────────────────────────────────────────────────

const LIVE_STATUSES  = new Set(["1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT", "LIVE"]);
const DONE_STATUSES  = new Set(["FT", "AET", "PEN", "AWD", "WO", "CANC", "ABD", "PST"]);

function normalizeStatus(short: string): NormalizedMatch["status"] {
  if (LIVE_STATUSES.has(short)) return "live";
  if (DONE_STATUSES.has(short)) return "finished";
  return "upcoming";
}

function normalizeFixture(f: AFFixture): NormalizedMatch {
  // Use the date/time from the API response directly — it's already in the
  // timezone we requested. Converting to UTC would shift dates for users
  // not in UTC (e.g. a 01:00 +03:00 match would appear as 22:00 on the prev day).
  const iso = f.fixture.date; // e.g. "2026-06-15T01:00:00+03:00"
  return {
    id: String(f.fixture.id),
    homeTeam: {
      id: String(f.teams.home.id),
      name: f.teams.home.name,
      logo: f.teams.home.logo || undefined,
      winner: f.teams.home.winner,
    },
    awayTeam: {
      id: String(f.teams.away.id),
      name: f.teams.away.name,
      logo: f.teams.away.logo || undefined,
      winner: f.teams.away.winner,
    },
    score: { home: f.goals.home, away: f.goals.away },
    halftime: {
      home: f.score.halftime?.home ?? null,
      away: f.score.halftime?.away ?? null,
    },
    status: normalizeStatus(f.fixture.status.short),
    minute: f.fixture.status.elapsed ?? undefined,
    date: iso.slice(0, 10),
    time: iso.slice(11, 16),
    venue: f.fixture.venue.name ?? undefined,
    league: f.league.name,
    leagueId: String(f.league.id),
    leagueLogo: f.league.logo || undefined,
    round: f.league.round,
    timestamp: f.fixture.timestamp,
  };
}

// ─── Public fetch functions ───────────────────────────────────────────────────

/**
 * All fixtures for a given date (YYYY-MM-DD).
 * One API request covers all leagues — filter client-side by leagueId.
 */
export async function fetchFixturesByDate(date: string, tz = "UTC"): Promise<NormalizedMatch[]> {
  const raw = await apiFetch<AFFixture[]>(`/fixtures?date=${date}&timezone=${encodeURIComponent(tz)}`);
  if (!raw) return [];
  return raw.map(normalizeFixture);
}

/**
 * All currently live fixtures across every competition.
 */
export async function fetchLiveFixtures(tz = "UTC"): Promise<NormalizedMatch[]> {
  const raw = await apiFetch<AFFixture[]>(`/fixtures?live=all&timezone=${encodeURIComponent(tz)}`);
  if (!raw) return [];
  return raw.map(normalizeFixture);
}

/**
 * Single fixture detail by ID.
 */
export async function fetchFixtureById(id: string, tz = "UTC"): Promise<NormalizedMatch | null> {
  const raw = await apiFetch<AFFixture[]>(`/fixtures?id=${id}&timezone=${encodeURIComponent(tz)}`);
  if (!raw || raw.length === 0) return null;
  return normalizeFixture(raw[0]);
}

/**
 * Match events (goals, cards, substitutions).
 */
export async function fetchFixtureEvents(id: string): Promise<MatchEvent[]> {
  const raw = await apiFetch<AFEventRaw[]>(`/fixtures/events?fixture=${id}`);
  if (!raw) return [];
  return raw.map((e) => ({
    minute: e.time.elapsed,
    extraMinute: e.time.extra,
    teamId: String(e.team.id),
    teamName: e.team.name,
    type: e.type,
    detail: e.detail,
    player: e.player.name,
    assist: e.assist?.name ?? null,
  }));
}

/**
 * Match statistics (shots, possession, etc.) — one entry per team.
 * Returns paired home/away stats.
 */
export async function fetchFixtureStats(id: string): Promise<MatchStat[]> {
  const raw = await apiFetch<AFStatTeam[]>(`/fixtures/statistics?fixture=${id}`);
  if (!raw || raw.length < 2) return [];

  const [home, away] = raw;
  const awayMap = new Map(away.statistics.map((s) => [s.type, s.value]));

  return home.statistics.map((s) => ({
    name: s.type,
    home: s.value,
    away: awayMap.get(s.type) ?? null,
  }));
}

/**
 * Starting lineups and substitutes for both teams.
 */
// ─── Standings types ──────────────────────────────────────────────────────────

interface AFStandingEntry {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  group: string;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
}

interface AFStandingsLeague {
  league: { standings: AFStandingEntry[][] };
}

export interface StandingEntry {
  rank: number;
  teamId: string;
  teamName: string;
  teamLogo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

export interface GroupStanding {
  name: string;
  teams: StandingEntry[];
}

export async function fetchStandings(leagueId: string, season: number): Promise<GroupStanding[]> {
  const raw = await apiFetch<AFStandingsLeague[]>(`/standings?league=${leagueId}&season=${season}`);
  if (!raw || raw.length === 0) return [];
  const groups: GroupStanding[] = [];
  for (const group of raw[0].league.standings) {
    if (group.length === 0) continue;
    groups.push({
      name: group[0].group.replace(/^Group Stage\s*-\s*/i, "").trim(),
      teams: group.map((e) => ({
        rank: e.rank,
        teamId: String(e.team.id),
        teamName: e.team.name,
        teamLogo: e.team.logo,
        played: e.all.played,
        won: e.all.win,
        drawn: e.all.draw,
        lost: e.all.lose,
        goalsFor: e.all.goals.for,
        goalsAgainst: e.all.goals.against,
        goalDiff: e.goalsDiff,
        points: e.points,
      })),
    });
  }
  return groups.sort((a, b) => a.name.localeCompare(b.name));
}

// ─── Tournament stats types ───────────────────────────────────────────────────

interface AFPlayerStatRaw {
  player: { id: number; name: string; photo: string; nationality: string };
  statistics: {
    team: { id: number; name: string; logo: string };
    goals: { total: number | null; assists: number | null };
    cards: { yellow: number; red: number };
    games: { rating: string | null; appearences: number | null };
  }[];
}

export interface PlayerStatEntry {
  rank: number;
  playerId: number;
  playerName: string;
  playerPhoto: string;
  teamName: string;
  teamLogo: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: number | null;
  appearances: number;
}

function normalizePlayerStat(p: AFPlayerStatRaw, rank: number): PlayerStatEntry {
  // Some players have multiple statistics entries (e.g. played in multiple leagues/teams).
  // Sum numeric fields across all entries; use the first entry for team info and rating.
  const s = p.statistics[0];
  const goals    = p.statistics.reduce((n, x) => n + (x.goals.total   ?? 0), 0);
  const assists  = p.statistics.reduce((n, x) => n + (x.goals.assists ?? 0), 0);
  const yellow   = p.statistics.reduce((n, x) => n + (x.cards.yellow  ?? 0), 0);
  const red      = p.statistics.reduce((n, x) => n + (x.cards.red     ?? 0), 0);
  const apps     = p.statistics.reduce((n, x) => n + (x.games.appearences ?? 0), 0);
  const ratingRaw = s?.games.rating ? parseFloat(s.games.rating) : null;
  return {
    rank,
    playerId: p.player.id,
    playerName: p.player.name,
    playerPhoto: p.player.photo,
    teamName: s?.team.name ?? "",
    teamLogo: s?.team.logo ?? "",
    goals,
    assists,
    yellowCards: yellow,
    redCards: red,
    rating: ratingRaw,
    appearances: apps,
  };
}

/**
 * Upcoming fixtures for a specific league (next N matches, status=NS).
 */
export async function fetchUpcomingByLeague(leagueId: string, season: number, next: number = 48): Promise<NormalizedMatch[]> {
  const raw = await apiFetch<AFFixture[]>(`/fixtures?league=${leagueId}&season=${season}&next=${next}&timezone=UTC`);
  if (!raw) return [];
  return raw.map(normalizeFixture);
}

export async function fetchTopScorers(leagueId: string, season: number): Promise<PlayerStatEntry[]> {
  const raw = await apiFetch<AFPlayerStatRaw[]>(`/players/topscorers?league=${leagueId}&season=${season}`);
  if (!raw) return [];
  return raw.slice(0, 10).map((p, i) => normalizePlayerStat(p, i + 1));
}

export async function fetchTopAssists(leagueId: string, season: number): Promise<PlayerStatEntry[]> {
  const raw = await apiFetch<AFPlayerStatRaw[]>(`/players/topassists?league=${leagueId}&season=${season}`);
  if (!raw) return [];
  return raw.slice(0, 10).map((p, i) => normalizePlayerStat(p, i + 1));
}

export async function fetchTopYellowCards(leagueId: string, season: number): Promise<PlayerStatEntry[]> {
  const raw = await apiFetch<AFPlayerStatRaw[]>(`/players/topyellowcards?league=${leagueId}&season=${season}`);
  if (!raw) return [];
  return raw.slice(0, 10).map((p, i) => normalizePlayerStat(p, i + 1));
}

export async function fetchTopRedCards(leagueId: string, season: number): Promise<PlayerStatEntry[]> {
  const raw = await apiFetch<AFPlayerStatRaw[]>(`/players/topredcards?league=${leagueId}&season=${season}`);
  if (!raw) return [];
  return raw.slice(0, 10).map((p, i) => normalizePlayerStat(p, i + 1));
}

export async function fetchTopRatings(leagueId: string, season: number): Promise<PlayerStatEntry[]> {
  const raw = await apiFetch<AFPlayerStatRaw[]>(`/players/topscorers?league=${leagueId}&season=${season}`);
  if (!raw) return [];
  // sort by rating descending
  return raw
    .map((p, i) => normalizePlayerStat(p, i + 1))
    .filter((p) => p.rating !== null)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 10)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}

export async function fetchFixtureLineups(id: string): Promise<MatchLineup[]> {
  const raw = await apiFetch<AFLineupRaw[]>(`/fixtures/lineups?fixture=${id}`);
  if (!raw) return [];
  return raw.map((l) => ({
    teamId: String(l.team.id),
    teamName: l.team.name,
    teamLogo: l.team.logo || undefined,
    formation: l.formation,
    startXI: (l.startXI ?? []).map((p) => ({
      id: p.player.id,
      name: p.player.name,
      number: p.player.number,
      position: p.player.pos,
      grid: p.player.grid,
    })),
    substitutes: (l.substitutes ?? []).map((p) => ({
      id: p.player.id,
      name: p.player.name,
      number: p.player.number,
      position: p.player.pos,
      grid: null,
    })),
    coach: l.coach.name,
  }));
}
