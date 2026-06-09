"use client";

import { useEffect, useState } from "react";
import { getCountryConfig } from "@/lib/countries";

interface Props {
  teamName: string;
  onDone?: () => void;
}

const CONFETTI_COLORS = ["#fbbf24", "#f87171", "#34d399", "#60a5fa", "#e879f9"];

export default function GoalAnimation({ teamName, onDone }: Props) {
  const [visible, setVisible] = useState(true);
  const config = getCountryConfig(teamName);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!visible) return null;

  const confettiPieces = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${(i / 18) * 100}%`,
    delay: `${(i * 0.06).toFixed(2)}s`,
    size: 6 + (i % 4) * 3,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden">
        {confettiPieces.map((p) => (
          <div
            key={p.id}
            className="absolute top-0 animate-confetti_fall"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: "2px",
              animationDelay: p.delay,
              animationDuration: `${0.8 + (p.id % 3) * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Main card */}
      <div className="relative z-10 flex flex-col items-center gap-4 animate-goalPop">
        <div
          className="rounded-3xl border-4 px-10 py-8 text-center shadow-2xl"
          style={{
            borderColor: config.accent,
            background: `linear-gradient(135deg, ${config.color}cc, ${config.accent}33)`,
          }}
        >
          <div className="text-7xl mb-2 animate-float">{config.mascot}</div>
          <div
            className="text-5xl font-bold"
            style={{ fontFamily: "'Fredoka One', cursive", color: config.accent }}
          >
            GOAL!
          </div>
          <div className="mt-1 text-xl font-semibold text-white/90">
            {config.flag} {teamName}
          </div>
        </div>
      </div>
    </div>
  );
}
