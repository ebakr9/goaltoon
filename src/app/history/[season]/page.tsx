import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { TOURNAMENTS, getTournament, BracketMatch } from "../data";
import { getCountryConfig } from "@/lib/countries";

export const revalidate = false;

export function generateStaticParams() {
  return TOURNAMENTS.map((t) => ({ season: String(t.season) }));
}

export async function generateMetadata({ params }: { params: { season: string } }) {
  const t = getTournament(Number(params.season));
  if (!t) return {};
  return { title: `${t.season} World Cup – Goaltoon` };
}

// API-Football national team logo IDs
const LOGOS: Record<string, string> = {
  "Argentina":   "https://media.api-sports.io/football/teams/26.png",
  "France":      "https://media.api-sports.io/football/teams/2.png",
  "Germany":     "https://media.api-sports.io/football/teams/25.png",
  "Spain":       "https://media.api-sports.io/football/teams/9.png",
  "Italy":       "https://media.api-sports.io/football/teams/768.png",
  "Brazil":      "https://media.api-sports.io/football/teams/6.png",
  "Croatia":     "https://media.api-sports.io/football/teams/3.png",
  "Netherlands": "https://media.api-sports.io/football/teams/1118.png",
  "England":     "https://media.api-sports.io/football/teams/10.png",
  "Portugal":    "https://media.api-sports.io/football/teams/27.png",
  "Uruguay":     "https://media.api-sports.io/football/teams/7.png",
  "Mexico":      "https://media.api-sports.io/football/teams/16.png",
  "USA":         "https://media.api-sports.io/football/teams/2384.png",
  "Morocco":     "https://media.api-sports.io/football/teams/31.png",
  "Senegal":     "https://media.api-sports.io/football/teams/13.png",
  "Switzerland": "https://media.api-sports.io/football/teams/15.png",
  "Denmark":     "https://media.api-sports.io/football/teams/21.png",
  "Belgium":     "https://media.api-sports.io/football/teams/1.png",
  "Sweden":      "https://media.api-sports.io/football/teams/5.png",
  "South Korea": "https://media.api-sports.io/football/teams/17.png",
  "Japan":       "https://media.api-sports.io/football/teams/12.png",
  "Australia":   "https://media.api-sports.io/football/teams/20.png",
  "Ecuador":     "https://media.api-sports.io/football/teams/2382.png",
  "Ghana":       "https://media.api-sports.io/football/teams/1504.png",
  "Colombia":    "https://media.api-sports.io/football/teams/8.png",
  "Chile":       "https://media.api-sports.io/football/teams/2383.png",
  "Paraguay":    "https://media.api-sports.io/football/teams/2380.png",
  "Costa Rica":  "https://media.api-sports.io/football/teams/29.png",
  "Algeria":     "https://media.api-sports.io/football/teams/1532.png",
  "Nigeria":     "https://media.api-sports.io/football/teams/19.png",
  "Greece":      "https://media.api-sports.io/football/teams/1117.png",
  "Slovakia":    "https://media.api-sports.io/football/teams/773.png",
  "Ukraine":     "https://media.api-sports.io/football/teams/772.png",
  "Romania":     "https://media.api-sports.io/football/teams/774.png",
  "Russia":      "https://media.api-sports.io/football/teams/4.png",
  "Poland":      "https://media.api-sports.io/football/teams/24.png",
  "Turkey":      "https://media.api-sports.io/football/teams/777.png",
  // Historical teams
  "West Germany":    "https://media.api-sports.io/football/teams/25.png",
  "East Germany":    "https://media.api-sports.io/football/teams/25.png",
  "Soviet Union":    "https://media.api-sports.io/football/teams/4.png",
  "Yugoslavia":      "https://media.api-sports.io/football/teams/774.png",
  "Czechoslovakia":  "https://media.api-sports.io/football/teams/773.png",
  "Bulgaria":        "https://media.api-sports.io/football/teams/30.png",
  "Northern Ireland":"https://media.api-sports.io/football/teams/1126.png",
  "Rep. of Ireland": "https://media.api-sports.io/football/teams/778.png",
  "Saudi Arabia":    "https://media.api-sports.io/football/teams/36.png",
  "Cameroon":        "https://media.api-sports.io/football/teams/18.png",
  "Peru":            "https://media.api-sports.io/football/teams/14.png",
  "Hungary":         "https://media.api-sports.io/football/teams/769.png",
  "North Korea":     "https://media.api-sports.io/football/teams/1527.png",
  "Austria":         "https://media.api-sports.io/football/teams/775.png",
  "United States":   "https://media.api-sports.io/football/teams/2384.png",
};

