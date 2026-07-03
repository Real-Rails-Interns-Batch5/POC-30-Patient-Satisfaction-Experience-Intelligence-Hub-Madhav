import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Cinematic Rail defaults (Maritime) */
        obsidian: "#021627",
        surface: "#06121a",
        /* Accent (rail) kept bright so it pops against deep background */
        rail: "#38BDF8",
        indigo: "#818CF8",
        stroke: "#1F2937",
      },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"] },
      boxShadow: { pulse: "0 0 0 0.5px rgba(56,189,248,.8), 0 0 18px rgba(56,189,248,.08)" },
    },
  },
  plugins: [],
};

export default config;
