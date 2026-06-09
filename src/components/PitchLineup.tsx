"use client";

import Image from "next/image";
import { MatchLineup, MatchPlayer } from "@/lib/apifootball";

interface Placed extends MatchPlayer {
  row: number;
  col: number;
}

// Parse grid "row:col" or fall back to position grouping
function parsePlayers(players: MatchPlayer[]): Placed[] {
  const withGrid = players.filter((p) => p.grid);

  if (withGrid.length > 0) {
    return withGrid.map((p) => {
      const [row, col] = p.grid!.split(":").map(Number);
      return { ...p, row, col };
    });
  }

  // Fallback: group by position code when grid isn't available
  const order: Record<string, number> = { G: 1, D: 2, M: 3, F: 4 };
  const buckets: Record<number, MatchPlayer[]> = {};
  for (const p of players) {
    const r = order[p.position] ?? 3;
    (buckets[r] ||= []).push(p);
  }
  return players.map((p) => {
    const row = order[p.position] ?? 3;
    const col = buckets[row].indexOf(p) + 1;
    return { ...p, row, col };
  });
}

function shortName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return name;
  return `${parts[0][0]}. ${parts[parts.length - 1]}`;
}

// x% based on column within its row, y% based on row index within the team half
function calcPos(
  p: Placed,
  maxRow: number,
  allPlayers: Placed[],
  isHome: boolean
): { x: number; y: number } {
  const colsInRow = allPlayers.filter((q) => q.row === p.row).length;
  const x = (p.col / (colsInRow + 1)) * 100;

  // Home → bottom half (GK at ~92%, highest row at ~57%)
  // Away → top half   (GK at ~8%,  highest row at ~43%)
  const spread = 35;
  const norm = (p.row - 1) / Math.max(maxRow - 1, 1);

  const y = isHome ? 92 - norm * spread : 8 + norm * spread;
  return { x, y };
}

interface Props {
  home: MatchLineup;
  away: MatchLineup;
}

