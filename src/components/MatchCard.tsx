"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { NormalizedMatch } from "@/lib/sportsdb";
import { getCountryConfig } from "@/lib/countries";
import PredictionButtons from "./PredictionButtons";
import GoalAnimation from "./GoalAnimation";

interface Props {
  match: NormalizedMatch;
}

export default function MatchCard({ match }: Props) {
  const homeConfig = getCountryConfig(match.homeTeam.name);
  const awayConfig = getCountryConfig(match.awayTeam.name);

  const prevScore = useRef({ home: match.score.home, away: match.score.away });
  const [goalTeam, setGoalTeam] = useState<string | null>(null);
  const [homeScoreAnim, setHomeScoreAnim] = useState(false);
  const [awayScoreAnim, setAwayScoreAnim] = useState(false);

  useEffect(() => {
    const prev = prevScore.current;
    if (match.score.home !== null && prev.home !== null && match.score.home > prev.home) {
      setGoalTeam(match.homeTeam.name);
      setHomeScoreAnim(true);
      setTimeout(() => setHomeScoreAnim(false), 600);
    }
    if (match.score.away !== null && prev.away !== null && match.score.away > prev.away) {
      setGoalTeam(match.awayTeam.name);
      setAwayScoreAnim(true);
      setTimeout(() => setAwayScoreAnim(false), 600);
    }
    prevScore.current = { home: match.score.home, away: match.score.away };
  }, [match.score.home, match.score.away, match.homeTeam.name, match.awayTeam.name]);

  const isLive = match.status === "live";
  const isFinished = match.status === "finished";

  return (
    <>
      {goalTeam && (
        <GoalAnimation teamName={goalTeam} onDone={() => setGoalTeam(null)} />
      )}

      <Link href={`/match/${match.id}`} className="block group">
        <div
          className={clsx(
            "relative overflow-hidden rounded-2xl border transition-transform duration-200",
            "group-hover:scale-[1.02] group-hover:shadow-xl",
            isLive
              ? "border-red-500/60 animate-pulse_glow"
              : "border-[#2e3650]"
          )}
        >
          {/* Stadium gradient background */}
          <div
            className={clsx(
              "absolute inset-0 bg-gradient-to-br opacity-30 pitch-texture",
              `from-[${homeConfig.color}] to-[${awayConfig.color}]`
            )}
            style={{
              background: `linear-gradient(135deg, ${homeConfig.color}55, ${awayConfig.color}55)`,
            }}
          />

          <div className="relative z-10 p-4">
            {/* Status bar */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-medium">{match.league}</span>
              <StatusBadge status={match.status} minute={match.minute} />
            </div>

            {/* Teams & Score */}
            <div className="flex items-center gap-3">
              {/* Home team */}
              <div className="flex-1 flex flex-col items-center gap-1 text-center">
                <TeamBadge badge={match.homeTeam.badge} name={match.homeTeam.name} flag={homeConfig.flag} />
                <span className="text-sm font-bold text-white leading-tight">
                  {match.homeTeam.name}
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center gap-2 px-3">
                {match.score.home !== null ? (
                  <>
                    <span
                      className={clsx(
                        "text-4xl font-bold text-white tabular-nums",
                        homeScoreAnim && "score-pop"
                      )}
                      style={{ fontFamily: "'Fredoka One', cursive" }}
                    >
                      {match.score.home}
                    </span>
                    <span className="text-2xl text-slate-500">–</span>
                    <span
                      className={clsx(
                        "text-4xl font-bold text-white tabular-nums",
                        awayScoreAnim && "score-pop"
                      )}
                      style={{ fontFamily: "'Fredoka One', cursive" }}
                    >
                      {match.score.away}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-slate-400">
                    {match.time}
                  </span>
                )}
              </div>

              {/* Away team */}
              <div className="flex-1 flex flex-col items-center gap-1 text-center">
                <TeamBadge badge={match.awayTeam.badge} name={match.awayTeam.name} flag={awayConfig.flag} />
                <span className="text-sm font-bold text-white leading-tight">
                  {match.awayTeam.name}
                </span>
              </div>
            </div>

            {/* Prediction buttons */}
            <PredictionButtons
              matchId={match.id}
              homeTeam={match.homeTeam.name}
              awayTeam={match.awayTeam.name}
              disabled={isFinished}
            />
          </div>
        </div>
      </Link>
    </>
  );
}

function TeamBadge({ badge, name, flag }: { badge?: string; name: string; flag: string }) {
  if (badge) {
    return (
      <Image
        src={badge}
        alt={name}
        width={44}
        height={44}
        className="object-contain drop-shadow-lg"
        unoptimized
      />
    );
  }
  return <span className="text-4xl">{flag}</span>;
}

function StatusBadge({ status, minute }: { status: NormalizedMatch["status"]; minute?: string }) {
  if (status === "live") {
    return (
      <div className="flex items-center gap-1.5 bg-red-600/20 border border-red-500/40 rounded-full px-2.5 py-0.5">
        <span className="live-dot w-2 h-2 rounded-full bg-red-500 inline-block" />
        <span className="text-xs font-bold text-red-400">
          {minute ? `${minute}'` : "LIVE"}
        </span>
      </div>
    );
  }
  if (status === "finished") {
    return (
      <span className="text-xs font-bold text-slate-500 bg-slate-800 rounded-full px-2.5 py-0.5">
        FT
      </span>
    );
  }
  return (
    <span className="text-xs font-semibold text-slate-400 bg-slate-800/60 rounded-full px-2.5 py-0.5">
      Upcoming
    </span>
  );
}
