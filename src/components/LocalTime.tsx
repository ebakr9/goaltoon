"use client";

export default function LocalTime({ timestamp }: { timestamp: number }) {
  const time = new Date(timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const tz   = Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " ");
  return <>{time} <span className="text-[10px] opacity-70">{tz}</span></>;
}
