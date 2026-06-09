"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NormalizedMatch } from "@/lib/sportsdb";
import { getCountryConfig } from "@/lib/countries";
import PredictionButtons from "./PredictionButtons";
import GoalAnimation from "./GoalAnimation";

export default function MatchCard({ match }: { match: NormalizedMatch }) {
  const hCfg = getCountryConfig(match.homeTeam.name);
  const aCfg = getCountryConfig(match.awayTeam.name);

  const prev  = useRef({ h: match.score.home, a: match.score.away });
  const [goal, setGoal]   = useState<string | null>(null);
  const [hPop, setHPop]   = useState(false);
  const [aPop, setAPop]   = useState(false);

  useEffect(() => {
    const p = prev.current;
    if (match.score.home !== null && p.h !== null && match.score.home > p.h) {
      setGoal(match.homeTeam.name); setHPop(true); setTimeout(() => setHPop(false), 500);
    }
    if (match.score.away !== null && p.a !== null && match.score.away > p.a) {
      setGoal(match.awayTeam.name); setAPop(true); setTimeout(() => setAPop(false), 500);
    }
    prev.current = { h: match.score.home, a: match.score.away };
  }, [match.score.home, match.score.away, match.homeTeam.name, match.awayTeam.name]);

  const isLive = match.status === "live";
  const isDone = match.status === "finished";
  const isWC   = match.leagueId === "4429";

  return (
    <>
      {goal && <GoalAnimation teamName={goal} onDone={() => setGoal(null)} />}

      <Link href={`/match/${match.id}`} className="block group">
        <article
          className="relative overflow-hidden rounded-xl transition-all duration-200"
          style={{
            background: "var(--bg2)",
            border: `1px solid ${isLive ? "rgba(230,48,48,.5)" : isWC ? "rgba(245,197,24,.35)" : "var(--line2)"}`,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor =
              isLive ? "rgba(230,48,48,.8)" : isWC ? "var(--gold)" : "var(--line2)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              isLive ? "0 8px 32px rgba(230,48,48,.15)" : "0 8px 32px rgba(0,0,0,.4)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor =
              isLive ? "rgba(230,48,48,.5)" : isWC ? "rgba(245,197,24,.35)" : "var(--line2)";
            (e.currentTarget as HTMLElement).style.transform = "";
            (e.currentTarget as HTMLElement).style.boxShadow = "";
          }}
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
            background: isLive
              ? "var(--red)"
              : isWC
              ? "linear-gradient(90deg, var(--gold), var(--cyan))"
              : `linear-gradient(90deg, ${hCfg.color}88, transparent 40%, ${aCfg.color}88)`,
          }} />

          {/* Subtle team tint */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `linear-gradient(110deg, ${hCfg.color}0a 0%, transparent 50%, ${aCfg.color}0a 100%)`,
          }} />

          <div className="relative z-10 p-4 pt-5">

            {/* League + status row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                {isWC && <span className="text-xs">🏆</span>}
                <span className="barlow text-[10px] font-bold tracking-[.14em] uppercase truncate max-w-[60%]"
                  style={{ color: isWC ? "var(--gold)" : "var(--fade)" }}>
                  {match.league || "—"}
                </span>
              </div>
              <LiveChip status={match.status} minute={match.minute} />
            </div>

            {/* Teams + Score */}
            <div className="flex items-center gap-2 mb-1">

              {/* Home */}
              <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <Crest badge={match.homeTeam.badge} name={match.homeTeam.name} flag={hCfg.flag} />
                <span className="barlow text-xs font-bold text-center leading-tight truncate w-full"
                  style={{ color: "var(--chalk)", letterSpacing: ".04em" }}>
                  {match.homeTeam.name}
                </span>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center shrink-0 min-w-[96px]">
                {match.score.home !== null ? (
                  <div className="flex items-baseline gap-1.5">
                    <span className={`anton text-[2.8rem] leading-none tabular-nums ${hPop ? "scorepop" : ""}`}
                      style={{ color: "var(--white)" }}>
                      {match.score.home}
                    </span>
                    <span className="anton text-xl" style={{ color: "var(--fade)" }}>–</span>
                    <span className={`anton text-[2.8rem] leading-none tabular-nums ${aPop ? "scorepop" : ""}`}
                      style={{ color: "var(--white)" }}>
                      {match.score.away}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="anton text-xl" style={{ color: "var(--gold)" }}>
                      {match.time || "TBD"}
                    </span>
                    <span className="barlow text-[9px] font-bold tracking-widest uppercase"
                      style={{ color: "var(--fade)" }}>Kick-off</span>
                  </div>
                )}
                <span className="text-[9px] tabular-nums mt-0.5" style={{ color: "var(--fade)" }}>
                  {match.date}
                </span>
              </div>

              {/* Away */}
              <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <Crest badge={match.awayTeam.badge} name={match.awayTeam.name} flag={aCfg.flag} />
                <span className="barlow text-xs font-bold text-center leading-tight truncate w-full"
                  style={{ color: "var(--chalk)", letterSpacing: ".04em" }}>
                  {match.awayTeam.name}
                </span>
              </div>
            </div>

            {/* Venue */}
            {match.venue && (
              <p className="text-center text-[9px] mt-1 mb-1 truncate"
                style={{ color: "var(--fade)", opacity: .7 }}>
                {match.venue}
              </p>
            )}

            <PredictionButtons
              matchId={match.id}
              homeTeam={match.homeTeam.name}
              awayTeam={match.awayTeam.name}
              disabled={isDone}
            />
          </div>
        </article>
      </Link>
    </>
  );
}

function Crest({ badge, name, flag }: { badge?: string; name: string; flag: string }) {
  if (badge) return (
    <div className="w-10 h-10 flex items-center justify-center">
      <Image src={badge} alt={name} width={38} height={38} className="object-contain" unoptimized />
    </div>
  );
  return <span className="text-3xl leading-none">{flag}</span>;
}

function LiveChip({ status, minute }: { status: NormalizedMatch["status"]; minute?: string }) {
  if (status === "live") return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded"
      style={{ background: "var(--redbg)", border: "1px solid rgba(230,48,48,.4)" }}>
      <span className="liveblink w-1.5 h-1.5 rounded-full" style={{ background: "var(--red)" }} />
      <span className="barlow text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--red)" }}>
        {minute ? `${minute}'` : "Live"}
      </span>
    </div>
  );
  if (status === "finished") return (
    <span className="barlow text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded"
      style={{ background: "var(--bg3)", border: "1px solid var(--line)", color: "var(--fade)" }}>
      FT
    </span>
  );
  return (
    <span className="barlow text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded"
      style={{ background: "rgba(245,197,24,.08)", border: "1px solid rgba(245,197,24,.25)", color: "var(--gold)" }}>
      Soon
    </span>
  );
}
