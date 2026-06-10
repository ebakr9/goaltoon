# Goaltoon — Project Guide

Independent football scores and match statistics platform. Built with Next.js 14 App Router, deployed on Vercel, data from API-Football v3.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 + custom CSS classes in `globals.css` |
| Data | API-Football v3 (`v3.football.api-sports.io`) |
| Cache | Upstash Redis (primary) + in-process Map (fallback) |
| Database | Supabase (configured but not actively used yet) |
| Hosting | Vercel |
| Analytics | Google Analytics (G-4GSEB3SC1X) |

---

## Environment Variables

All must be set in Vercel → Settings → Environment Variables.

```
API_FOOTBALL_KEY=            # Required — API-Football v3 key
UPSTASH_REDIS_REST_URL=      # Optional but strongly recommended
UPSTASH_REDIS_REST_TOKEN=    # Optional but strongly recommended
NEXT_PUBLIC_SUPABASE_URL=    # Not actively used yet
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

If `API_FOOTBALL_KEY` is missing, all data fetches silently return empty and the console logs `[api-football] API_FOOTBALL_KEY not set`. **This is the first thing to check when the site shows no data.**

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: TopNav + SiteFooter + GA scripts
│   ├── page.tsx                # Home: hero countdown + live score dashboard
│   ├── groups/
│   │   └── page.tsx            # Group stage standings (World Cup)
│   ├── match/[id]/
│   │   └── page.tsx            # Match detail: header + MatchDetailClient
│   ├── api/
│   │   ├── live-scores/route.ts   # Polling endpoint for home page
│   │   └── matches/[id]/route.ts  # Polling endpoint for match detail
│   └── globals.css             # Tailwind + all custom CSS classes
├── components/
│   ├── TopNav.tsx              # Client component — uses usePathname() for active link
│   ├── LiveScoreClient.tsx     # Client — home page polling, date/league filters
│   ├── MatchCard.tsx           # Client — single match card with goal animation
│   ├── MatchDetailClient.tsx   # Client — stats + events + lineups dashboard
│   ├── PitchLineup.tsx         # Client — SVG football pitch with player positions
│   ├── HeroCountdown.tsx       # Client — countdown timer to June 11 2026
│   ├── GoalAnimation.tsx       # Client — confetti/celebration overlay on goal
│   └── PredictionButtons.tsx   # Client — win/draw/loss prediction UI
└── lib/
    ├── apifootball.ts          # All API-Football fetch functions + normalized types
    ├── redis.ts                # Caching layer (Upstash Redis + in-process Map fallback)
    ├── leagues.ts              # League config: IDs, names, flags, seasons
    ├── countries.ts            # Country name → flag emoji + brand color mapping
    ├── supabase.ts             # Supabase client (unused in active flows)
    ├── predictions.ts          # Prediction logic (unused in active flows)
    └── sportsdb.ts             # TheSportsDB client (legacy, not used in main flow)
```

---

## Data Flow

### Home Page
```
page.tsx (server)
  → fetchFixturesByDate(today)          # Direct API call at build/revalidate
  → filter by LEAGUE_IDS               # Client-side filter using leagues.ts
  → <LiveScoreClient initial={...} />  # Hydrates with SSR data

LiveScoreClient (client)
  → polls /api/live-scores every 60s (live matches) or 300s (no live)
  → user can change date/league → new fetch

/api/live-scores
  → getCached(dateCacheKey)            # Try Redis
  → fetchFixturesByDate(date)          # API-Football if cache miss
  → fetchLiveFixtures()                # Always fetched for today (real-time minutes)
  → setCached(key, data, ttl)          # Write back to cache
```

### Match Detail
```
match/[id]/page.tsx (server)
  → Promise.all([fixture, events, stats, lineups])  # 4 parallel API calls
  → <MatchDetailClient {...} />

MatchDetailClient (client)
  → polls /api/matches/[id] every 30s when match.status === "live"

/api/matches/[id]
  → getCached per data type (4 separate keys)
  → fetch only what's missing
  → NEVER cache empty arrays (stats/events may not exist yet)
```

---

## Caching Strategy

File: `src/lib/redis.ts`

Two-tier cache: Upstash Redis (shared across all Vercel instances) → in-process Map (per-instance fallback).

**TTL rules:**
| Data | Finished match | Live match | Upcoming |
|---|---|---|---|
| Match info | 24h | 30s | 10min |
| Events | 24h | 30s | — |
| Stats | 24h | 30s | — |
| Lineups | 24h | 10min | 10min |
| Date fixtures | 24h | 60s (live) / 5min (no live) | 1h |
| Standings | — | 5min | — |

**Critical rule:** Empty arrays are never cached. If the API returns no stats/events yet, the next request hits the API again immediately. This prevents stale empty results during the early minutes of a match.

**Cache key format:** `af:<type>:<identifier>` e.g. `af:match:fixture:1544368`, `af:standings:1:2026`

---

## League Configuration

File: `src/lib/leagues.ts`

Central place to add/remove leagues. `LEAGUE_IDS` is the allowlist used to filter API responses. Adding a league here makes it appear everywhere (home filters, match cards, etc.).

