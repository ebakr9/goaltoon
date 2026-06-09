import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Goaltoon – World Cup Live Scores",
  description: "Live scores, fixtures and results for the World Cup – with a cartoon twist!",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Goaltoon – World Cup Live Scores",
    description: "Live scores, fixtures and results for the World Cup – with a cartoon twist!",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b border-[#2e3650] bg-[#0d1117]/90 backdrop-blur-md">
          <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">⚽</span>
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: "'Fredoka One', cursive", color: "#fbbf24" }}
              >
                Goaltoon
              </span>
            </a>
            <nav className="flex items-center gap-4 text-sm font-semibold text-slate-400">
              <a href="/" className="hover:text-white transition-colors">
                Live
              </a>
              <a href="/" className="hover:text-white transition-colors">
                Fixtures
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <footer className="mt-16 border-t border-[#2e3650] py-6 text-center text-xs text-slate-600">
          Data by TheSportsDB · Built with ❤️ for Goaltoon.com
        </footer>
      </body>
    </html>
  );
}
