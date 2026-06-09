"use client";

import { useEffect, useState, useCallback } from "react";
import { NormalizedMatch, LEAGUES } from "@/lib/sportsdb";
import MatchCard from "./MatchCard";

interface MatchData {
  live: NormalizedMatch[];
  upcoming: NormalizedMatch[];
  finished: NormalizedMatch[];
  date: string;
  leagueId: string;
  fetchedAt: number;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// Generate last 7 days + today + next 3 days as quick picks
function quickDates(): { label: string; value: string }[] {
  const result = [];
  for (let i = -6; i <= 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const val = d.toISOString().split("T")[0];
    const label =
      i === 0 ? "Today" :
      i === -1 ? "Yesterday" :
      i === 1 ? "Tomorrow" :
      d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    result.push({ label, value: val });
  }
  return result;
}

export default function LiveScoreClient({ initial }: { initial: MatchData }) {
  const [data, setData] = useState<MatchData>(initial);
  const [selectedDate, setSelectedDate] = useState(initial.date);
  const [selectedLeague, setSelectedLeague] = useState(initial.leagueId);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = useCallback(async (date: string, leagueId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/live-scores?date=${date}&leagueId=${leagueId}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const json: MatchData = await res.json();
        setData(json);
        setLastUpdated(new Date());
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh only when viewing today
  useEffect(() => {
    if (selectedDate !== todayStr()) return;
    const id = setInterval(() => fetchData(selectedDate, selectedLeague), 60_000);
    return () => clearInterval(id);
  }, [selectedDate, selectedLeague, fetchData]);

  function handleDateChange(date: string) {
    setSelectedDate(date);
    fetchData(date, selectedLeague);
  }

  function handleLeagueChange(leagueId: string) {
    setSelectedLeague(leagueId);
    fetchData(selectedDate, leagueId);
  }

  const isToday = selectedDate === todayStr();
  const dates = quickDates();
  const total = data.live.length + data.upcoming.length + data.finished.length;

  return (
    <div>
      {/* ── League selector ── */}
      <div className="mb-4 overflow-x-auto pb-1">
        <div className="flex gap-2 min-w-max">
          {LEAGUES.map((lg) => (
            <button
              key={lg.id}
              onClick={() => handleLeagueChange(lg.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap
                ${selectedLeague === lg.id
                  ? "bg-yellow-400 text-black border-yellow-400"
                  : "bg-[#1a1f2e] text-slate-400 border-[#2e3650] hover:border-slate-500 hover:text-white"
                }`}
            >
              <span>{lg.flag}</span>
              <span>{lg.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Date selector ── */}
      <div className="mb-6">
        {/* Quick date pills */}
        <div className="overflow-x-auto pb-1 mb-2">
          <div className="flex gap-2 min-w-max">
            {dates.map((d) => (
              <button
                key={d.value}
                onClick={() => handleDateChange(d.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap
                  ${selectedDate === d.value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-[#1a1f2e] text-slate-400 border-[#2e3650] hover:border-slate-500 hover:text-white"
                  }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom date input + status bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium">Custom date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && handleDateChange(e.target.value)}
              className="bg-[#1a1f2e] border border-[#2e3650] text-slate-300 text-xs rounded-lg px-2.5 py-1.5
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
                [color-scheme:dark]"
            />
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              Updated:{" "}
              {lastUpdated.toLocaleTimeString("en-GB", {
                hour: "2-digit", minute: "2-digit", second: "2-digit",
              })}
            </span>
            <button
              onClick={() => fetchData(selectedDate, selectedLeague)}
              disabled={isLoading}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <span className={isLoading ? "animate-spin inline-block" : "inline-block"}>↻</span>
              {isLoading ? "Loading…" : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-[#1a1f2e] border border-[#2e3650] animate-pulse"
            />
          ))}
        </div>
      )}

      {/* ── Content ── */}
      {!isLoading && (
        <>
          {/* Live */}
          {data.live.length > 0 && (
            <section className="mb-8">
              <SectionHeader title="Live Now" count={data.live.length} accent="text-red-400" dot />
              <MatchGrid matches={data.live} />
            </section>
          )}

          {/* Upcoming */}
          {data.upcoming.length > 0 && (
            <section className="mb-8">
              <SectionHeader
                title={isToday ? "Today's Fixtures" : "Fixtures"}
                count={data.upcoming.length}
                accent="text-blue-400"
              />
              <MatchGrid matches={data.upcoming} />
            </section>
          )}

          {/* Finished */}
          {data.finished.length > 0 && (
            <section className="mb-8">
              <SectionHeader title="Results" count={data.finished.length} accent="text-slate-400" />
              <MatchGrid matches={data.finished} />
            </section>
          )}

          {/* Empty state */}
          {total === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <span className="text-7xl">⚽</span>
              <p
                className="text-xl font-bold text-slate-400"
                style={{ fontFamily: "'Fredoka One', cursive" }}
              >
                No matches found
              </p>
              <p className="text-sm text-slate-600">
                Try a different date or league.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SectionHeader({
  title, count, accent, dot,
}: {
  title: string; count: number; accent: string; dot?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      {dot && <span className="live-dot w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />}
      <h2
        className={`text-xl font-bold ${accent}`}
        style={{ fontFamily: "'Fredoka One', cursive" }}
      >
        {title}
      </h2>
      <span className="text-xs font-bold text-slate-600 bg-slate-800 rounded-full px-2 py-0.5">
        {count}
      </span>
    </div>
  );
}

function MatchGrid({ matches }: { matches: NormalizedMatch[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {matches.map((m) => (
        <MatchCard key={m.id} match={m} />
      ))}
    </div>
  );
}