```typescript
{ id: "1",   name: "World Cup",        season: 2026, featured: true }
{ id: "10",  name: "Friendlies",       season: 2026 }
{ id: "39",  name: "Premier League",   season: 2024 }  // update season each year
{ id: "140", name: "La Liga",          season: 2024 }
{ id: "135", name: "Serie A",          season: 2024 }
{ id: "78",  name: "Bundesliga",       season: 2024 }
{ id: "61",  name: "Ligue 1",          season: 2024 }
{ id: "2",   name: "Champions League", season: 2024 }
```

The `season` field is metadata only — `fetchFixturesByDate` does not pass season to the API. **When a new season starts, update the season numbers here.**

---

## Design System

The project uses a custom "Stitch" design system defined in `globals.css`.

### Color Tokens (CSS variables via Tailwind)
| Token | Value | Use |
|---|---|---|
| `primary` | #006d37 | Green — home team, active states, primary actions |
| `tertiary` | #006497 | Blue — away team |
| `primary-container` | #2ecc71 | Light green — home stat bars |
| `tertiary-container` | #6ebaf6 | Light blue — away stat bars |
| `on-surface` | #1a1c1c | Near-black — borders, text |
| `error` | #ba1a1a | Red cards, live badge |

### Key CSS Classes (in `globals.css`)
```css
.card-border-bold      /* 3px border + 6px 6px offset shadow — main card style */
.card-border-bold-sm   /* 2px border + 4px 4px offset shadow — smaller cards */
.pitch-pattern-dense   /* Dark green + diagonal stripe pattern — match header BG */
.stadium-geo           /* Radial gradient overlay for depth */
.glass-panel           /* Frosted glass panel — score display */
.diagonal-pattern      /* SVG diagonal lines — events timeline BG */
.barlow                /* Source Sans 3 Bold utility class */
.pulse-dot             /* Pulsing dot animation for live indicator */
.liveblink             /* Blinking animation for LIVE badge */
```

### Fonts
- **Montserrat** (900/800/700) — headings, scores, team names
- **Source Sans 3** (400/600/700) — body, stats, labels

---

## Server vs Client Components

**Server components** (no `"use client"`): `layout.tsx`, `page.tsx`, `match/[id]/page.tsx`, `groups/page.tsx`
- Handle data fetching, caching, metadata
- Never poll; use `revalidate` for background ISR

**Client components** (have `"use client"`): Everything in `components/`, `TopNav.tsx`
- Handle interactivity, polling intervals, animations
- Receive initial data as props from server, then self-update

**Rule:** Keep data fetching in server components or API routes. Client components receive data as props and poll via the API routes.

---

## Match Detail Page Architecture

`match/[id]/page.tsx` renders a two-section layout:

1. **Header** (`page.tsx`, server): `pitch-pattern-dense` green background, glass-panel score, Goal Celebration sidebar. Static on first load.

2. **Dashboard** (`MatchDetailClient.tsx`, client): 12-column grid.
   - Left 8 cols: Stats with category filter pills (Shots / Passing / Duels / Discipline / Advanced)
   - Right 4 cols: Events timeline (newest-first, HT divider, max-height 700px scrollable)
   - Full width below: `PitchLineup` with SVG pitch and player positions

### PitchLineup Position Logic
Uses `grid: "row:col"` field from API-Football lineups response.
- Row 1 = GK, higher row = more forward
- Home team: y = `92 - norm*35` (bottom half, GK at 92%)
- Away team: y = `8 + norm*35` (top half, GK at 8%)
- x = `col / (colsInRow + 1) * 100`
- Fallback when `grid` is null: groups by `position` field (G/D/M/F)

---

## API Route Patterns

Both API routes follow the same pattern:
1. Check Redis cache per data type
2. Fetch only missing data from API-Football
3. Never cache empty arrays
4. Return JSON with appropriate `Cache-Control` header

The live-scores route additionally:
- Fetches `/fixtures?live=all` separately and merges real-time elapsed minutes into date fixtures
- Uses smart TTL: shorter when live matches exist

---

## Known Issues / Gotchas

- **Friendly matches (league 10) often have no stats.** API-Football data providers don't always push stats for friendly games. This is expected behavior, not a bug.
- **Stats show empty for first ~10 minutes of a match.** The API needs time to start receiving data from providers. Empty arrays are not cached so the next poll will retry.
- **`tsconfig.json` must have `"target": "ES2017"`.** Without it, `Map.entries()` in `redis.ts` causes a TypeScript error in Vercel's build. The workaround is `Array.from(mem.entries())` which is already in place.
- **Groups page shows empty state until tournament starts.** `fetchStandings("1", 2026)` returns `[]` before the tournament begins. The empty state component handles this gracefully.
- **`supabase.ts`, `predictions.ts`, `sportsdb.ts` are present but not actively used** in the main data flow. They exist for future features.

---

## Adding a New League

1. Find the league ID on [api-football.com](https://api-football.com)
2. Add to `src/lib/leagues.ts` `LEAGUES` array
3. It automatically appears in home page filters and match routing

## Adding a New Page

1. Create `src/app/<route>/page.tsx` as a server component
2. Add nav link to `src/components/TopNav.tsx` `NAV_LINKS` array — `usePathname()` handles active state automatically
3. Use `getCached` / `setCached` from `src/lib/redis.ts` for any API calls

## Legal

Goaltoon is an independent platform. Do not use "FIFA", "official", or tournament organiser names in UI text, page titles, or metadata. The footer disclaimer must remain in place. See `src/app/layout.tsx` `SiteFooter`.
