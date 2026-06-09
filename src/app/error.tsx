"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
      <span className="text-7xl">🚨</span>
      <h2
        className="text-3xl font-bold text-red-400"
        style={{ fontFamily: "'Fredoka One', cursive" }}
      >
        VAR Check Failed
      </h2>
      <p className="text-slate-400 text-sm">Something went wrong on our end.</p>
      <button
        onClick={reset}
        className="mt-4 rounded-xl bg-red-500 text-white font-bold px-6 py-2.5 hover:bg-red-400 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
