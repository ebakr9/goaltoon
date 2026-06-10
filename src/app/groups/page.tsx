import Image from "next/image";
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {groups.map((g) => (
            <GroupCard key={g.name} group={g} />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupCard({ group }: { group: GroupStanding }) {
  return (
    <div className="rounded-2xl overflow-hidden card-border-bold">
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between border-b-4 border-on-surface bg-primary">
        <span className="font-montserrat font-black text-sm uppercase tracking-widest text-on-primary">
          {group.name}
        </span>
        <div className="flex gap-3">
          {["P", "W", "D", "L", "Pts"].map((h) => (
            <span key={h}
              className="barlow text-xs font-bold tracking-widest uppercase w-5 text-center text-on-primary/70">
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Teams */}
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
      className={`flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-low transition-colors
        ${isQualified ? "border-l-4 border-primary" : "border-l-4 border-transparent"}`}
      style={!isLast ? { borderBottom: "1px solid rgba(26,28,28,0.08)" } : {}}
    >
      {/* Rank */}
      <span className={`barlow text-sm font-bold w-4 text-center shrink-0
        ${isQualified ? "text-primary" : "text-on-surface-variant"}`}>
        {team.rank}
      </span>

      {/* Logo badge + name */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-outline-variant shrink-0
          flex items-center justify-center bg-surface-container">
          {team.teamLogo ? (
            <Image
              src={team.teamLogo}
              alt={team.teamName}
              width={28}
              height={28}
              className="w-full h-full object-contain scale-[1.8]"
              unoptimized
            />
          ) : (
            <span className="font-montserrat font-black text-xs text-on-surface-variant">
              {team.teamName.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <span className="font-bold text-sm text-on-surface truncate">{team.teamName}</span>
      </div>

      {/* Stats */}
      <div className="flex gap-3 shrink-0">
        {[team.played, team.won, team.drawn, team.lost].map((v, i) => (
          <span key={i} className="barlow text-sm font-bold text-on-surface-variant w-5 text-center tabular-nums">
            {v}
          </span>
        ))}
        <span className="barlow text-sm font-black text-on-surface w-5 text-center tabular-nums">
          {team.points}
        </span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-container card-border-bold
        flex items-center justify-center">
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
