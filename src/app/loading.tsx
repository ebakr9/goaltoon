export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-[0.2em]">
        Loading fixtures…
      </p>
    </div>
  );
}
