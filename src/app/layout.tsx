import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Goaltoon · FIFA World Cup 2026",
  description: "Live scores, fixtures and results — FIFA World Cup 2026.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4GSEB3SC1X"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4GSEB3SC1X');
        `}</Script>
        <Sidebar />
        <Topbar />
        <div className="page-shell">
          <div className="page-content">{children}</div>
        </div>
      </body>
    </html>
  );
}

/* ── Sidebar ── */
const SIDE_NAV = [
  { icon: <HomeIcon />,     label: "Home",         active: true  },
  { icon: <LiveIcon />,     label: "Live Scores",  active: false },
  { icon: <FixtureIcon />,  label: "Fixtures",     active: false },
  { icon: <TrophyIcon />,   label: "Competitions", active: false },
  { icon: <CalIcon />,      label: "Schedule",     active: false },
  { icon: <StatsIcon />,    label: "Stats",        active: false },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        {/* Cup mark only */}
        <svg width="26" height="28" viewBox="0 0 42 44" fill="none">
          <path d="M10 4H32L29 22C28 28 24 32 21 33C18 32 14 28 13 22Z" fill="var(--gold)"/>
          <path d="M10 4C6 4 3 7 3 11C3 16 7 19 11 18" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M32 4C36 4 39 7 39 11C39 16 35 19 31 18" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <rect x="17.5" y="33" width="7" height="6" rx="1" fill="var(--gold)"/>
          <rect x="12" y="39" width="18" height="3.5" rx="1.5" fill="var(--gold)"/>
        </svg>
      </div>

      <nav className="sidebar-nav">
        {SIDE_NAV.map((item, i) => (
          <a key={i} href="/" title={item.label}
            className={`sidebar-item ${item.active ? "active" : ""}`}>
            {item.icon}
          </a>
        ))}
      </nav>
    </aside>
  );
}

/* ── Topbar ── */
const TOP_LINKS = [
  { label: "Live Scores",  active: true  },
  { label: "Fixtures",     active: false },
  { label: "Competitions", active: false },
  { label: "Teams",        active: false },
  { label: "Stats",        active: false },
  { label: "News",         active: false },
];

function Topbar() {
  return (
    <header className="topbar">
      {/* Logo wordmark */}
      <a href="/" className="flex items-center gap-2.5 mr-8 select-none shrink-0">
        <div className="flex items-end leading-none">
          <span className="anton" style={{ fontSize: "1.35rem", color: "var(--gold)", lineHeight: 1 }}>GOAL</span>
          <span className="anton" style={{ fontSize: "1.35rem", color: "var(--white)", lineHeight: 1 }}>TOON</span>
        </div>
        <div className="hidden sm:flex flex-col leading-none">
          <span className="text-[8px] font-bold tracking-[.2em] uppercase" style={{ color: "var(--fade)" }}>
            World Cup 2026
          </span>
        </div>
      </a>

      {/* Nav */}
      <nav className="flex items-center gap-0.5 nobar overflow-x-auto">
        {TOP_LINKS.map((l, i) => (
          <a key={i} href="/" className={`topbar-link ${l.active ? "active" : ""}`}>
            {l.label}
          </a>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Host country pills */}
      <div className="flex items-center gap-1.5 shrink-0">
        {[{ f: "🇺🇸", n: "USA" }, { f: "🇨🇦", n: "CAN" }, { f: "🇲🇽", n: "MEX" }].map(h => (
          <div key={h.n} className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded"
            style={{ background: "var(--bg3)", border: "1px solid var(--line2)" }}>
            <span className="text-xs leading-none">{h.f}</span>
            <span className="text-[10px] font-bold barlow tracking-wide" style={{ color: "var(--chalk)" }}>{h.n}</span>
          </div>
        ))}
      </div>
    </header>
  );
}

/* ── Icons ── */
function HomeIcon() {
  return <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>;
}
function LiveIcon() {
  return <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M6.3 6.3a8 8 0 000 11.4M17.7 6.3a8 8 0 010 11.4"/></svg>;
}
function FixtureIcon() {
  return <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
}
function TrophyIcon() {
  return <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M8 21h8M12 17v4"/><path d="M7 4H4a1 1 0 00-1 1v3a4 4 0 004 4"/><path d="M17 4h3a1 1 0 011 1v3a4 4 0 01-4 4"/><path d="M7 4h10v8a5 5 0 01-10 0V4z"/></svg>;
}
function CalIcon() {
  return <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
}
function StatsIcon() {
  return <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>;
}
