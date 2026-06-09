"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LEAGUES } from "@/lib/leagues";
import { NormalizedMatch } from "@/lib/apifootball";
import MatchCard from "./MatchCard";

interface MatchData {
  live: NormalizedMatch[];
  upcoming: NormalizedMatch[];
  finished: NormalizedMatch[];
  date: string;
  leagueId: string;
  fetchedAt: number;
}

const today  = () => new Date().toISOString().slice(0, 10);
const offset = (n: number) => {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export default function LiveScoreClient({ initial }: { initial: MatchData }) {
  const [data, setData]           = useState<MatchData>(initial);
  const [selDate, setSelDate]     = useState(initial.date);
  const [selLeague, setSelLeague] = useState(initial.leagueId);
  const [loading, setLoading]     = useState(false);
  const [updated, setUpdated]     = useState<Date | null>(null);
  const pending                   = useRef("");

  const load = useCallback(async (date: string, league: string) => {
    const key = `${date}|${league}`;
    pending.current = key;
    setLoading(true);
    try {
      const res = await fetch(`/api/live-scores?date=${date}&leagueId=${league}`, { cache: "no-store" });
      if (res.ok && pending.current === key) {
        setData(await res.json());
        setUpdated(new Date());
      }
    } finally { if (pending.current === key) setLoading(false); }
  }, []);

  // Smart polling: faster when live, slower otherwise
  useEffect(() => {
    if (selDate !== today()) return;
    const interval = data.live.length > 0 ? 60_000 : 300_000;
    const id = setInterval(() => load(selDate, selLeague), interval);
    return () => clearInterval(id);
  }, [selDate, selLeague, load, data.live.length]);

  const changeDate   = (d: string) => { setSelDate(d);   load(d, selLeague); };
  const changeLeague = (l: string) => { setSelLeague(l); load(selDate, l);   };

  const isStale = data.date !== selDate || data.leagueId !== selLeague;
  const total   = data.live.length + data.upcoming.length + data.finished.length;

  const QUICK = [
    { label: "Yesterday", val: offset(-1) },
    { label: "Today",     val: today()    },
    { label: "Tomorrow",  val: offset(1)  },
  ];

  return (
    <div>
      {/* ── Filter panel ── */}
      <div className="card-flat rounded-2xl overflow-hidden mb-8">
        {/* League tabs */}
        <div className="px-5 pt-5 pb-4 border-b-2 border-outline-variant">
          <p className="text-xs font-bold tracking-[.2em] uppercase text-on-surface-variant mb-3">Competition</p>
          <div className="nobar overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {LEAGUES.map((lg) => {
                const active     = selLeague === lg.id;
                const isFeatured = !!lg.featured;
                return (
                  <button key={lg.id} onClick={() => changeLeague(lg.id)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold
                      tracking-wide transition-all duration-150 whitespace-nowrap"
                    style={{
                      background: active
                        ? isFeatured ? "#006d37" : "#1a1c1c"
                        : "#eeeeee",
                      border: `2px solid ${active
                        ? isFeatured ? "#2ecc71" : "#3d4a3e"
                        : "#bbcbbb"}`,
                      color: active ? "#ffffff" : "#6c7b6d",
                      transform: active ? "translateY(-1px)" : "none",
                      boxShadow: active ? "2px 2px 0px rgba(0,0,0,0.15)" : "none",
                    }}>
                    <span className="text-sm leading-none">{lg.flag}</span>
                    <span>{lg.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Date + refresh row */}
        <div className="px-5 py-4 flex items-center gap-3 flex-wrap bg-surface-container-low">
          <p className="text-xs font-bold tracking-[.2em] uppercase text-on-surface-variant">Date</p>

          <div className="flex gap-1">
            {QUICK.map((q) => {
              const active = selDate === q.val;
              return (
                <button key={q.label} onClick={() => changeDate(q.val)}
                  className="px-3 py-1.5 rounded text-xs font-bold tracking-wide transition-all"
                  style={{
                    background: active ? "#006d37" : "#eeeeee",
                    border:     `2px solid ${active ? "#2ecc71" : "#bbcbbb"}`,
                    color:      active ? "#ffffff" : "#6c7b6d",
                    transform:  active ? "translateY(-1px)" : "none",
                  }}>
                  {q.label}
                </button>
              );
            })}
          </div>

          <div className="w-px h-4 bg-outline-variant" />

          <input type="date" value={selDate}
            onChange={(e) => e.target.value && changeDate(e.target.value)}
            className="text-xs font-medium px-2.5 py-1.5 rounded outline-none border-2 border-outline-variant
              bg-white text-on-surface"
            style={{ fontFamily: "inherit" }} />

          <div className="flex-1" />

          {/* Status */}
          <div className="flex items-center gap-2">
            {loading ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin inline-block" />
                Loading…
              </span>
            ) : (
              <span className="text-xs tabular-nums text-on-surface-variant">
                {updated
                  ? updated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                  : "—"}
              </span>
            )}
            <button onClick={() => load(selDate, selLeague)} disabled={loading}
              className="text-lg transition-colors disabled:opacity-30 text-on-surface-variant hover:text-primary"
              title="Refresh">↻</button>
          </div>
        </div>
      </div>

      {/* ── Match sections ── */}
      <div style={{
        opacity:        loading && isStale ? .5 : 1,
        pointerEvents:  loading && isStale ? "none" : "auto",
        transition:     "opacity .2s",
      }}>
        {data.live.length > 0 && (
          <MatchSection label="Live Action" count={data.live.length} dot>
            <p className="text-sm text-on-surface-variant mb-4">Don&apos;t blink. The pitch is hot.</p>
            <Grid matches={data.live} />
          </MatchSection>
        )}
        {data.upcoming.length > 0 && (
          <MatchSection label="Upcoming Fixtures" count={data.upcoming.length}>
            <Grid matches={data.upcoming} />
          </MatchSection>
        )}
        {data.finished.length > 0 && (
          <MatchSection label="Results" count={data.finished.length}>
            <Grid matches={data.finished} />
          </MatchSection>
        )}

        {/* Skeleton */}
        {loading && isStale && total === 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-52 rounded-xl animate-pulse bg-surface-container border-2 border-outline-variant" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !isStale && total === 0 && (
          <div className="py-24 flex flex-col items-center gap-4 text-center slideup">
            <div className="text-6xl opacity-20">⚽</div>
            <div>
              <p className="font-montserrat font-bold text-lg tracking-widest uppercase text-on-surface">
                No Matches Found
              </p>
              <p className="text-sm mt-1 text-on-surface-variant">
                Try a different date or competition.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MatchSection({ label, count, dot, children }:
  { label: string; count: number; dot?: boolean; children: React.ReactNode }) {
  return (
    <section className="mb-10 slideup">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {dot && <span className="w-2.5 h-2.5 rounded-full bg-error pulse-dot shrink-0" />}
          <h2 className="font-montserrat font-black text-2xl text-on-surface">{label}</h2>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full border-2 border-outline-variant
          bg-surface-container text-on-surface-variant">{count}</span>
      </div>
      {children}
    </section>
  );
}

function Grid({ matches }: { matches: NormalizedMatch[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {matches.map((m) => <MatchCard key={m.id} match={m} />)}
    </div>
  );
}
