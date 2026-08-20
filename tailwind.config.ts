import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      paper: "var(--paper)",
      ink: "var(--ink)",
      subtle: "var(--subtle)",
      brass: "var(--brass)",
      hairline: "var(--hairline)",
    },
    fontFamily: {
      serif: ["var(--font-serif)", "Georgia", "serif"],
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      mono: ["var(--font-mono)", "ui-monospace", "monospace"],
    },
    extend: {
      borderRadius: {
        card: "10px",
        portrait: "12px",
        panel: "16px",
        pill: "100px",
      },
      maxWidth: {
        content: "84rem",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        curtain: "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      transitionDuration: {
        theme: "560ms",
      },
    },
  },
  plugins: [],
};
export default config;
