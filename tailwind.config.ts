import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:                    "#006d37",
        "primary-container":        "#2ecc71",
        "primary-fixed":            "#6bfe9c",
        "primary-fixed-dim":        "#4ae183",
        "on-primary":               "#ffffff",
        "on-primary-container":     "#005027",
        secondary:                  "#735c00",
        "secondary-container":      "#fed023",
        "on-secondary":             "#ffffff",
        "on-secondary-container":   "#6f5900",
        tertiary:                   "#006497",
        "tertiary-container":       "#6ebaf6",
        "on-tertiary":              "#ffffff",
        "on-tertiary-container":    "#004970",
        error:                      "#ba1a1a",
        "error-container":          "#ffdad6",
        "on-error-container":       "#93000a",
        surface:                    "#f9f9f9",
        "surface-dim":              "#dadada",
        "surface-container":        "#eeeeee",
        "surface-container-low":    "#f3f3f4",
        "surface-container-high":   "#e8e8e8",
        "surface-container-highest":"#e2e2e2",
        "surface-container-lowest": "#ffffff",
        "surface-variant":          "#e2e2e2",
        "on-surface":               "#1a1c1c",
        "on-surface-variant":       "#3d4a3e",
        "inverse-primary":          "#4ae183",
        outline:                    "#6c7b6d",
        "outline-variant":          "#bbcbbb",
        background:                 "#f9f9f9",
        "on-background":            "#1a1c1c",
      },
      fontFamily: {
        montserrat:   ["Montserrat",     "sans-serif"],
        "source-sans":["Source Sans 3",  "sans-serif"],
        sans:         ["Source Sans 3",  "sans-serif"],
      },
      maxWidth: {
        "container-max": "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