function TeamCircle({ country, size = "md" }: { country: string; size?: "sm" | "md" | "lg" }) {
  const logo = LOGOS[country];
  const flag = getCountryConfig(country).flag;
  const dim = size === "lg" ? "w-10 h-10" : size === "sm" ? "w-5 h-5" : "w-7 h-7";
  const border = size === "lg" ? "border-2" : "border-2";
  return (
    <div className={`${dim} rounded-full ${border} border-outline-variant bg-surface-container overflow-hidden shrink-0 flex items-center justify-center`}>
      {logo ? (
        <Image src={logo} alt={country} width={40} height={40}
          className="w-full h-full object-contain scale-[1.8]" unoptimized />
      ) : (
        <span style={{ fontSize: size === "lg" ? 18 : size === "sm" ? 10 : 14 }}>{flag}</span>
      )}
    </div>
  );
}

function parseScores(s: string): [string, string, string | undefined] {
  const paren = s.match(/\(([^)]+)\)/);
  const extra = paren?.[1];
  const main = s.replace(/\s*\([^)]+\)/, "").trim();
  const idx = main.indexOf("-");
  if (idx === -1) return [main, "", extra];
  return [main.slice(0, idx), main.slice(idx + 1), extra];
}

function MatchCard({ match, size = "md" }: { match: BracketMatch; size?: "sm" | "md" | "lg" }) {
  const [s1, s2, extra] = parseScores(match.s);
  const w = size === "lg" ? "w-[190px]" : size === "sm" ? "w-[148px]" : "w-[168px]";
  return (
    <div className={`rounded-xl overflow-hidden border-2 border-on-surface bg-white shrink-0 ${w}`}>
      <div className={`flex items-center justify-between gap-1.5 px-2 py-1.5 ${match.w === 1 ? "bg-primary/10" : ""}`}>
        <span className={`flex items-center gap-1.5 min-w-0 ${match.w === 1 ? "font-black text-primary" : "text-on-surface-variant font-medium"}`}
          style={{ fontSize: size === "lg" ? 13 : 11 }}>
          <TeamCircle country={match.t1} size="sm" />
          <span className="truncate">{match.t1}</span>
        </span>
        <span className={`font-black tabular-nums shrink-0 ml-1 ${match.w === 1 ? "text-primary" : "text-on-surface-variant"}`}
          style={{ fontSize: size === "lg" ? 15 : 12 }}>
          {s1}
        </span>
      </div>
      <div className="h-px bg-outline-variant" />
      <div className={`flex items-center justify-between gap-1.5 px-2 py-1.5 ${match.w === 2 ? "bg-primary/10" : ""}`}>
        <span className={`flex items-center gap-1.5 min-w-0 ${match.w === 2 ? "font-black text-primary" : "text-on-surface-variant font-medium"}`}
          style={{ fontSize: size === "lg" ? 13 : 11 }}>
          <TeamCircle country={match.t2} size="sm" />
          <span className="truncate">{match.t2}</span>
        </span>
        <span className={`font-black tabular-nums shrink-0 ml-1 ${match.w === 2 ? "text-primary" : "text-on-surface-variant"}`}
          style={{ fontSize: size === "lg" ? 15 : 12 }}>
          {s2}
        </span>
      </div>
      {extra && (
        <div className="bg-surface-container px-2 py-0.5 text-center border-t border-outline-variant">
          <span className="text-[10px] font-bold text-on-surface-variant">({extra})</span>
        </div>
      )}
    </div>
  );
}

