"use client";

import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";
import { DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";

const NAV_LINKS = [
  { label: "Home",    href: "/" },
  { label: "Groups",  href: "/groups" },
  { label: "Stats",   href: "/stats" },
  { label: "History", href: "/history" },
];

export default function TopNav() {
  const pathname = usePathname();
  const dotLottieRef = useRef<DotLottie | null>(null);

  // Play once on mount
  useEffect(() => {
    dotLottieRef.current?.play();
  }, []);

  function handleMouseEnter() {
    const dl = dotLottieRef.current;
    if (!dl) return;
    dl.stop();
    dl.play();
  }

  return (
    <nav
      className="bg-white w-full top-0 sticky z-50 border-b-2 border-outline-variant"
      style={{ height: "var(--topbar-h)", boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.1)" }}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-10 max-w-container-max mx-auto relative">
        {/* Logo */}
        <div className="flex items-center gap-2 select-none shrink-0">
          <a href="/" className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: 40, fontVariationSettings: "'FILL' 1" }}
            >
              sports_soccer
            </span>
            <span className="font-montserrat font-black text-2xl text-primary tracking-tight">
              Goaltoon
            </span>
          </a>
          <div onMouseEnter={handleMouseEnter} style={{ width: 40, height: 40 }}>
            <DotLottieReact
              src="/animations/ball.lottie"
              autoplay={false}
              loop={false}
              dotLottieRefCallback={(dl) => { dotLottieRef.current = dl; }}
              style={{ width: 40, height: 40 }}
            />
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((n) => {
            const isActive = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return isActive ? (
              <a key={n.label} href={n.href}
                className="text-primary font-bold border-b-4 border-primary pb-0.5 text-base transition-all">
                {n.label}
              </a>
            ) : (
              <a key={n.label} href={n.href}
                className="text-on-surface-variant text-base font-semibold hover:bg-surface-container-high px-3 py-1 rounded-md transition-all">
                {n.label}
              </a>
            );
          })}
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-3">
          <button className="md:hidden text-primary" aria-label="Menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
