import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        deepNavy: "#0A0F2C",
        gold: "#F5B042",
        accentBlue: "#2A4B9C",
        mutedText: "#A7AFD1",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(245, 176, 66, 0.28)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(120deg, #F5B042 0%, #f59e0b 100%)",
        "premium-gradient":
          "radial-gradient(circle at 20% 20%, rgba(42,75,156,0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(245,176,66,0.22), transparent 35%), linear-gradient(145deg, #070a1a 0%, #0A0F2C 55%, #0d1233 100%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "0.5" },
          "50%": { opacity: "0.95" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
