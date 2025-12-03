/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        background: "var(--background)",
        headerLogoText: "var(--header-logo-text)",
        headerText: "var(--header-text)",
        headerTextActive: "var(--header-text-active)",
        headerIcon: "var(--header-icon)",
        headerSearchBg: "var(--header-search-bg)",
        headerSearchText: "var(--header-search-text)",
        headerSearchPlaceholder: "var(--header-search-placeholder)",
        headerTextHover: "var(--header-text-hover)",
        headerIconHoverBg: "var(--header-icon-hover-bg)",
        bodyBg: "var(--body-bg)",
        bodyBorder: "var(--body-border)",
        bodyText: "var(--body-text)",
        bodyTextMuted: "var(--body-text-muted)",
        bodyButtonBoxBg: "var(--body-button-box-bg)",
        bodyButtonBg: "var(--body-button-bg)",
        bodyButtonBgHover: "var(--body-button-bg-hover)",
        bodyButtonText: "var(--body-button-text)",
        bodyButtonTextHover: "var(--body-button-text-hover)",
        bodyButtonTextDisabled: "var(--body-button-text-disabled)",
        bodyIcon: "var(--body-icon)",
        shadowColor: "var(--shadow-color)",
        glass: {
          DEFAULT: "var(--glass-bg)",
          border: "var(--glass-border)",
        },
        // 👇 [추가] 트렌드 시맨틱 컬러 등록
        trendUp: {
          bg: "var(--trend-up-bg)",
          border: "var(--trend-up-border)",
          text: "var(--trend-up-text)",
          icon: "var(--trend-up-icon-bg)",
        },
        trendDown: {
          bg: "var(--trend-down-bg)",
          border: "var(--trend-down-border)",
          text: "var(--trend-down-text)",
          icon: "var(--trend-down-icon-bg)",
        },
        trendNeutral: {
          bg: "var(--trend-neutral-bg)",
          border: "var(--trend-neutral-border)",
          text: "var(--trend-neutral-text)",
          icon: "var(--trend-neutral-icon-bg)",
        },
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-200%)" },
          "100%": { transform: "translateX(200%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      backgroundImage: {
        "gradient-custom":
          "linear-gradient(to right, #D9D9D9 0%, #EDEEF1 50%, #D9D9D9 100%)",
      },
      transitionDuration: {
        transitionDuration: "300ms",
      },
      fontFamily: {
        sans: ["Pretendard", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
