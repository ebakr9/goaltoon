"use client";

import { useEffect, useRef } from "react";

export default function WorldCupTrophy() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    const t = setTimeout(() => {
      el.style.transition = "opacity 1.4s ease, transform 1.6s cubic-bezier(.22,1,.36,1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 280 480"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        {/* ── Gradients ── */}
        <linearGradient id="g-gold-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#fff3a0"/>
          <stop offset="18%"  stopColor="#ffd700"/>
          <stop offset="42%"  stopColor="#c8960c"/>
          <stop offset="60%"  stopColor="#ffd700"/>
          <stop offset="80%"  stopColor="#a0720a"/>
          <stop offset="100%" stopColor="#d4a00e"/>
        </linearGradient>
        <linearGradient id="g-gold-left" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#a0720a"/>
          <stop offset="40%"  stopColor="#ffd700"/>
          <stop offset="100%" stopColor="#c8960c"/>
        </linearGradient>
        <linearGradient id="g-gold-right" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#c8960c"/>
          <stop offset="60%"  stopColor="#ffd700"/>
          <stop offset="100%" stopColor="#a0720a"/>
        </linearGradient>
        <linearGradient id="g-gold-stem" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#8b6200"/>
          <stop offset="30%"  stopColor="#ffd700"/>
          <stop offset="55%"  stopColor="#e8b800"/>
          <stop offset="80%"  stopColor="#ffd700"/>
          <stop offset="100%" stopColor="#8b6200"/>
        </linearGradient>
        <linearGradient id="g-malachite" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#22a55a"/>
          <stop offset="35%"  stopColor="#006d37"/>
          <stop offset="65%"  stopColor="#004d26"/>
          <stop offset="100%" stopColor="#003318"/>
        </linearGradient>
        <linearGradient id="g-base-top" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#ffd700"/>
          <stop offset="40%"  stopColor="#b8860b"/>
          <stop offset="100%" stopColor="#7a5500"/>
        </linearGradient>
        <linearGradient id="g-base-bot" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#c8960c"/>
          <stop offset="50%"  stopColor="#7a5500"/>
          <stop offset="100%" stopColor="#c8960c"/>
        </linearGradient>
        <linearGradient id="g-globe" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%"   stopColor="#1db865"/>
          <stop offset="50%"  stopColor="#006d37"/>
          <stop offset="100%" stopColor="#003d1f"/>
        </linearGradient>
        <radialGradient id="g-globe-shine" cx="35%" cy="30%" r="50%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-cup-inner" cx="50%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="#fff3a0" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#7a5500" stopOpacity="0.08"/>
        </radialGradient>

        {/* ── Filters ── */}
        <filter id="f-shadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#00000040"/>
        </filter>
        <filter id="f-glow-gold" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="b"/>
          <feColorMatrix in="b" type="matrix"
            values="1 0.8 0 0 0  0.6 0.5 0 0 0  0 0 0 0 0  0 0 0 0.6 0"/>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="f-glow-green" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feColorMatrix in="b" type="matrix"
            values="0 0 0 0 0  0.5 1 0.3 0 0  0 0.3 0 0 0  0 0 0 0.7 0"/>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* ── Animations ── */}
        <style>{`
          @keyframes wc-float {
            0%,100% { transform: translateY(0px); }
            50%      { transform: translateY(-8px); }
          }
          @keyframes wc-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes wc-sparkle {
            0%,100% { opacity:0; transform:scale(0.4) rotate(0deg); }
            40%     { opacity:1; transform:scale(1.1) rotate(20deg); }
          }
          @keyframes wc-pulse {
            0%,100% { opacity:0.5; transform:scale(1); }
            50%     { opacity:1; transform:scale(1.08); }
          }
          .wc-float { animation: wc-float 4s ease-in-out infinite; transform-origin: 140px 260px; }
          .wc-orbit { animation: wc-spin 20s linear infinite; transform-origin: 140px 55px; }
          .wc-sp1 { animation: wc-sparkle 2.6s ease-in-out 0.0s infinite; transform-origin:44px 108px; }
          .wc-sp2 { animation: wc-sparkle 3.0s ease-in-out 0.7s infinite; transform-origin:236px 92px; }
          .wc-sp3 { animation: wc-sparkle 2.4s ease-in-out 1.3s infinite; transform-origin:30px 220px; }
          .wc-sp4 { animation: wc-sparkle 3.4s ease-in-out 0.4s infinite; transform-origin:252px 190px; }
          .wc-sp5 { animation: wc-sparkle 2.8s ease-in-out 1.8s infinite; transform-origin:140px 12px; }
          .wc-pulse { animation: wc-pulse 3s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* ══ GROUND SHADOW ══ */}
      <ellipse cx="140" cy="474" rx="78" ry="10" fill="rgba(0,0,0,0.18)"/>

      {/* ══ FLOATING GROUP ══ */}
      <g className="wc-float">

        {/* ──────── BASE ──────── */}
        {/* Bottom tier */}
        <rect x="62" y="430" width="156" height="34" rx="7"
          fill="url(#g-base-bot)" filter="url(#f-shadow)"/>
        {/* Malachite inlay */}
        <rect x="70" y="436" width="140" height="22" rx="5"
          fill="url(#g-malachite)"/>
        {/* Malachite facets */}
        <line x1="105" y1="436" x2="105" y2="458" stroke="#00a050" strokeWidth="0.8" strokeOpacity="0.4"/>
        <line x1="140" y1="436" x2="140" y2="458" stroke="#00a050" strokeWidth="0.8" strokeOpacity="0.4"/>
        <line x1="175" y1="436" x2="175" y2="458" stroke="#00a050" strokeWidth="0.8" strokeOpacity="0.4"/>
        {/* Horizontal light band */}
        <rect x="70" y="443" width="140" height="4" rx="1" fill="white" fillOpacity="0.12"/>
        {/* Top ring gold */}
        <rect x="76" y="416" width="128" height="17" rx="5"
          fill="url(#g-base-top)"/>
        <rect x="84" y="420" width="112" height="9" rx="3"
          fill="white" fillOpacity="0.07"/>
        {/* Thin separator ring */}
        <rect x="90" y="406" width="100" height="12" rx="4"
          fill="url(#g-gold-stem)"/>

        {/* ──────── STEM ──────── */}
        {/* Lower stem column */}
        <rect x="112" y="322" width="56" height="88" rx="10"
          fill="url(#g-gold-stem)"/>
        {/* Stem ridge lines */}
        <rect x="124" y="325" width="4" height="82" rx="2" fill="white" fillOpacity="0.12"/>
        <rect x="133" y="325" width="4" height="82" rx="2" fill="white" fillOpacity="0.06"/>
        <rect x="142" y="325" width="4" height="82" rx="2" fill="white" fillOpacity="0.06"/>
        <rect x="151" y="325" width="4" height="82" rx="2" fill="white" fillOpacity="0.06"/>
        {/* Stem knob top */}
        <ellipse cx="140" cy="322" rx="38" ry="14" fill="url(#g-gold-body)"/>
        <ellipse cx="140" cy="318" rx="34" ry="10" fill="white" fillOpacity="0.12"/>
        {/* Stem knob bottom */}
        <ellipse cx="140" cy="408" rx="36" ry="12" fill="url(#g-gold-body)"/>
        <ellipse cx="140" cy="406" rx="32" ry="8"  fill="white" fillOpacity="0.10"/>

        {/* ──────── CUP BODY ──────── */}
        <g filter="url(#f-shadow)">
          {/* Main cup shape — widens toward rim */}
          <path
            d="M 96 308
               C 88 270 72 216 70 168
               C 68 120 88 72 140 62
               C 192 72 212 120 210 168
               C 208 216 192 270 184 308 Z"
            fill="url(#g-gold-body)"
          />
          {/* Left face shadow for depth */}
          <path
            d="M 96 308 C 88 270 72 216 70 168 C 68 130 82 86 110 72
               C 92 92 84 132 86 172 C 88 218 100 270 108 308 Z"
            fill="url(#g-gold-left)" opacity="0.7"
          />
          {/* Right face */}
          <path
            d="M 184 308 C 192 270 208 216 210 168 C 212 130 198 86 170 72
               C 188 92 196 132 194 172 C 192 218 180 270 172 308 Z"
            fill="url(#g-gold-right)" opacity="0.7"
          />
          {/* Inner highlight */}
          <path
            d="M 108 300 C 100 264 86 212 84 166 C 82 124 96 82 140 72
               C 184 82 198 124 196 166 C 194 212 180 264 172 300 Z"
            fill="url(#g-cup-inner)"
          />
          {/* Vertical light streak */}
          <path d="M 122 75 C 116 140 110 240 114 306"
            fill="none" stroke="white" strokeWidth="12"
            strokeLinecap="round" opacity="0.10"/>
          <path d="M 128 72 C 124 140 120 240 122 306"
            fill="none" stroke="white" strokeWidth="5"
            strokeLinecap="round" opacity="0.16"/>
        </g>

        {/* ── Rim ── */}
        <ellipse cx="140" cy="70"  rx="74" ry="20" fill="url(#g-gold-body)"/>
        <ellipse cx="140" cy="66"  rx="68" ry="15" fill="white" fillOpacity="0.18"/>
        <ellipse cx="140" cy="63"  rx="60" ry="10" fill="white" fillOpacity="0.10"/>

        {/* ── Malachite band on cup body ── */}
        <path
          d="M 80 228 C 78 238 76 248 76 255
             L 204 255 C 204 248 202 238 200 228 Z"
          fill="url(#g-malachite)"
        />
        {/* Facet lines on malachite band */}
        <line x1="104" y1="230" x2="102" y2="253" stroke="#1db865" strokeWidth="0.9" strokeOpacity="0.35"/>
        <line x1="124" y1="229" x2="122" y2="253" stroke="#1db865" strokeWidth="0.9" strokeOpacity="0.35"/>
        <line x1="140" y1="228" x2="140" y2="253" stroke="#1db865" strokeWidth="0.9" strokeOpacity="0.35"/>
        <line x1="156" y1="229" x2="158" y2="253" stroke="#1db865" strokeWidth="0.9" strokeOpacity="0.35"/>
        <line x1="176" y1="230" x2="178" y2="253" stroke="#1db865" strokeWidth="0.9" strokeOpacity="0.35"/>
        <rect x="76" y="240" width="128" height="5" rx="1" fill="white" fillOpacity="0.08"/>
        {/* Gold outline on band */}
        <path
          d="M 80 228 C 78 238 76 248 76 255"
          fill="none" stroke="#ffd700" strokeWidth="1.2" strokeOpacity="0.6"/>
        <path
          d="M 200 228 C 202 238 204 248 204 255"
          fill="none" stroke="#ffd700" strokeWidth="1.2" strokeOpacity="0.6"/>

        {/* ── Engraved globe lines on cup ── */}
        {/* Equator */}
        <ellipse cx="140" cy="175" rx="64" ry="15" fill="none"
          stroke="#b8860b" strokeWidth="1.1" strokeOpacity="0.5"/>
        {/* Tropics */}
        <ellipse cx="140" cy="145" rx="56" ry="12" fill="none"
          stroke="#b8860b" strokeWidth="0.9" strokeOpacity="0.38"/>
        <ellipse cx="140" cy="208" rx="68" ry="14" fill="none"
          stroke="#b8860b" strokeWidth="0.9" strokeOpacity="0.38"/>
        {/* Meridians */}
        <path d="M 140 64 C 155 140 152 240 148 308"
          fill="none" stroke="#b8860b" strokeWidth="1" strokeOpacity="0.4"/>
        <path d="M 140 64 C 125 140 128 240 132 308"
          fill="none" stroke="#b8860b" strokeWidth="1" strokeOpacity="0.4"/>
        <path d="M 140 64 C 178 130 184 220 180 290"
          fill="none" stroke="#b8860b" strokeWidth="0.8" strokeOpacity="0.28"/>
        <path d="M 140 64 C 102 130  96 220 100 290"
          fill="none" stroke="#b8860b" strokeWidth="0.8" strokeOpacity="0.28"/>

        {/* ──────── HANDLES ──────── */}
        {/* Left handle — thick organic curve */}
        <path d="M 86 148 Q 18 130 16 196 Q 16 258 86 270"
          fill="none" stroke="url(#g-gold-left)" strokeWidth="26" strokeLinecap="round"/>
        <path d="M 86 148 Q 22 132 20 196 Q 20 256 86 270"
          fill="none" stroke="url(#g-gold-body)" strokeWidth="22" strokeLinecap="round"/>
        {/* Handle shine */}
        <path d="M 86 152 Q 28 136 26 196 Q 26 252 86 266"
          fill="none" stroke="white" strokeWidth="7"
          strokeLinecap="round" opacity="0.16"/>
        <path d="M 86 156 Q 32 140 30 196 Q 30 250 86 262"
          fill="none" stroke="white" strokeWidth="3"
          strokeLinecap="round" opacity="0.22"/>
        {/* Handle shadow edge */}
        <path d="M 86 148 Q 14 128 12 196 Q 12 262 86 274"
          fill="none" stroke="#7a5500" strokeWidth="28"
          strokeLinecap="round" opacity="0.4"/>

        {/* Right handle */}
        <path d="M 194 148 Q 262 130 264 196 Q 264 258 194 270"
          fill="none" stroke="#7a5500" strokeWidth="28"
          strokeLinecap="round" opacity="0.4"/>
        <path d="M 194 148 Q 258 132 260 196 Q 260 256 194 270"
          fill="none" stroke="url(#g-gold-body)" strokeWidth="22" strokeLinecap="round"/>
        <path d="M 194 152 Q 252 136 254 196 Q 254 252 194 266"
          fill="none" stroke="white" strokeWidth="7"
          strokeLinecap="round" opacity="0.16"/>
        <path d="M 194 156 Q 248 140 250 196 Q 250 250 194 262"
          fill="none" stroke="white" strokeWidth="3"
          strokeLinecap="round" opacity="0.22"/>

        {/* ──────── GLOBE TOP ──────── */}
        <g filter="url(#f-glow-green)">
          <circle cx="140" cy="55" r="36" fill="url(#g-globe)"/>
          {/* Globe continent shapes */}
          {/* Americas blob */}
          <path d="M 122 42 Q 126 34 133 36 Q 138 38 135 46 Q 132 54 126 56 Q 120 52 122 42 Z"
            fill="#1db865" opacity="0.5"/>
          {/* Europe-Africa blob */}
          <path d="M 144 32 Q 152 32 154 40 Q 155 48 150 54 Q 145 56 142 50 Q 138 44 140 38 Q 141 34 144 32 Z"
            fill="#1db865" opacity="0.45"/>
          {/* Asia blob */}
          <path d="M 158 36 Q 168 34 170 42 Q 169 50 162 52 Q 156 50 156 44 Q 156 39 158 36 Z"
            fill="#1db865" opacity="0.35"/>
          {/* Latitude lines */}
          <ellipse cx="140" cy="55" rx="36" ry="11" fill="none"
            stroke="#2ecc71" strokeWidth="1" strokeOpacity="0.55"/>
          <ellipse cx="140" cy="42" rx="28" ry="8" fill="none"
            stroke="#2ecc71" strokeWidth="0.9" strokeOpacity="0.4"/>
          <ellipse cx="140" cy="68" rx="28" ry="8" fill="none"
            stroke="#2ecc71" strokeWidth="0.9" strokeOpacity="0.4"/>
          {/* Longitude */}
          <path d="M 140 19 Q 156 55 140 91" fill="none"
            stroke="#2ecc71" strokeWidth="1" strokeOpacity="0.45"/>
          <path d="M 140 19 Q 124 55 140 91" fill="none"
            stroke="#2ecc71" strokeWidth="1" strokeOpacity="0.45"/>
          {/* Shine */}
          <circle cx="140" cy="55" r="36" fill="url(#g-globe-shine)"/>
        </g>
        {/* Orbit ring */}
        <g className="wc-orbit">
          <ellipse cx="140" cy="55" rx="50" ry="13"
            fill="none" stroke="#ffd700"
            strokeWidth="1.8" strokeDasharray="7 5" strokeOpacity="0.55"/>
        </g>
        {/* Globe base ring */}
        <ellipse cx="140" cy="88" rx="20" ry="6" fill="url(#g-gold-body)" opacity="0.8"/>

      </g>{/* end float group */}

      {/* ══ SPARKLES ══ */}
      <g fill="#ffd700">
        <g className="wc-sp1">
          <path d="M44,96 L46,104 L54,104 L48,109 L50,117 L44,112 L38,117 L40,109 L34,104 L42,104 Z"/>
        </g>
        <g className="wc-sp2">
          <path d="M236,80 L238,88 L246,88 L240,93 L242,101 L236,96 L230,101 L232,93 L226,88 L234,88 Z"/>
        </g>
        <g className="wc-sp3">
          <path d="M30,212 L32,219 L39,219 L33,223 L35,230 L30,226 L25,230 L27,223 L21,219 L28,219 Z" opacity="0.7"/>
        </g>
        <g className="wc-sp4">
          <path d="M252,182 L254,189 L261,189 L255,193 L257,200 L252,196 L247,200 L249,193 L243,189 L250,189 Z" opacity="0.75"/>
        </g>
        <g className="wc-sp5">
          <path d="M140,4 L142,11 L149,11 L143,15 L145,22 L140,18 L135,22 L137,15 L131,11 L138,11 Z"/>
        </g>
      </g>
    </svg>
  );
}
