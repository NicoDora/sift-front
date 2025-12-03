import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/tv": {
        target: "https://screener-facade.tradingview.com",
        changeOrigin: true, // 호스트 헤더를 타겟 URL로 변경 (CORS 우회 핵심)
        secure: false, // SSL 인증서 검증 무시 (필요 시)
        rewrite: (path) => path.replace(/^\/api\/tv/, ""),
      },
    },
  },
});
