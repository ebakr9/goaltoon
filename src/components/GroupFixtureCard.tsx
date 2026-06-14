"use client";

import Image from "next/image";
import Link from "next/link";
import { NormalizedMatch } from "@/lib/apifootball";

export default function GroupFixtureCard({ match }: { match: NormalizedMatch }) {
  const date = new Date(match.timestamp * 1000);
  const tz   = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const dayName  = date.toLocaleDateString([], { weekday: "short", timeZone: tz });
  const dateStr  = date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric", timeZone: tz });
  const timeStr  = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: tz });
  const tzLabel  = tz.replace(/_/g, " ");

  return (
    <Link href={`/match/${match.id}`}
      className="card-border-bold-sm rounded-xl bg-white hover:bg-surface-container-low transition-colors overflow-hidden block">
      <div className="flex items-center px-4 py-3 gap-4">

        {/* Date/time in local timezone */}
        <div className="shrink-0 text-center min-w-[80px]">
          <p className="text-xs font-bold text-primary">{dayName}</p>
          <p className="text-sm font-black text-on-surface font-montserrat">{dateStr}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">{timeStr}</p>
          <p className="text-[10px] text-on-surface-variant opacity-60">{tzLabel}</p>
        </div>

        <div className="w-px h-10 bg-outline-variant shrink-0" />

        {/* Home team */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="font-bold text-sm text-on-surface truncate text-right">{match.homeTeam.name}</span>
          {match.homeTeam.logo && (
            <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={28} height={28}
              className="object-contain shrink-0" unoptimized />
          )}
        </div>

        {/* VS */}
        <div className="shrink-0 px-2">
          <span className="font-montserrat font-black text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded">
            VS
          </span>
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {match.awayTeam.logo && (
            <Image src={match.awayTeam.logo} alt={match.awayTeam.name} width={28} height={28}
              className="object-contain shrink-0" unoptimized />
          )}
          <span className="font-bold text-sm text-on-surface truncate">{match.awayTeam.name}</span>
        </div>

        {/* Arrow */}
        <span className="material-symbols-outlined text-on-surface-variant text-base shrink-0">chevron_right</span>
      </div>
    </Link>
  );
}
