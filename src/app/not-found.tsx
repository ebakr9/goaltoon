export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
      <span className="text-8xl">⚽</span>
      <h1
        className="text-4xl font-bold text-yellow-400"
        style={{ fontFamily: "'Fredoka One', cursive" }}
      >
        Off Target!
      </h1>
      <p className="text-slate-400">This page doesn&apos;t exist.</p>
      <a
        href="/"
        className="mt-4 rounded-xl bg-yellow-500 text-black font-bold px-6 py-2.5 hover:bg-yellow-400 transition-colors"
      >
        Back to Fixtures
      </a>
    </div>
  );
}
