"use client";

import { useEffect, useState } from "react";

export default function MatchCountdown({ timestamp }: { timestamp: number }) {
  const [diff, setDiff] = useState(() => timestamp * 1000 - Date.now());

  useEffect(() => {
    const id = setInterval(() => setDiff(timestamp * 1000 - Date.now()), 1000);
    return () => clearInterval(id);
  }, [timestamp]);

  if (diff <= 0) return null;

  const totalSecs = Math.floor(diff / 1000);
  const d = Math.floor(totalSecs / 86400);
  const h = Math.floor((totalSecs % 86400) / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
        Kick-off in
      </span>
      <div className="flex items-center gap-1.5">
        {d > 0 && (
          <>
            <Unit value={d} label="d" />
            <Sep />
          </>
        )}
        <Unit value={h} label="h" />
        <Sep />
        <Unit value={m} label="m" />
        <Sep />
        <Unit value={s} label="s" />
      </div>
    </div>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-black/40 backdrop-blur-sm
      border border-white/20 rounded-lg px-2 py-1 min-w-[36px]">
      <span className="font-montserrat font-black text-white text-lg leading-none tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-white/50 text-[9px] font-bold uppercase tracking-wider leading-none mt-0.5">
        {label}
      </span>
    </div>
  );
}

function Sep() {
  return (
    <span className="font-montserrat font-black text-white/50 text-base leading-none mb-1">:</span>
  );
}
