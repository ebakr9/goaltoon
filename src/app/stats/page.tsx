import Image from "next/image";
import {
  fetchTopScorers,
  fetchTopAssists,
  fetchTopYellowCards,
  fetchTopRedCards,
  fetchTopRatings,
  fetchStandings,
  PlayerStatEntry,
} from "@/lib/apifootball";

function TeamCircle({ logo, name, size = "sm" }: { logo: string; name: string; size?: "sm" | "md" }) {
  const dim = size === "md" ? "w-7 h-7" : "w-5 h-5";
  return (
    <div className={`${dim} rounded-full border-2 border-outline-variant bg-surface-container shrink-0 overflow-hidden flex items-center justify-center`}>
      {logo
        ? <Image src={logo} alt={name} width={28} height={28} className="w-full h-full object-contain scale-[1.8]" unoptimized />
        : <span className="text-[10px] font-black text-on-surface-variant">{name.slice(0, 2).toUpperCase()}</span>
      }
    </div>
  );
}

export const revalidate = 300;

const LEAGUE_ID = "1";
const SEASON = 2026;

export default async function StatsPage() {
  const [scorers, assists, yellows, reds, ratings, standings] = await Promise.all([
    fetchTopScorers(LEAGUE_ID, SEASON),
    fetchTopAssists(LEAGUE_ID, SEASON),
    fetchTopYellowCards(LEAGUE_ID, SEASON),
    fetchTopRedCards(LEAGUE_ID, SEASON),
    fetchTopRatings(LEAGUE_ID, SEASON),
    fetchStandings(LEAGUE_ID, SEASON),
  ]);

  const allTeamsRaw = standings.flatMap((g) => g.teams);
  // Deduplicate by teamId — some teams appear in multiple groups in the API response
  const seenTeamIds = new Set<string>();
  const allTeams = allTeamsRaw.filter((t) => {
    if (seenTeamIds.has(t.teamId)) return false;
    seenTeamIds.add(t.teamId);
    return true;
  });
  const mostGoalsFor = [...allTeams].sort((a, b) => b.goalsFor - a.goalsFor).slice(0, 8);
  const mostGoalsAgainst = [...allTeams].sort((a, b) => b.goalsAgainst - a.goalsAgainst).slice(0, 8);

  // Merge yellows + reds by playerId so each player is counted once,
  // then aggregate per team.
  const playerCardMap = new Map<number, PlayerStatEntry>();
  for (const p of yellows) playerCardMap.set(p.playerId, p);
  for (const p of reds) {
    const existing = playerCardMap.get(p.playerId);
    if (existing) {
      // Already have this player from yellows list — keep the entry as-is
      // (normalizePlayerStat already sums both card types from the API response)
    } else {
      playerCardMap.set(p.playerId, p);
    }
  }
  const teamDisciplineMap = new Map<string, { name: string; logo: string; yellow: number; red: number }>();
  for (const p of playerCardMap.values()) {
    const existing = teamDisciplineMap.get(p.teamName);
    if (existing) {
      existing.yellow += p.yellowCards;
      existing.red += p.redCards;
    } else {
      teamDisciplineMap.set(p.teamName, {
        name: p.teamName,
        logo: p.teamLogo,
        yellow: p.yellowCards,
        red: p.redCards,
      });
    }
  }
  // 1 red card weighs as much as 2 yellow cards when ranking
  const disciplineScore = (t: { yellow: number; red: number }) => t.yellow + t.red * 2;
  const discipline = Array.from(teamDisciplineMap.values())
    .sort((a, b) => disciplineScore(b) - disciplineScore(a))
    .slice(0, 6);

  const maxRating = ratings.length > 0 ? ratings[0].rating ?? 10 : 10;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-12 flex flex-col gap-12">

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-outline-variant pb-6">
        <div>
          <span className="inline-flex items-center bg-tertiary text-on-tertiary rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider mb-3">
            Tournament Overview
          </span>
          <h1 className="font-montserrat font-black text-5xl md:text-6xl text-on-background leading-none">
            Tournament Statistics
          </h1>
        </div>
      </header>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* ── Left column (8 cols) ── */}
        <div className="md:col-span-8 flex flex-col gap-6">

          {/* Golden Boot */}
          <section className="card-sticker p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b-2 border-surface-container-highest pb-4">
              <div className="flex items-center gap-3">
                <Image src="/icon.png" alt="Goaltoon" width={30} height={30} className="rounded-md" />
                <h2 className="font-montserrat font-bold text-2xl text-on-background">Golden Boot Race</h2>
              </div>
              <span className="text-on-surface-variant font-bold text-sm">Goals</span>
            </div>

            {scorers.length === 0 ? <EmptyState /> : (
              <div className="flex flex-col gap-4">
                {scorers.slice(0, 5).map((p, i) => (
                  <ScorerRow key={p.playerId} player={p} rank={i + 1} isFirst={i === 0} />
                ))}
              </div>
            )}
          </section>

          {/* Playmakers (Assists) */}
          <section className="card-sticker p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b-2 border-surface-container-highest pb-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-tertiary">sports_score</span>
                <h2 className="font-montserrat font-bold text-2xl text-on-background">Playmakers (Assists)</h2>
              </div>
            </div>
            {assists.length === 0 ? <EmptyState /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {assists.slice(0, 6).map((p) => (
                  <AssistCard key={p.playerId} player={p} />
                ))}
              </div>
            )}
          </section>

          {/* Top Rated Players */}
          <section className="card-sticker p-6 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none text-[150px] select-none">⭐</div>
            <div className="flex justify-between items-center border-b-2 border-surface-container-highest pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-secondary-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <h2 className="font-montserrat font-bold text-2xl text-on-background">Top Rated Players</h2>
              </div>
              <span className="text-on-surface-variant font-bold text-sm">Score /10</span>
            </div>
            {ratings.length === 0 ? <EmptyState /> : (
              <div className="flex flex-col gap-3 relative z-10">
                {ratings.slice(0, 8).map((p, i) => {
                  const pct = maxRating > 0 ? ((p.rating ?? 0) / maxRating) * 100 : 0;
                  const barColor = i === 0 ? "bg-primary" : i === 1 ? "bg-tertiary" : "bg-outline";
                  return (
                    <div key={p.playerId}
                      className="flex items-center justify-between py-2 border-b border-surface-container-high last:border-0">
                      <div className="flex items-center gap-3 w-[45%] min-w-0">
                        <span className={`font-bold text-sm w-4 shrink-0 ${i === 0 ? "text-primary" : "text-on-surface-variant"}`}>
                          {i + 1}
                        </span>
                        <span className="font-montserrat font-bold text-base text-on-background truncate">
                          {p.playerName}
                        </span>
                        <TeamCircle logo={p.teamLogo} name={p.teamName} size="sm" />
                      </div>
                      <div className="flex items-center gap-4 flex-1 ml-4">
                        <div className="flex-grow h-3 bg-surface-container-high rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-montserrat font-bold text-base text-on-background min-w-[2.5rem] text-right">
                          {p.rating?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>

        {/* ── Right sidebar (4 cols) ── */}
        <div className="md:col-span-4 flex flex-col gap-6">

          {/* Most Goals Scored */}
          <section className="card-sticker p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">fitness_center</span>
              <h3 className="font-montserrat font-bold text-lg text-on-background">Most Goals Scored</h3>
            </div>
            {mostGoalsFor.length === 0 ? <EmptyState /> : (
              <ul className="flex flex-col gap-2">
                {mostGoalsFor.map((t, i) => (
                  <li key={t.teamId}
                    className="flex justify-between items-center bg-surface-bright p-3 rounded border border-surface-container-highest">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface-variant w-4 text-center shrink-0">{i + 1}</span>
                      <div className="w-7 h-7 rounded-full border-2 border-outline-variant bg-surface-container shrink-0 overflow-hidden flex items-center justify-center">
                        {t.teamLogo
                          ? <Image src={t.teamLogo} alt={t.teamName} width={28} height={28} className="w-full h-full object-contain scale-[1.8]" unoptimized />
                          : <span className="text-xs font-black text-on-surface-variant">{t.teamName.slice(0, 2).toUpperCase()}</span>
                        }
                      </div>
                      <span className="font-bold text-sm text-on-background truncate">{t.teamName}</span>
                    </div>
                    <span className={`font-montserrat font-black text-xl ${i === 0 ? "text-primary" : "text-on-background"}`}>
                      {t.goalsFor}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Most Goals Conceded */}
          <section className="card-sticker p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-error">gpp_bad</span>
              <h3 className="font-montserrat font-bold text-lg text-on-background">Most Conceded</h3>
            </div>
            {mostGoalsAgainst.length === 0 ? <EmptyState /> : (
              <ul className="flex flex-col gap-2">
                {mostGoalsAgainst.map((t, i) => (
                  <li key={t.teamId}
                    className="flex justify-between items-center bg-surface-bright p-3 rounded border border-surface-container-highest">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface-variant w-4 text-center shrink-0">{i + 1}</span>
                      <div className="w-7 h-7 rounded-full border-2 border-outline-variant bg-surface-container shrink-0 overflow-hidden flex items-center justify-center">
                        {t.teamLogo
                          ? <Image src={t.teamLogo} alt={t.teamName} width={28} height={28} className="w-full h-full object-contain scale-[1.8]" unoptimized />
                          : <span className="text-xs font-black text-on-surface-variant">{t.teamName.slice(0, 2).toUpperCase()}</span>
                        }
                      </div>
                      <span className="font-bold text-sm text-on-background truncate">{t.teamName}</span>
                    </div>
                    <span className={`font-montserrat font-black text-xl ${i === 0 ? "text-error" : "text-on-background"}`}>
                      {t.goalsAgainst}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Discipline */}
          <section className="card-sticker p-5">
            <div className="flex items-center gap-2 mb-4 border-b-2 border-surface-container-highest pb-2">
              <span className="material-symbols-outlined text-on-background">style</span>
              <h3 className="font-montserrat font-bold text-lg text-on-background">Discipline</h3>
            </div>
            {discipline.length === 0 ? <EmptyState /> : (
              <div className="flex flex-col gap-3">
                {discipline.map((t) => (
                  <div key={t.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2 min-w-0">
                      <TeamCircle logo={t.logo} name={t.name} size="sm" />
                      <span className="font-bold text-sm text-on-background truncate">{t.name}</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <div className="bg-secondary-container text-on-secondary-container font-bold text-xs px-2 py-1 rounded w-8 text-center"
                        title="Yellow Cards">{t.yellow}</div>
                      <div className="bg-error text-on-error font-bold text-xs px-2 py-1 rounded w-8 text-center"
                        title="Red Cards">{t.red}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}

// ─── ScorerRow ────────────────────────────────────────────────────────────────

function ScorerRow({ player, rank, isFirst }: { player: PlayerStatEntry; rank: number; isFirst: boolean }) {
  const hasPhoto = !!player.playerPhoto;

  return (
    <div className="flex items-center justify-between p-3 hover:bg-surface-container-low rounded-lg transition-colors border border-surface-container-highest">
      <div className="flex items-center gap-4">
        <span className={`font-montserrat font-bold text-xl w-8 text-center ${isFirst ? "text-primary" : "text-on-surface-variant"}`}>
          {rank}
        </span>
        {hasPhoto ? (
          <Image
            src={player.playerPhoto}
            alt={player.playerName}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full border-2 border-outline-variant object-cover shrink-0"
            unoptimized
          />
        ) : (
          <TeamCircle logo={player.teamLogo} name={player.teamName} size="md" />
        )}
        <div>
          <h3 className="font-montserrat font-bold text-lg text-on-background leading-none">
            {player.playerName}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <TeamCircle logo={player.teamLogo} name={player.teamName} size="sm" />
            <span className="text-xs text-on-surface-variant">{player.teamName}</span>
          </div>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className={`font-montserrat font-black text-4xl leading-none ${isFirst ? "text-primary" : "text-on-background"}`}>
          {player.goals}
        </span>
        <div className="text-xs text-on-surface-variant mt-0.5">{player.assists} Assists</div>
      </div>
    </div>
  );
}

// ─── AssistCard ───────────────────────────────────────────────────────────────

function AssistCard({ player }: { player: PlayerStatEntry }) {
  const hasPhoto = !!player.playerPhoto;

  return (
    <div className="border border-surface-container-highest p-4 rounded-xl flex items-center gap-4 bg-surface-bright">
      <div className="shrink-0 w-14 h-14 rounded-full border-2 border-tertiary overflow-hidden bg-surface-container-high flex items-center justify-center">
        {hasPhoto ? (
          <Image src={player.playerPhoto} alt={player.playerName} width={56} height={56}
            className="w-full h-full object-cover" unoptimized />
        ) : (
          <TeamCircle logo={player.teamLogo} name={player.teamName} size="md" />
        )}
      </div>
      <div className="flex-grow min-w-0">
        <h4 className="font-montserrat font-bold text-base text-on-background truncate">{player.playerName}</h4>
        <p className="text-xs text-on-surface-variant">{player.teamName}</p>
      </div>
      <div className="text-center bg-tertiary-fixed text-on-tertiary-fixed w-10 h-10 rounded-lg flex items-center justify-center font-montserrat font-bold text-xl shrink-0">
        {player.assists}
      </div>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2 text-on-surface-variant">
      <span className="material-symbols-outlined text-4xl opacity-30">bar_chart</span>
      <p className="text-sm font-semibold text-center">No data yet — check back after the tournament starts</p>
    </div>
  );
}
