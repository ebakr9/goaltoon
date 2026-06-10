"use client";

import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Fixtures", href: "/" },
  { label: "Groups",   href: "/groups" },
  { label: "Stats",    href: "/" },
];

export default function TopNav() {
  const pathname = usePathname();

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
          {NAV_LINKS.map((n) => {
            const isActive = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return isActive ? (
              <a key={n.label} href={n.href}
                className="text-primary font-bold border-b-4 border-primary pb-0.5 text-sm transition-all">
                {n.label}
              </a>
            ) : (
              <a key={n.label} href={n.href}
                className="text-on-surface-variant text-sm font-semibold hover:bg-surface-container-high px-3 py-1 rounded-md transition-all">
                {n.label}
              </a>
            );
          })}
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
