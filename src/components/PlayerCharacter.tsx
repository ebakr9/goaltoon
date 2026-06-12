interface Props {
  shirtColor: string;
  accentColor: string;
  flip?: boolean;
  size?: number;
}

export default function PlayerCharacter({ shirtColor, accentColor, flip = false, size = 130 }: Props) {
  const skin  = "#FDBCB4";
  const skinS = "#E8967A";
  const hair  = "#1a0800";
  const K     = "#0d0d0d";   // black outline
  const W     = "#ffffff";

  const shortC = darken(shirtColor, 35);
  const textC  = isLight(shirtColor) ? K : W;

  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 110 165"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? "scaleX(-1)" : "none", display: "block", overflow: "visible" }}
      aria-hidden="true"
    >
      {/* ── SHADOW ── */}
      <ellipse cx="55" cy="162" rx="26" ry="4" fill="rgba(0,0,0,0.20)" />

      {/* ══════════════ LEGS ══════════════ */}
      {/* Left leg — short & chubby */}
      <rect x="32" y="112" width="18" height="28" rx="7" fill={shortC} />
      {/* Left sock */}
      <rect x="31" y="134" width="20" height="10" rx="4" fill={accentColor === shirtColor ? W : accentColor} />
      {/* Left boot */}
      <ellipse cx="41" cy="148" rx="12" ry="6" fill={K} />
      <ellipse cx="41" cy="146" rx="11" ry="5" fill="#2a2a2a" />

      {/* Right leg */}
      <rect x="60" y="112" width="18" height="28" rx="7" fill={shortC} />
      {/* Right sock */}
      <rect x="59" y="134" width="20" height="10" rx="4" fill={accentColor === shirtColor ? W : accentColor} />
      {/* Right boot */}
      <ellipse cx="69" cy="148" rx="12" ry="6" fill={K} />
      <ellipse cx="69" cy="146" rx="11" ry="5" fill="#2a2a2a" />

      {/* ══════════════ SHIRT — kısa kollu forma ══════════════ */}
      {/* Body */}
      <path d="M20 75 L20 116 Q20 120 24 120 L86 120 Q90 120 90 116 L90 75 Q90 72 87 70 L75 65 Q69 76 55 76 Q41 76 35 65 L23 70 Q20 72 20 75 Z"
        fill={shirtColor} stroke={K} strokeWidth="1.2" strokeLinejoin="round" />

      {/* Shirt accent stripe — vertical center */}
      <path d="M49 65 Q47 70 47 120 L63 120 Q63 70 61 65 Q58 62 55 62 Q52 62 49 65 Z"
        fill={accentColor} opacity="0.55" />

      {/* Short sleeve left */}
      <path d="M20 75 L20 88 Q20 93 25 93 L34 93 L35 70 L23 70 Q20 72 20 75 Z"
        fill={shirtColor} stroke={K} strokeWidth="1" strokeLinejoin="round" />
      {/* Sleeve stripe left */}
      <path d="M20 78 Q20 87 24 88 L28 88 L28 72 Q24 73 20 78 Z"
        fill={accentColor} opacity="0.45" />

      {/* Short sleeve right */}
      <path d="M90 75 L90 88 Q90 93 85 93 L76 93 L75 70 L87 70 Q90 72 90 75 Z"
        fill={shirtColor} stroke={K} strokeWidth="1" strokeLinejoin="round" />
      {/* Sleeve stripe right */}
      <path d="M90 78 Q90 87 86 88 L82 88 L82 72 Q86 73 90 78 Z"
        fill={accentColor} opacity="0.45" />

      {/* Collar V */}
      <path d="M47 66 Q55 74 63 66" fill="none" stroke={K} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M49 65 Q55 72 61 65" fill={darken(shirtColor, 18)} />

      {/* Number */}
      <text x="55" y="104" textAnchor="middle" fontSize="13" fontFamily="Arial Black,sans-serif"
        fontWeight="900" fill={textC} opacity="0.88">10</text>

      {/* ══════════════ ARMS — straight down ══════════════ */}
      {/* Left arm (bare forearm below sleeve) */}
      <rect x="13" y="90" width="13" height="22" rx="6" fill={skin} stroke={K} strokeWidth="0.8" />
      {/* Left hand */}
      <ellipse cx="19" cy="115" rx="8" ry="7" fill={skin} stroke={K} strokeWidth="0.8" />
      <path d="M12 112 Q13 107 19 108 Q24 109 24 114" fill={skin} />

      {/* Right arm */}
      <rect x="84" y="90" width="13" height="22" rx="6" fill={skin} stroke={K} strokeWidth="0.8" />

      {/* BALL in right hand */}
      <circle cx="96" cy="120" r="13" fill={W} stroke={K} strokeWidth="1.5" />
      {/* Ball panels */}
      <path d="M96 107 L101 113 L99 120 L93 120 L91 113 Z" fill={K} opacity="0.13" />
      <path d="M96 107 L99 112" stroke={K} strokeWidth="0.9" fill="none" />
      <path d="M91 113 L96 107 L101 113" stroke={K} strokeWidth="0.9" fill="none" />
      <path d="M91 113 L93 121" stroke={K} strokeWidth="0.9" fill="none" />
      <path d="M101 113 L99 121" stroke={K} strokeWidth="0.9" fill="none" />
      {/* Right hand on ball */}
      <ellipse cx="90" cy="114" rx="7" ry="6" fill={skin} stroke={K} strokeWidth="0.8" />

      {/* ══════════════ NECK ══════════════ */}
      <rect x="48" y="60" width="14" height="9" rx="5" fill={skin} />

      {/* ══════════════ HEAD — large chibi ══════════════ */}
      <ellipse cx="55" cy="34" rx="30" ry="32" fill={skin} stroke={K} strokeWidth="1.2" />

      {/* Ears */}
      <ellipse cx="25" cy="36" rx="6" ry="7" fill={skin} stroke={K} strokeWidth="1" />
      <ellipse cx="24" cy="36" rx="3.5" ry="4.5" fill={skinS} opacity="0.5" />
      <ellipse cx="85" cy="36" rx="6" ry="7" fill={skin} stroke={K} strokeWidth="1" />
      <ellipse cx="86" cy="36" rx="3.5" ry="4.5" fill={skinS} opacity="0.5" />

      {/* ══════════════ HAIR ══════════════ */}
      <path d="M25 24 Q28 3 55 2 Q82 3 85 24 Q78 10 55 10 Q32 10 25 24 Z" fill={hair} />
      {/* Side tufts */}
      <path d="M25 24 Q20 16 23 9 Q27 4 31 9 Q28 15 29 22 Z" fill={hair} />
      <path d="M85 24 Q90 16 87 9 Q83 4 79 9 Q82 15 81 22 Z" fill={hair} />
      {/* Front tuft */}
      <path d="M48 7 Q55 1 62 7 Q58 4 55 5 Q52 4 48 7 Z" fill={hair} />

      {/* ══════════════ EYEBROWS ══════════════ */}
      <path d="M36 19 Q42 14 48 18" fill="none" stroke={hair} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M62 18 Q68 14 74 19" fill="none" stroke={hair} strokeWidth="2.8" strokeLinecap="round" />

      {/* ══════════════ EYES — big anime ══════════════ */}
      {/* Left eye white */}
      <ellipse cx="43" cy="30" rx="9" ry="10" fill={W} stroke={K} strokeWidth="1.2" />
      {/* Left iris */}
      <ellipse cx="43" cy="31" rx="6" ry="7" fill="#3d1f00" />
      {/* Left pupil */}
      <ellipse cx="43" cy="32" rx="4" ry="5" fill={K} />
      {/* Left shine */}
      <circle cx="40" cy="27" r="2.5" fill={W} />
      <circle cx="46" cy="34" r="1.2" fill={W} opacity="0.7" />
      {/* Left top lashes */}
      <path d="M34 23 Q36 19 40 21" stroke={K} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M38 20 Q41 17 44 19" stroke={K} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M44 18 Q47 17 49 20" stroke={K} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M50 20 Q52 18 53 22" stroke={K} strokeWidth="1.3" fill="none" strokeLinecap="round" />

      {/* Right eye white */}
      <ellipse cx="67" cy="30" rx="9" ry="10" fill={W} stroke={K} strokeWidth="1.2" />
      {/* Right iris */}
      <ellipse cx="67" cy="31" rx="6" ry="7" fill="#3d1f00" />
      {/* Right pupil */}
      <ellipse cx="67" cy="32" rx="4" ry="5" fill={K} />
      {/* Right shine */}
      <circle cx="64" cy="27" r="2.5" fill={W} />
      <circle cx="70" cy="34" r="1.2" fill={W} opacity="0.7" />
      {/* Right top lashes */}
      <path d="M57 22 Q59 19 63 21" stroke={K} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M62 19 Q65 17 68 19" stroke={K} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M68 18 Q71 17 73 20" stroke={K} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M74 20 Q76 18 77 22" stroke={K} strokeWidth="1.3" fill="none" strokeLinecap="round" />

      {/* ══════════════ NOSE ══════════════ */}
      <path d="M52 42 Q55 47 58 42" fill="none" stroke={skinS} strokeWidth="1.8" strokeLinecap="round" />

      {/* ══════════════ MOUTH — big open smile ══════════════ */}
      {/* Outer smile */}
      <path d="M40 52 Q47 64 55 65 Q63 64 70 52" fill={K} strokeWidth="0" />
      {/* Teeth */}
      <path d="M41 53 Q48 63 55 64 Q62 63 69 53 Q62 60 55 60 Q48 60 41 53 Z" fill={W} />
      {/* Mouth interior */}
      <path d="M42 54 Q49 62 55 62 Q61 62 68 54 Q61 59 55 59 Q49 59 42 54 Z" fill="#cc4444" opacity="0.4" />
      {/* Bottom lip */}
      <path d="M47 64 Q55 68 63 64" fill="none" stroke={skinS} strokeWidth="1.5" strokeLinecap="round" />

      {/* ══════════════ CHEEKS ══════════════ */}
      <ellipse cx="34" cy="48" rx="9" ry="5" fill="#ff8866" opacity="0.38" />
      <ellipse cx="76" cy="48" rx="9" ry="5" fill="#ff8866" opacity="0.38" />
    </svg>
  );
}

function darken(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return "#333";
  const r = Math.max(0, parseInt(h.slice(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(h.slice(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(h.slice(4, 6), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function isLight(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}
