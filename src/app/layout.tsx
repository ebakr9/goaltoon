import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Goaltoon – Independent Football Scores & Match Statistics",
  description: "Live scores, fixtures, events and match statistics for football leagues and international tournaments.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/icon.png",
  },
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
            © 2026 Goaltoon. All Rights Reserved.
          </p>
          <p className="text-xs text-on-surface-variant/70 leading-relaxed max-w-sm">
            Goaltoon is an independent football scores and statistics platform.
            Goaltoon is not affiliated with, endorsed by, sponsored by, or connected
            with FIFA, the FIFA World Cup, Goal.com, or any official tournament organiser.
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