function BracketColumn({ label, matches, height }: { label: string; matches: BracketMatch[]; height: number }) {
  return (
    <div className="flex flex-col gap-2 shrink-0">
      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">{label}</span>
      <div className="flex flex-col justify-around" style={{ height }}>
        {matches.map((m, i) => <MatchCard key={i} match={m} />)}
      </div>
    </div>
  );
}

export default function TournamentDetailPage({ params }: { params: { season: string } }) {
  const t = getTournament(Number(params.season));
  if (!t) notFound();

  const BRACKET_H = 640;

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-10 flex flex-col gap-10">

      {/* Back */}
      <Link href="/history"
        className="inline-flex items-center gap-1 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
        <span className="material-symbols-outlined text-base">arrow_back</span>
        All Tournaments
      </Link>

      {/* Hero header */}
      <div className="card-border-bold rounded-2xl overflow-hidden">
        <div className="pitch-pattern-dense px-8 py-8 flex flex-col gap-4">
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest">{t.host} · FIFA World Cup</p>
          <div className="flex items-center gap-5">
            <span className="font-montserrat font-black text-7xl text-white/20 leading-none">{t.season}</span>
            <div className="flex flex-col gap-2">
              {/* Winner */}
              <div className="flex items-center gap-3">
                <TeamCircle country={t.winner} size="lg" />
                <span className="font-montserrat font-black text-3xl text-white">{t.winner}</span>
                <span className="text-white/40 font-bold text-lg">{t.finalScore}</span>
                <TeamCircle country={t.runnerUp} size="md" />
                <span className="text-white/60 text-lg font-bold">{t.runnerUp}</span>
              </div>
              <p className="text-white/40 text-sm font-bold">World Champions</p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-surface-container grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-outline-variant">
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
            <div className="flex items-center gap-3">
              <TeamCircle country={t.topScorer.country} size="md" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Golden Boot</p>
                <p className="font-montserrat font-black text-xl text-on-background">{t.topScorer.name}</p>
                <p className="text-sm text-on-surface-variant">
                  <span className="text-primary font-black text-base">{t.topScorer.goals}</span> goals · {t.topScorer.country}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="material-symbols-outlined text-tertiary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>sports_score</span>
            <div className="flex items-center gap-3">
              <TeamCircle country={t.topAssists.country} size="md" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Top Assists</p>
                <p className="font-montserrat font-black text-xl text-on-background">{t.topAssists.name}</p>
                <p className="text-sm text-on-surface-variant">
                  <span className="text-tertiary font-black text-base">{t.topAssists.assists}</span> assists · {t.topAssists.country}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bracket */}
      <section>
        <h2 className="font-montserrat font-black text-2xl text-on-surface border-b-4 border-primary inline-block pb-1 mb-6">
          Tournament Bracket
        </h2>
        <div className="card-border-bold rounded-2xl bg-white p-5 overflow-x-auto">
          <div className="flex gap-4" style={{ minWidth: 960 }}>
            <BracketColumn label="Round of 16"    matches={t.r16} height={BRACKET_H} />
            <BracketColumn label="Quarter-finals" matches={t.qf}  height={BRACKET_H} />
            <BracketColumn label="Semi-finals"    matches={t.sf}  height={BRACKET_H} />
            <div className="flex flex-col gap-2 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">Final Stage</span>
              <div className="flex flex-col justify-around items-center" style={{ height: BRACKET_H }}>
                <div className="flex flex-col items-center gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center mb-1.5">🏆 Final</p>
                    <MatchCard match={t.final} size="lg" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center mb-1.5">3rd Place</p>
                    <MatchCard match={t.thirdPlace} size="lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
