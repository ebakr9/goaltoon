"use client";

import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Groups",   href: "/groups" },
  { label: "Stats",    href: "/stats" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="bg-white w-full top-0 sticky z-50 border-b-2 border-outline-variant"
      style={{ height: "var(--topbar-h)", boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.1)" }}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-10 max-w-container-max mx-auto relative">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 select-none shrink-0">
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

        {/* mobile menu */}
        <div className="flex items-center gap-3">
          <button className="md:hidden text-primary" aria-label="Menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
