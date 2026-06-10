"use client";

import { useEffect, useState } from "react";

// International football opening match — June 11 2026 at 20:00 UTC
const TARGET = new Date("2026-06-11T20:00:00Z").getTime();

interface TimeLeft { days: number; hours: number; mins: number; secs: number }

function calc(): TimeLeft {
  const diff = Math.max(0, TARGET - Date.now());
  return {
    days:  Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins:  Math.floor((diff % 3_600_000) / 60_000),
    secs:  Math.floor((diff % 60_000) / 1_000),
  };
}

export default function HeroCountdown() {
  const [t, setT] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  const boxes = t
    ? [
        { val: pad(t.days),  label: "Days"  },
        { val: pad(t.hours), label: "Hours" },
        { val: pad(t.mins),  label: "Mins"  },
        { val: pad(t.secs),  label: "Secs"  },
      ]
    : [
        { val: "--", label: "Days"  },
        { val: "--", label: "Hours" },
        { val: "--", label: "Mins"  },
        { val: "--", label: "Secs"  },
      ];

  return (
    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
      {boxes.map(({ val, label }) => (
        <div
          key={label}
          className="bg-white border-2 border-outline-variant rounded-xl p-4 min-w-[80px] text-center"
          style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.1)" }}
        >
          <span className="block font-montserrat text-3xl font-bold text-primary leading-none">
            {val}
          </span>
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mt-1 block">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
