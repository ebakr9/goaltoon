import { fetchMatchesByDate, NormalizedMatch } from "@/lib/sportsdb";
import LiveScoreClient from "@/components/LiveScoreClient";

export const revalidate = 60;

export default async function HomePage() {
  const today = new Date().toISOString().split("T")[0];
  let matches: NormalizedMatch[] = [];

  try {
    matches = await fetchMatchesByDate(today, "all");
  } catch {
    // show empty state if API is down
  }

  const initial = {
    live: matches.filter((m) => m.status === "live"),
    upcoming: matches.filter((m) => m.status === "upcoming"),
    finished: matches.filter((m) => m.status === "finished"),
    date: today,
    leagueId: "all",
    fetchedAt: Date.now(),
  };

  return (
    <>
      <div className="mb-8 text-center">
        <h1
          className="text-5xl font-bold text-yellow-400 mb-2"
          style={{ fontFamily: "'Fredoka One', cursive" }}
        >
          ⚽ Goaltoon
        </h1>
        <p className="text-slate-400 text-sm">
          Live Scores · Fixtures · Results
        </p>
      </div>

      <LiveScoreClient initial={initial} />
    </>
  );
}
