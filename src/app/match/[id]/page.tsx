import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchMatchById, fetchMatchStats, MatchStat } from "@/lib/sportsdb";
import { getCountryConfig } from "@/lib/countries";
import PredictionButtons from "@/components/PredictionButtons";

interface Props { params: { id: string } }

export const revalidate = 30;

export async function generateMetadata({ params }: Props) {
  const match = await fetchMatchById(params.id);
  if (!match) return { title: "Match – Goaltoon" };
  return { title: `${match.homeTeam.name} vs ${match.awayTeam.name} – Goaltoon` };
}

export default async function MatchPage({ params }: Props) {
  const [match, stats] = await Promise.all([
    fetchMatchById(params.id),
    fetchMatchStats(params.id),
  ]);
  if (!match) notFound();

  const hCfg = getCountryConfig(match.homeTeam.name);
  const aCfg = getCountryConfig(match.awayTeam.name);
  const isLive     = match.status === "live";
  const isFinished = match.status === "finished";

  return (
    <div className="max-w-2xl mx-auto">
      <a href="/" className="back-link inline-flex items-center gap-1.5 barlow text-sm font-bold
        tracking-wide uppercase mb-6">
        ← Back
      </a>

      {/* ── Match header ── */}
      <div className="relative overflow-hidden rounded-xl p-6 mb-5"
        style={{
          background: "var(--bg2)",
          border: `1px solid ${isLive ? "rgba(230,48,48,.5)" : "var(--line2)"}`,
          boxShadow: isLive ? "0 0 30px rgba(230,48,48,.1)" : "none",
        }}>

        {/* Team colour tint */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `linear-gradient(110deg, ${hCfg.color}12 0%, transparent 50%, ${aCfg.color}12 100%)`,
        }} />
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{
          background: isLive
            ? "var(--red)"
            : `linear-gradient(90deg, ${hCfg.color}bb 0%, var(--gold) 50%, ${aCfg.color}bb 100%)`,
        }} />

        <div className="relative z-10">
          {/* League + status */}
          <div className="flex items-center justify-between mb-5">
            <span className="barlow text-xs font-bold tracking-[.14em] uppercase"
              style={{ color: "var(--fade)" }}>{match.league}</span>

            {isLive && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded"
                style={{ background: "var(--redbg)", border: "1px solid rgba(230,48,48,.4)" }}>
                <span className="liveblink w-1.5 h-1.5 rounded-full" style={{ background: "var(--red)" }} />
                <span className="barlow text-xs font-bold tracking-widest uppercase" style={{ color: "var(--red)" }}>
                  {match.minute ? `${match.minute}'` : "LIVE"}
                </span>
              </div>
            )}
            {isFinished && (
              <span className="barlow text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded"
                style={{ background: "var(--bg3)", border: "1px solid var(--line)", color: "var(--fade)" }}>
                Full Time
              </span>
            )}
            {!isLive && !isFinished && (
              <span className="barlow text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded"
                style={{ background: "rgba(245,197,24,.08)", border: "1px solid rgba(245,197,24,.25)", color: "var(--gold)" }}>
                Upcoming
              </span>
            )}
          </div>

          {/* Teams + Score */}
          <div className="flex items-center gap-4 justify-between">
            <TeamBlock name={match.homeTeam.name} badge={match.homeTeam.badge} flag={hCfg.flag} mascot={hCfg.mascot} />

            <div className="text-center shrink-0">
              {match.score.home !== null ? (
                <div className="anton text-[4rem] leading-none tabular-nums" style={{ color: "var(--white)" }}>
                  {match.score.home} – {match.score.away}
                </div>
              ) : (
                <div className="anton text-2xl" style={{ color: "var(--gold)" }}>{match.time}</div>
              )}
              <div className="barlow text-xs mt-1.5" style={{ color: "var(--fade)" }}>{match.date}</div>
              {match.venue && (
                <div className="barlow text-xs font-semibold mt-0.5" style={{ color: "var(--chalk)" }}>
                  {match.venue}
                </div>
              )}
            </div>

            <TeamBlock name={match.awayTeam.name} badge={match.awayTeam.badge} flag={aCfg.flag} mascot={aCfg.mascot} />
          </div>

          {!isFinished && (
            <div className="mt-5">
              <PredictionButtons matchId={match.id} homeTeam={match.homeTeam.name}
                awayTeam={match.awayTeam.name} disabled={false} />
            </div>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      {stats.length > 0 && (
        <section className="mb-8">
          <div className="section-header mb-4">
            <h2 className="section-title">Match Stats</h2>
          </div>
          <div className="rounded-xl overflow-hidden"
            style={{ background: "var(--bg2)", border: "1px solid var(--line2)" }}>
            <div className="grid grid-cols-3 px-4 py-3"
              style={{ borderBottom: "1px solid var(--line)" }}>
              <span className="barlow text-[10px] font-bold tracking-widest uppercase text-center truncate"
                style={{ color: "var(--fade)" }}>{match.homeTeam.name}</span>
              <span className="barlow text-[10px] font-bold tracking-widest uppercase text-center"
                style={{ color: "var(--fade)" }}>Stat</span>
              <span className="barlow text-[10px] font-bold tracking-widest uppercase text-center truncate"
                style={{ color: "var(--fade)" }}>{match.awayTeam.name}</span>
            </div>
            {stats.map((stat, i) => (
              <StatRow key={i} stat={stat} isLast={i === stats.length - 1} />
            ))}
          </div>
        </section>
      )}

      {stats.length === 0 && isFinished && (
        <p className="text-center py-8 text-sm" style={{ color: "var(--fade)" }}>
          No statistics available for this match.
        </p>
      )}
      {isLive && stats.length === 0 && (
        <p className="text-center text-sm mt-4" style={{ color: "var(--fade)" }}>
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
  const homeW = total === 0 ? 50 : Math.round((home / total) * 100);

  return (
    <div className="px-4 py-3" style={!isLast ? { borderBottom: "1px solid var(--line)" } : {}}>
      <div className="grid grid-cols-3 items-center mb-2">
        <span className="text-center text-sm font-bold tabular-nums" style={{ color: "var(--white)" }}>
          {stat.home ?? "–"}
        </span>
        <span className="barlow text-center text-[10px] font-bold tracking-wide uppercase"
          style={{ color: "var(--fade)" }}>{stat.name}</span>
        <span className="text-center text-sm font-bold tabular-nums" style={{ color: "var(--white)" }}>
          {stat.away ?? "–"}
        </span>
      </div>
      {total > 0 && (
        <div className="flex rounded overflow-hidden h-1" style={{ gap: 1 }}>
          <div style={{ width: `${homeW}%`, background: "var(--gold)", borderRadius: 2 }} />
          <div style={{ width: `${100 - homeW}%`, background: "var(--cyan)", borderRadius: 2 }} />
        </div>
      )}
    </div>
  );
}

function TeamBlock({ name, badge, flag }: { name: string; badge?: string; flag: string; mascot: string }) {
  return (
    <div className="flex flex-col items-center gap-2 w-28 text-center">
      {badge ? (
        <Image src={badge} alt={name} width={56} height={56} className="object-contain" unoptimized />
      ) : (
        <span className="text-4xl leading-none">{flag}</span>
      )}
      <span className="barlow text-sm font-bold leading-tight" style={{ color: "var(--chalk)" }}>{name}</span>
    </div>
  );
}
