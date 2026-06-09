"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LEAGUES, NormalizedMatch } from "@/lib/sportsdb";
import MatchCard from "./MatchCard";

interface MatchData {
  live: NormalizedMatch[];
  upcoming: NormalizedMatch[];
  finished: NormalizedMatch[];
  date: string;
  leagueId: string;
  fetchedAt: number;
}

const today  = () => new Date().toISOString().split("T")[0];
const offset = (n: number) => {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

export default function LiveScoreClient({ initial }: { initial: MatchData }) {
  const [data, setData]           = useState<MatchData>(initial);
  const [selDate, setSelDate]     = useState(initial.date);
  const [selLeague, setSelLeague] = useState(initial.leagueId);
  const [loading, setLoading]     = useState(false);
  const [updated, setUpdated]     = useState(new Date());
  const pending                   = useRef("");

  const load = useCallback(async (date: string, league: string) => {
    const key = `${date}|${league}`;
    pending.current = key;
    setLoading(true);
    try {
      const res = await fetch(`/api/live-scores?date=${date}&leagueId=${league}`, { cache: "no-store" });
      if (res.ok && pending.current === key) {
        setData(await res.json()); setUpdated(new Date());
      }
    } finally { if (pending.current === key) setLoading(false); }
  }, []);

  useEffect(() => {
    if (selDate !== today()) return;
    const id = setInterval(() => load(selDate, selLeague), 60_000);
    return () => clearInterval(id);
  }, [selDate, selLeague, load]);

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
      <div className="mb-6 rounded-xl overflow-hidden"
        style={{ background: "var(--bg2)", border: "1px solid var(--line2)" }}>

        {/* League tabs */}
        <div className="px-4 pt-4 pb-3"
          style={{ borderBottom: "1px solid var(--line)" }}>
          <p className="barlow text-[10px] font-bold tracking-[.2em] uppercase mb-3"
            style={{ color: "var(--fade)" }}>Competition</p>
          <div className="nobar overflow-x-auto">
            <div className="flex gap-1.5 min-w-max">
              {LEAGUES.map(lg => {
                const active = selLeague === lg.id;
                const isWC   = lg.id === "4429";
                return (
                  <button key={lg.id} onClick={() => changeLeague(lg.id)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] font-bold
                      tracking-wide transition-all duration-150 whitespace-nowrap barlow"
                    style={{
                      background:  active ? (isWC ? "var(--gold)" : "var(--bg4)") : "var(--bg3)",
                      border:      `1px solid ${active ? (isWC ? "var(--gold2)" : "var(--line2)") : "var(--line)"}`,
                      color:       active ? (isWC ? "#000" : "var(--white)") : "var(--fade)",
                      boxShadow:   active && isWC ? "0 0 20px rgba(245,197,24,.3)" : "none",
                      transform:   active ? "translateY(-1px)" : "none",
                      letterSpacing: ".06em",
                    }}>
                    <span className="text-sm leading-none">{lg.flag}</span>
                    <span>{lg.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Date row */}
        <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
          <p className="barlow text-[10px] font-bold tracking-[.2em] uppercase"
            style={{ color: "var(--fade)" }}>Date</p>

          <div className="flex gap-1">
            {QUICK.map(q => {
              const active = selDate === q.val;
              return (
                <button key={q.label} onClick={() => changeDate(q.val)}
                  className="px-3 py-1.5 rounded text-xs font-bold tracking-wide transition-all duration-150 barlow"
                  style={{
                    background:  active ? "var(--gold)" : "var(--bg3)",
                    border:      `1px solid ${active ? "var(--gold2)" : "var(--line)"}`,
                    color:       active ? "#000" : "var(--fade)",
                    transform:   active ? "translateY(-1px)" : "none",
                    letterSpacing: ".06em",
                  }}>
                  {q.label}
                </button>
              );
            })}
          </div>

          <div className="w-px h-4" style={{ background: "var(--line2)" }} />

          <div className="flex items-center gap-2">
            <span className="barlow text-[10px] font-bold tracking-widest uppercase"
              style={{ color: "var(--fade)" }}>Go to</span>
            <input type="date" value={selDate}
              onChange={e => e.target.value && changeDate(e.target.value)}
              className="text-xs font-medium px-2.5 py-1.5 rounded outline-none [color-scheme:dark]"
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--line2)",
                color: "var(--white)",
                fontFamily: "inherit",
              }} />
          </div>

          <div className="flex-1" />

          {/* Status */}
          <div className="flex items-center gap-2">
            {loading
              ? <span className="flex items-center gap-1.5 text-xs font-semibold barlow"
                  style={{ color: "var(--gold)" }}>
                  <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin inline-block" />
                  Loading…
                </span>
              : <span className="text-[11px] tabular-nums" style={{ color: "var(--fade)" }}>
                  {updated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
            }
            <button onClick={() => load(selDate, selLeague)} disabled={loading}
              className="text-lg transition-colors disabled:opacity-20"
              style={{ color: "var(--fade)", lineHeight: 1 }}
              title="Refresh">↻</button>
          </div>
        </div>
      </div>

      {/* ── Match list ── */}
      <div style={{
        opacity: loading && isStale ? .45 : 1,
        pointerEvents: loading && isStale ? "none" : "auto",
        transition: "opacity .2s",
      }}>
        {data.live.length > 0 && (
          <Section label="Live Now" count={data.live.length} accent="var(--red)" dot>
            <Grid matches={data.live} />
          </Section>
        )}
        {data.upcoming.length > 0 && (
          <Section label="Fixtures" count={data.upcoming.length} accent="var(--gold)">
            <Grid matches={data.upcoming} />
          </Section>
        )}
        {data.finished.length > 0 && (
          <Section label="Results" count={data.finished.length} accent="var(--chalk)">
            <Grid matches={data.finished} />
          </Section>
        )}

        {loading && isStale && total === 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {[1,2,3,4].map(i =>
              <div key={i} className="h-44 rounded-xl animate-pulse"
                style={{ background: "var(--bg2)", border: "1px solid var(--line)" }} />
            )}
          </div>
        )}

        {!loading && !isStale && total === 0 && (
          <div className="py-24 flex flex-col items-center gap-4 text-center slideup">
            <div className="text-5xl opacity-20">⚽</div>
            <div>
              <p className="barlow font-bold text-lg tracking-widest uppercase"
                style={{ color: "var(--chalk)" }}>No Matches Found</p>
              <p className="text-sm mt-1" style={{ color: "var(--fade)" }}>
                Try a different date or competition.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ label, count, accent, dot, children }:
  { label: string; count: number; accent: string; dot?: boolean; children: React.ReactNode }) {
  return (
    <section className="mb-8 slideup">
      <div className="section-header">
        {dot && <span className="liveblink w-2 h-2 rounded-full shrink-0" style={{ background: "var(--red)" }} />}
        <h2 className="section-title" style={{ color: accent }}>{label}</h2>
        <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
        <span className="barlow text-xs font-bold px-2 py-0.5 rounded"
          style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--fade)" }}>
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}

function Grid({ matches }: { matches: NormalizedMatch[] }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {matches.map(m => <MatchCard key={m.id} match={m} />)}
    </div>
  );
}
