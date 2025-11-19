import { useEffect, useState } from "react";

export const useCurrentTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme as "light" | "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // 1. OS 테마 변경 감지 핸들러
    const handleChange = () => {
      if (!localStorage.getItem("theme")) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    // 2. data-theme 속성 변경 감지 (MutationObserver)
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute("data-theme");
      // 속성이 'dark'면 dark, 아니면 light
      setTheme(newTheme === "dark" ? "dark" : "light");
    });

    // 감시 시작
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    mediaQuery.addEventListener("change", handleChange);

    // 클린업
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      observer.disconnect();
    };
  }, []);

  return theme;
};
