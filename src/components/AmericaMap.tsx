"use client";

import { useEffect, useRef } from "react";

export default function AmericaMap() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateX(16px)";
    const t = setTimeout(() => {
      el.style.transition = "opacity 1.6s ease, transform 1.8s cubic-bezier(.22,1,.36,1)";
      el.style.opacity = "1";
      el.style.transform = "translateX(0)";
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 300 540"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="am-land" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%"   stopColor="#e8f5ee"/>
          <stop offset="40%"  stopColor="#c8e6d4"/>
          <stop offset="100%" stopColor="#a8d4ba"/>
        </linearGradient>
        <linearGradient id="am-land-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#b8d8c6"/>
          <stop offset="100%" stopColor="#88b89a"/>
        </linearGradient>
        <linearGradient id="am-ocean" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ddf0f8"/>
          <stop offset="100%" stopColor="#b8dff0"/>
        </linearGradient>
        <linearGradient id="am-host-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#006d37" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#2ecc71" stopOpacity="0.08"/>
        </linearGradient>
        <radialGradient id="am-dot-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#006d37" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#006d37" stopOpacity="0"/>
        </radialGradient>
        <filter id="am-shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="3" dy="4" stdDeviation="5" floodColor="#00000022"/>
        </filter>
        <filter id="am-country-shadow" x="-2%" y="-2%" width="108%" height="108%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#00000018"/>
        </filter>
        <style>{`
          @keyframes am-pulse {
            0%,100% { r:4.5; opacity:1; }
            50%      { r:8; opacity:0.4; }
          }
          @keyframes am-ring {
            0%   { r:8; opacity:0.6; }
            100% { r:22; opacity:0; }
          }
          @keyframes am-dash {
            to { stroke-dashoffset: -24; }
          }
          @keyframes am-float {
            0%,100% { transform: translateY(0); }
            50%      { transform: translateY(-5px); }
          }
          .am-dot  { animation: am-pulse 2.2s ease-in-out infinite; }
          .am-dot2 { animation: am-pulse 2.2s ease-in-out 0.6s infinite; }
          .am-dot3 { animation: am-pulse 2.2s ease-in-out 1.1s infinite; }
          .am-dot4 { animation: am-pulse 2.2s ease-in-out 1.6s infinite; }
          .am-dot5 { animation: am-pulse 2.2s ease-in-out 0.3s infinite; }
          .am-ring { animation: am-ring 2.2s ease-out infinite; }
          .am-dash { animation: am-dash 2.5s linear infinite; }
          .am-group { animation: am-float 6s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* ── Ocean background ── */}
      <rect width="300" height="540" fill="url(#am-ocean)" rx="14"/>
      {/* Ocean texture lines */}
      <line x1="0" y1="80"  x2="300" y2="80"  stroke="#006497" strokeWidth="0.4" strokeOpacity="0.12" strokeDasharray="8 12"/>
      <line x1="0" y1="160" x2="300" y2="160" stroke="#006497" strokeWidth="0.4" strokeOpacity="0.12" strokeDasharray="8 12"/>
      <line x1="0" y1="240" x2="300" y2="240" stroke="#006497" strokeWidth="0.4" strokeOpacity="0.12" strokeDasharray="8 12"/>
      <line x1="0" y1="320" x2="300" y2="320" stroke="#006497" strokeWidth="0.4" strokeOpacity="0.12" strokeDasharray="8 12"/>
      <line x1="0" y1="400" x2="300" y2="400" stroke="#006497" strokeWidth="0.4" strokeOpacity="0.12" strokeDasharray="8 12"/>
      <line x1="0" y1="480" x2="300" y2="480" stroke="#006497" strokeWidth="0.4" strokeOpacity="0.12" strokeDasharray="8 12"/>
      <line x1="60"  y1="0" x2="60"  y2="540" stroke="#006497" strokeWidth="0.4" strokeOpacity="0.10" strokeDasharray="8 12"/>
      <line x1="150" y1="0" x2="150" y2="540" stroke="#006497" strokeWidth="0.4" strokeOpacity="0.10" strokeDasharray="8 12"/>
      <line x1="240" y1="0" x2="240" y2="540" stroke="#006497" strokeWidth="0.4" strokeOpacity="0.10" strokeDasharray="8 12"/>

      <g className="am-group">

      {/* ══════════════ CANADA ══════════════ */}
      <path
        d="M 24 52
           L 44 40 L 68 34 L 96 30 L 126 27 L 158 26
           L 188 28 L 215 34 L 238 44 L 255 58
           L 264 74 L 268 92 L 265 110
           L 258 124 L 249 136 L 238 145
           L 226 150 L 218 158 L 222 168
           L 232 180 L 240 194 L 236 208
           L 225 218 L 212 224 L 198 228
           C 185 230 176 234 172 242
           L 164 252 L 155 258
           C 147 252 140 244 132 240
           L 118 234 L 104 230 L 90 232
           L 76 236 L 62 242 L 52 240
           L 42 232 L 36 220 L 30 205
           L 26 188 L 22 168 L 20 146
           L 18 122 L 18 98 L 20 76 Z"
        fill="url(#am-land)"
        stroke="#7ab890"
        strokeWidth="1.2"
        strokeOpacity="0.7"
        filter="url(#am-shadow)"
      />
      {/* Hudson Bay */}
      <path
        d="M 130 70 Q 155 60 172 78 Q 185 96 178 118 Q 168 138 150 142 Q 130 140 118 124 Q 108 108 112 90 Q 118 74 130 70 Z"
        fill="url(#am-ocean)"
        stroke="#8ac4d8" strokeWidth="0.8" strokeOpacity="0.8"
      />
      {/* Canada label */}
      <text x="140" y="108" textAnchor="middle" fontSize="9.5"
        fontFamily="'Montserrat',sans-serif" fontWeight="700"
        fill="#4a7a5a" opacity="0.65" letterSpacing="1.5">CANADA</text>

      {/* ══════════════ USA ══════════════ */}
      <path
        d="M 46 170
           L 66 164 L 90 160 L 118 158 L 148 158
           L 176 160 L 200 164 L 222 170 L 240 176
           L 252 184 L 258 196 L 252 208
           L 240 218 L 226 224 L 210 228
           L 194 232 L 176 236 L 160 238
           L 144 237 L 128 233 L 112 228
           L 96 222 L 80 216 L 66 208
           L 54 200 L 46 190 Z"
        fill="url(#am-land)"
        stroke="#7ab890" strokeWidth="1.2" strokeOpacity="0.7"
        filter="url(#am-country-shadow)"
      />
      {/* Great Lakes hint */}
      <ellipse cx="190" cy="178" rx="12" ry="5" fill="url(#am-ocean)" stroke="#8ac4d8" strokeWidth="0.7" strokeOpacity="0.7" transform="rotate(-10,190,178)"/>
      <ellipse cx="206" cy="182" rx="8"  ry="4" fill="url(#am-ocean)" stroke="#8ac4d8" strokeWidth="0.7" strokeOpacity="0.7" transform="rotate(-8,206,182)"/>
      {/* Florida */}
      <path
        d="M 196 234 L 200 244 L 204 256 L 207 270
           L 208 284 L 206 296 L 202 304
           L 196 302 L 192 290 L 190 276
           L 189 260 L 190 248 L 193 238 Z"
        fill="url(#am-land)"
        stroke="#7ab890" strokeWidth="1" strokeOpacity="0.65"
      />
      {/* USA label */}
      <text x="152" y="202" textAnchor="middle" fontSize="10"
        fontFamily="'Montserrat',sans-serif" fontWeight="700"
        fill="#3a6a4a" opacity="0.7" letterSpacing="2">USA</text>

      {/* ══════════════ MEXICO ══════════════ */}
      <path
        d="M 100 242 L 118 237 L 140 235 L 160 237 L 178 241
           L 192 248 L 196 258 L 190 268 L 182 275
           L 172 280 L 162 284 L 154 290
           L 148 298 L 144 308 L 140 316
           L 136 314 L 132 306 L 128 296
           L 122 288 L 114 282 L 106 276
           L 98 268 L 94 258 L 96 248 Z"
        fill="url(#am-land-dark)"
        stroke="#7ab890" strokeWidth="1.1" strokeOpacity="0.65"
        filter="url(#am-country-shadow)"
      />
      {/* Baja California */}
      <path
        d="M 54 228 L 62 234 L 70 244 L 78 258 L 84 272
           L 88 286 L 88 296 L 84 300 L 78 296 L 72 284
           L 66 268 L 60 252 L 54 240 Z"
        fill="url(#am-land-dark)"
        stroke="#7ab890" strokeWidth="1" strokeOpacity="0.55"
      />
      {/* Gulf of Mexico */}
      <path
        d="M 138 248 Q 165 250 185 266 Q 195 280 188 295 Q 175 310 155 310 Q 140 308 132 296 Q 126 282 130 265 Q 132 254 138 248 Z"
        fill="url(#am-ocean)"
        stroke="#8ac4d8" strokeWidth="0.8" strokeOpacity="0.7"
      />
      <text x="144" y="262" textAnchor="middle" fontSize="7"
        fontFamily="sans-serif" fill="#006497" opacity="0.5" fontStyle="italic">Gulf of Mexico</text>
      {/* Mexico label */}
      <text x="148" y="270" textAnchor="middle" fontSize="8.5"
        fontFamily="'Montserrat',sans-serif" fontWeight="700"
        fill="#3a6a4a" opacity="0.65" letterSpacing="1.2">MEXICO</text>

      {/* ══════════════ CENTRAL AMERICA ══════════════ */}
      <path
        d="M 140 316 L 148 314 L 156 316 L 162 320
           L 166 328 L 164 336 L 160 342
           L 156 348 L 152 354 L 148 360
           L 144 358 L 140 352 L 137 344
           L 136 336 L 137 328 Z"
        fill="url(#am-land-dark)"
        stroke="#7ab890" strokeWidth="1" strokeOpacity="0.6"
      />

      {/* ══════════════ CARIBBEAN ══════════════ */}
      <ellipse cx="212" cy="290" rx="8" ry="4" fill="url(#am-land)" stroke="#7ab890" strokeWidth="0.8" strokeOpacity="0.6" transform="rotate(-15,212,290)"/>
      <ellipse cx="228" cy="300" rx="6" ry="3" fill="url(#am-land)" stroke="#7ab890" strokeWidth="0.7" strokeOpacity="0.5" transform="rotate(-10,228,300)"/>
      <ellipse cx="222" cy="312" rx="5" ry="2.5" fill="url(#am-land)" stroke="#7ab890" strokeWidth="0.7" strokeOpacity="0.5"/>

      {/* ══════════════ SOUTH AMERICA ══════════════ */}
      <path
        d="M 120 370
           L 134 360 L 150 356 L 166 358
           L 182 362 L 198 368 L 212 376
           L 224 386 L 234 398 L 240 412
           L 244 428 L 244 444 L 240 460
           L 232 474 L 220 486 L 206 494
           L 192 500 L 178 502 L 164 500
           L 150 494 L 138 484 L 126 470
           L 116 454 L 110 436 L 108 418
           L 108 400 L 112 384 Z"
        fill="url(#am-land)"
        stroke="#7ab890"
        strokeWidth="1.4"
        strokeOpacity="0.7"
        filter="url(#am-shadow)"
      />
      {/* Brazil interior highlight */}
      <path
        d="M 148 382 L 168 378 L 190 380 L 208 390 L 220 404
           L 224 420 L 220 436 L 210 448 L 194 458
           L 176 462 L 160 458 L 146 448
           L 136 434 L 132 418 L 136 402 L 142 390 Z"
        fill="#2ecc71" fillOpacity="0.07"
        stroke="#2ecc71" strokeWidth="0.9" strokeOpacity="0.25"
      />
      {/* Amazon River */}
      <path d="M 110 418 Q 140 415 170 416 Q 200 417 228 408"
        fill="none" stroke="#8ac4d8" strokeWidth="1.4" strokeOpacity="0.5"/>
      {/* Andes mountain edge */}
      <path d="M 112 384 Q 116 400 112 420 Q 110 440 114 458 Q 118 474 126 488"
        fill="none" stroke="#9aaa98" strokeWidth="2.5" strokeOpacity="0.3" strokeLinecap="round"/>
      {/* Chile narrow strip */}
      <path
        d="M 116 464 L 120 478 L 122 494 L 122 510
           L 120 522 L 116 528 L 112 522 L 110 508
           L 110 492 L 112 476 Z"
        fill="url(#am-land-dark)"
        stroke="#7ab890" strokeWidth="0.9" strokeOpacity="0.55"
      />
      {/* Argentina lower tip */}
      <path
        d="M 152 494 L 160 502 L 164 514 L 162 526
           L 156 532 L 150 526 L 148 514 L 150 502 Z"
        fill="url(#am-land-dark)"
        stroke="#7ab890" strokeWidth="0.9" strokeOpacity="0.55"
      />
      {/* SA Labels */}
      <text x="176" y="424" textAnchor="middle" fontSize="9"
        fontFamily="'Montserrat',sans-serif" fontWeight="700"
        fill="#3a6a4a" opacity="0.6" letterSpacing="1.2">BRAZIL</text>
      <text x="130" y="480" textAnchor="middle" fontSize="7.5"
        fontFamily="'Montserrat',sans-serif" fontWeight="700"
        fill="#3a6a4a" opacity="0.5">ARG</text>

      {/* ══════════════ HOST CITY DOTS ══════════════ */}

      {/* — New York/NJ — */}
      <circle cx="224" cy="192" r="18" fill="url(#am-dot-glow)"/>
      <circle cx="224" cy="192" r="8"  fill="#006d37" fillOpacity="0.15" className="am-ring"/>
      <circle cx="224" cy="192" fill="#006d37" className="am-dot">
        <animate attributeName="r" values="4.5;8;4.5" dur="2.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.4;1" dur="2.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="224" cy="192" r="3.5" fill="#fff" opacity="0.7"/>
      <text x="232" y="188" fontSize="8.5" fontFamily="'Montserrat',sans-serif"
        fontWeight="800" fill="#006d37" opacity="0.85">New York</text>

      {/* — Los Angeles — */}
      <circle cx="66" cy="214" r="18" fill="url(#am-dot-glow)"/>
      <circle cx="66" cy="214" fill="#006d37" className="am-dot2">
        <animate attributeName="r" values="4.5;8;4.5" dur="2.2s" begin="0.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.4;1" dur="2.2s" begin="0.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="66" cy="214" r="3.5" fill="#fff" opacity="0.7"/>
      <text x="74" y="210" fontSize="8.5" fontFamily="'Montserrat',sans-serif"
        fontWeight="800" fill="#006d37" opacity="0.85">Los Angeles</text>

      {/* — Dallas — */}
      <circle cx="148" cy="222" r="14" fill="url(#am-dot-glow)"/>
      <circle cx="148" cy="222" fill="#006d37" className="am-dot3">
        <animate attributeName="r" values="4.5;8;4.5" dur="2.2s" begin="1.1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.4;1" dur="2.2s" begin="1.1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="148" cy="222" r="3.5" fill="#fff" opacity="0.7"/>
      <text x="156" y="218" fontSize="8.5" fontFamily="'Montserrat',sans-serif"
        fontWeight="800" fill="#006d37" opacity="0.85">Dallas</text>

      {/* — Miami — */}
      <circle cx="200" cy="262" r="14" fill="url(#am-dot-glow)"/>
      <circle cx="200" cy="262" fill="#006d37" className="am-dot4">
        <animate attributeName="r" values="4.5;8;4.5" dur="2.2s" begin="1.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.4;1" dur="2.2s" begin="1.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="200" cy="262" r="3.5" fill="#fff" opacity="0.7"/>
      <text x="208" y="258" fontSize="8.5" fontFamily="'Montserrat',sans-serif"
        fontWeight="800" fill="#006d37" opacity="0.85">Miami</text>

      {/* — Mexico City — */}
      <circle cx="144" cy="280" r="14" fill="url(#am-dot-glow)"/>
      <circle cx="144" cy="280" fill="#006d37" className="am-dot5">
        <animate attributeName="r" values="4.5;8;4.5" dur="2.2s" begin="0.3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.4;1" dur="2.2s" begin="0.3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="144" cy="280" r="3.5" fill="#fff" opacity="0.7"/>
      <text x="82" y="292" fontSize="8.5" fontFamily="'Montserrat',sans-serif"
        fontWeight="800" fill="#006d37" opacity="0.85">Mexico City</text>

      {/* — Seattle — */}
      <circle cx="60" cy="164" r="3.5" fill="#2ecc71" opacity="0.85"/>
      <circle cx="60" cy="164" r="3.5" fill="#2ecc71">
        <animate attributeName="r" values="3.5;7;3.5" dur="2.6s" begin="0.9s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.85;0.2;0.85" dur="2.6s" begin="0.9s" repeatCount="indefinite"/>
      </circle>
      <text x="68" y="161" fontSize="7.5" fontFamily="'Montserrat',sans-serif"
        fontWeight="700" fill="#006d37" opacity="0.75">Seattle</text>

      {/* — Boston — */}
      <circle cx="238" cy="182" r="3.5" fill="#2ecc71" opacity="0.85"/>
      <text x="242" y="178" fontSize="7.5" fontFamily="'Montserrat',sans-serif"
        fontWeight="700" fill="#006d37" opacity="0.75">Boston</text>

      {/* — Kansas City — */}
      <circle cx="160" cy="208" r="3.5" fill="#2ecc71" opacity="0.85"/>
      <text x="168" y="205" fontSize="7" fontFamily="'Montserrat',sans-serif"
        fontWeight="700" fill="#006d37" opacity="0.65">Kansas City</text>

      {/* — San Francisco — */}
      <circle cx="50" cy="196" r="3.5" fill="#2ecc71" opacity="0.85"/>
      <text x="30" y="192" fontSize="7" fontFamily="'Montserrat',sans-serif"
        fontWeight="700" fill="#006d37" opacity="0.65">SF</text>

      {/* ══════════════ CONNECTION LINES ══════════════ */}
      {/* NYC ↔ LA */}
      <path d="M 224 192 Q 145 168 66 214"
        fill="none" stroke="#006d37" strokeWidth="0.9" strokeOpacity="0.22"
        strokeDasharray="5 5" className="am-dash"/>
      {/* Dallas ↔ Mexico City */}
      <path d="M 148 222 Q 146 250 144 280"
        fill="none" stroke="#006d37" strokeWidth="0.9" strokeOpacity="0.22"
        strokeDasharray="5 5" className="am-dash"/>
      {/* NYC ↔ Miami */}
      <path d="M 224 192 Q 222 228 200 262"
        fill="none" stroke="#006d37" strokeWidth="0.9" strokeOpacity="0.22"
        strokeDasharray="5 5" className="am-dash"/>
      {/* LA ↔ Dallas */}
      <path d="M 66 214 Q 108 218 148 222"
        fill="none" stroke="#006d37" strokeWidth="0.9" strokeOpacity="0.18"
        strokeDasharray="5 5" className="am-dash"/>

      </g>{/* end float group */}

      {/* ══ LABEL ══ */}
      <text x="150" y="527" textAnchor="middle"
        fontSize="8.5" fontFamily="'Montserrat',sans-serif" fontWeight="900"
        fill="#006d37" fillOpacity="0.4" letterSpacing="2.5">
        FIFA WORLD CUP 2026
      </text>
    </svg>
  );
}
