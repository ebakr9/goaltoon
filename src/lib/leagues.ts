// Central league configuration — add/remove leagues here only.
// id = API-Football league ID (string "all" for the aggregate view).
// featured = true → gold/highlight treatment in the UI (e.g. major tournaments).
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
  { id: "1", name: "World Cup", flag: "🏆", group: "international", season: 2026, featured: true },
];

export function getLeague(id: string): League | undefined {
  return LEAGUES.find((l) => l.id === id);
}

// All valid numeric league IDs (excludes "all")
export const LEAGUE_IDS = LEAGUES.filter((l) => l.id !== "all").map((l) => l.id);
