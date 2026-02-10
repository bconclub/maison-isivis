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
        brand: {
          purple: {
            DEFAULT: "#0D0033",
            light: "#1A0A4E",
            80: "#2A1665",
            60: "#3D2580",
            40: "#6650A0",
            20: "#9988C0",
            10: "#CCC4DF",
          },
          blue: {
            DEFAULT: "#0033CC",
            light: "#1A4DDD",
            80: "#3366E6",
            60: "#6690EE",
            40: "#99B3F5",
            20: "#CCD9FA",
            10: "#E6ECFD",
          },
        },
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6",
      },
      fontFamily: {
        heading: ["var(--font-italiana)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        script: ["var(--font-cormorant)", "cursive"],
      },
      fontSize: {
        hero: [
          "clamp(3rem, 8vw, 4.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ],
        h1: [
          "clamp(2rem, 5vw, 3rem)",
          { lineHeight: "1.2", letterSpacing: "-0.01em" },
        ],
        h2: ["clamp(1.5rem, 4vw, 2.25rem)", { lineHeight: "1.3" }],
        h3: ["clamp(1.25rem, 3vw, 1.875rem)", { lineHeight: "1.4" }],
        h4: ["1.25rem", { lineHeight: "1.5" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4" }],
      },
      spacing: {
        "section-desktop": "120px",
        "section-tablet": "80px",
        "section-mobile": "40px",
      },
      maxWidth: {
        container: "1440px",
      },
      borderRadius: {
        luxury: "2px",
        "luxury-md": "4px",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #0D0033 0%, #0033CC 50%, #0D0033 100%)",
        "brand-gradient-hover":
          "linear-gradient(135deg, #1A0A4E 0%, #1A4DDD 50%, #1A0A4E 100%)",
        "brand-gradient-light":
          "linear-gradient(135deg, #9988C0 0%, #CCD9FA 100%)",
        "brand-overlay":
          "linear-gradient(135deg, rgba(13,0,51,0.7) 0%, rgba(0,51,204,0.6) 50%, rgba(13,0,51,0.7) 100%)",
        "brand-hero":
          "radial-gradient(ellipse at center, #0033CC 0%, #0D0033 70%)",
      },
      boxShadow: {
        "luxury-sm": "0 2px 8px rgba(13,0,51,0.15)",
        luxury: "0 4px 16px rgba(0,0,0,0.1)",
        "luxury-lg": "0 12px 24px rgba(13,0,51,0.25)",
        "luxury-xl": "0 20px 40px rgba(0,0,0,0.1)",
      },
      letterSpacing: {
        luxury: "0.5px",
        "luxury-wide": "2px",
        "luxury-widest": "4px",
      },
      aspectRatio: {
        product: "2 / 3",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        marquee: "marquee 25s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
