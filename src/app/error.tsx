"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
      <div
        className="text-7xl font-black text-red-700/20"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        ERR
      </div>
      <h2 className="text-xl font-bold text-[var(--text)] uppercase tracking-widest"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
        Something went wrong
      </h2>
      <p className="text-xs text-[var(--muted)]">Data could not be loaded.</p>
      <button
        onClick={reset}
        className="mt-4 rounded-sm bg-red-700 text-white font-bold text-xs
          px-6 py-2.5 hover:bg-red-600 transition-colors uppercase tracking-widest"
      >
        Try Again
      </button>
    </div>
  );
}
