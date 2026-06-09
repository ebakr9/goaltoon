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
const DONE_STATUSES  = new Set(["FT", "AET", "PEN"]);

function normalizeStatus(short: string): NormalizedMatch["status"] {
  if (LIVE_STATUSES.has(short)) return "live";
  if (DONE_STATUSES.has(short)) return "finished";
  return "upcoming";
}

function normalizeFixture(f: AFFixture): NormalizedMatch {
  const iso = f.fixture.date; // e.g. "2024-08-16T19:00:00+00:00"
  const utc = new Date(iso).toISOString();
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
    date: utc.slice(0, 10),
    time: utc.slice(11, 16),
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
export async function fetchFixturesByDate(date: string): Promise<NormalizedMatch[]> {
  const raw = await apiFetch<AFFixture[]>(`/fixtures?date=${date}&timezone=UTC`);
  if (!raw) return [];
  return raw.map(normalizeFixture);
}

/**
 * All currently live fixtures across every competition.
 */
export async function fetchLiveFixtures(): Promise<NormalizedMatch[]> {
  const raw = await apiFetch<AFFixture[]>(`/fixtures?live=all&timezone=UTC`);
  if (!raw) return [];
  return raw.map(normalizeFixture);
}

/**
 * Single fixture detail by ID.
 */
export async function fetchFixtureById(id: string): Promise<NormalizedMatch | null> {
  const raw = await apiFetch<AFFixture[]>(`/fixtures?id=${id}&timezone=UTC`);
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
export async function fetchFixtureLineups(id: string): Promise<MatchLineup[]> {
  const raw = await apiFetch<AFLineupRaw[]>(`/fixtures/lineups?fixture=${id}`);
  if (!raw) return [];
  return raw.map((l) => ({
    teamId: String(l.team.id),
    teamName: l.team.name,
    teamLogo: l.team.logo || undefined,
    formation: l.formation,
    startXI: l.startXI.map((p) => ({
      id: p.player.id,
      name: p.player.name,
      number: p.player.number,
      position: p.player.pos,
      grid: p.player.grid,
    })),
    substitutes: l.substitutes.map((p) => ({
      id: p.player.id,
      name: p.player.name,
      number: p.player.number,
      position: p.player.pos,
      grid: null,
    })),
    coach: l.coach.name,
  }));
}
