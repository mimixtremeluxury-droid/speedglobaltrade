import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#050B14",
        midnightSoft: "#0A111F",
        gold: "#F5A623",
        cyan: "#00F0FF",
        body: "#C9D1D9",
        ink: "#FFFFFF",
        stroke: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 24px 80px rgba(245, 166, 35, 0.18)",
        cyan: "0 16px 60px rgba(0, 240, 255, 0.12)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F5A623 0%, #FFD36F 100%)",
        "cyan-gradient": "linear-gradient(135deg, rgba(0,240,255,0.25) 0%, rgba(0,240,255,0.02) 100%)",
        "midnight-radial":
          "radial-gradient(circle at top, rgba(245,166,35,0.12) 0%, rgba(5,11,20,0) 42%), radial-gradient(circle at 85% 10%, rgba(0,240,255,0.08) 0%, rgba(5,11,20,0) 34%), linear-gradient(180deg, #050B14 0%, #07111D 48%, #050B14 100%)",
      },
      animation: {
        float: "float 9s ease-in-out infinite",
        pulseSoft: "pulseSoft 4s ease-in-out infinite",
        marquee: "marquee 26s linear infinite",
        shimmer: "shimmer 2.6s linear infinite",
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
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
