import { notFound } from "next/navigation";
import Image from "next/image";
import {
  fetchFixtureById,
  fetchFixtureEvents,
  fetchFixtureStats,
  fetchFixtureLineups,
} from "@/lib/apifootball";
import { getCountryConfig } from "@/lib/countries";
import MatchDetailClient from "@/components/MatchDetailClient";
import PredictionWidget from "@/components/PredictionWidget";

interface Props { params: { id: string } }

export const revalidate = 30;

export async function generateMetadata({ params }: Props) {
  const match = await fetchFixtureById(params.id);
  if (!match) return { title: "Match – Goaltoon" };
  return { title: `${match.homeTeam.name} vs ${match.awayTeam.name} – Goaltoon` };
}

export default async function MatchPage({ params }: Props) {
  const [match, events, stats, lineups] = await Promise.all([
    fetchFixtureById(params.id),
    fetchFixtureEvents(params.id),
    fetchFixtureStats(params.id),
    fetchFixtureLineups(params.id),
  ]);

  if (!match) notFound();

  const hCfg      = getCountryConfig(match.homeTeam.name);
  const aCfg      = getCountryConfig(match.awayTeam.name);
  const isLive    = match.status === "live";
  const isDone    = match.status === "finished";
  const goalEvents = events.filter((e) => e.type === "Goal");

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 py-6">

      {/* Back */}
      <a href="/" className="back-link inline-flex items-center gap-1.5 barlow text-sm font-bold
        tracking-wide uppercase mb-5">
        ← Back
      </a>

      {/* ══ Header grid: score panel (8) + goal celebration (4) ══ */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch mb-6">

        {/* ── Left 8: pitch score panel ── */}
        <div
          className="lg:col-span-8 rounded-2xl overflow-hidden card-border-bold relative
            pitch-pattern-dense flex flex-col sm:flex-row"
          style={{ boxShadow: "8px 8px 0 0 #1a1c1c", minHeight: 168 }}
        >
          <div className="absolute inset-0 stadium-geo opacity-50 z-0" />

          {/* Home side */}
          <div
            className="flex-1 p-5 md:p-7 flex flex-col items-center justify-center relative z-10"
            style={{ background: `linear-gradient(to right, ${hCfg.color}cc, transparent)` }}
          >
            {match.homeTeam.logo ? (
              <div className="w-[68px] h-[68px] md:w-20 md:h-20 rounded-full bg-white border-4
                border-white overflow-hidden mb-2 shadow-[4px_4px_0_0_#1a1c1c]">
                <Image src={match.homeTeam.logo} alt={match.homeTeam.name}
                  width={80} height={80} className="w-full h-full object-contain" unoptimized />
              </div>
            ) : (
              <span className="text-5xl mb-2">{hCfg.flag}</span>
            )}
            <h2 className="font-montserrat font-black text-2xl md:text-3xl text-white text-center
              drop-shadow-[2px_2px_0px_#1a1c1c]">
              {abbr(match.homeTeam.name)}
            </h2>
          </div>

          {/* Score center */}
          <div className="flex flex-col items-center justify-center py-5 px-4 z-20 relative gap-2.5 shrink-0">
            {/* Status badge */}
            {isLive ? (
              <div className="flex items-center gap-2 bg-error text-white font-bold px-3.5 py-1.5
                rounded-full text-xs uppercase tracking-wider card-border-bold-sm">
                <span className="w-2 h-2 rounded-full bg-white liveblink" />
                LIVE {match.minute}&apos;
              </div>
            ) : isDone ? (
              <span className="barlow text-xs font-bold uppercase tracking-widest px-3.5 py-1.5
                rounded-full bg-surface text-on-surface-variant border-2 border-on-surface">
                FULL TIME
              </span>
            ) : (
              <span className="barlow text-xs font-bold uppercase tracking-widest px-3.5 py-1.5
                rounded-full bg-surface text-on-surface-variant border-2 border-on-surface">
                {match.time} UTC
              </span>
            )}

            {/* Score glass */}
            <div className="glass-panel px-5 py-3 rounded-2xl" style={{ boxShadow: "6px 6px 0 0 #1a1c1c" }}>
              <div className="font-montserrat font-black text-5xl md:text-6xl text-on-surface
                tabular-nums tracking-tighter">
                {match.score.home !== null
                  ? `${match.score.home} – ${match.score.away}`
                  : "vs"}
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-col items-center gap-1">
              {match.halftime.home !== null && (
                <span className="text-white/90 text-[11px] font-bold bg-black/60 px-3 py-1
                  rounded-full border border-white/20 backdrop-blur-sm">
                  HT {match.halftime.home}–{match.halftime.away} · {match.date}
                </span>
              )}
              {match.venue && (
                <span className="text-white/60 text-[10px] font-semibold">📍 {match.venue}</span>
              )}
            </div>
          </div>

          {/* Away side */}
          <div
            className="flex-1 p-5 md:p-7 flex flex-col items-center justify-center relative z-10"
            style={{ background: `linear-gradient(to left, ${aCfg.color}cc, transparent)` }}
          >
            {match.awayTeam.logo ? (
              <div className="w-[68px] h-[68px] md:w-20 md:h-20 rounded-full bg-white border-4
                border-white overflow-hidden mb-2 shadow-[4px_4px_0_0_#1a1c1c]">
                <Image src={match.awayTeam.logo} alt={match.awayTeam.name}
                  width={80} height={80} className="w-full h-full object-contain" unoptimized />
              </div>
            ) : (
              <span className="text-5xl mb-2">{aCfg.flag}</span>
            )}
            <h2 className="font-montserrat font-black text-2xl md:text-3xl text-white text-center
              drop-shadow-[2px_2px_0px_#1a1c1c]">
              {abbr(match.awayTeam.name)}
            </h2>
          </div>
        </div>

        {/* ── Right 4: Goal Celebration ── */}
        <div
          className="lg:col-span-4 bg-surface rounded-2xl p-5 card-border-bold flex flex-col gap-3"
          style={{ boxShadow: "8px 8px 0 0 #1a1c1c" }}
        >
          <h3 className="font-montserrat font-black text-base border-b-4 border-on-surface pb-2
            flex items-center gap-2 uppercase italic tracking-tight shrink-0">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}
            >
              sports_soccer
            </span>
            Goal Celebration
          </h3>

          {goalEvents.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-4 flex-1">
              No goals yet
            </p>
          ) : (
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
              {goalEvents.map((ge, i) => {
                const logo = ge.teamId === match.homeTeam.id
                  ? match.homeTeam.logo
                  : match.awayTeam.logo;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5
                      bg-surface-container-lowest rounded-lg card-border-bold-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-black text-xs bg-on-surface text-white
                        px-2 py-0.5 rounded shrink-0">
                        {ge.minute}{ge.extraMinute ? `+${ge.extraMinute}` : ""}′
                      </span>
                      <span className="font-montserrat font-black text-sm italic uppercase
                        tracking-tight text-primary truncate pr-1">
                        {ge.player}
                      </span>
                    </div>
                    {logo && (
                      <Image src={logo} alt={ge.teamName} width={26} height={26}
                        className="rounded-full border-2 border-outline-variant
                          object-contain shrink-0 ml-2"
                        unoptimized />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* League footer */}
          <div className="flex items-center gap-2 pt-2 border-t border-outline-variant shrink-0 mt-auto">
            {match.leagueLogo && (
              <Image src={match.leagueLogo} alt={match.league ?? ""} width={18} height={18}
                className="object-contain shrink-0" unoptimized />
            )}
            <span className="text-xs font-bold text-on-surface-variant truncate">{match.league}</span>
            {match.round && (
              <span className="text-[11px] text-on-surface-variant/60 truncate">· {match.round}</span>
            )}
          </div>
        </div>

        {/* Prediction widget — upcoming matches only */}
        {!isLive && !isDone && (
          <div className="lg:col-span-12">
            <PredictionWidget
              fixtureId={match.id}
              homeTeam={match.homeTeam.name}
              awayTeam={match.awayTeam.name}
            />
          </div>
        )}
      </header>

      {/* ══ Dashboard body (client — polls when live) ══ */}
      <MatchDetailClient
        match={match}
        events={events}
        stats={stats}
        lineups={lineups}
      />
    </div>
  );
}

/** 3-4 letter abbreviation for a team name */
function abbr(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return name.slice(0, 4).toUpperCase();
  return words.slice(0, 2).map((w) => w.slice(0, 3).toUpperCase()).join(" ");
}
