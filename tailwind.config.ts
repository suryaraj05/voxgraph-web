import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-inter)", "system-ui", "sans-serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      colors: {
        naval: {
          base: "var(--bg-base)",
          surface: "var(--bg-surface)",
          sidebar: "var(--bg-sidebar)",
          terminal: "var(--bg-terminal)",
        },
        primary: "var(--text-primary)",
        muted: "var(--text-muted)",
        accent: {
          DEFAULT: "var(--accent)",
          bright: "var(--accent-bright)",
        },
      },
      maxWidth: {
        prose: "720px",
      },
    },
  },
  plugins: [],
};

export default config;
