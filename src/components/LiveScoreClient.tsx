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

const userTz = typeof Intl !== "undefined"
  ? Intl.DateTimeFormat().resolvedOptions().timeZone
  : "UTC";

// Returns YYYY-MM-DD in the user's local timezone
const today  = () => new Date().toLocaleDateString("en-CA", { timeZone: userTz });

const toISO = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: userTz });

const offset = (n: number) => {
  // Shift from local today by n days
  const base = new Date();
  base.setDate(base.getDate() + n);
  return toISO(base);
};


export default function LiveScoreClient({ initial }: { initial: MatchData }) {
  // Always start from local today — SSR initial.date is UTC which may differ
  const localToday                = today();
  const [data, setData]           = useState<MatchData>(
    initial.date === localToday ? initial : { ...initial, live: [], upcoming: [], finished: [] }
  );
  const [selDate, setSelDate]     = useState(localToday);
  const [selLeague, setSelLeague] = useState(initial.leagueId);
  const [loading, setLoading]     = useState(false);
  const [updated, setUpdated]     = useState<Date | null>(null);
  const pending                   = useRef("");

  const load = useCallback(async (date: string, league: string) => {
    const key = `${date}|${league}`;
    pending.current = key;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/live-scores?date=${date}&leagueId=${league}&tz=${encodeURIComponent(userTz)}`,
        { cache: "no-store" }
      );
      if (res.ok && pending.current === key) {
        setData(await res.json());
        setUpdated(new Date());
      }
    } finally { if (pending.current === key) setLoading(false); }
  }, []);

  // Always fetch on mount — SSR data may be stale (finished matches not showing, etc.)
  useEffect(() => {
    load(localToday, selLeague);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const isStale  = data.date !== selDate || data.leagueId !== selLeague;
  const total    = data.live.length + data.upcoming.length + data.finished.length;
  const todayISO  = today();
  const datePickerRef = useRef<HTMLInputElement>(null);

  // Build -2..+2 window centered on selDate
  const dateRange = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(selDate + "T00:00:00");
    d.setDate(d.getDate() + (i - 2));
    return toISO(d);
  });

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

        {/* Date strip */}
        <div className="px-5 py-3 bg-surface-container-low border-b-2 border-outline-variant">
          <div className="flex items-center gap-2">

            {/* ← prev day */}
            <button
              onClick={() => { const d = new Date(selDate + "T00:00:00"); d.setDate(d.getDate() - 1); changeDate(toISO(d)); }}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border-2 border-outline-variant
                bg-white text-on-surface-variant hover:border-primary hover:text-primary transition-all">
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>

            {/* 5-day strip — always selDate at index 2 (center) */}
            <div className="grid grid-cols-5 gap-1.5 flex-1">
              {dateRange.map((iso) => {
                const d       = new Date(iso + "T00:00:00");
                const isToday = iso === todayISO;
                const active  = iso === selDate;
                const dayName = d.toLocaleDateString("en-GB", { weekday: "short" });
                const dayNum  = d.getDate();
                const month   = d.toLocaleDateString("en-GB", { month: "short" });

                return (
                  <button key={iso} onClick={() => changeDate(iso)}
                    className="flex flex-col items-center px-2 py-2 rounded-xl border-2 transition-all duration-150 w-full"
                    style={{
                      background:  active ? "#006d37" : "#fff",
                      borderColor: active ? "#2ecc71" : isToday ? "#006d37" : "#d4d4d4",
                      color:       active ? "#fff"    : isToday ? "#006d37" : "#6c7b6d",
                      transform:   active ? "translateY(-2px)" : "none",
                      boxShadow:   active ? "2px 2px 0 #1a1c1c" : "none",
                    }}>
                    <span className="text-[10px] font-bold uppercase tracking-wide leading-none">
                      {isToday ? "Today" : dayName}
                    </span>
                    <span className="font-montserrat font-black text-lg leading-tight tabular-nums">
                      {dayNum}
                    </span>
                    <span className="text-[9px] font-semibold uppercase leading-none opacity-70">
                      {month}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* → next day */}
            <button
              onClick={() => { const d = new Date(selDate + "T00:00:00"); d.setDate(d.getDate() + 1); changeDate(toISO(d)); }}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border-2 border-outline-variant
                bg-white text-on-surface-variant hover:border-primary hover:text-primary transition-all">
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>

            {/* Calendar picker */}
            <div className="relative shrink-0">
              <button
                onClick={() => datePickerRef.current?.showPicker()}
                className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-outline-variant
                  bg-white text-on-surface-variant hover:border-primary hover:text-primary transition-all"
                title="Pick a date">
                <span className="material-symbols-outlined text-base">calendar_month</span>
              </button>
              <input
                ref={datePickerRef}
                type="date"
                value={selDate}
                onChange={(e) => e.target.value && changeDate(e.target.value)}
                className="absolute opacity-0 pointer-events-none w-0 h-0 top-0 left-0"
                tabIndex={-1}
              />
            </div>

            {/* Refresh */}
            <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l-2 border-outline-variant">
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              ) : (
                <span className="text-[10px] tabular-nums text-on-surface-variant">
                  {updated ? updated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "—"}
                </span>
              )}
              <button onClick={() => load(selDate, selLeague)} disabled={loading}
                className="text-xl transition-colors disabled:opacity-30 text-on-surface-variant hover:text-primary"
                title="Refresh">↻</button>
            </div>
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
            <Grid matches={data.live} date={selDate} />
          </MatchSection>
        )}
        {data.upcoming.length > 0 && (
          <MatchSection label="Upcoming Fixtures" count={data.upcoming.length}>
            <Grid matches={data.upcoming} date={selDate} />
          </MatchSection>
        )}
        {data.finished.length > 0 && (
          <MatchSection label="Results" count={data.finished.length}>
            <Grid matches={data.finished} date={selDate} />
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

function Grid({ matches, date }: { matches: NormalizedMatch[]; date: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {matches.map((m) => <MatchCard key={m.id} match={m} date={date} />)}
    </div>
  );
}
