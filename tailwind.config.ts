import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: { brand: "#65777B" },
        charcoal: "#1F3032",
        mauve: "#C184AA",
        plum: "#714C67",
        burgundy: "#6C1F4D",
        night: "#220913",
        offwhite: "#F5EEF2",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(34, 9, 19, 0.7)",
      },
    },
  },
  plugins: [],
};

export default config;
