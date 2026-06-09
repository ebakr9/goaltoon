export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
      <div
        className="text-7xl font-black text-[var(--gold-lt)] opacity-20"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        404
      </div>
      <h1 className="text-xl font-bold text-[var(--text)] uppercase tracking-widest"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
        Page Not Found
      </h1>
      <p className="text-xs text-[var(--muted)]">This page doesn&apos;t exist.</p>
      <a
        href="/"
        className="mt-4 rounded-sm bg-[var(--gold)] text-black font-bold text-xs
          px-6 py-2.5 hover:bg-[var(--gold-lt)] transition-colors uppercase tracking-widest"
      >
        Back to Fixtures
      </a>
    </div>
  );
}
