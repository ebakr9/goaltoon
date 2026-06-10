"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = (id: string) => `goaltoon_pred_${id}`;

type Pick = "1" | "x" | "2";
interface Counts { "1": number; x: number; "2": number; }

const OPTS: { key: Pick; short: string }[] = [
  { key: "1", short: "1" },
  { key: "x", short: "X" },
  { key: "2", short: "2" },
];

// Migrate legacy "home"/"draw"/"away" values to "1"/"x"/"2"
function normalizePick(v: string | null): Pick | null {
  if (!v) return null;
  if (v === "home") return "1";
  if (v === "draw") return "x";
  if (v === "away") return "2";
  if (v === "1" || v === "x" || v === "2") return v;
  return null;
}

const COLORS: Record<Pick, { active: string; bar: string }> = {
  "1": { active: "bg-primary border-on-surface text-white shadow-[2px_2px_0_0_#1a1c1c]", bar: "bg-primary" },
  x:  { active: "bg-on-surface border-on-surface text-white shadow-[2px_2px_0_0_#1a1c1c]", bar: "bg-on-surface" },
  "2": { active: "bg-tertiary border-on-surface text-white shadow-[2px_2px_0_0_#1a1c1c]", bar: "bg-tertiary" },
};

export default function PredictionButtons({
  matchId, homeTeam, awayTeam, disabled,
}: { matchId: string; homeTeam: string; awayTeam: string; disabled?: boolean }) {
  const [voted, setVoted]   = useState<Pick | null>(null);
  const [counts, setCounts] = useState<Counts>({ "1": 0, x: 0, "2": 0 });
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY(matchId));
    const normalized = normalizePick(raw);
    if (normalized) {
      setVoted(normalized);
      if (raw !== normalized) localStorage.setItem(STORAGE_KEY(matchId), normalized);
    }

    fetch(`/api/predictions/${matchId}`)
      .then(r => r.json())
      .then(d => { setCounts(d.counts); setTotal(d.total); })
      .catch(() => {});
  }, [matchId]);

  async function handleVote(pick: Pick) {
    if (voted || loading || disabled) return;
    setLoading(true);
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fixtureId: matchId, pick }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCounts(data.counts);
      setTotal(data.total);
      setVoted(pick);
      localStorage.setItem(STORAGE_KEY(matchId), pick);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  const labels: Record<Pick, string> = { "1": homeTeam, x: "Draw", "2": awayTeam };
  const showResults = !!voted;

  return (
    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--line)" }}>
      <p className="barlow text-[9px] font-bold tracking-[.22em] uppercase text-center mb-2"
        style={{ color: "var(--fade)" }}>
        Your Prediction
      </p>
      <div className="flex gap-1.5">
        {OPTS.map(o => {
          const isActive = voted === o.key;
          const pct = total > 0 ? Math.round((counts[o.key] / total) * 100) : 0;

          return (
            <div key={o.key} className="flex-1 flex flex-col gap-1">
              {showResults && (
                <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${COLORS[o.key].bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); void handleVote(o.key); }}
                disabled={!!voted || loading || disabled}
                className={`w-full flex flex-col items-center gap-0.5 py-2 rounded border-2 transition-all duration-150
                  ${isActive
                    ? COLORS[o.key].active
                    : voted
                      ? "bg-surface-container border-outline-variant text-on-surface-variant opacity-60 cursor-not-allowed"
                      : disabled
                        ? "bg-surface-container border-outline-variant text-on-surface-variant opacity-20 cursor-not-allowed"
                        : "bg-white border-outline text-on-surface-variant hover:border-on-surface cursor-pointer"
                  }`}
              >
                <span className="anton text-sm leading-none">{o.short}</span>
                <span className="barlow text-[8px] font-bold tracking-wide uppercase truncate max-w-full leading-none mt-0.5"
                  style={{ opacity: .8 }}>
                  {labels[o.key]}
                </span>
                {showResults && (
                  <span className={`text-[9px] font-black leading-none mt-0.5 ${isActive ? "text-white" : "text-on-surface-variant"}`}>
                    {pct}%
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
      {showResults && total > 0 && (
        <p className="text-center text-[9px] text-on-surface-variant font-semibold mt-1.5">
          {total} vote{total !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
