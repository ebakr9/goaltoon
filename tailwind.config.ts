import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cartoon: ["'Fredoka One'", "cursive"],
        body: ["'Nunito'", "sans-serif"],
      },
      colors: {
        pitch: {
          green: "#2d7a3a",
          light: "#3a9e4a",
          dark: "#1e5228",
        },
        card: {
          bg: "#1a1f2e",
          border: "#2e3650",
        },
      },
      keyframes: {
        goalPop: {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.4) rotate(-5deg)" },
          "60%": { transform: "scale(1.2) rotate(3deg)" },
          "100%": { transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulse_glow: {
          "0%, 100%": { boxShadow: "0 0 8px 2px rgba(255,80,80,0.4)" },
          "50%": { boxShadow: "0 0 18px 6px rgba(255,80,80,0.8)" },
        },
        confetti_fall: {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(80px) rotate(720deg)", opacity: "0" },
        },
      },
      animation: {
        goalPop: "goalPop 0.6s ease-in-out",
        float: "float 3s ease-in-out infinite",
        pulse_glow: "pulse_glow 1.5s ease-in-out infinite",
        confetti_fall: "confetti_fall 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
