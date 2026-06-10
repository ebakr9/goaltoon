"use client";

import Image from "next/image";
import { MatchLineup, MatchPlayer } from "@/lib/apifootball";

interface Placed extends MatchPlayer {
  row: number;
  col: number;
}

function parsePlayers(players: MatchPlayer[]): Placed[] {
  const withGrid = players.filter((p) => p.grid);

  if (withGrid.length > 0) {
    return withGrid.map((p) => {
      const [row, col] = p.grid!.split(":").map(Number);
      return { ...p, row, col };
    });
  }

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

// Horizontal pitch: x = depth (left=home GK, right=away GK), y = width
// row → depth axis, col → width axis
function calcPos(
  p: Placed,
  maxRow: number,
  allPlayers: Placed[],
  isHome: boolean
): { x: number; y: number } {
  const colsInRow = allPlayers.filter((q) => q.row === p.row).length;
  // y: spread players across pitch width
  const y = (p.col / (colsInRow + 1)) * 100;

  const spread = 35;
  const norm = (p.row - 1) / Math.max(maxRow - 1, 1);

  // Home: left side — GK at ~8%, outfield pushes right toward centre
  // Away: right side — GK at ~92%, outfield pushes left toward centre
  const x = isHome ? 8 + norm * spread : 92 - norm * spread;
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

      {/* Horizontal Pitch */}
      <div
        className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden select-none"
        style={{ aspectRatio: "105/68" }}
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
      <div
        className={`w-6 h-6 rounded-full ${bg} border-2 ${ring} shadow-lg
          flex items-center justify-center font-montserrat font-bold text-[10px] ${textColor}`}
      >
        {player.number}
      </div>
      <span
        className="mt-0.5 text-[9px] font-bold text-white text-center leading-tight max-w-[56px] truncate"
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

// ─── Horizontal Football Pitch SVG ───────────────────────────────────────────
// ViewBox 0 0 105 68 (meters). Pitch on its side: left=home, right=away.

function PitchSVG() {
  const lc = "rgba(255,255,255,0.65)";
  const lw = 0.4;

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 105 68"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Alternating grass stripes (vertical) */}
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={i * 15} y="0" width="15" height="68"
          fill={i % 2 === 0 ? "#2e7d32" : "#33902e"} />
      ))}

      <g stroke={lc} strokeWidth={lw} fill="none">
        {/* Outer boundary */}
        <rect x="2" y="2" width="101" height="64" />

        {/* Halfway line */}
        <line x1="52.5" y1="2" x2="52.5" y2="66" />

        {/* Centre circle + spot */}
        <circle cx="52.5" cy="34" r="9.15" />
        <circle cx="52.5" cy="34" r="0.5" fill={lc} stroke="none" />

        {/* ── Left half (home) ── */}
        {/* Penalty area */}
        <rect x="2" y="13.84" width="16.5" height="40.32" />
        {/* Goal area */}
        <rect x="2" y="24.84" width="5.5" height="18.32" />
        {/* Penalty spot */}
        <circle cx="13" cy="34" r="0.5" fill={lc} stroke="none" />
        {/* Penalty arc */}
        <path d="M18.5 22.77 A9.15 9.15 0 0 0 18.5 45.23" />

        {/* ── Right half (away) ── */}
        {/* Penalty area */}
        <rect x="86.5" y="13.84" width="16.5" height="40.32" />
        {/* Goal area */}
        <rect x="97" y="24.84" width="5.5" height="18.32" />
        {/* Penalty spot */}
        <circle cx="92" cy="34" r="0.5" fill={lc} stroke="none" />
        {/* Penalty arc */}
        <path d="M86.5 22.77 A9.15 9.15 0 0 1 86.5 45.23" />
      </g>

      {/* Goals */}
      <g stroke={lc} strokeWidth={lw}>
        <rect x="0.3" y="29.34" width="2.2" height="9.32" fill="rgba(255,255,255,0.15)" />
        <rect x="102.5" y="29.34" width="2.2" height="9.32" fill="rgba(255,255,255,0.15)" />
      </g>

      {/* Corner arcs */}
      <g stroke={lc} strokeWidth={lw} fill="none">
        <path d="M5.5 2 A3.5 3.5 0 0 0 2 5.5" />
        <path d="M5.5 66 A3.5 3.5 0 0 1 2 62.5" />
        <path d="M99.5 2 A3.5 3.5 0 0 1 103 5.5" />
        <path d="M99.5 66 A3.5 3.5 0 0 0 103 62.5" />
      </g>

      {/* Team side labels */}
      <text x="49" y="34.5" textAnchor="middle" fill="rgba(255,255,255,0.25)"
        fontSize="3.5" fontFamily="sans-serif" fontWeight="bold">HOME</text>
      <text x="56" y="34.5" textAnchor="middle" fill="rgba(255,255,255,0.25)"
        fontSize="3.5" fontFamily="sans-serif" fontWeight="bold">AWAY</text>
    </svg>
  );
}
