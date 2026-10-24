import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dce8ff",
          200: "#c0d6ff",
          300: "#94b8ff",
          400: "#5b8dff",
          500: "#2f6bff",
          600: "#1f54e8",
          700: "#1a43c4",
        },
        ink: {
          1: "#1f2937",
          2: "#374151",
          3: "#6b7280",
          4: "#9ca3af",
        },
        page: "#f0f2f5",
        rail: "#1f2430",
      },
      boxShadow: {
        panel: "0 1px 2px rgba(15, 23, 42, 0.04)",
      },
      keyframes: {
        "drawer-in": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "drawer-in": "drawer-in 0.2s ease-out",
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Noto Sans SC"',
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
