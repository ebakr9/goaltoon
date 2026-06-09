import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchMatchById, fetchMatchStats, MatchStat } from "@/lib/sportsdb";
import { getCountryConfig } from "@/lib/countries";
import PredictionButtons from "@/components/PredictionButtons";

interface Props {
  params: { id: string };
}

export const revalidate = 30;

export async function generateMetadata({ params }: Props) {
  const match = await fetchMatchById(params.id);
  if (!match) return { title: "Match – Goaltoon" };
  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name} – Goaltoon`,
  };
}

export default async function MatchPage({ params }: Props) {
  const [match, stats] = await Promise.all([
    fetchMatchById(params.id),
    fetchMatchStats(params.id),
  ]);

  if (!match) notFound();

  const homeConfig = getCountryConfig(match.homeTeam.name);
  const awayConfig = getCountryConfig(match.awayTeam.name);
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";

  return (
    <div className="max-w-2xl mx-auto">
      <a
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Fixtures
      </a>

      {/* ── Match header ── */}
      <div
        className="relative overflow-hidden rounded-3xl border border-[#2e3650] p-6 mb-6"
        style={{
          background: `linear-gradient(135deg, ${homeConfig.color}44, ${awayConfig.color}44)`,
        }}
      >
        <div className="absolute inset-0 pitch-texture opacity-20" />

        <div className="relative z-10">
          {/* League + status */}
          <div className="flex items-center justify-between mb-4 text-xs">
            <span className="text-slate-400 font-medium">{match.league}</span>
            {isLive && (
              <div className="flex items-center gap-1.5 bg-red-600/20 border border-red-500/40 rounded-full px-2.5 py-1">
                <span className="live-dot w-2 h-2 rounded-full bg-red-500" />
                <span className="font-bold text-red-400">
                  {match.minute ? `${match.minute}'` : "LIVE"}
                </span>
              </div>
            )}
            {isFinished && (
              <span className="text-slate-500 font-bold bg-slate-800 rounded-full px-2.5 py-1">
                FT
              </span>
            )}
            {!isLive && !isFinished && (
              <span className="text-slate-400 font-bold bg-slate-800/60 rounded-full px-2.5 py-1">
                Upcoming
              </span>
            )}
          </div>

          {/* Teams and score */}
          <div className="flex items-center gap-4 justify-between">
            <TeamBlock
              name={match.homeTeam.name}
              badge={match.homeTeam.badge}
              flag={homeConfig.flag}
              mascot={homeConfig.mascot}
            />

            <div className="text-center shrink-0">
              {match.score.home !== null ? (
                <div
                  className="text-6xl font-bold text-white tabular-nums"
                  style={{ fontFamily: "'Fredoka One', cursive" }}
                >
                  {match.score.home} – {match.score.away}
                </div>
              ) : (
                <div className="text-2xl font-bold text-slate-400">{match.time}</div>
              )}
              <div className="text-xs text-slate-500 mt-1">{match.date}</div>
              {match.venue && (
                <div className="text-xs text-slate-600 mt-0.5">📍 {match.venue}</div>
              )}
            </div>

            <TeamBlock
              name={match.awayTeam.name}
              badge={match.awayTeam.badge}
              flag={awayConfig.flag}
              mascot={awayConfig.mascot}
            />
          </div>

          {/* Prediction (only for non-finished) */}
          {!isFinished && (
            <div className="mt-5">
              <p className="text-xs text-slate-500 text-center mb-1 font-semibold uppercase tracking-wide">
                Your Prediction
              </p>
              <PredictionButtons
                matchId={match.id}
                homeTeam={match.homeTeam.name}
                awayTeam={match.awayTeam.name}
                disabled={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      {stats.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-xl font-bold text-slate-300 mb-4"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            📊 Match Stats
          </h2>
          <div className="bg-[#1a1f2e] border border-[#2e3650] rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 px-4 py-2.5 border-b border-[#2e3650] text-xs font-bold text-slate-500 uppercase tracking-wide">
              <span className="text-center">{match.homeTeam.name}</span>
              <span className="text-center">Stat</span>
              <span className="text-center">{match.awayTeam.name}</span>
            </div>

            {stats.map((stat, i) => (
              <StatRow
                key={i}
                stat={stat}
                isLast={i === stats.length - 1}
              />
            ))}
          </div>
        </section>
      )}

      {/* No stats message */}
      {stats.length === 0 && isFinished && (
        <div className="text-center py-8 text-slate-600 text-sm">
          No detailed statistics available for this match.
        </div>
      )}

      {isLive && stats.length === 0 && (
        <p className="text-center text-slate-500 text-sm mt-4">
          Statistics will appear as the match progresses…
        </p>
      )}
    </div>
  );
}

function StatRow({ stat, isLast }: { stat: MatchStat; isLast: boolean }) {
  const home = stat.home ?? 0;
  const away = stat.away ?? 0;
  const total = home + away;
  const homeWidth = total === 0 ? 50 : Math.round((home / total) * 100);
  const awayWidth = 100 - homeWidth;

  return (
    <div className={`px-4 py-3 ${!isLast ? "border-b border-[#2e3650]" : ""}`}>
      {/* Numbers + label */}
      <div className="grid grid-cols-3 items-center mb-1.5">
        <span className="text-center text-sm font-bold text-white tabular-nums">
          {stat.home ?? "–"}
        </span>
        <span className="text-center text-xs text-slate-500 font-medium">{stat.name}</span>
        <span className="text-center text-sm font-bold text-white tabular-nums">
          {stat.away ?? "–"}
        </span>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="flex rounded-full overflow-hidden h-1.5 gap-0.5">
          <div
            className="bg-blue-500 rounded-l-full transition-all"
            style={{ width: `${homeWidth}%` }}
          />
          <div
            className="bg-red-500 rounded-r-full transition-all"
            style={{ width: `${awayWidth}%` }}
          />
        </div>
      )}
    </div>
  );
}

function TeamBlock({
  name, badge, flag, mascot,
}: {
  name: string; badge?: string; flag: string; mascot: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 w-24 text-center">
      {badge ? (
        <Image
          src={badge}
          alt={name}
          width={52}
          height={52}
          className="object-contain drop-shadow-lg"
          unoptimized
        />
      ) : (
        <span className="text-5xl animate-float">{mascot}</span>
      )}
      <span className="text-sm font-bold text-white leading-tight">{name}</span>
      <span className="text-xl">{flag}</span>
    </div>
  );
}
