"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NormalizedMatch } from "@/lib/apifootball";
import { getLeague } from "@/lib/leagues";
import PredictionButtons from "./PredictionButtons";
import GoalAnimation from "./GoalAnimation";

export default function MatchCard({ match }: { match: NormalizedMatch }) {
  const prev  = useRef({ h: match.score.home, a: match.score.away });
  const [goal, setGoal] = useState<string | null>(null);
  const [hPop, setHPop] = useState(false);
  const [aPop, setAPop] = useState(false);

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

  const isLive     = match.status === "live";
  const isDone     = match.status === "finished";
  const league     = getLeague(match.leagueId ?? "");
  const isFeatured = !!league?.featured;

  return (
    <>
      {goal && <GoalAnimation teamName={goal} onDone={() => setGoal(null)} />}

      <Link href={`/match/${match.id}`} className="block group">
        <article
          className="card-flat rounded-xl flex flex-col relative overflow-hidden
            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)]"
        >
          {/* Top accent strip */}
          <div className="h-1 w-full" style={{
            background: isLive
              ? "#ba1a1a"
              : isFeatured
              ? "linear-gradient(90deg, #006d37, #2ecc71)"
              : "linear-gradient(90deg, #bbcbbb, #e8e8e8)",
          }} />

          <div className="p-5 flex flex-col flex-1">
            {/* League + status */}
            <div className="flex items-center justify-between mb-4 border-b-2 border-outline-variant pb-3">
              <div className="flex items-center gap-1.5">
                {match.leagueLogo ? (
                  <Image src={match.leagueLogo} alt={match.league ?? ""} width={14} height={14}
                    className="object-contain" unoptimized />
                ) : null}
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border
                  ${isFeatured
                    ? "bg-secondary-container text-on-secondary-container border-secondary/50"
                    : "bg-surface-container text-on-surface-variant border-outline-variant"
                  }`}>
                  {match.league || "—"}
                </span>
              </div>
              <StatusChip status={match.status} minute={match.minute} />
            </div>

            {/* Teams + Score */}
            <div className="flex items-center justify-between my-2 gap-2">
              {/* Home */}
              <div className="flex flex-col items-center gap-2 w-1/3">
                <Crest logo={match.homeTeam.logo} name={match.homeTeam.name} />
                <span className="font-montserrat font-bold text-sm text-center text-on-surface leading-tight truncate w-full text-center">
                  {match.homeTeam.name}
                </span>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center w-1/3 shrink-0">
                {match.score.home !== null ? (
                  <span className="font-montserrat font-bold text-2xl bg-surface-container
                    px-3 py-1 rounded-lg border-2 border-outline-variant text-on-surface tabular-nums">
                    <span className={hPop ? "scorepop inline-block" : ""}>{match.score.home}</span>
                    {" – "}
                    <span className={aPop ? "scorepop inline-block" : ""}>{match.score.away}</span>
                  </span>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="font-montserrat font-bold text-xl text-primary">
                      {match.timestamp
                        ? new Date(match.timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : match.time || "TBD"}
                    </span>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                      {Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " ")}
                    </span>
                  </div>
                )}
                <span className="text-[10px] text-on-surface-variant mt-1">{match.date}</span>
              </div>

              {/* Away */}
              <div className="flex flex-col items-center gap-2 w-1/3">
                <Crest logo={match.awayTeam.logo} name={match.awayTeam.name} />
                <span className="font-montserrat font-bold text-sm text-center text-on-surface leading-tight truncate w-full text-center">
                  {match.awayTeam.name}
                </span>
              </div>
            </div>

            {/* Venue */}
            {match.venue && (
              <p className="text-center text-[10px] text-on-surface-variant mt-1 truncate">
                📍 {match.venue}
              </p>
            )}

            {/* Prediction buttons */}
            <div className="mt-auto pt-4 border-t-2 border-outline-variant">
              <PredictionButtons
                matchId={match.id}
                homeTeam={match.homeTeam.name}
                awayTeam={match.awayTeam.name}
                disabled={isDone}
              />
            </div>
          </div>
        </article>
      </Link>
    </>
  );
}

function Crest({ logo, name }: { logo?: string; name: string }) {
  if (logo) return (
    <div className="w-12 h-12 rounded-full bg-surface-variant border-2 border-outline
      flex items-center justify-center overflow-hidden shrink-0">
      <Image src={logo} alt={name} width={44} height={44} className="object-contain" unoptimized />
    </div>
  );
  return (
    <div className="w-12 h-12 rounded-full bg-surface-container border-2 border-outline
      flex items-center justify-center text-2xl shrink-0">
      ⚽
    </div>
  );
}

function StatusChip({ status, minute }: { status: NormalizedMatch["status"]; minute?: number }) {
  if (status === "live") return (
    <div className="flex items-center gap-1.5 text-error text-xs font-bold">
      <span className="w-2 h-2 rounded-full bg-error pulse-dot" />
      {minute != null ? `${minute}'` : "LIVE"}
    </div>
  );
  if (status === "finished") return (
    <span className="text-xs font-bold text-on-surface-variant bg-surface-variant
      px-2 py-0.5 rounded border border-outline-variant">FT</span>
  );
  return (
    <span className="text-xs font-bold text-primary bg-primary/10
      px-2 py-0.5 rounded border border-primary/20">Soon</span>
  );
}
