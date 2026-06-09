// Country name → emoji flag + cartoon mascot config
export interface CountryConfig {
  flag: string;
  color: string;       // primary brand color for card BG tint
  accent: string;      // secondary/accent color
  mascot: string;      // emoji mascot used in goal animation
  stadiumGradient: string; // Tailwind gradient classes
}

const countries: Record<string, CountryConfig> = {
  Brazil: {
    flag: "🇧🇷",
    color: "#009c3b",
    accent: "#ffdf00",
    mascot: "🦜",
    stadiumGradient: "from-green-800 to-yellow-700",
  },
  Argentina: {
    flag: "🇦🇷",
    color: "#74acdf",
    accent: "#ffffff",
    mascot: "🦁",
    stadiumGradient: "from-sky-700 to-blue-500",
  },
  France: {
    flag: "🇫🇷",
    color: "#002395",
    accent: "#ed2939",
    mascot: "🐓",
    stadiumGradient: "from-blue-900 to-red-700",
  },
  Germany: {
    flag: "🇩🇪",
    color: "#000000",
    accent: "#dd0000",
    mascot: "🦅",
    stadiumGradient: "from-gray-900 to-red-800",
  },
  England: {
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    color: "#cf111b",
    accent: "#ffffff",
    mascot: "🦁",
    stadiumGradient: "from-red-700 to-white/10",
  },
  Spain: {
    flag: "🇪🇸",
    color: "#aa151b",
    accent: "#f1bf00",
    mascot: "🐂",
    stadiumGradient: "from-red-800 to-yellow-600",
  },
  Portugal: {
    flag: "🇵🇹",
    color: "#006600",
    accent: "#ff0000",
    mascot: "🦅",
    stadiumGradient: "from-green-800 to-red-700",
  },
  Netherlands: {
    flag: "🇳🇱",
    color: "#ff6600",
    accent: "#003082",
    mascot: "🌷",
    stadiumGradient: "from-orange-600 to-blue-800",
  },
  Italy: {
    flag: "🇮🇹",
    color: "#009246",
    accent: "#ce2b37",
    mascot: "🐺",
    stadiumGradient: "from-green-700 to-red-700",
  },
  USA: {
    flag: "🇺🇸",
    color: "#b22234",
    accent: "#3c3b6e",
    mascot: "🦅",
    stadiumGradient: "from-red-700 to-blue-900",
  },
  Mexico: {
    flag: "🇲🇽",
    color: "#006847",
    accent: "#ce1126",
    mascot: "🦅",
    stadiumGradient: "from-green-800 to-red-700",
  },
  Japan: {
    flag: "🇯🇵",
    color: "#bc002d",
    accent: "#ffffff",
    mascot: "🦊",
    stadiumGradient: "from-red-700 to-pink-300",
  },
  Morocco: {
    flag: "🇲🇦",
    color: "#c1272d",
    accent: "#006233",
    mascot: "🦁",
    stadiumGradient: "from-red-700 to-green-800",
  },
  Senegal: {
    flag: "🇸🇳",
    color: "#00853f",
    accent: "#fdef42",
    mascot: "🦁",
    stadiumGradient: "from-green-700 to-yellow-600",
  },
  Croatia: {
    flag: "🇭🇷",
    color: "#ff0000",
    accent: "#ffffff",
    mascot: "🦅",
    stadiumGradient: "from-red-700 to-blue-400",
  },
  Uruguay: {
    flag: "🇺🇾",
    color: "#5aaae7",
    accent: "#ffffff",
    mascot: "☀️",
    stadiumGradient: "from-sky-600 to-blue-400",
  },
};

export function getCountryConfig(teamName: string): CountryConfig {
  const key = Object.keys(countries).find((k) =>
    teamName.toLowerCase().includes(k.toLowerCase())
  );
  return (
    key ? countries[key] : {
      flag: "⚽",
      color: "#334155",
      accent: "#94a3b8",
      mascot: "⚽",
      stadiumGradient: "from-slate-800 to-slate-600",
    }
  );
}
