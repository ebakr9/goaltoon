"use client";

export default function LocalTime({ timestamp, stackTz }: { timestamp: number; stackTz?: boolean }) {
  const time = new Date(timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const tz   = Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " ");
  if (stackTz) {
    return (
      <span className="flex flex-col items-center leading-none gap-0.5">
        <span>{time}</span>
        <span className="text-[10px] font-normal opacity-60">{tz}</span>
      </span>
    );
  }
  return <>{time} <span className="text-[10px] opacity-70">{tz}</span></>;
}
