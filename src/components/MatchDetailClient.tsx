"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  NormalizedMatch,
  MatchEvent,
  MatchStat,
  MatchLineup,
} from "@/lib/apifootball";
import PitchLineup from "./PitchLineup";

interface DetailData {
  match: NormalizedMatch;
  events: MatchEvent[];
  stats: MatchStat[];
  lineups: MatchLineup[];
}

interface Props extends DetailData {}

function countGoals(events: MatchEvent[]) {
  return events.filter((e) => e.type === "Goal").length;
}

export default function MatchDetailClient({ match: initial, events: ie, stats: is, lineups: il }: Props) {
  const [data, setData] = useState<DetailData>({ match: initial, events: ie, stats: is, lineups: il });
  const intervalRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const goalCountRef    = useRef<number>(countGoals(ie));

  const playGoalSound = useCallback(() => {
    try {
      const audio = new Audio("/sounds/goal.mp3");
      audio.volume = 0.8;
      audio.play().catch(() => { /* user hasn't interacted yet — browser blocks autoplay */ });
    } catch { /* non-fatal */ }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/matches/${initial.id}`, { cache: "no-store" });
      if (!res.ok) return;
      const fresh: DetailData = await res.json();
      const newGoalCount = countGoals(fresh.events);
      if (newGoalCount > goalCountRef.current) {
        playGoalSound();
      }
      goalCountRef.current = newGoalCount;
      setData(fresh);
    } catch { /* non-fatal */ }
  }, [initial.id, playGoalSound]);

  useEffect(() => {
    if (data.match.status !== "live") return;
    intervalRef.current = setInterval(refresh, 30_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [data.match.status, refresh]);


  const { match, events, stats, lineups } = data;
  const isLive = match.status === "live";

  const homeLineup = lineups.find((l) => l.teamId === match.homeTeam.id);
  const awayLineup = lineups.find((l) => l.teamId === match.awayTeam.id);

  return (
    <div className="space-y-6">

      <h3 className="font-montserrat font-black text-3xl text-on-surface
        border-b-4 border-primary inline-block pb-1 w-max">
        Match Dashboard
      </h3>

      {/* ── Dashboard grid: Stats (left 8) + Events (right 4) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Stats — shown second on mobile, first on desktop */}
        <section className="lg:col-span-8 order-2 lg:order-1">
          <StatsTab stats={stats} match={match} isLive={isLive} />
        </section>

        {/* Events — shown first on mobile (most dynamic), right on desktop, sticky on scroll */}
        <aside className="lg:col-span-4 order-1 lg:order-2">
          <div className="rounded-2xl card-border-bold overflow-hidden">
            {/* Green header */}
            <div className="flex items-center gap-2.5 px-5 py-4 bg-primary text-on-primary
              border-b-4 border-on-surface">
              {isLive && <span className="w-2 h-2 rounded-full bg-on-primary pulse-dot shrink-0" />}
              <span className="font-montserrat font-black text-base uppercase tracking-wider">
                {isLive ? "Live Events" : "Match Events"}
              </span>
              {events.length > 0 && (
                <span className="ml-auto barlow text-xs font-bold px-2 py-0.5 rounded-full
                  bg-primary-container text-on-primary-container">
                  {events.length}
                </span>
              )}
            </div>
            {/* Fixed height = ~7 events visible, scroll for the rest */}
            <div className="overflow-y-auto" style={{ maxHeight: 600 }}>
              <EventsTab events={events} match={match} isLive={isLive} />
            </div>
          </div>
        </aside>
      </div>

      {/* ── Lineup — full width below ── */}
      {homeLineup && awayLineup && (
        <section className="flex flex-col gap-4">
          <h3 className="font-montserrat font-black text-2xl text-on-surface
            border-b-4 border-primary pb-1 w-max">
            Lineups
          </h3>
          <PitchLineup home={homeLineup} away={awayLineup} />
        </section>
      )}

    </div>
  );
}

// ─── Events tab ───────────────────────────────────────────────────────────────

function EventsTab({ events, match, isLive }: { events: MatchEvent[]; match: NormalizedMatch; isLive: boolean }) {
  if (events.length === 0) {
    return (
      <p className="text-center py-10 text-sm text-on-surface-variant">
        {isLive ? "Events will appear as the match progresses…" : "No events available for this match."}
      </p>
    );
  }

  // Newest-first with HT divider
  const items: (MatchEvent | "HT")[] = [];
  let htDone = false;
  for (const e of [...events].reverse()) {
    if (!htDone && e.minute <= 45) { items.push("HT"); htDone = true; }
    items.push(e);
  }

  return (
    <div className="relative diagonal-pattern p-6 flex flex-col gap-6">
      {/* Vertical line — p-6(24px) + half w-8(16px) = 40px = left-10 ✓ */}
      <div className="absolute left-10 top-6 bottom-6 w-1 bg-on-surface rounded-full z-0" />

      {items.map((item, i) =>
        item === "HT" ? (
          <div key="HT" className="relative flex items-center gap-4 z-10">
            <div className="w-8 h-8 rounded-full bg-surface-container border-4 border-on-surface
              flex items-center justify-center shrink-0 text-[9px] font-black tracking-wider
              text-on-surface-variant shadow-[2px_2px_0_0_#1a1c1c]">
              HT
            </div>
            <span className="barlow text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
              Half Time
            </span>
          </div>
        ) : (
          <TimelineEvent key={i} event={item as MatchEvent} match={match} />
        )
      )}
    </div>
  );
}

function circleStyle(type: string, detail: string, isHome: boolean): { bg: string; emoji: string } {
  if (type === "Goal") {
    const own = detail === "Own Goal";
    return {
      emoji: detail === "Penalty" ? "🎯" : "⚽",
      bg: own
        ? (isHome ? "bg-tertiary-container" : "bg-primary-container")
        : (isHome ? "bg-primary-container" : "bg-tertiary-container"),
    };
  }
  if (type === "Card") {
    if (detail === "Yellow Card")     return { emoji: "🟨", bg: "bg-secondary-container" };
    if (detail === "Red Card")        return { emoji: "🟥", bg: "bg-error-container" };
    return { emoji: "🟧", bg: "bg-secondary-container" };
  }
  if (type === "subst") return { emoji: "🔄", bg: "bg-surface-container-high" };
  return { emoji: "📺", bg: "bg-surface-container" };
}

function eventHeading(e: MatchEvent): string {
  const min = `${e.minute}${e.extraMinute ? `+${e.extraMinute}` : ""}' — `;
  if (e.type === "Goal") {
    if (e.detail === "Own Goal") return `${min}Own Goal`;
    if (e.detail === "Penalty")  return `${min}Penalty!`;
    return `${min}GOAL!`;
  }
  if (e.type === "Card")  return `${min}${e.detail ?? "Card"}`;
  if (e.type === "subst") return `${min}Substitution`;
  if (e.type === "Var")   return `${min}VAR Review`;
  return `${min}${e.type}`;
}

function eventBody(e: MatchEvent): string {
  if (e.type === "Goal")  return e.assist ? `${e.player} · Assist: ${e.assist}` : (e.player ?? "");
  if (e.type === "subst") return `IN: ${e.player ?? ""}${e.assist ? ` · OUT: ${e.assist}` : ""}`;
  return e.player ?? "";
}

function TimelineEvent({ event: e, match }: { event: MatchEvent; match: NormalizedMatch }) {
  const isHome = e.teamId === match.homeTeam.id;
  const { emoji, bg } = circleStyle(e.type, e.detail, isHome);
  const body = eventBody(e);

  return (
    <div className="relative flex gap-4 items-start z-10 group">
      <div className={`w-8 h-8 rounded-full ${bg} border-4 border-on-surface shrink-0 mt-1
        flex items-center justify-center text-sm shadow-[2px_2px_0_0_#1a1c1c]`}>
        {emoji}
      </div>
      <div className="flex-grow bg-surface-container-lowest rounded-xl p-4 card-border-bold-sm
        transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5">
        <p className="font-bold text-sm text-on-surface">{eventHeading(e)}</p>
        {body && <p className="text-[13px] text-on-surface-variant mt-0.5 font-medium">{body}</p>}
      </div>
    </div>
  );
}

// ─── Stats tab ────────────────────────────────────────────────────────────────

const STAT_CATEGORIES: Record<string, { icon: string; keys: string[] }> = {
  Shots:      { icon: "🎯", keys: ["total shots", "shots on goal", "shots off goal", "blocked shots", "shots insidebox", "shots outsidebox"] },
  Passing:    { icon: "🎲", keys: ["ball possession", "total passes", "passes accurate", "passes %"] },
  Duels:      { icon: "⚔️", keys: ["fouls", "corner kicks", "offsides", "goalkeeper saves"] },
  Discipline: { icon: "🟨", keys: ["yellow cards", "red cards"] },
  Advanced:   { icon: "📊", keys: ["expected_goals", "xg", "big chances"] },
};

function matchesCat(statName: string, keys: string[]): boolean {
  const lower = statName.toLowerCase();
  return keys.some((k) => lower.includes(k));
}

function StatsTab({ stats, match, isLive }: { stats: MatchStat[]; match: NormalizedMatch; isLive: boolean }) {
  const [activeCat, setActiveCat] = useState<string>("All");

  if (stats.length === 0) {
    return (
      <Empty>
        {isLive ? "Statistics will appear as the match progresses…" : "No statistics available for this match."}
      </Empty>
    );
  }

  // Only surface categories that have at least one matching stat
  const availableCats = Object.entries(STAT_CATEGORIES).filter(([, { keys }]) =>
    stats.some((s) => matchesCat(s.name, keys))
  );

  const filteredStats = activeCat === "All"
    ? stats.slice(0, 8)
    : stats.filter((s) => matchesCat(s.name, STAT_CATEGORIES[activeCat].keys)).slice(0, 8);

  return (
    <div className="rounded-2xl overflow-hidden card-border-bold bg-white">
      {/* Category pills + team headers in one header block */}
      <div className="bg-surface-container border-b-4 border-on-surface">
        {/* Pills row */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-2 overflow-x-auto nobar">
          <button
            onClick={() => setActiveCat("All")}
            className={`shrink-0 barlow text-[10px] font-bold tracking-widest uppercase px-3 py-1.5
              rounded-full transition-all border-2 border-on-surface
              ${activeCat === "All"
                ? "bg-on-surface text-surface shadow-[2px_2px_0_0_rgba(0,0,0,0.3)]"
                : "bg-surface text-on-surface-variant hover:bg-surface-container-high"
              }`}
          >
            All
          </button>
          {availableCats.map(([cat, { icon }]) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`shrink-0 barlow text-[10px] font-bold tracking-widest uppercase px-3 py-1.5
                rounded-full transition-all border-2 border-on-surface flex items-center gap-1
                ${activeCat === cat
                  ? "bg-primary text-on-primary shadow-[2px_2px_0_0_#1a1c1c]"
                  : "bg-surface text-on-surface-variant hover:bg-surface-container-high"
                }`}
            >
              <span>{icon}</span> {cat}
            </button>
          ))}
        </div>
        {/* Team name headers */}
        <div className="grid grid-cols-3 px-4 py-2">
          <span className="barlow text-[10px] font-bold tracking-widest uppercase text-on-surface-variant truncate">
            {match.homeTeam.name}
          </span>
          <span className="barlow text-[10px] font-bold tracking-widest uppercase text-on-surface-variant text-center">
            STAT
          </span>
          <span className="barlow text-[10px] font-bold tracking-widest uppercase text-on-surface-variant text-right truncate">
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        {filteredStats.length === 0 ? (
          <p className="text-center py-8 text-sm text-on-surface-variant">
            No data for this category yet.
          </p>
        ) : (
          filteredStats.map((s, i) => (
            <StatRow key={i} stat={s} isLast={i === filteredStats.length - 1} />
          ))
        )}
      </div>
    </div>
  );
}

function StatRow({ stat, isLast }: { stat: MatchStat; isLast: boolean }) {
  const rawHome = stat.home;
  const rawAway = stat.away;
  const homeNum = typeof rawHome === "string" ? parseFloat(rawHome) : (rawHome ?? 0);
  const awayNum = typeof rawAway === "string" ? parseFloat(rawAway) : (rawAway ?? 0);
  const total   = homeNum + awayNum;
  const homeW   = total === 0 ? 50 : Math.round((homeNum / total) * 100);

  return (
    <div
      className="px-4 py-3 hover:bg-surface-container-low transition-colors"
      style={!isLast ? { borderBottom: "2px solid rgba(26,28,28,0.08)" } : {}}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-black text-xl text-primary tabular-nums">{rawHome ?? "–"}</span>
        <span className="barlow text-xs font-bold tracking-widest uppercase text-on-surface-variant">
          {stat.name}
        </span>
        <span className="font-black text-xl text-tertiary tabular-nums">{rawAway ?? "–"}</span>
      </div>
      {total > 0 && (
        <div className="h-4 bg-surface-variant rounded-full overflow-hidden flex border-2 border-on-surface">
          <div className="h-full bg-primary-container" style={{ width: `${homeW}%` }} />
          <div className="h-full bg-tertiary-container" style={{ width: `${100 - homeW}%` }} />
        </div>
      )}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center py-12 text-sm" style={{ color: "var(--fade)" }}>{children}</p>
  );
}
