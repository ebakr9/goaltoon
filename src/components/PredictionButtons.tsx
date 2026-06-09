"use client";

import { useEffect, useState } from "react";
import { getPrediction, setPrediction, Prediction } from "@/lib/predictions";
import clsx from "clsx";

interface Props {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  disabled?: boolean;
}

const OPTIONS: { value: Prediction; label: (h: string, a: string) => string; emoji: string; color: string }[] = [
  { value: "home", label: (h) => h, emoji: "🏠", color: "hover:bg-blue-600 data-[active=true]:bg-blue-600" },
  { value: "draw", label: () => "Draw", emoji: "🤝", color: "hover:bg-yellow-600 data-[active=true]:bg-yellow-600" },
  { value: "away", label: (_, a) => a, emoji: "✈️", color: "hover:bg-red-600 data-[active=true]:bg-red-600" },
];

export default function PredictionButtons({ matchId, homeTeam, awayTeam, disabled }: Props) {
  const [prediction, setPred] = useState<Prediction | null>(null);

  useEffect(() => {
    setPred(getPrediction(matchId));
  }, [matchId]);

  function handleClick(val: Prediction) {
    if (disabled) return;
    const next = prediction === val ? null : val;
    if (next) {
      setPrediction(matchId, next);
    } else {
      // toggle off — clear
      localStorage.removeItem(`goaltoon_pred_${matchId}`);
    }
    setPred(next);
  }

  return (
    <div className="flex gap-2 mt-3">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          data-active={prediction === opt.value}
          onClick={() => handleClick(opt.value)}
          disabled={disabled}
          className={clsx(
            "flex-1 flex flex-col items-center gap-1 rounded-xl border border-white/10 py-2 px-1",
            "text-xs font-bold transition-all duration-200",
            "bg-white/5 text-slate-300",
            opt.color,
            disabled && "opacity-40 cursor-not-allowed",
            prediction === opt.value && "ring-2 ring-white/40 text-white scale-105"
          )}
        >
          <span className="text-lg">{opt.emoji}</span>
          <span className="truncate max-w-full px-1">
            {opt.label(homeTeam, awayTeam)}
          </span>
        </button>
      ))}
    </div>
  );
}
