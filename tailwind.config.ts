import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#FAFAF9",
        surface: "#FFFFFF",
        border: "#E7E5E4",
        muted: {
          DEFAULT: "#F3F2F0",
          foreground: "#666666",
        },
        primary: {
          DEFAULT: "#B5121B",
          deep: "#8F0D15",
          foreground: "#FFFFFF",
        },
        gmni: {
          red: "#B5121B",
          deep: "#8F0D15",
          dark: "#171717",
          neutral: "#666666",
        },
        ink: {
          primary: "#171717",
          secondary: "#666666",
          tertiary: "#888888",
          subtle: "#A3A3A3",
        },
        status: {
          success: "#2E7D32",
          warning: "#B7791F",
          danger: "#B42318",
          info: "#2563EB",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        'card': '12px',
        'badge': '6px',
        'btn': '8px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 2px 6px -1px rgba(0, 0, 0, 0.06), 0 1px 3px -1px rgba(0, 0, 0, 0.04)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [],
} satisfies Config;
