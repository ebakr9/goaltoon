// Central league configuration — add/remove leagues here only.
// id = API-Football league ID (string "all" for the aggregate view).
// featured = true → gold/highlight treatment in the UI (e.g. World Cup).
// season = the active season year for this league.

export interface League {
  id: string;
  name: string;
  flag: string;
  country?: string;
  season: number;
  group?: "all" | "international" | "domestic" | "european";
  featured?: boolean;
}

export const LEAGUES: League[] = [
  { id: "all",  name: "All",              flag: "⚽",  group: "all",           season: 2025 },
  { id: "1",    name: "World Cup",        flag: "🏆",  group: "international", season: 2026, featured: true },
  { id: "10",   name: "Friendlies",       flag: "🤝",  group: "international", season: 2026 },
  { id: "39",   name: "Premier League",   flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "domestic",      season: 2024 },
  { id: "140",  name: "La Liga",          flag: "🇪🇸", group: "domestic",      season: 2024 },
  { id: "135",  name: "Serie A",          flag: "🇮🇹", group: "domestic",      season: 2024 },
  { id: "78",   name: "Bundesliga",       flag: "🇩🇪", group: "domestic",      season: 2024 },
  { id: "61",   name: "Ligue 1",          flag: "🇫🇷", group: "domestic",      season: 2024 },
  { id: "2",    name: "Champions League", flag: "⭐",  group: "european",      season: 2024 },
];

export function getLeague(id: string): League | undefined {
  return LEAGUES.find((l) => l.id === id);
}

// All valid numeric league IDs (excludes "all")
export const LEAGUE_IDS = LEAGUES.filter((l) => l.id !== "all").map((l) => l.id);
