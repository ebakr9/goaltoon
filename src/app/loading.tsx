export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <span className="text-7xl animate-float">⚽</span>
      <p
        className="text-xl font-bold text-yellow-400"
        style={{ fontFamily: "'Fredoka One', cursive" }}
      >
        Loading fixtures…
      </p>
    </div>
  );
}
