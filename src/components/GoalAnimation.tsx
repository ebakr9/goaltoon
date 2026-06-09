"use client";

import { useEffect, useState } from "react";
import { getCountryConfig } from "@/lib/countries";

const SPARKS = ["var(--gold)", "var(--gold2)", "#fff", "var(--gold3)", "var(--gold)", "#fff"];

export default function GoalAnimation({ teamName, onDone }: { teamName: string; onDone?: () => void }) {
  const [on, setOn] = useState(true);
  const cfg = getCountryConfig(teamName);

  useEffect(() => {
    const t = setTimeout(() => { setOn(false); onDone?.(); }, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!on) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,.88)", backdropFilter: "blur(6px)" }} />

      {/* Gold burst */}
      <div className="absolute" style={{
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(245,197,24,.12) 0%, transparent 65%)",
        borderRadius: "50%",
      }} />

      {/* Confetti */}
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} className="absolute top-0" style={{
          left: `${(i / 24) * 100}%`,
          width: 4 + (i % 3) * 4,
          height: 10 + (i % 4) * 6,
          background: SPARKS[i % SPARKS.length],
          borderRadius: 2,
          animationName: "confetti",
          animationDuration: `${.5 + (i % 4) * .18}s`,
          animationDelay: `${(i * .03).toFixed(2)}s`,
          animationFillMode: "forwards",
          animationTimingFunction: "ease-out",
        }} />
      ))}

      {/* Card */}
      <div className="relative z-10 px-14 py-9 text-center slideup rounded-xl"
        style={{
          background: "var(--bg2)",
          border: "2px solid var(--gold)",
          boxShadow: "0 0 60px rgba(245,197,24,.25), 0 24px 60px rgba(0,0,0,.8)",
        }}>
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t"
          style={{ background: "var(--gold)" }} />

        <div className="text-5xl mb-3 leading-none">{cfg.flag}</div>

        <div className="anton tracking-[.04em] uppercase leading-none"
          style={{ fontSize: "3.8rem", color: "var(--gold)" }}>
          GOAL!
        </div>

        <div className="barlow text-sm font-bold tracking-[.2em] uppercase mt-3"
          style={{ color: "var(--chalk)" }}>
          {teamName}
        </div>
      </div>
    </div>
  );
}
