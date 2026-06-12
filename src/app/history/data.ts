export interface BracketMatch {
  t1: string;
  t2: string;
  s: string;
  w: 1 | 2;
}

export interface TournamentData {
  season: number;
  host: string;
  winner: string;
  winnerLogo: string;
  runnerUp: string;
  finalScore: string;
  topScorer: { name: string; goals: number; country: string };
  topAssists: { name: string; assists: number; country: string };
  r16: BracketMatch[];
  qf: BracketMatch[];
  sf: BracketMatch[];
  thirdPlace: BracketMatch;
  final: BracketMatch;
}

export const TOURNAMENTS: TournamentData[] = [
  {
    season: 2022, host: "Qatar",
    winner: "Argentina", winnerLogo: "https://media.api-sports.io/football/teams/26.png",
    runnerUp: "France", finalScore: "3-3 (4-2p)",
    topScorer:  { name: "Kylian Mbappé",     goals: 8,   country: "France" },
    topAssists: { name: "Lionel Messi",       assists: 3, country: "Argentina" },
    r16: [
      { t1: "Netherlands",  t2: "USA",          s: "3-1",         w: 1 },
      { t1: "Argentina",    t2: "Australia",     s: "2-1",         w: 1 },
      { t1: "Japan",        t2: "Croatia",       s: "1-1 (1-3p)",  w: 2 },
      { t1: "Brazil",       t2: "South Korea",   s: "4-1",         w: 1 },
      { t1: "France",       t2: "Poland",        s: "3-1",         w: 1 },
      { t1: "England",      t2: "Senegal",       s: "3-0",         w: 1 },
      { t1: "Morocco",      t2: "Spain",         s: "0-0 (3-0p)",  w: 1 },
      { t1: "Portugal",     t2: "Switzerland",   s: "6-1",         w: 1 },
    ],
    qf: [
      { t1: "Netherlands",  t2: "Argentina",     s: "2-2 (3-4p)",  w: 2 },
      { t1: "Croatia",      t2: "Brazil",        s: "1-1 (4-2p)",  w: 1 },
      { t1: "France",       t2: "England",       s: "2-1",         w: 1 },
      { t1: "Morocco",      t2: "Portugal",      s: "1-0",         w: 1 },
    ],
    sf: [
      { t1: "Argentina",    t2: "Croatia",       s: "3-0",         w: 1 },
      { t1: "France",       t2: "Morocco",       s: "2-0",         w: 1 },
    ],
    thirdPlace: { t1: "Croatia",   t2: "Morocco",  s: "2-1",         w: 1 },
    final:      { t1: "Argentina", t2: "France",   s: "3-3 (4-2p)",  w: 1 },
  },
  {
    season: 2018, host: "Russia",
    winner: "France", winnerLogo: "https://media.api-sports.io/football/teams/2.png",
    runnerUp: "Croatia", finalScore: "4-2",
    topScorer:  { name: "Harry Kane",          goals: 6,   country: "England" },
    topAssists: { name: "Antoine Griezmann",   assists: 2, country: "France" },
    r16: [
      { t1: "France",       t2: "Argentina",     s: "4-3",         w: 1 },
      { t1: "Uruguay",      t2: "Portugal",      s: "2-1",         w: 1 },
      { t1: "Brazil",       t2: "Mexico",        s: "2-0",         w: 1 },
      { t1: "Belgium",      t2: "Japan",         s: "3-2",         w: 1 },
      { t1: "Spain",        t2: "Russia",        s: "1-1 (3-4p)",  w: 2 },
      { t1: "Croatia",      t2: "Denmark",       s: "1-1 (3-2p)",  w: 1 },
      { t1: "Sweden",       t2: "Switzerland",   s: "1-0",         w: 1 },
      { t1: "Colombia",     t2: "England",       s: "1-1 (3-4p)",  w: 2 },
    ],
    qf: [
      { t1: "Uruguay",      t2: "France",        s: "0-2",         w: 2 },
      { t1: "Brazil",       t2: "Belgium",       s: "1-2",         w: 2 },
      { t1: "Russia",       t2: "Croatia",       s: "2-2 (3-4p)",  w: 2 },
      { t1: "Sweden",       t2: "England",       s: "0-2",         w: 2 },
    ],
    sf: [
      { t1: "France",       t2: "Belgium",       s: "1-0",         w: 1 },
      { t1: "Croatia",      t2: "England",       s: "2-1 (aet)",   w: 1 },
    ],
    thirdPlace: { t1: "Belgium",  t2: "England",  s: "2-0",  w: 1 },
    final:      { t1: "France",   t2: "Croatia",  s: "4-2",  w: 1 },
  },
  {
    season: 2014, host: "Brazil",
    winner: "Germany", winnerLogo: "https://media.api-sports.io/football/teams/25.png",
    runnerUp: "Argentina", finalScore: "1-0 (aet)",
    topScorer:  { name: "James Rodríguez",  goals: 6,   country: "Colombia" },
    topAssists: { name: "Toni Kroos",       assists: 3, country: "Germany" },
    r16: [
      { t1: "Brazil",       t2: "Chile",         s: "1-1 (3-2p)",  w: 1 },
      { t1: "Colombia",     t2: "Uruguay",       s: "2-0",         w: 1 },
      { t1: "France",       t2: "Nigeria",       s: "2-0",         w: 1 },
      { t1: "Germany",      t2: "Algeria",       s: "2-1 (aet)",   w: 1 },
      { t1: "Argentina",    t2: "Switzerland",   s: "1-0 (aet)",   w: 1 },
      { t1: "Belgium",      t2: "USA",           s: "2-1 (aet)",   w: 1 },
      { t1: "Netherlands",  t2: "Mexico",        s: "2-1 (aet)",   w: 1 },
      { t1: "Costa Rica",   t2: "Greece",        s: "1-1 (5-3p)",  w: 1 },
    ],
    qf: [
      { t1: "Brazil",       t2: "Colombia",      s: "2-1",         w: 1 },
      { t1: "France",       t2: "Germany",       s: "0-1",         w: 2 },
      { t1: "Argentina",    t2: "Belgium",       s: "1-0",         w: 1 },
      { t1: "Netherlands",  t2: "Costa Rica",    s: "0-0 (4-3p)",  w: 1 },
    ],
    sf: [
      { t1: "Brazil",       t2: "Germany",       s: "1-7",         w: 2 },
      { t1: "Netherlands",  t2: "Argentina",     s: "0-0 (2-4p)",  w: 2 },
    ],
    thirdPlace: { t1: "Brazil",   t2: "Netherlands", s: "0-3",       w: 2 },
    final:      { t1: "Germany",  t2: "Argentina",   s: "1-0 (aet)", w: 1 },
  },
  {
    season: 2010, host: "South Africa",
    winner: "Spain", winnerLogo: "https://media.api-sports.io/football/teams/9.png",
    runnerUp: "Netherlands", finalScore: "1-0 (aet)",
    topScorer:  { name: "Thomas Müller",  goals: 5,   country: "Germany" },
    topAssists: { name: "Thomas Müller",  assists: 3, country: "Germany" },
    r16: [
      { t1: "Netherlands",  t2: "Slovakia",      s: "2-1",         w: 1 },
      { t1: "Brazil",       t2: "Chile",         s: "3-0",         w: 1 },
      { t1: "Uruguay",      t2: "South Korea",   s: "2-1",         w: 1 },
      { t1: "USA",          t2: "Ghana",         s: "1-2 (aet)",   w: 2 },
      { t1: "Germany",      t2: "England",       s: "4-1",         w: 1 },
      { t1: "Argentina",    t2: "Mexico",        s: "3-1",         w: 1 },
      { t1: "Paraguay",     t2: "Japan",         s: "0-0 (5-3p)",  w: 1 },
      { t1: "Spain",        t2: "Portugal",      s: "1-0",         w: 1 },
    ],
    qf: [
      { t1: "Netherlands",  t2: "Brazil",        s: "2-1",         w: 1 },
      { t1: "Uruguay",      t2: "Ghana",         s: "1-1 (4-2p)",  w: 1 },
      { t1: "Germany",      t2: "Argentina",     s: "4-0",         w: 1 },
      { t1: "Paraguay",     t2: "Spain",         s: "0-1",         w: 2 },
    ],
    sf: [
      { t1: "Netherlands",  t2: "Uruguay",       s: "3-2",         w: 1 },
      { t1: "Germany",      t2: "Spain",         s: "0-1",         w: 2 },
    ],
    thirdPlace: { t1: "Uruguay",     t2: "Germany",     s: "2-3",        w: 2 },
    final:      { t1: "Netherlands", t2: "Spain",       s: "0-1 (aet)",  w: 2 },
  },
  {
    season: 2006, host: "Germany",
    winner: "Italy", winnerLogo: "https://media.api-sports.io/football/teams/10.png",
    runnerUp: "France", finalScore: "1-1 (5-3p)",
    topScorer:  { name: "Miroslav Klose",   goals: 5,   country: "Germany" },
    topAssists: { name: "Zinedine Zidane",  assists: 3, country: "France" },
    r16: [
      { t1: "Germany",      t2: "Sweden",        s: "2-0",         w: 1 },
      { t1: "Argentina",    t2: "Mexico",        s: "2-1 (aet)",   w: 1 },
      { t1: "Italy",        t2: "Australia",     s: "1-0",         w: 1 },
      { t1: "Switzerland",  t2: "Ukraine",       s: "0-0 (0-3p)",  w: 2 },
      { t1: "England",      t2: "Ecuador",       s: "1-0",         w: 1 },
      { t1: "Portugal",     t2: "Netherlands",   s: "1-0",         w: 1 },
      { t1: "France",       t2: "Spain",         s: "3-1",         w: 1 },
      { t1: "Brazil",       t2: "Ghana",         s: "3-0",         w: 1 },
    ],
    qf: [
      { t1: "Germany",      t2: "Argentina",     s: "1-1 (4-2p)",  w: 1 },
      { t1: "Italy",        t2: "Ukraine",       s: "3-0",         w: 1 },
      { t1: "England",      t2: "Portugal",      s: "0-0 (1-3p)",  w: 2 },
      { t1: "France",       t2: "Brazil",        s: "1-0",         w: 1 },
    ],
    sf: [
      { t1: "Germany",      t2: "Italy",         s: "0-2 (aet)",   w: 2 },
      { t1: "Portugal",     t2: "France",        s: "0-1",         w: 2 },
    ],
    thirdPlace: { t1: "Germany", t2: "Portugal", s: "3-1",         w: 1 },
    final:      { t1: "Italy",   t2: "France",   s: "1-1 (5-3p)", w: 1 },
  },
  {
    season: 2002, host: "Korea / Japan",
    winner: "Brazil", winnerLogo: "https://media.api-sports.io/football/teams/6.png",
    runnerUp: "Germany", finalScore: "2-0",
    topScorer:  { name: "Ronaldo",  goals: 8,   country: "Brazil" },
    topAssists: { name: "Rivaldo",  assists: 3, country: "Brazil" },
    r16: [
      { t1: "Germany",      t2: "Paraguay",      s: "1-0",         w: 1 },
      { t1: "USA",          t2: "Mexico",        s: "2-0",         w: 1 },
      { t1: "South Korea",  t2: "Italy",         s: "2-1 (aet)",   w: 1 },
      { t1: "Spain",        t2: "Ireland",       s: "1-1 (3-2p)",  w: 1 },
      { t1: "Brazil",       t2: "Belgium",       s: "2-0",         w: 1 },
      { t1: "England",      t2: "Denmark",       s: "3-0",         w: 1 },
      { t1: "Senegal",      t2: "Sweden",        s: "2-1 (aet)",   w: 1 },
      { t1: "Japan",        t2: "Turkey",        s: "0-1",         w: 2 },
    ],
    qf: [
      { t1: "Germany",      t2: "USA",           s: "1-0",         w: 1 },
      { t1: "South Korea",  t2: "Spain",         s: "0-0 (5-3p)",  w: 1 },
      { t1: "Brazil",       t2: "England",       s: "2-1",         w: 1 },
      { t1: "Senegal",      t2: "Turkey",        s: "0-1",         w: 2 },
    ],
    sf: [
      { t1: "Germany",      t2: "South Korea",   s: "1-0",         w: 1 },
      { t1: "Brazil",       t2: "Turkey",        s: "1-0",         w: 1 },
    ],
    thirdPlace: { t1: "South Korea", t2: "Turkey",  s: "2-3",  w: 2 },
    final:      { t1: "Germany",     t2: "Brazil",  s: "0-2",  w: 2 },
  },
  {
    season: 1998, host: "France",
    winner: "France", winnerLogo: "https://media.api-sports.io/football/teams/2.png",
    runnerUp: "Brazil", finalScore: "3-0",
    topScorer:  { name: "Davor Šuker",     goals: 6,   country: "Croatia" },
    topAssists: { name: "Zinedine Zidane", assists: 2, country: "France" },
    r16: [
      { t1: "Brazil",       t2: "Chile",         s: "4-1",         w: 1 },
      { t1: "Denmark",      t2: "Nigeria",       s: "4-1",         w: 1 },
      { t1: "Netherlands",  t2: "Yugoslavia",    s: "2-1",         w: 1 },
      { t1: "Argentina",    t2: "England",       s: "2-2 (4-3p)",  w: 1 },
      { t1: "France",       t2: "Paraguay",      s: "1-0 (aet)",   w: 1 },
      { t1: "Italy",        t2: "Norway",        s: "1-0",         w: 1 },
      { t1: "Germany",      t2: "Mexico",        s: "2-1",         w: 1 },
      { t1: "Croatia",      t2: "Romania",       s: "1-0",         w: 1 },
    ],
    qf: [
      { t1: "Brazil",       t2: "Denmark",       s: "3-2",         w: 1 },
      { t1: "Netherlands",  t2: "Argentina",     s: "2-1",         w: 1 },
      { t1: "France",       t2: "Italy",         s: "0-0 (4-3p)",  w: 1 },
      { t1: "Germany",      t2: "Croatia",       s: "0-3",         w: 2 },
    ],
    sf: [
      { t1: "Brazil",       t2: "Netherlands",   s: "1-1 (4-2p)",  w: 1 },
      { t1: "France",       t2: "Croatia",       s: "2-1",         w: 1 },
    ],
    thirdPlace: { t1: "Netherlands", t2: "Croatia", s: "1-2",  w: 2 },
    final:      { t1: "France",      t2: "Brazil",  s: "3-0",  w: 1 },
  },
];

export function getTournament(season: number): TournamentData | undefined {
  return TOURNAMENTS.find((t) => t.season === season);
}
