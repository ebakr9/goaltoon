import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchStandings,
  fetchUpcomingByLeague,
  GroupStanding,
  StandingEntry,
  NormalizedMatch,
} from "@/lib/apifootball";
import { getCached, setCached } from "@/lib/redis";

export const revalidate = 120;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const groupName = decodeGroupName(params.slug);
  return { title: `${groupName} – Groups – Goaltoon` };
}

function decodeGroupName(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function GroupDetailPage({ params }: { params: { slug: string } }) {
  const groupName = decodeGroupName(params.slug);

  // Fetch standings
  const cacheKey = "af:standings:1:2026";
  let groups: GroupStanding[] = (await getCached<GroupStanding[]>(cacheKey)) ?? [];
  if (groups.length === 0) {
    groups = await fetchStandings("1", 2026);
    if (groups.length > 0) await setCached(cacheKey, groups, 300);
  }

  const group = groups.find(
    (g) => g.name.toLowerCase().replace(/\s+/g, "-") === params.slug.toLowerCase()
  );
  if (!group) notFound();

  // Fetch upcoming fixtures for the league, filter to this group's teams
  const teamIds = new Set(group.teams.map((t) => t.teamId));
  const upcomingCacheKey = "af:upcoming:1:2026";
  let allUpcoming: NormalizedMatch[] = (await getCached<NormalizedMatch[]>(upcomingCacheKey)) ?? [];
  if (allUpcoming.length === 0) {
    allUpcoming = await fetchUpcomingByLeague("1", 2026, 96);
    if (allUpcoming.length > 0) await setCached(upcomingCacheKey, allUpcoming, 300);
  }

  const groupFixtures = allUpcoming
    .filter((m) => teamIds.has(m.homeTeam.id) || teamIds.has(m.awayTeam.id))
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(0, 10);

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 space-y-8">

      {/* Back + Header */}
      <div className="flex flex-col gap-4">
        <Link href="/groups"
          className="inline-flex items-center gap-1 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          All Groups
        </Link>
        <h1 className="font-montserrat font-black text-4xl text-on-surface border-b-4 border-primary inline-block pb-1">
          {group.name}
        </h1>
        <p className="text-sm text-on-surface-variant mt-2">2026 World Cup · Group Stage Standings</p>
      </div>

      {/* Standings table */}
      <section>
        <div className="rounded-2xl overflow-hidden card-border-bold">
          {/* Table header */}
          <div className="px-5 py-3 flex items-center bg-primary border-b-4 border-on-surface">
            <span className="font-montserrat font-black text-sm uppercase tracking-widest text-on-primary flex-1">
              Team
            </span>
            <div className="flex gap-4">
              {["P", "W", "D", "L", "GF", "GA", "GD", "Pts"].map((h) => (
                <span key={h}
                  className="barlow text-xs font-bold uppercase text-on-primary/70 w-6 text-center">
                  {h}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white">
            {group.teams.map((team, i) => (
              <StandingRow key={team.teamId} team={team} isLast={i === group.teams.length - 1} />
            ))}
          </div>

          {/* Legend */}
          <div className="px-5 py-2 bg-surface-container flex items-center gap-4 text-xs text-on-surface-variant border-t border-outline-variant">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span>Advances to Round of 32</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming fixtures */}
      <section className="space-y-3">
        <h2 className="font-montserrat font-black text-2xl text-on-surface border-b-4 border-primary inline-block pb-1">
          Upcoming Matches
        </h2>

        {groupFixtures.length === 0 ? (
          <div className="card-border-bold rounded-xl p-8 text-center text-on-surface-variant bg-white">
            <span className="material-symbols-outlined text-4xl opacity-30 block mb-2">event_busy</span>
            <p className="font-semibold text-sm">No upcoming fixtures scheduled yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {groupFixtures.map((match) => (
              <FixtureCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

// ─── Standing Row ─────────────────────────────────────────────────────────────

function StandingRow({ team, isLast }: { team: StandingEntry; isLast: boolean }) {
  const isQualified = team.rank <= 2;
  const gd = team.goalDiff > 0 ? `+${team.goalDiff}` : String(team.goalDiff);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors
        ${isQualified ? "border-l-4 border-primary" : "border-l-4 border-transparent"}`}
      style={!isLast ? { borderBottom: "1px solid rgba(26,28,28,0.08)" } : {}}
    >
      {/* Rank */}
      <span className={`barlow text-sm font-bold w-4 text-center shrink-0
        ${isQualified ? "text-primary" : "text-on-surface-variant"}`}>
        {team.rank}
      </span>

      {/* Logo + name */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-outline-variant shrink-0
          flex items-center justify-center bg-surface-container">
          {team.teamLogo ? (
            <Image src={team.teamLogo} alt={team.teamName} width={32} height={32}
              className="w-full h-full object-contain scale-[1.8]" unoptimized />
          ) : (
            <span className="font-montserrat font-black text-xs text-on-surface-variant">
              {team.teamName.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <span className="font-bold text-sm text-on-surface truncate">{team.teamName}</span>
      </div>

      {/* Stats: P W D L GF GA GD Pts */}
      <div className="flex gap-4 shrink-0">
        {[team.played, team.won, team.drawn, team.lost, team.goalsFor, team.goalsAgainst].map((v, i) => (
          <span key={i} className="barlow text-sm text-on-surface-variant w-6 text-center tabular-nums">
            {v}
          </span>
        ))}
        <span className={`barlow text-sm w-6 text-center tabular-nums font-bold
          ${team.goalDiff > 0 ? "text-primary" : team.goalDiff < 0 ? "text-error" : "text-on-surface-variant"}`}>
          {gd}
        </span>
        <span className="barlow text-sm font-black text-on-surface w-6 text-center tabular-nums">
          {team.points}
        </span>
      </div>
    </div>
  );
}

// ─── Fixture Card ─────────────────────────────────────────────────────────────

function FixtureCard({ match }: { match: NormalizedMatch }) {
  const date = new Date(match.timestamp * 1000);
  const dateStr = date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const timeStr = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC";

  return (
    <Link href={`/match/${match.id}`}
      className="card-border-bold-sm rounded-xl bg-white hover:bg-surface-container-low transition-colors overflow-hidden block">
      <div className="flex items-center px-4 py-3 gap-4">

        {/* Date/time */}
        <div className="shrink-0 text-center min-w-[72px]">
          <p className="text-xs font-bold text-primary">{dateStr.split(",")[0]}</p>
          <p className="text-sm font-black text-on-surface font-montserrat">{dateStr.replace(/^\w+,\s*/, "")}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">{timeStr}</p>
        </div>

        <div className="w-px h-10 bg-outline-variant shrink-0" />

        {/* Home team */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="font-bold text-sm text-on-surface truncate text-right">{match.homeTeam.name}</span>
          {match.homeTeam.logo && (
            <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={28} height={28}
              className="object-contain shrink-0" unoptimized />
          )}
        </div>

        {/* VS */}
        <div className="shrink-0 px-2">
          <span className="font-montserrat font-black text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded">
            VS
          </span>
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {match.awayTeam.logo && (
            <Image src={match.awayTeam.logo} alt={match.awayTeam.name} width={28} height={28}
              className="object-contain shrink-0" unoptimized />
          )}
          <span className="font-bold text-sm text-on-surface truncate">{match.awayTeam.name}</span>
        </div>

        {/* Arrow */}
        <span className="material-symbols-outlined text-on-surface-variant text-base shrink-0">chevron_right</span>
      </div>
    </Link>
  );
}
