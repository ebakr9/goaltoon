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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-4GSEB3SC1X" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4GSEB3SC1X');
        `}</Script>
        <TopNav />
        <div className="page-shell">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}

/* ── Top navigation ── */
const NAV_LINKS = [
  { label: "Home",     href: "/",  active: true  },
  { label: "Fixtures", href: "/",  active: false },
  { label: "Groups",   href: "/",  active: false },
  { label: "Stats",    href: "/",  active: false },
];

function TopNav() {
  return (
    <nav
      className="bg-white w-full top-0 sticky z-50 border-b-2 border-outline-variant"
      style={{ height: "var(--topbar-h)", boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.1)" }}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-10 max-w-container-max mx-auto">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 select-none shrink-0">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}
          >
            sports_soccer
          </span>
          <span className="font-montserrat font-black text-xl text-primary tracking-tight">
            Goaltoon
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((n) =>
            n.active ? (
              <a key={n.label} href={n.href}
                className="text-primary font-bold border-b-4 border-primary pb-0.5 text-sm transition-all">
                {n.label}
              </a>
            ) : (
              <a key={n.label} href={n.href}
                className="text-on-surface-variant text-sm font-semibold hover:bg-surface-container-high px-3 py-1 rounded-md transition-all">
                {n.label}
              </a>
            )
          )}
        </div>

        {/* CTA + mobile menu */}
        <div className="flex items-center gap-3">
          <a href="/"
            className="hidden md:block btn-stacked px-5 py-2 rounded-lg text-sm">
            Live Updates
          </a>
          <button className="md:hidden text-primary" aria-label="Menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ── Footer ── */
const FOOTER_LINKS = ["Privacy Policy", "Terms of Service", "Tournament Rules", "Contact"];

function SiteFooter() {
  return (
    <footer className="w-full py-12 border-t-2 border-outline-variant mt-auto"
      style={{ background: "#e2e2e2" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-10 max-w-container-max mx-auto text-center md:text-left">
        <div className="flex flex-col gap-3">
          <span className="font-montserrat font-bold text-on-surface-variant flex items-center justify-center md:justify-start gap-2">
            <span className="material-symbols-outlined text-[20px]">sports_soccer</span>
            Goaltoon
          </span>
          <p className="text-sm text-on-surface-variant">
            © 2026 Goaltoon. All Rights Reserved. Not affiliated with FIFA.
          </p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-6 items-center">
          {FOOTER_LINKS.map((l) => (
            <a key={l} href="/"
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-bold">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
