import { fetchMatchesByDate, NormalizedMatch } from "@/lib/sportsdb";
import LiveScoreClient from "@/components/LiveScoreClient";

export const revalidate = 60;

export default async function HomePage() {
  const today = new Date().toISOString().split("T")[0];
  let matches: NormalizedMatch[] = [];
  try { matches = await fetchMatchesByDate(today, "all"); } catch { /**/ }

  const initial = {
    live:      matches.filter(m => m.status === "live"),
    upcoming:  matches.filter(m => m.status === "upcoming"),
    finished:  matches.filter(m => m.status === "finished"),
    date:      today,
    leagueId:  "all",
    fetchedAt: Date.now(),
  };

  return (
    <>
      <Hero />
      <LiveScoreClient initial={initial} />
    </>
  );
}

function Hero() {
  return (
    <div className="relative overflow-hidden rounded-xl mb-8"
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--line2)",
        minHeight: 200,
      }}>

      {/* BG image — WC artwork cropped top portion */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: "url('/wc-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          opacity: .22,
        }} />

      {/* Dark gradient over image */}
      <div className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, rgba(10,10,10,.98) 35%, rgba(10,10,10,.6) 70%, transparent 100%)",
        }} />

      {/* Gold accent bar — left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: "var(--gold)" }} />

      <div className="relative z-10 px-8 py-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-4"
          style={{
            background: "var(--gold)",
            padding: "4px 12px",
            borderRadius: 4,
          }}>
          <span className="barlow text-xs font-900 tracking-[.18em] uppercase"
            style={{ color: "#000", fontWeight: 800 }}>
            FIFA World Cup 2026
          </span>
        </div>

        <h1 className="barlow font-black uppercase leading-none mb-1"
          style={{ fontSize: "clamp(2rem,5vw,3.4rem)", letterSpacing: ".01em" }}>
          <span style={{ color: "var(--white)" }}>LIVE SCORES &amp;</span>
          <br />
          <span style={{ color: "var(--gold)" }}>FIXTURES</span>
        </h1>

        <p className="text-sm mt-3 max-w-xs" style={{ color: "var(--fade)", lineHeight: 1.6 }}>
          Real-time updates, match stats and everything about World Cup 2026.
        </p>

        {/* Stats strip */}
        <div className="flex gap-8 mt-6">
          {[
            { n: "48",  l: "Nations"       },
            { n: "104", l: "Matches"       },
            { n: "16",  l: "Host Cities"   },
            { n: "3",   l: "Host Countries"},
          ].map(s => (
            <div key={s.n}>
              <div className="anton text-2xl leading-none" style={{ color: "var(--gold)" }}>{s.n}</div>
              <div className="text-[10px] font-semibold tracking-widest uppercase mt-0.5" style={{ color: "var(--fade)" }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
