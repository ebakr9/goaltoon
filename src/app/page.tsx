import Image from "next/image";
import { fetchFixturesByDate, NormalizedMatch } from "@/lib/apifootball";
import { LEAGUE_IDS } from "@/lib/leagues";
import LiveScoreClient from "@/components/LiveScoreClient";
import HeroCountdown from "@/components/HeroCountdown";
import LocalTime from "@/components/LocalTime";

export const revalidate = 60;

export default async function HomePage({ searchParams }: { searchParams: { date?: string } }) {
  const today = new Date().toISOString().slice(0, 10);
  const initialDate = searchParams.date ?? today;
  let matches: NormalizedMatch[] = [];
  try {
    const all = await fetchFixturesByDate(initialDate);
    matches = all.filter((m) => LEAGUE_IDS.includes(m.leagueId ?? ""));
  } catch { /**/ }

  const live     = matches.filter((m) => m.status === "live");
  const upcoming = matches.filter((m) => m.status === "upcoming");
  const finished = matches.filter((m) => m.status === "finished");

  const featured = live[0] ?? upcoming[0] ?? null;

  const initial = { live, upcoming, finished, date: initialDate, leagueId: "all", fetchedAt: Date.now() };

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative w-full bg-surface-container-high border-b-2 border-outline-variant overflow-hidden">
        {/* BG image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/wc-bg.png"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, #e8e8e8, transparent)" }} />
        </div>

        <div className="relative z-10 max-w-container-max mx-auto px-4 md:px-10 py-16 md:py-24
          text-center md:text-left flex flex-col md:flex-row items-center gap-12">

          {/* Left: copy + countdown */}
          <div className="flex-1 space-y-6">
            <span className="inline-block bg-tertiary-container text-on-tertiary-container px-4 py-1
              rounded-full text-sm font-bold border-2 border-outline-variant">
              Tournament Kickoff
            </span>

            <h1 className="font-montserrat font-black text-on-surface leading-tight"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", letterSpacing: "-0.02em" }}>
              The Pitch Awaits.
            </h1>

            <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Track every goal, foul, and moment of glory in real-time.
              Unapologetically bold stats for the true fans.
            </p>

            <HeroCountdown />
          </div>

          {/* Right: featured match card */}
          <div className="flex-1 w-full max-w-md">
            <FeaturedCard match={featured} />
          </div>
        </div>
      </section>

      {/* ── Match sections ── */}
      <div className="max-w-container-max mx-auto px-4 md:px-10 py-10 pb-20">
        <LiveScoreClient initial={initial} />
      </div>
    </>
  );
}

/* ── Featured match card (right side of hero) ── */
function FeaturedCard({ match }: { match: NormalizedMatch | null }) {
  if (!match) {
    return (
      <div className="card-flat rounded-2xl p-8 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-primary pulse-dot" />
          <span className="text-sm font-bold text-primary uppercase tracking-widest">Coming Soon</span>
        </div>
        <div className="font-montserrat font-black text-on-surface text-2xl">Live Football Returns</div>
        <p className="text-sm text-on-surface-variant">
          International football kicks off June 11, 2026. Check back then for live scores.
        </p>
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border border-primary/30
          bg-primary/5 text-primary text-sm font-bold">
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          48 Nations · 104 Matches · 3 Countries
        </div>
      </div>
    );
  }

  const isLive = match.status === "live";

  return (
    <div className="card-flat rounded-2xl p-6 relative overflow-hidden">
      {/* Live badge */}
      {isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-error-container
          text-on-error-container px-3 py-1 rounded-full border border-error text-sm font-bold">
          <span className="w-2 h-2 rounded-full bg-error pulse-dot" />
          LIVE {match.minute ? `${match.minute}'` : "NOW"}
        </div>
      )}

      <div className="text-center">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {match.league} {match.round ? `· ${match.round}` : ""}
        </span>

        <div className="flex items-center justify-between mt-6 gap-2">
          {/* Home */}
          <div className="flex flex-col items-center gap-2 flex-1">
            {match.homeTeam.logo ? (
              <div className="w-16 h-16 rounded-full bg-surface-variant border-2 border-outline
                flex items-center justify-center overflow-hidden">
                <Image src={match.homeTeam.logo} alt={match.homeTeam.name}
                  width={64} height={64} className="object-contain" unoptimized />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-surface-container border-2 border-outline
                flex items-center justify-center text-3xl">⚽</div>
            )}
            <span className="font-montserrat font-bold text-on-surface text-sm text-center leading-tight">
              {match.homeTeam.name}
            </span>
          </div>

          {/* Score */}
          <div className="font-montserrat font-black text-4xl px-4 py-2 bg-surface-container
            rounded-xl border-2 border-outline-variant text-on-surface tabular-nums shrink-0">
            {match.score.home !== null
              ? `${match.score.home} – ${match.score.away}`
              : <LocalTime timestamp={match.timestamp} stackTz />}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-2 flex-1">
            {match.awayTeam.logo ? (
              <div className="w-16 h-16 rounded-full bg-surface-variant border-2 border-outline
                flex items-center justify-center overflow-hidden">
                <Image src={match.awayTeam.logo} alt={match.awayTeam.name}
                  width={64} height={64} className="object-contain" unoptimized />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-surface-container border-2 border-outline
                flex items-center justify-center text-3xl">⚽</div>
            )}
            <span className="font-montserrat font-bold text-on-surface text-sm text-center leading-tight">
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {match.venue && (
          <p className="mt-5 text-primary text-sm font-bold bg-primary/5 inline-block
            px-4 py-2 rounded-full border border-primary/20">
            📍 {match.venue}
          </p>
        )}
      </div>
    </div>
  );
}
