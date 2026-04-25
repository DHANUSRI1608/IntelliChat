/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        midnight: {
          50: "#f0f4ff",
          100: "#dde8ff",
          200: "#c2d3ff",
          300: "#9db5ff",
          400: "#748bff",
          500: "#4f5fff",
          600: "#3a3df5",
          700: "#2e2ed9",
          800: "#2828b0",
          900: "#27278a",
          950: "#161654",
        },
        slate: {
          925: "#0f1117",
          950: "#090b12",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
        "pulse-slow": "pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite",
        "bounce-dot": "bounceDot 1.2s ease-in-out infinite",
        "cursor-blink": "cursorBlink 1s ease-in-out infinite",
        "slide-in-left": "slideInLeft 0.3s ease-out",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "translateY(0)", opacity: 0.4 },
          "40%": { transform: "translateY(-6px)", opacity: 1 },
        },
        cursorBlink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        slideInLeft: {
          from: { opacity: 0, transform: "translateX(-16px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};