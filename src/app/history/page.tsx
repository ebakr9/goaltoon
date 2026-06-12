import Link from "next/link";
import Image from "next/image";
import { TOURNAMENTS } from "./data";

export const revalidate = false;

export async function generateMetadata() {
  return { title: "History – Goaltoon" };
}

export default function HistoryPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-12 flex flex-col gap-8">
      <header className="border-b-2 border-outline-variant pb-6">
        <span className="inline-flex items-center bg-primary text-on-primary rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider mb-3">
          FIFA World Cup
        </span>
        <h1 className="font-montserrat font-black text-5xl md:text-6xl text-on-background leading-none">
          Tournament History
        </h1>
        <p className="text-sm text-on-surface-variant mt-3">1966 – 2022</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...TOURNAMENTS].sort((a, b) => b.season - a.season).map((t) => (
          <Link
            key={t.season}
            href={`/history/${t.season}`}
            className="card-border-bold rounded-xl overflow-hidden group block"
          >
            <div className="pitch-pattern-dense px-5 py-4 flex items-center gap-3">
              <span className="font-montserrat font-black text-2xl text-white leading-none shrink-0">{t.season}</span>
              <div className="w-px h-6 bg-white/20 shrink-0" />
              <span className="text-white/60 text-xs font-bold truncate min-w-0">{t.host}</span>
              <div className="w-px h-6 bg-white/20 shrink-0" />
              <div className="w-7 h-7 rounded-full border-2 border-white/30 bg-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                <Image src={t.winnerLogo} alt={t.winner} width={28} height={28}
                  className="w-full h-full object-contain scale-[1.8]" unoptimized />
              </div>
              <span className="text-white text-sm font-bold truncate min-w-0 flex-1">{t.winner}</span>
              <span className="material-symbols-outlined text-white/30 text-base group-hover:translate-x-0.5 transition-transform shrink-0">
                arrow_forward
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
