import Image from "next/image";
import Link from "next/link";
import { fetchStandings, GroupStanding, StandingEntry } from "@/lib/apifootball";
import { getCached, setCached } from "@/lib/redis";

export const revalidate = 120;

export async function generateMetadata() {
  return { title: "Groups – Goaltoon" };
}

export default async function GroupsPage() {
  const cacheKey = "af:standings:1:2026";
  let groups: GroupStanding[] = (await getCached<GroupStanding[]>(cacheKey)) ?? [];

  if (groups.length === 0) {
    groups = await fetchStandings("1", 2026);
    if (groups.length > 0) await setCached(cacheKey, groups, 300);
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 py-8">
      <div className="mb-8">
        <h1 className="font-montserrat font-black text-4xl text-on-surface
          border-b-4 border-primary inline-block pb-1">
          Group Stage
        </h1>
        <p className="text-sm text-on-surface-variant mt-2">
          2026 International Tournament · 48 Teams · 12 Groups
        </p>
      </div>

      {groups.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {groups
              .filter((g) => !/third|3rd|best/i.test(g.name))
              .map((g) => (
              <GroupCard
                key={g.name}
                group={g}
                slug={encodeURIComponent(g.name.toLowerCase().replace(/\s+/g, "-"))}
              />
            ))}
          </div>

          <BestThirdsTable groups={groups} />
        </>
      )}
    </div>
  );
}

// ─── Group Card (tıklanabilir) ────────────────────────────────────────────────

function GroupCard({ group, slug }: { group: GroupStanding; slug: string }) {
  return (
    <div className="rounded-2xl overflow-hidden card-border-bold">
      <Link
        href={`/groups/${slug}`}
        className="px-5 py-3 flex items-center justify-between border-b-4 border-on-surface bg-primary hover:bg-primary/90 transition-colors"
      >
        <span className="font-montserrat font-black text-sm uppercase tracking-widest text-on-primary">
          {group.name}
        </span>
        <div className="flex items-center gap-3">
          {["P", "W", "D", "L", "Pts"].map((h) => (
            <span key={h} className="barlow text-xs font-bold tracking-widest uppercase w-5 text-center text-on-primary/70">
              {h}
            </span>
          ))}
          <span className="material-symbols-outlined text-on-primary/70 text-base ml-1">arrow_forward</span>
        </div>
      </Link>

      <div className="bg-white flex flex-col">
        {group.teams.map((t, i) => (
          <TeamRow key={t.teamId} team={t} isLast={i === group.teams.length - 1} />
        ))}
      </div>
    </div>
  );
}