export default function PitchLineup({ home, away }: Props) {
  const homePlayers = parsePlayers(home.startXI);
  const awayPlayers = parsePlayers(away.startXI);
  const homeMax = Math.max(...homePlayers.map((p) => p.row), 1);
  const awayMax = Math.max(...awayPlayers.map((p) => p.row), 1);

  return (
    <div className="space-y-3">
      {/* Formation header */}
      <div className="grid grid-cols-2 gap-2">
        <TeamHeader lineup={home} align="left" colorClass="text-primary" />
        <TeamHeader lineup={away} align="right" colorClass="text-tertiary" />
      </div>

      {/* Pitch */}
      <div
        className="relative w-full max-w-[380px] mx-auto rounded-xl overflow-hidden select-none"
        style={{ aspectRatio: "68/105" }}
      >
        <PitchSVG />

        {/* Home players */}
        {homePlayers.map((p) => {
          const pos = calcPos(p, homeMax, homePlayers, true);
          return (
            <PlayerDot
              key={p.id}
              player={p}
              x={pos.x}
              y={pos.y}
              ring="border-primary"
              bg="bg-white"
              textColor="text-primary"
            />
          );
        })}

        {/* Away players */}
        {awayPlayers.map((p) => {
          const pos = calcPos(p, awayMax, awayPlayers, false);
          return (
            <PlayerDot
              key={p.id}
              player={p}
              x={pos.x}
              y={pos.y}
              ring="border-white"
              bg="bg-tertiary"
              textColor="text-white"
            />
          );
        })}
      </div>

      {/* Substitutes */}
      {(home.substitutes.length > 0 || away.substitutes.length > 0) && (
        <SubstitutesList home={home} away={away} />
      )}

      {/* Coaches */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border-2 border-outline-variant">
          <span className="text-lg">🧥</span>
          <div>
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Coach</p>
            <p className="font-semibold text-on-surface">{home.coach}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border-2 border-outline-variant justify-end">
          <div className="text-right">
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Coach</p>
            <p className="font-semibold text-on-surface">{away.coach}</p>
          </div>
          <span className="text-lg">🧥</span>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TeamHeader({
  lineup, align, colorClass,
}: { lineup: MatchLineup; align: "left" | "right"; colorClass: string }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-white border-2 border-outline-variant
        ${align === "right" ? "flex-row-reverse" : ""}`}
    >
      {lineup.teamLogo && (
        <Image src={lineup.teamLogo} alt={lineup.teamName} width={26} height={26}
          className="object-contain shrink-0" unoptimized />
      )}
      <div className={align === "right" ? "text-right" : ""}>
        <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider truncate">
          {lineup.teamName}
        </p>
        <p className={`font-montserrat font-black text-xl leading-none ${colorClass}`}>
          {lineup.formation}
        </p>
      </div>
    </div>
  );
}

function PlayerDot({
  player, x, y, ring, bg, textColor,
}: {
  player: Placed;
  x: number;
  y: number;
  ring: string;
  bg: string;
  textColor: string;
}) {
  return (
    <div
      className="absolute flex flex-col items-center pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", zIndex: 10 }}
    >
      {/* Jersey circle */}
      <div
        className={`w-8 h-8 rounded-full ${bg} border-2 ${ring} shadow-lg
          flex items-center justify-center font-montserrat font-bold text-[11px] ${textColor}`}
      >
        {player.number}
      </div>
      {/* Name */}
      <span
        className="mt-0.5 text-[8px] font-bold text-white text-center leading-tight max-w-[52px] truncate"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.6)" }}
      >
        {shortName(player.name)}
      </span>
    </div>
  );
}

function SubstitutesList({ home, away }: { home: MatchLineup; away: MatchLineup }) {
  const max = Math.max(home.substitutes.length, away.substitutes.length);
  return (
    <div className="rounded-xl overflow-hidden border-2 border-outline-variant bg-white">
      <div className="px-4 py-2.5 bg-surface-container border-b-2 border-outline-variant">
        <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
          Substitutes
        </span>
      </div>
      {Array.from({ length: max }).map((_, i) => {
        const h = home.substitutes[i];
        const a = away.substitutes[i];
        const isLast = i === max - 1;
        return (
          <div
            key={i}
            className="grid grid-cols-[1fr_16px_1fr] items-center gap-1 px-4 py-2"
            style={!isLast ? { borderBottom: "1px solid #bbcbbb" } : {}}
          >
            {/* Home sub */}
            {h ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold w-5 text-center bg-surface-container rounded text-on-surface-variant shrink-0">
                  {h.number}
                </span>
                <span className="text-xs font-semibold text-on-surface truncate">{h.name}</span>
              </div>
            ) : <div />}
            <div className="flex justify-center">
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
            </div>
            {/* Away sub */}
            {a ? (
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xs font-semibold text-on-surface truncate text-right">{a.name}</span>
                <span className="text-[10px] font-bold w-5 text-center bg-surface-container rounded text-on-surface-variant shrink-0">
                  {a.number}
                </span>
              </div>
            ) : <div />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Football pitch SVG ───────────────────────────────────────────────────────
// ViewBox 0 0 68 105 (meters). Real pitch proportions.

function PitchSVG() {
  const lc = "rgba(255,255,255,0.65)";
  const lw = 0.4;

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 68 105"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Alternating grass stripes */}
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x="0" y={i * 15} width="68" height="15"
          fill={i % 2 === 0 ? "#2e7d32" : "#33902e"} />
      ))}

      <g stroke={lc} strokeWidth={lw} fill="none">
        {/* Outer boundary */}
        <rect x="2" y="2" width="64" height="101" />

        {/* Halfway line */}
        <line x1="2" y1="52.5" x2="66" y2="52.5" />

        {/* Centre circle + spot */}
        <circle cx="34" cy="52.5" r="9.15" />
        <circle cx="34" cy="52.5" r="0.5" fill={lc} stroke="none" />

        {/* ── Top half (away) ── */}
        {/* Penalty area */}
        <rect x="13.84" y="2" width="40.32" height="16.5" />
        {/* Goal area */}
        <rect x="24.84" y="2" width="18.32" height="5.5" />
        {/* Penalty spot */}
        <circle cx="34" cy="13" r="0.5" fill={lc} stroke="none" />
        {/* Penalty arc (outside area) */}
        <path d="M22.77 18.5 A9.15 9.15 0 0 1 45.23 18.5" />

        {/* ── Bottom half (home) ── */}
        {/* Penalty area */}
        <rect x="13.84" y="86.5" width="40.32" height="16.5" />
        {/* Goal area */}
        <rect x="24.84" y="97" width="18.32" height="5.5" />
        {/* Penalty spot */}
        <circle cx="34" cy="92" r="0.5" fill={lc} stroke="none" />
        {/* Penalty arc */}
        <path d="M22.77 86.5 A9.15 9.15 0 0 0 45.23 86.5" />
      </g>

      {/* Goals (white filled) */}
      <g stroke={lc} strokeWidth={lw}>
        <rect x="29.34" y="0.3" width="9.32" height="2.2" fill="rgba(255,255,255,0.15)" />
        <rect x="29.34" y="102.5" width="9.32" height="2.2" fill="rgba(255,255,255,0.15)" />
      </g>

      {/* Corner arcs */}
      <g stroke={lc} strokeWidth={lw} fill="none">
        <path d="M2 5.5 A3.5 3.5 0 0 0 5.5 2" />
        <path d="M66 5.5 A3.5 3.5 0 0 1 62.5 2" />
        <path d="M2 99.5 A3.5 3.5 0 0 1 5.5 103" />
        <path d="M66 99.5 A3.5 3.5 0 0 0 62.5 103" />
      </g>

      {/* Team side labels */}
      <text x="34" y="49.5" textAnchor="middle" fill="rgba(255,255,255,0.25)"
        fontSize="3.5" fontFamily="sans-serif" fontWeight="bold">AWAY</text>
      <text x="34" y="56.5" textAnchor="middle" fill="rgba(255,255,255,0.25)"
        fontSize="3.5" fontFamily="sans-serif" fontWeight="bold">HOME</text>
    </svg>
  );
}
