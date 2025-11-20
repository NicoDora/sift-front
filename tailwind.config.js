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
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-200%)" },
          "100%": { transform: "translateX(200%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
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