function TeamRow({ team, isLast }: { team: StandingEntry; isLast: boolean }) {
  const isQualified = team.rank <= 2;
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5
        ${isQualified ? "border-l-4 border-primary" : "border-l-4 border-transparent"}`}
      style={!isLast ? { borderBottom: "1px solid rgba(26,28,28,0.08)" } : {}}
    >
      <span className={`barlow text-sm font-bold w-4 text-center shrink-0
        ${isQualified ? "text-primary" : "text-on-surface-variant"}`}>
        {team.rank}
      </span>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-outline-variant shrink-0 flex items-center justify-center bg-surface-container">
          {team.teamLogo ? (
            <Image src={team.teamLogo} alt={team.teamName} width={28} height={28}
              className="w-full h-full object-contain scale-[1.8]" unoptimized />
          ) : (
            <span className="font-montserrat font-black text-xs text-on-surface-variant">
              {team.teamName.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <span className="font-bold text-sm text-on-surface truncate">{team.teamName}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {[team.played, team.won, team.drawn, team.lost].map((v, i) => (
          <span key={i} className="barlow text-sm font-bold text-on-surface-variant w-5 text-center tabular-nums">
            {v}
          </span>
        ))}
        <span className="barlow text-sm font-black text-on-surface w-5 text-center tabular-nums">
          {team.points}
        </span>
        {/* invisible spacer matching the arrow_forward icon in the header */}
        <span className="material-symbols-outlined opacity-0 text-base ml-1 pointer-events-none select-none" aria-hidden="true">
          arrow_forward
        </span>
      </div>
    </div>
  );
}

// ─── Best Third-Place Table (tıklanamaz) ─────────────────────────────────────

function BestThirdsTable({ groups }: { groups: GroupStanding[] }) {
  const thirds = groups
    .flatMap((g) => {
      const t = g.teams.find((t) => t.rank === 3);
      return t ? [{ ...t, groupName: g.name }] : [];
    })
    .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor);

  if (thirds.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="mb-4">
        <h2 className="font-montserrat font-black text-2xl text-on-surface border-b-4 border-primary inline-block pb-1">
          Best Third-Place Teams
        </h2>
        <p className="text-xs text-on-surface-variant mt-1">Top 8 advance to the Round of 32</p>
      </div>

      <div className="rounded-2xl overflow-hidden card-border-bold cursor-default select-none">
        {/* Header — plain div, not clickable */}
        <div className="px-5 py-3 flex items-center bg-surface-container border-b-4 border-on-surface">
          <span className="font-montserrat font-black text-xs uppercase tracking-widest text-on-surface-variant w-6 text-center shrink-0">#</span>
          <span className="font-montserrat font-black text-xs uppercase tracking-widest text-on-surface flex-1 ml-3">Team</span>
          <div className="flex gap-3">
            {["Grp", "P", "W", "D", "L", "GF", "GA", "GD", "Pts"].map((h) => (
              <span key={h} className="barlow text-xs font-bold uppercase text-on-surface-variant w-6 text-center">{h}</span>
            ))}
          </div>
        </div>

        <div className="bg-white flex flex-col">
          {thirds.map((team, i) => {
            const gd = team.goalDiff > 0 ? `+${team.goalDiff}` : String(team.goalDiff);
            const advances = i < 8;
            return (
              <div
                key={team.teamId}
                className={`flex items-center gap-3 px-4 py-2.5
                  ${advances ? "border-l-4 border-primary" : "border-l-4 border-transparent"}`}
                style={i < thirds.length - 1 ? { borderBottom: "1px solid rgba(26,28,28,0.08)" } : {}}
              >
                <span className={`barlow text-sm font-bold w-6 text-center shrink-0 ${advances ? "text-primary" : "text-on-surface-variant"}`}>
                  {i + 1}
                </span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-outline-variant shrink-0 flex items-center justify-center bg-surface-container">
                    {team.teamLogo ? (
                      <Image src={team.teamLogo} alt={team.teamName} width={28} height={28}
                        className="w-full h-full object-contain scale-[1.8]" unoptimized />
                    ) : (
                      <span className="font-montserrat font-black text-xs text-on-surface-variant">
                        {team.teamName.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-sm text-on-surface truncate">{team.teamName}</span>
                </div>
                <div className="flex gap-3 shrink-0">
                  <span className="barlow text-xs font-bold text-on-surface-variant w-6 text-center">
                    {team.groupName.replace(/^Group\s+/i, "")}
                  </span>
                  {[team.played, team.won, team.drawn, team.lost, team.goalsFor, team.goalsAgainst].map((v, j) => (
                    <span key={j} className="barlow text-sm text-on-surface-variant w-6 text-center tabular-nums">{v}</span>
                  ))}
                  <span className={`barlow text-sm w-6 text-center tabular-nums font-bold
                    ${team.goalDiff > 0 ? "text-primary" : team.goalDiff < 0 ? "text-error" : "text-on-surface-variant"}`}>
                    {gd}
                  </span>
                  <span className="barlow text-sm font-black text-on-surface w-6 text-center tabular-nums">{team.points}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 py-2 bg-surface-container flex items-center gap-4 text-xs text-on-surface-variant border-t border-outline-variant">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            <span>Advances to Round of 32 (top 8 third-place teams)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-container card-border-bold flex items-center justify-center">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>
          sports_soccer
        </span>
      </div>
      <h2 className="font-montserrat font-black text-2xl text-on-surface">Groups Coming Soon</h2>
      <p className="text-sm text-on-surface-variant max-w-sm">
        Group standings will appear once the tournament kicks off on June 11, 2026.
      </p>
    </div>
  );
}
