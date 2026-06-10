"use client";

import { useEffect, useState } from "react";

interface Counts {
  "1": number;
  x: number;
  "2": number;
}

interface Props {
  fixtureId: string;
  homeTeam: string;
  awayTeam: string;
}

const STORAGE_KEY = (id: string) => `goaltoon_pred_${id}`;

export default function PredictionWidget({ fixtureId, homeTeam, awayTeam }: Props) {
  const [voted, setVoted]   = useState<string | null>(null);
  const [counts, setCounts] = useState<Counts>({ "1": 0, x: 0, "2": 0 });
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);

  // On mount: check localStorage for prior vote + fetch current counts
  useEffect(() => {
    const prior = localStorage.getItem(STORAGE_KEY(fixtureId));
    if (prior) setVoted(prior);

    fetch(`/api/predictions/${fixtureId}`)
      .then((r) => r.json())
      .then((d) => { setCounts(d.counts); setTotal(d.total); })
      .catch(() => {});
  }, [fixtureId]);

  async function handleVote(pick: string) {
    if (voted || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fixtureId, pick }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCounts(data.counts);
      setTotal(data.total);
      setVoted(pick);
      localStorage.setItem(STORAGE_KEY(fixtureId), pick);
    } catch {
      // silently fail — user can retry
    } finally {
      setLoading(false);
    }
  }

  const options = [
    { key: "1",  label: homeTeam,  shortLabel: "1",  color: "bg-primary",   border: "border-primary",   text: "text-primary",   bar: "bg-primary" },
    { key: "x",  label: "Draw",    shortLabel: "X",  color: "bg-on-surface", border: "border-on-surface", text: "text-on-surface", bar: "bg-on-surface" },
    { key: "2",  label: awayTeam,  shortLabel: "2",  color: "bg-tertiary",  border: "border-tertiary",  text: "text-tertiary",  bar: "bg-tertiary" },
  ] as const;

  const showResults = !!voted;

  return (
    <div className="rounded-2xl card-border-bold bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 bg-primary border-b-4 border-on-surface">
        <span className="material-symbols-outlined text-on-primary text-[18px]"
          style={{ fontVariationSettings: "'FILL' 1" }}>
          how_to_vote
        </span>
        <span className="font-montserrat font-black text-sm uppercase tracking-wider text-on-primary">
          Who wins?
        </span>
        {total > 0 && (
          <span className="ml-auto barlow text-xs font-bold px-2 py-0.5 rounded-full
            bg-primary-container text-on-primary-container">
            {total} vote{total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {options.map((opt) => {
            const isVoted = voted === opt.key;
            const pct = total > 0 ? Math.round((counts[opt.key as keyof Counts] / total) * 100) : 0;

            return (
              <div key={opt.key} className="flex flex-col gap-1.5">
                {/* Progress bar — only after voting */}
                {showResults && (
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${opt.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}

                <button
                  onClick={() => handleVote(opt.key)}
                  disabled={!!voted || loading}
                  className={`relative w-full flex flex-col items-center gap-1 py-3 px-2 rounded-xl
                    border-2 font-montserrat font-black transition-all duration-150 select-none
                    ${isVoted
                      ? `${opt.color} text-white border-on-surface shadow-[3px_3px_0_0_#1a1c1c]`
                      : voted
                        ? `bg-surface-container ${opt.border} text-on-surface-variant opacity-60 cursor-not-allowed`
                        : `bg-white ${opt.border} ${opt.text} hover:brightness-95 active:shadow-none active:translate-y-0.5 shadow-[3px_3px_0_0_#1a1c1c] cursor-pointer`
                    }`}
                >
                  <span className="text-2xl leading-none">{opt.shortLabel}</span>
                  <span className="text-[9px] uppercase tracking-wider truncate w-full text-center">
                    {opt.label.length > 10 ? opt.label.slice(0, 9) + "…" : opt.label}
                  </span>
                  {showResults && (
                    <span className={`text-xs font-black ${isVoted ? "text-white" : opt.text}`}>
                      {pct}%
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Voted feedback */}
        {voted && (
          <p className="text-center text-xs text-on-surface-variant font-semibold">
            {voted === "1" ? `You picked ${homeTeam}` : voted === "2" ? `You picked ${awayTeam}` : "You picked Draw"}
            {" · "}
            <span className="text-primary">{total} total vote{total !== 1 ? "s" : ""}</span>
          </p>
        )}
      </div>
    </div>
  );
}
