"use client";

import { useEffect, useState } from "react";
import { getPrediction, setPrediction, Prediction } from "@/lib/predictions";

const OPTS: { v: Prediction; short: string }[] = [
  { v: "home", short: "1" },
  { v: "draw", short: "X" },
  { v: "away", short: "2" },
];

const ACT: Record<Prediction, { bg: string; border: string; color: string }> = {
  home: { bg: "var(--gold)",  border: "var(--gold2)",  color: "#000" },
  draw: { bg: "var(--bg4)",   border: "var(--line2)",  color: "var(--white)" },
  away: { bg: "var(--red)",   border: "#ff5252",        color: "#fff" },
};

export default function PredictionButtons({
  matchId, homeTeam, awayTeam, disabled,
}: { matchId: string; homeTeam: string; awayTeam: string; disabled?: boolean }) {
  const [pick, setPick] = useState<Prediction | null>(null);
  useEffect(() => { setPick(getPrediction(matchId)); }, [matchId]);

  function toggle(v: Prediction) {
    if (disabled) return;
    const next = pick === v ? null : v;
    if (next) setPrediction(matchId, next);
    else localStorage.removeItem(`goaltoon_pred_${matchId}`);
    setPick(next);
  }

  const labels: Record<Prediction, string> = {
    home: homeTeam,
    draw: "Draw",
    away: awayTeam,
  };

  return (
    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--line)" }}>
      <p className="barlow text-[9px] font-bold tracking-[.22em] uppercase text-center mb-2"
        style={{ color: "var(--fade)" }}>
        Your Prediction
      </p>
      <div className="flex gap-1.5">
        {OPTS.map(o => {
          const active = pick === o.v;
          const c = active ? ACT[o.v] : null;
          return (
            <button key={o.v}
              onClick={e => { e.preventDefault(); toggle(o.v); }}
              disabled={disabled}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded transition-all duration-150"
              style={{
                background: c ? c.bg    : "var(--bg3)",
                border:     `1px solid ${c ? c.border : "var(--line)"}`,
                color:      c ? c.color : "var(--fade)",
                opacity:    disabled ? .2 : 1,
                cursor:     disabled ? "not-allowed" : "pointer",
                transform:  active ? "translateY(-1px)" : "none",
              }}>
              <span className="anton text-sm leading-none">{o.short}</span>
              <span className="barlow text-[8px] font-bold tracking-wide uppercase truncate max-w-full leading-none mt-0.5"
                style={{ opacity: .8 }}>
                {labels[o.v]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
