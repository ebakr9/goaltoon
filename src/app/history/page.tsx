import Link from "next/link";
import Image from "next/image";
import { TOURNAMENTS } from "./data";

export const revalidate = false;

export async function generateMetadata() {
  return { title: "History – Goaltoon" };
}

const BLURBS: Record<number, string> = {
  2022: "Argentina's dream fulfilled, Messi lifting the trophy after a breathtaking final and penalty-shootout victory over Mbappé's France.",
  2018: "France's fearless new generation conquered Russia, with Mbappé's explosive brilliance powering Les Bleus past Croatia in a thrilling final.",
  2014: "Germany's complete team triumphed in Brazil, crowned by Götze's extra-time winner against Argentina at the Maracanã.",
  2010: "Spain's golden generation ruled South Africa, as Iniesta's extra-time strike delivered their first World Cup against the Netherlands.",
  2006: "Italy rose through tension and controversy, defeating France on penalties after Zidane's unforgettable headbutt in his final match.",
  2002: "Brazil reclaimed football's throne in Asia, with Ronaldo's redemption and eight goals leading a dazzling fifth World Cup triumph.",
  1998: "France celebrated on home soil, as Zidane's two headers dismantled Brazil and delivered Les Bleus their first title.",
  1994: "Brazil ended twenty-four years of waiting, defeating Italy on penalties after Baggio's heartbreaking miss under the Californian sun.",
  1990: "West Germany's disciplined machine conquered a defensive tournament, defeating Maradona's Argentina through Brehme's late penalty in Rome.",
  1986: "Maradona's World Cup: divine skill, controversy, and genius carried Argentina past England and toward glory in Mexico.",
  1982: "Italy transformed from doubt to champions, inspired by Paolo Rossi's goals and a commanding final victory over West Germany.",
  1978: "Argentina lifted their first World Cup at home, amid roaring crowds, ticker tape, and Kempes's unforgettable goals.",
  1974: "Total Football enchanted the world, but West Germany's resilience overcame Cruyff's Netherlands in a dramatic Munich final.",
  1970: "Brazil produced footballing perfection in Mexico, with Pelé leading a legendary team to a glorious third World Cup.",
  1966: "England's finest footballing hour arrived at Wembley, defeating West Germany after extra time and Hurst's historic hat-trick.",
};

export default function HistoryPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-12 flex flex-col gap-8">
      <header className="border-b-2 border-outline-variant pb-6">
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
            className="card-border-bold rounded-xl overflow-hidden group block flex flex-col"
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
            {BLURBS[t.season] && (
              <div className="bg-white px-5 py-3 flex-1 border-t-2 border-outline-variant">
                <p className="text-sm text-on-surface-variant leading-relaxed font-bold">{BLURBS[t.season]}</p>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
